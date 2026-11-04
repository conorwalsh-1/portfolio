import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

// Astro's static build output, resolved from this file so `cdk deploy` works from any directory.
// Run `npm run build` at the repository root before `cdk synth`.
const SITE_DIST = path.resolve(__dirname, '../../dist');

export interface PortfolioSiteStackProps extends cdk.StackProps {
  /** Serve through CloudFront (default). Without it the bucket hosts the site itself, over HTTP. */
  useCloudFront?: boolean;
  /** Directory to upload; defaults to the Astro build output. */
  siteDist?: string;
}

export class PortfolioSiteStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: PortfolioSiteStackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('project', 'portfolio');
    const source = s3deploy.Source.asset(props?.siteDist ?? SITE_DIST);

    if (props?.useCloudFront === false) {
      this.websiteBucket(source);
      return;
    }

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Rewrites pretty URLs (/about or /about/) to the about/index.html files Astro generates.
    // Anything still missing gets the site's 404 page through `errorResponses` below.
    const directoryIndex = new cloudfront.Function(this, 'DirectoryIndexFunction', {
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.split('/').pop().includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
`),
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        functionAssociations: [{ function: directoryIndex, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST }],
      },
      defaultRootObject: 'index.html',
      // A private bucket answers 403 for missing keys; show the site's own 404 page for both.
      errorResponses: [403, 404].map((httpStatus) => ({
        httpStatus,
        responseHttpStatus: 404,
        responsePagePath: '/404.html',
        ttl: cdk.Duration.minutes(5),
      })),
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [source],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'], // invalidate the CDN cache on every deploy
    });

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'HTTPS URL for the portfolio',
    });
  }

  /** S3 static website hosting: no CDN, HTTPS or security headers, but no account verification needed. */
  private websiteBucket(source: s3deploy.ISource) {
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      // Only a bucket policy granting public reads; ACLs stay blocked.
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [source],
      destinationBucket: siteBucket,
    });

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: siteBucket.bucketWebsiteUrl,
      description: 'HTTP URL of the S3-hosted portfolio',
    });
  }
}
