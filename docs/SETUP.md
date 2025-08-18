# 🛠️ Setup Guide

## Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **PostgreSQL** - Database server
- **Git** - Version control

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd personal_finance
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/personal_finance"

# Optional: Prisma Accelerate (for production)
# ACCELERATE_URL="your_accelerate_connection_string"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database:

   ```sql
   CREATE DATABASE personal_finance;
   ```

3. Update the `DATABASE_URL` in your `.env` file

#### Option B: Cloud Database

Popular options:

- **Vercel Postgres** - Integrated with Vercel deployment
- **Supabase** - PostgreSQL with built-in auth
- **PlanetScale** - Serverless MySQL (requires schema changes)
- **Railway** - Simple PostgreSQL hosting

### 5. Initialize Database

```bash
# Run initial migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# (Optional) Seed the database
npx tsx prisma/seed.ts
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development Workflow

### Database Changes

When modifying the database schema:

1. **Edit** `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name <migration_name>`
3. **Generate client**: `npx prisma generate`
4. **Restart dev server**: The generated client will be updated

### Adding UI Components

Using shadcn/ui components:

```bash
# Add a new component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button card input
```

### Code Quality

Run these commands before committing:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Linting with auto-fix
npm run lint:fix
```

## IDE Configuration

### VS Code Extensions

Recommended extensions for optimal development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.eslint.fixAll": true,
    "source.organizeImports": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Troubleshooting

### Common Issues

#### Database Connection Errors

```bash
# Test database connection
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```

#### Prisma Client Not Found

```bash
# Regenerate Prisma client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Restart TypeScript server in VS Code
Ctrl/Cmd + Shift + P -> "TypeScript: Restart TS Server"
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear Turbopack cache
rm -rf .turbo

# Rebuild
npm run build
```

### Environment-Specific Setup

#### Windows

Install using PowerShell:

```powershell
# Install Node.js via Chocolatey
choco install nodejs

# Install PostgreSQL
choco install postgresql
```

#### macOS

Install using Homebrew:

```bash
# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

## Scripts Reference

Available npm scripts:

```json
{
  "dev": "next dev --turbopack", // Start development server
  "build": "next build", // Build for production
  "start": "next start", // Start production server
  "lint": "next lint", // Run ESLint
  "type-check": "tsc --noEmit", // Type checking only
  "db:migrate": "prisma migrate dev", // Run database migrations
  "db:generate": "prisma generate", // Generate Prisma client
  "db:studio": "prisma studio", // Open Prisma Studio
  "db:seed": "tsx prisma/seed.ts" // Seed database
}
```

## Next Steps

After setup:

1. **Explore the codebase** - Understand the project structure
2. **Read the architecture docs** - Learn about design decisions
3. **Check the API documentation** - Understand data models
4. **Start contributing** - Follow the contributing guidelines

For detailed information about the project architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).
