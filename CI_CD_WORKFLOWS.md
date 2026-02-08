# CI/CD Workflows

This document describes the GitHub Actions workflows included in this project.

## Overview

```
.github/workflows/
├── ci.yml                 # Main CI pipeline
├── build-packages.yml     # Build .deb packages
├── release.yml            # Release automation
└── dependency-update.yml  # Dependency updates
```

## CI Pipeline (`ci.yml`)

Runs on every push and pull request.

### Jobs

#### 1. React Build Test

Tests React build across multiple Node.js versions:

| Ubuntu | Node 18 | Node 20 | Node 22 |
|--------|---------|---------|---------|
| 22.04  | ✅ | ✅ | ✅ |
| 24.04  | ✅ | ✅ | ✅ |

#### 2. PHP Syntax Check

Tests all PHP files against multiple PHP versions:

| Ubuntu | PHP 8.0 | PHP 8.1 | PHP 8.2 | PHP 8.3 | PHP 8.4 |
|--------|---------|---------|---------|---------|---------|
| 22.04  | ✅ | ✅ | ✅ | ✅ | ✅ |
| 24.04  | ✅ | ✅ | ✅ | ✅ | ✅ |

#### 3. Docker Integration

Tests installation in Docker containers:

- Ubuntu 22.04
- Ubuntu 24.04
- Debian 11
- Debian 12

#### 4. Security Scan

- npm audit for production dependencies
- PHP security patterns check

## Package Build (`build-packages.yml`)

Builds Debian packages for distribution.

### Trigger

- On git tag push (`v*`)
- Manual trigger with version input

### Packages Built

| Package | Description |
|---------|-------------|
| `vesta_*.deb` | Main Vesta package (bin, web, func, data) |
| `vesta-nginx_*.deb` | Nginx configurations |
| `vesta-php_*.deb` | PHP configurations |

### Artifacts

Packages are:
1. Uploaded as GitHub Actions artifacts (30 day retention)
2. Attached to GitHub Releases (on tag push)

### Usage

Manual trigger:
```bash
gh workflow run build-packages.yml -f version=2.1.0
```

Or push a tag:
```bash
git tag v2.1.0
git push origin v2.1.0
```

## Release Automation (`release.yml`)

Creates GitHub releases with changelog.

### Trigger

- On tag push (`v*`)

### Actions

1. Generates release notes from commits
2. Creates GitHub Release
3. Attaches built packages (from build-packages workflow)

## Dependency Updates (`dependency-update.yml`)

Automated dependency update checks.

### Schedule

- Weekly on Sundays

### Actions

1. Checks for npm updates
2. Checks for security vulnerabilities
3. Creates issues for updates needed

## Secrets Required

For APT repository publishing (to be added):

| Secret | Description |
|--------|-------------|
| `BUCKET_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `BUCKET_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |

## Local Testing

Run CI checks locally:

```bash
# React build
cd src/react && npm ci && npm run build

# PHP syntax
find . -name "*.php" -exec php -l {} \;

# Run specific workflow
gh workflow run ci.yml
```

## Adding APT Repository Publishing

TODO: Add step to `build-packages.yml` to:

1. Create APT repository structure
2. Sign packages with GPG
3. Upload to Cloudflare R2 bucket
4. Public URL: https://beta.vestacp.com
