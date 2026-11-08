# Branches

**`main` is the only branch, and it is the release.** Build and deploy from `main`. The `v1.0` tag and its
[GitHub release](https://github.com/jamessburnss1313-dev/hanzo-site/releases/tag/v1.0) mark the version handed over.

## Design history

The working branches from the design sessions (60 already fully merged into `main`, plus three dark-mode proof
branches that were not) are kept as archive refs, so the repository stays clean but nothing is lost. GitHub does not
list them, and a normal clone does not download them.

To look at them:

```bash
git fetch origin 'refs/archive/*:refs/archive/*'
git for-each-ref refs/archive
```

To bring one back as a branch:

```bash
git branch <name> refs/archive/<name>
```
