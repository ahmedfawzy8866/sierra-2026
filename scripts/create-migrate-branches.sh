#!/usr/bin/env bash
set -euo pipefail

git fetch sierra-blu hash-repo frontend-repo new-folder-repo
git push origin refs/remotes/sierra-blu/main:refs/heads/migrate/sierra-blu-main
git push origin refs/remotes/hash-repo/main:refs/heads/migrate/hash-repo-main
git push origin refs/remotes/frontend-repo/master:refs/heads/migrate/frontend-repo-master
git push origin refs/remotes/new-folder-repo/main:refs/heads/migrate/new-folder-repo-main
