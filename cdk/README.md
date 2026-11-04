# Portfolio infrastructure (AWS CDK)

`lib/portfolio-site-stack.ts` defines **`PortfolioSiteStack`**, which uploads the static Astro
build (`../dist`) to S3. The name is distinct so it never collides with other stacks in the
same AWS account.

- **With CloudFront** (`-c cloudfront=true`, the CDK default): private bucket behind a
  CloudFront distribution with HTTPS, security headers, pretty-URL rewrites, the site's
  `404.html` for missing pages, and a cache invalidation on every deploy.
- **Without CloudFront** (`-c cloudfront=false`): S3 static website hosting over HTTP. Use
  this while the AWS account is not yet verified for CloudFront.

## Deploying

Nothing deploys automatically. Run **Actions → Deploy Portfolio via AWS CDK → Run
workflow**. It needs these repository secrets (Settings → Secrets and variables → Actions),
which only the repository owner should add:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Optionally set the repository **variable** `USE_CLOUDFRONT=true` once CloudFront is available.
The account must be CDK-bootstrapped (`npx cdk bootstrap aws://ACCOUNT_ID/us-east-1`).

Cost: S3 website hosting for a site this size is effectively free; CloudFront's free tier
covers 1 TB/month. To remove everything: `npx cdk destroy PortfolioSiteStack`.

## Local commands

Run `npm run build` at the repository root first so `dist/` exists. Then, from `cdk/`:

- `npm test -- --runInBand` runs the infrastructure tests
- `npx cdk synth` synthesizes the CloudFormation template
- `npx cdk diff` compares with what is deployed
