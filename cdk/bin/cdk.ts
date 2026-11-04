#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PortfolioSiteStack } from '../lib/portfolio-site-stack';

const app = new cdk.App();

const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1' };

// CloudFront needs a verified AWS account. `cdk deploy -c cloudfront=false` serves the site
// from S3 static website hosting instead (HTTP only, no CDN).
const useCloudFront = String(app.node.tryGetContext('cloudfront') ?? 'true') !== 'false';

new PortfolioSiteStack(app, 'PortfolioSiteStack', {
  env,
  useCloudFront,
  description: 'Conor Walsh portfolio: static Astro site on S3 (optionally behind CloudFront)',
});
