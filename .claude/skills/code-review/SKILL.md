---
name: code-review
description: Reviews a branch of this repository against origin/main and lists only confident findings. Use for reviewing a pull request branch. Arguments - the branch name, then optionally --confidence <0-100>.
---

Review the branch given as the first argument against `origin/main`. Work without asking questions and without waiting for confirmation.

1. Read the diff: `git diff origin/main...<branch>`, then the changed files in full where the diff is not enough.
2. Check the changes against `CLAUDE.md` and `.claude/rules/`: money formatting through `formatPrice`, tests for fixes, no edits to `migrations/`, no new dependencies.
3. Look for real bugs in the changed lines: wrong boundaries, float money, mutation of shared data (`PRODUCTS`), missing awaits, error handling in `src/server.ts`.
4. Report only findings with confidence at or above the `--confidence` argument (default 80). For each: category (BUG, CONVENTION, SECURITY, ARCHITECTURE), confidence, file, line in the full file, one or two sentences.
5. Skip style and formatting. Problems outside the changed lines go into a short note, not into findings.
