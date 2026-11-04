import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { PortfolioSiteStack } from '../lib/portfolio-site-stack';

// Tests use a throwaway site directory so they do not depend on a prior `npm run build`.
const siteDist = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-dist-'));
fs.writeFileSync(path.join(siteDist, 'index.html'), '<h1>test</h1>');

function synth(useCloudFront?: boolean): Template {
  const app = new cdk.App();
  return Template.fromStack(new PortfolioSiteStack(app, 'TestStack', { useCloudFront, siteDist }));
}

describe('with CloudFront (default)', () => {
  const template = synth();

  test('keeps the bucket private and reachable only through CloudFront', () => {
    template.resourceCountIs('AWS::S3::Bucket', 1);
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
  });

  test('forces HTTPS, adds security headers and serves the 404 page', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultRootObject: 'index.html',
        DefaultCacheBehavior: Match.objectLike({ ViewerProtocolPolicy: 'redirect-to-https' }),
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({ ErrorCode: 403, ResponseCode: 404, ResponsePagePath: '/404.html' }),
          Match.objectLike({ ErrorCode: 404, ResponseCode: 404, ResponsePagePath: '/404.html' }),
        ]),
      }),
    });
  });

  test('invalidates the CDN on every deploy', () => {
    template.hasResourceProperties('Custom::CDKBucketDeployment', { DistributionPaths: ['/*'] });
    template.hasOutput('SiteUrl', {});
  });
});

describe('without CloudFront', () => {
  const template = synth(false);

  test('hosts the site from the bucket and only allows public reads', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 0);
    template.hasResourceProperties('AWS::S3::Bucket', {
      WebsiteConfiguration: { IndexDocument: 'index.html', ErrorDocument: '404.html' },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: false,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: false,
      },
    });
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({ Action: 's3:GetObject', Effect: 'Allow', Principal: { AWS: '*' } }),
        ]),
      },
    });
    template.hasOutput('SiteUrl', {});
  });
});

test('tags every resource with the project name', () => {
  synth().hasResourceProperties('AWS::S3::Bucket', {
    Tags: Match.arrayWith([{ Key: 'project', Value: 'portfolio' }]),
  });
});
