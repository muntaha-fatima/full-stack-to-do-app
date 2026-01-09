# Git & Version Control Skill

## Description
Expert in Git version control, branching strategies, collaboration workflows, and best practices for team development.

## Capabilities

### Core Git Operations
- **Repository Management**: Init, clone, remote configuration
- **Staging & Commits**: Add, commit, amend, reset
- **Branching**: Create, switch, merge, delete branches
- **History**: Log, diff, blame, show
- **Remote Operations**: Push, pull, fetch
- **Stashing**: Temporary changes storage
- **Tags**: Version marking and releases

### Branching Strategies
- **Git Flow**: Feature, develop, release, hotfix branches
- **GitHub Flow**: Simple feature branch workflow
- **Trunk-Based**: Short-lived feature branches
- **Release Branches**: Version-specific branches
- **Hotfix Workflow**: Emergency production fixes

### Collaboration
- **Pull Requests**: Code review workflow
- **Merge Strategies**: Merge, squash, rebase
- **Conflict Resolution**: Handling merge conflicts
- **Code Review**: Best practices for reviews
- **Protected Branches**: Branch protection rules
- **CODEOWNERS**: Automatic review assignment

### Advanced Features
- **Rebase**: Interactive rebase, squashing commits
- **Cherry-pick**: Selective commit application
- **Bisect**: Binary search for bugs
- **Submodules**: Nested repositories
- **Worktrees**: Multiple working directories
- **Hooks**: Pre-commit, pre-push automation

### GitHub Features
- **Issues**: Bug tracking and feature requests
- **Projects**: Kanban boards and planning
- **Actions**: CI/CD automation
- **Releases**: Version management
- **GitHub CLI**: Command-line interface
- **Discussions**: Community conversations

## Usage Examples

### Basic Workflow

```bash
# Initialize repository
git init
git remote add origin https://github.com/user/repo.git

# Clone repository
git clone https://github.com/user/repo.git
cd repo

# Check status
git status

# Stage changes
git add .
git add file.txt
git add src/

# Commit changes
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login bug" -m "Additional details here"

# Push to remote
git push origin main
git push -u origin feature-branch

# Pull latest changes
git pull origin main
git pull --rebase origin main
```

### Branching

```bash
# Create and switch to new branch
git checkout -b feature/user-profile
git switch -c feature/user-profile  # Modern syntax

# List branches
git branch
git branch -a  # Include remote branches
git branch -v  # Show last commit

# Switch branches
git checkout main
git switch main  # Modern syntax

# Delete branch
git branch -d feature-branch  # Safe delete
git branch -D feature-branch  # Force delete

# Rename branch
git branch -m old-name new-name

# Push new branch to remote
git push -u origin feature/user-profile
```

### Merging & Rebasing

```bash
# Merge feature branch into main
git checkout main
git merge feature/user-profile

# Merge with no fast-forward (creates merge commit)
git merge --no-ff feature/user-profile

# Squash merge (combine all commits)
git merge --squash feature/user-profile
git commit -m "feat: add user profile feature"

# Rebase feature branch onto main
git checkout feature/user-profile
git rebase main

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Continue/abort rebase
git rebase --continue
git rebase --abort
```

### Stashing

```bash
# Stash current changes
git stash
git stash save "WIP: working on feature"

# List stashes
git stash list

# Apply stash
git stash apply
git stash apply stash@{0}

# Apply and remove stash
git stash pop

# Drop stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

### History & Inspection

```bash
# View commit history
git log
git log --oneline
git log --graph --oneline --all
git log --author="John Doe"
git log --since="2 weeks ago"

# View changes
git diff
git diff HEAD~1
git diff main..feature-branch
git diff --staged

# Show commit details
git show HEAD
git show abc123

# Find who changed a line
git blame file.txt
git blame -L 10,20 file.txt

# Search commits
git log --grep="bug fix"
git log -S "function_name"  # Search for code
```

### Undoing Changes

```bash
# Discard working directory changes
git checkout -- file.txt
git restore file.txt  # Modern syntax

# Unstage files
git reset HEAD file.txt
git restore --staged file.txt  # Modern syntax

# Amend last commit
git commit --amend
git commit --amend --no-edit

# Reset to previous commit
git reset --soft HEAD~1  # Keep changes staged
git reset --mixed HEAD~1  # Keep changes unstaged
git reset --hard HEAD~1  # Discard changes

# Revert commit (creates new commit)
git revert abc123
git revert HEAD
```

### Remote Operations

```bash
# View remotes
git remote -v

# Add remote
git remote add upstream https://github.com/original/repo.git

# Fetch from remote
git fetch origin
git fetch --all

# Pull with rebase
git pull --rebase origin main

# Push to remote
git push origin main
git push --force-with-lease origin feature-branch  # Safer force push

# Delete remote branch
git push origin --delete feature-branch

# Update remote tracking
git remote update origin --prune
```

### Tags

```bash
# Create tag
git tag v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

# List tags
git tag
git tag -l "v1.*"

# Push tags
git push origin v1.0.0
git push origin --tags

# Delete tag
git tag -d v1.0.0
git push origin --delete v1.0.0

# Checkout tag
git checkout v1.0.0
```

### GitHub CLI

```bash
# Install gh CLI
# macOS: brew install gh
# Windows: winget install GitHub.cli

# Authenticate
gh auth login

# Create repository
gh repo create my-project --public

# Clone repository
gh repo clone user/repo

# Create pull request
gh pr create --title "Add feature" --body "Description"

# List pull requests
gh pr list
gh pr view 123

# Merge pull request
gh pr merge 123 --squash

# Create issue
gh issue create --title "Bug report" --body "Details"

# List issues
gh issue list
gh issue view 456
```

### Commit Message Convention

```bash
# Conventional Commits format
# <type>(<scope>): <subject>

# Types:
# feat: New feature
# fix: Bug fix
# docs: Documentation changes
# style: Code style changes (formatting)
# refactor: Code refactoring
# test: Adding or updating tests
# chore: Maintenance tasks

# Examples:
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): resolve CORS issue"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(database): optimize query performance"
git commit -m "test(user): add user service unit tests"
git commit -m "chore(deps): update dependencies"
```

### .gitignore Example

```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc
venv/
.venv/

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Testing
coverage/
.pytest_cache/

# Database
*.db
*.sqlite
```

## Best Practices

1. **Commit Often**: Small, focused commits
2. **Write Clear Messages**: Descriptive commit messages
3. **Branch Strategy**: Use consistent branching model
4. **Pull Before Push**: Always pull latest changes first
5. **Review Before Commit**: Check staged changes
6. **Protect Main**: Use branch protection rules
7. **Rebase Feature Branches**: Keep history clean
8. **Tag Releases**: Mark version releases
9. **Use .gitignore**: Don't commit generated files
10. **Sign Commits**: Use GPG for verification

## Common Workflows

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: implement new feature"

# 3. Push to remote
git push -u origin feature/new-feature

# 4. Create pull request (via GitHub)
gh pr create --title "Add new feature"

# 5. After review, merge and cleanup
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Fix and commit
git add .
git commit -m "fix: resolve critical bug"

# 3. Push and create PR
git push -u origin hotfix/critical-bug
gh pr create --title "Hotfix: Critical bug"

# 4. After merge, tag release
git checkout main
git pull origin main
git tag -a v1.0.1 -m "Hotfix release"
git push origin v1.0.1
```

## Troubleshooting

### Common Issues

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Fix wrong branch
git stash
git checkout correct-branch
git stash pop

# Recover deleted branch
git reflog
git checkout -b recovered-branch abc123

# Clean untracked files
git clean -n  # Dry run
git clean -fd  # Force delete

# Fix merge conflicts
# 1. Edit conflicted files
# 2. Mark as resolved
git add conflicted-file.txt
git commit

# Sync fork with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub CLI](https://cli.github.com/)
