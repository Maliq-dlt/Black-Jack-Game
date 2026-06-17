
## 2024-05-18 - [Avoid dependency noise during targeted micro-optimizations]
**Learning:** Running `pnpm install` in an environment without an existing `pnpm-lock.yaml` will generate a massive new lockfile. If left unchecked, this file will accidentally be included in the PR commit, violating the < 50 lines rule for 'Bolt' performance fixes and obscuring the actual optimization logic.
**Action:** When running build or verification commands in a clean environment, specifically check `git status` for newly generated files like `pnpm-lock.yaml` and remove them (`git restore --staged <file> && rm <file>`) before submitting the PR to ensure the commit remains laser-focused on the optimization.
