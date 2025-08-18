# 💰 Personal Finance Management App

A modern, full-stack personal finance management application built with Next.js 15, TypeScript, and Prisma for comprehensive financial tracking and management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
echo 'DATABASE_URL="your_postgresql_connection_string"' > .env

# Initialize database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Prisma ORM with Accelerate, PostgreSQL
- **Development**: ESLint 9, Turbopack, TypeScript 5

## � Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - Detailed technical architecture and design decisions
- **[Setup Guide](./docs/SETUP.md)** - Complete development environment setup
- **[API Documentation](./docs/API.md)** - API endpoints and data models
- **[Contributing](./docs/CONTRIBUTING.md)** - Development guidelines and contribution process

## 🎯 Current Features

- Clean, responsive UI with shadcn/ui components
- Type-safe database layer with Prisma
- SEO-optimized page structure
- Development-ready environment with hot reload

## 🔮 Roadmap

- **Phase 1**: User authentication and profile management
- **Phase 2**: Transaction tracking and categorization
- **Phase 3**: Budget planning and financial goals
- **Phase 4**: Investment tracking and analytics
- **Phase 5**: Reporting and data visualization

## � Project Structure

```text
personal_finance/
├── docs/                      # Documentation
├── src/
│   ├── app/                   # Next.js App Router
│   ├── lib/                   # Utilities and configurations
│   └── generated/prisma/      # Generated Prisma client
├── prisma/                    # Database schema and migrations
└── components.json            # shadcn/ui configuration
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on our development process and coding standards.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for modern personal finance management
