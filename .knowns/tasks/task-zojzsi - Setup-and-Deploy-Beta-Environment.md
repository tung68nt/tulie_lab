---
id: zojzsi
title: Setup and Deploy Beta Environment
status: in-progress
priority: high
labels:
  - deployment
  - beta
createdAt: '2026-03-02T17:21:30.351Z'
updatedAt: '2026-03-02T17:25:06.380Z'
timeSpent: 0
assignee: '@me'
---
# Setup and Deploy Beta Environment

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deploy the beta branch using the production database (main) for live testing. This includes branch creation, Coolify configuration, and environment variable setup.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Beta branch created from main
- [x] #2 Beta environment configured in Coolify to use main DB
- [ ] #3 Beta site go live and verified
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Merged main into beta, created docker-compose.beta.yml, and added GitHub Actions workflow deploy-beta.yml. Pushed everything to beta branch.
<!-- SECTION:NOTES:END -->

