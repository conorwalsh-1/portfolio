# Runbook: Rollback drills

Golden rule: **mitigate first, debug later.** Restore the site with a rollback, then fix
the bug on a feature branch.

The portfolio is a static site, so a release is just the contents of `dist/` uploaded by
`PortfolioSiteStack`. Rolling back means deploying an earlier commit's build.

## Drill: bad release of the static site

`main` should be protected, so a rollback goes through a revert PR.

1. Merge a PR with an intentional, visible UI bug (for example, break the hero heading).
2. Run **Actions → Deploy Portfolio via AWS CDK → Run workflow** on `main` and confirm the bug at
   the `SiteUrl` stack output (CloudFront, or the S3 website URL while `USE_CLOUDFRONT` is off).
3. Roll back, either way:
   - **GitHub UI:** open the merged PR → **Revert** → merge the generated revert PR.
   - **Terminal:**
     ```bash
     git checkout main && git pull
     git checkout -b revert/fix-outage
     git revert HEAD --no-edit   # use -m 1 when reverting a merge commit
     git push -u origin revert/fix-outage
     ```
     Open the PR, wait for CI, and merge it.
4. Run the deploy workflow again on `main`. With CloudFront on, `BucketDeployment` also
   invalidates `/*`. Verify the fix and record the timings below.

### Faster mitigation (before the revert is merged)

The deploy workflow can be run against any branch or tag. To restore the last good release
while the revert PR is still in review, push a tag on the last good commit and run the
workflow with **Use workflow from → Tags → that tag**:

```bash
git tag release/last-good <good-sha>
git push origin release/last-good
```

Then merge the revert so `main` matches what is live.

## Drill log

| Date | Fault | Detected | Mitigated | Notes |
| ---- | ----- | -------- | --------- | ----- |
|      |       |          |           |       |
