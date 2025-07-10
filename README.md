Here's your updated README.md with **Bun** as the primary package manager and installation instructions:

```markdown
# Personal Trainer Web Panel

A mobile-first web application for personal trainers to manage clients, training files, and payments. Built with SvelteKit, SQLite, and vanilla CSS.

## Features

- User authentication (admin/user/ultimate admin roles)
- Training file management
- Payment processing with QR codes ( PIX ) without banks
- Mobile-first responsive design

## Technologies

- SvelteKit
- TypeScript
- SQLite (better-sqlite3)
- Vanilla CSS
- Vite
- Bun (JavaScript runtime & package manager)

## Quick Start

### 1. Install Bun
```bash
# On macOS/Linux
curl -fsSL https://bun.sh/install | bash

# On Windows (via PowerShell)
powershell -c "irm bun.sh/install.ps1|iex"
```

### 2. Setup Project
```bash
# Clone repository
git clone [your-repo-url]
cd your-project

# Install dependencies (using Bun)
bun install

# Initialize database
bun init:db

# Copy .env.example to .env and configure
cp .env.example .env
```

## Development Commands

```bash
# Start dev server (3x faster than npm)
bun dev

# Test database connection
bun test:db

# TypeScript checking
bun check

# Migrate new DB changes
bun migrate 
```

## Production Build

```bash
# Build for production
bun build

# Preview production build
bun preview
```