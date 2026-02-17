
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Claude Code Sandbox** — a Docker devcontainer providing a secure, isolated development environment for use with the Claude Code CLI. The workspace (`/workspace`) is bind-mounted from the host and is meant to be populated with user projects.

## Environment

- **Container base:** Node 20
- **Shell:** ZSH (default, with Powerlevel10k), Bash also available
- **User:** `node` (non-root)
- **Node memory:** 4GB (`NODE_OPTIONS=--max-old-space-size=4096`)
- **Editor:** nano (default `$EDITOR`/`$VISUAL`)
- **Tools available:** git, gh (GitHub CLI), fzf, jq, vim, nano, git-delta

## Network Restrictions

The container runs behind a default-deny iptables firewall (`init-firewall.sh` runs on container start). Only these destinations are whitelisted:

- GitHub (web, API, git — IPs fetched dynamically)
- `registry.npmjs.org`
- `api.anthropic.com`
- `sentry.io`, `statsig.anthropic.com`, `statsig.com`
- VS Code marketplace/update services
- Host network (default gateway /24)
- DNS (port 53) and SSH (port 22)

All other outbound connections are rejected. If you need to fetch from a URL not on this list, it will fail.

## VS Code Integration

- **Formatting:** Prettier runs on save (`editor.formatOnSave: true`)
- **Linting:** ESLint auto-fixes on save (`source.fixAll.eslint`)
- **Extensions:** Claude Code, ESLint, Prettier, GitLens

## Key Files

| Path | Purpose |
|------|---------|
| `.devcontainer/devcontainer.json` | Container config, env vars, mounts, extensions |
| `.devcontainer/Dockerfile` | Image definition (Node 20, system packages, Claude CLI) |
| `.devcontainer/init-firewall.sh` | Network firewall setup (default-deny with whitelist) |
| `.claude/settings.local.json` | Claude Code permission restrictions |

## Persistent Volumes

- **Bash history:** mounted at `/commandhistory`
- **Claude config:** mounted at `/home/node/.claude`

These survive container rebuilds.
