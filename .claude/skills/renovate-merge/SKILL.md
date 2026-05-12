---
name: renovate-merge
description: This skill should be used when the user asks to "merge renovate PRs", "process renovate PRs", "merge dependency updates", "handle open PRs", "batch merge PRs", or asks to "review and merge the open pull requests" on this blog repository. Covers checking out each Renovate PR, running the Astro build to surface errors, fixing those errors, pushing back to the PR branch, waiting for CI, and merging into main.
version: 0.1.0
---

# Renovate PR Batch Merge — blog.tanay.tech

## Overview

This repo is an Astro + Starlight blog managed by Renovate. Renovate opens PRs to keep npm dependencies current. The only validation step needed is `npm run build` — there are no lint, test, or typecheck scripts.

**Renovate config highlights (from `renovate.json`):**
- Branch prefix: `renovate/`
- Commit prefix: `chore(deps):`
- Non-major updates grouped, patch + minor auto-merged by Renovate itself
- Major updates require manual review and are **not** auto-merged
- Max 3 concurrent PRs, 1 PR per hour

---

## Step 0 — Start from a clean main

```bash
git checkout main
git fetch origin
git pull --rebase origin main
```

If uncommitted changes are blocking:

```bash
git stash
git pull --rebase origin main
git stash pop
```

---

## Step 1 — List open Renovate PRs

```bash
gh pr list --state open --json number,title,headRefName,author \
  --template '{{range .}}#{{.number}} {{.title}} (branch: {{.headRefName}}) by {{.author.login}}{{"\n"}}{{end}}'
```

Capture only `renovate/` branches, sorted ascending:

```bash
PR_NUMBERS=$(gh pr list --state open --json number,headRefName \
  --jq '[.[] | select(.headRefName | startswith("renovate/")) | .number] | sort | .[]')
echo "$PR_NUMBERS"
```

---

## Step 2 — Process each PR in a loop

```bash
for PR in $PR_NUMBERS; do
  echo "=========================================="
  echo "Processing PR #$PR"
  echo "=========================================="

  # Skip if not open (already merged or closed)
  STATUS=$(gh pr view "$PR" --json state --jq '.state')
  if [ "$STATUS" != "OPEN" ]; then
    echo "PR #$PR is $STATUS — skipping"
    continue
  fi

  # Safety check: skip non-renovate branches
  BRANCH=$(gh pr view "$PR" --json headRefName --jq '.headRefName')
  if [[ "$BRANCH" != renovate/* ]]; then
    echo "PR #$PR branch '$BRANCH' is not renovate/* — skipping"
    continue
  fi

  # Check out the PR branch
  gh pr checkout "$PR"
  git branch --show-current

  # Rebase onto latest main
  git stash
  git fetch origin main
  if ! git rebase origin/main; then
    echo "PR #$PR has rebase conflicts — skipping (resolve manually)"
    git rebase --abort
    git stash pop
    git checkout main
    continue
  fi
  git stash pop

  # Install dependencies
  npm install

  # Build — the only validation script in this repo
  if ! npm run build 2>&1 | tee /tmp/pr_build.log; then
    echo "BUILD FAILED for PR #$PR — attempting fix"
    # See references/error-fixes.md for fix patterns
    # After fixing:
    # git add <fixed files>
    # git commit -m "chore(deps): fix build errors for PR #$PR"
  fi

  # Stage package-lock.json if npm install changed it
  git diff --quiet package-lock.json || git add package-lock.json
  # Stage any source files explicitly fixed:
  # git add src/foo.ts src/bar.ts

  git diff --cached --quiet || git commit -m "chore(deps): fix build errors for PR #$PR"
  git push origin HEAD

  # Wait for CI
  echo "Waiting for CI on PR #$PR ..."
  if ! gh pr checks "$PR" --watch; then
    echo "PR #$PR CI failed — skipping merge"
    git checkout main
    continue
  fi

  # Merge with rebase strategy (linear history)
  gh pr merge "$PR" --rebase --delete-branch
  echo "PR #$PR merged."

  # Mark GitHub notification as done
  REPO_FULL=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
  THREAD_ID=$(gh api "/notifications?all=true" \
    --jq ".[] | select(.subject.url == \"https://api.github.com/repos/$REPO_FULL/pulls/$PR\") | .id")
  if [ -n "$THREAD_ID" ]; then
    gh api --method DELETE "/notifications/threads/$THREAD_ID"
    echo "PR #$PR notification cleared."
  fi

  # Return to main and pull merged changes
  git stash
  git checkout main
  git pull --rebase origin main
  git stash pop

done

echo "All PRs processed."
```

---

## Merge strategy

Use `--rebase` to keep a linear history on `main`. The renovate commit prefix is `chore(deps):` (enforced by `semanticCommits` in `renovate.json`) — do not change it in fix commits.

```bash
gh pr merge "$PR" --rebase --delete-branch
```

---

## Checking CI status

```bash
# Non-interactive check
gh pr checks "$PR"

# Stream until complete
gh pr checks "$PR" --watch

# View failed run logs
gh run list --branch "$(git branch --show-current)"
gh run view <run-id> --log-failed
```

---

## Edge cases

**Push rejected (non-fast-forward):**
```bash
git pull --rebase origin "$(git branch --show-current)"
# resolve conflicts, then:
git push origin HEAD
```

**Major version PR (requires manual review):**
Renovate's `automerge: false` for major updates means these PRs may need extra care. Inspect the diff with `gh pr diff "$PR"` and check the package's changelog before merging. Do not auto-merge without reading what breaking changes the major bump introduces.

**Rebase conflict:**
```bash
git status            # see conflicted files
# edit files to resolve <<<< ==== >>>> markers
git add <resolved>
git rebase --continue
# or abort:
git rebase --abort
```

---

## Quick reference

| Goal | Command |
|---|---|
| List open PRs | `gh pr list --state open` |
| Check out PR | `gh pr checkout <number>` |
| Run build | `npm run build` |
| Watch CI | `gh pr checks <number> --watch` |
| Merge + delete branch | `gh pr merge <number> --rebase --delete-branch` |
| View failed CI logs | `gh run view <run-id> --log-failed` |
| Abort bad rebase | `git rebase --abort` |
| Clear notification | `gh api --method DELETE /notifications/threads/<id>` |

---

## Additional Resources

- **`references/error-fixes.md`** — Build error patterns specific to Astro/Starlight and how to fix them (npm install errors, MDX errors, config errors, sharp/image errors)
