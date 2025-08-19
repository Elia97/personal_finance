# Contributing Guide

## Welcome

Thank you for your interest in contributing to the Personal Finance Management App! This guide will help you get started with contributing to the project.

## Development Philosophy

We believe in:

- **Type Safety First**: All code should be type-safe with TypeScript
- **User-Centered Design**: Features should solve real user problems
- **Clean Architecture**: Code should be maintainable and well-organized
- **Performance**: The app should be fast and responsive
- **Security**: Financial data requires the highest security standards

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node.js version)

### Suggesting Features

1. Check existing issues and discussions
2. Create a feature request with:
   - Clear description of the problem
   - Proposed solution
   - Alternative solutions considered
   - Additional context or mockups

### 🔧 Development Workflow

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/personal_finance.git
cd personal_finance

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/personal_finance.git
```

#### 2. Set Up Development Environment

Follow the [Setup Guide](./SETUP.md) to configure your development environment.

#### 3. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

#### 4. Make Your Changes

- Write your code following our coding standards
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

#### 5. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Examples of good commit messages
git commit -m "feat(auth): add user registration endpoint"
git commit -m "fix(ui): resolve button alignment issue on mobile"
git commit -m "docs: update API documentation for transactions"
git commit -m "refactor(db): optimize user query performance"
```

#### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
# Include a clear description of what your PR does
```

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use explicit types
interface UserProfile {
  id: string;
  email: string;
  name: string;
}

// ✅ Good: Use const assertions for literal types
const TRANSACTION_TYPES = ["income", "expense"] as const;
type TransactionType = (typeof TRANSACTION_TYPES)[number];

// ❌ Avoid: Using 'any' type
const userData: any = getUserData();

// ✅ Good: Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error instanceof Error) {
    console.error("API call failed:", error.message);
  }
  throw error;
}
```

### React/Next.js Guidelines

```typescript
// ✅ Good: Use proper component typing
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  return (
    <button onClick={onClick} className={cn("btn", `btn-${variant}`)}>
      {children}
    </button>
  );
}

// ✅ Good: Use proper error boundaries
export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  // Implementation
}

// ✅ Good: Use server components when possible
export default async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Database Guidelines

```typescript
// ✅ Good: Use Prisma transactions for complex operations
await prisma.$transaction([
  prisma.user.update({ where: { id }, data: userData }),
  prisma.profile.create({ data: profileData }),
]);

// ✅ Good: Use proper error handling with Prisma
try {
  const user = await prisma.user.create({ data: userData });
  return user;
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new Error("User already exists");
    }
  }
  throw error;
}

// ✅ Good: Use select to optimize queries
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
  },
});
```

### CSS/Styling Guidelines

```typescript
// ✅ Good: Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// ✅ Good: Use CSS variables for theming
<div className="bg-background text-foreground">

// ✅ Good: Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Good: Use semantic class names for complex styles
<div className="transaction-card transaction-card--income">
```

## Project Structure Guidelines

### File Organization

```text
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route groups
│   ├── api/                    # API routes
│   └── globals.css             # Global styles
├── components/                 # Reusable components
│   ├── ui/                     # shadcn/ui components
│   └── forms/                  # Form components
├── lib/                        # Utilities and configurations
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # General utilities
│   └── validations/            # Zod schemas
└── types/                      # TypeScript type definitions
```

### Naming Conventions

- **Files**: Use kebab-case (`user-profile.tsx`)
- **Components**: Use PascalCase (`UserProfile`)
- **Functions**: Use camelCase (`getUserProfile`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: Use PascalCase (`UserProfile`, `ApiResponse`)

## Testing Guidelines

### Unit Tests

```typescript
// test/utils/currency.test.ts
import { formatCurrency } from "@/lib/utils/currency";

describe("formatCurrency", () => {
  it("should format USD currency correctly", () => {
    expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
  });

  it("should handle zero amounts", () => {
    expect(formatCurrency(0, "USD")).toBe("$0.00");
  });
});
```

### Component Tests

```typescript
// test/components/button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("should render with correct text", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });
});
```

### API Tests

```typescript
// test/api/users.test.ts
import { POST } from "@/app/api/users/route";

describe("/api/users", () => {
  it("should create a new user", async () => {
    const request = new Request("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe("test@example.com");
  });
});
```

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```text
type(scope): description

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting (no logic changes)
- **refactor**: Code restructuring (no feature changes)
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Scopes

- **auth**: Authentication and authorization
- **ui**: User interface components
- **api**: API endpoints and backend logic
- **db**: Database schema and migrations
- **deps**: Dependency updates

### Examples

```bash
feat(auth): implement user registration with email verification
fix(ui): resolve mobile navigation menu overlap issue
docs(api): add transaction endpoints documentation
refactor(db): optimize user query performance
chore(deps): update Next.js to version 15.0.1
```

## Review Process

### Pull Request Guidelines

1. **Title**: Use clear, descriptive titles
2. **Description**: Explain what changes were made and why
3. **Screenshots**: Include before/after images for UI changes
4. **Testing**: Describe how the changes were tested
5. **Breaking Changes**: Clearly document any breaking changes

### Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements left in code
- [ ] TypeScript types are properly defined
- [ ] Performance implications considered
- [ ] Security implications reviewed
- [ ] Accessibility guidelines followed

## Getting Help

- **GitHub Discussions**: For questions and community discussions
- **Issues**: For bug reports and feature requests
- **Discord/Slack**: For real-time chat (if available)
- **Documentation**: Check our docs first

## Security

- **Never commit sensitive data** (API keys, passwords, etc.)
- **Use environment variables** for configuration
- **Follow security best practices** for financial applications
- **Report security vulnerabilities** privately

## License and Legal

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to the Personal Finance Management App! 🎉
