# Architecture Documentation

## Overview

Personal Finance Management App is built with a modern, scalable architecture focusing on type safety, performance, and maintainability. The application follows a full-stack approach with clear separation of concerns.

## Tech Stack Deep Dive

### Frontend Architecture

#### Next.js 15 with App Router

- **Server-Side Rendering**: Optimized for SEO and performance
- **Client Components**: Interactive UI elements
- **File-based Routing**: Intuitive route organization
- **Built-in Optimizations**: Image optimization, font loading, bundle splitting

#### React 19 Features

- **Concurrent Rendering**: Improved user experience
- **Automatic Batching**: Optimized state updates
- **Modern Hooks**: Enhanced component lifecycle management

#### TypeScript Integration

- **Strict Mode**: Enhanced type checking
- **Path Aliases**: `@/` prefix for clean imports
- **Type-safe API Calls**: End-to-end type safety

#### Styling Architecture

- **Tailwind CSS 4**: Utility-first CSS framework
- **CSS Variables**: Dynamic theming support
- **Component Variants**: shadcn/ui component system
- **Responsive Design**: Mobile-first approach

### Backend Architecture

#### Database Layer

```mermaid
graph TD
    A[Application] --> B[Prisma Client]
    B --> C[Prisma Accelerate]
    C --> D[PostgreSQL Database]
    B --> E[Type Generation]
    E --> F[Generated Types]
```

#### Prisma ORM

- **Type-safe Queries**: Auto-generated TypeScript types
- **Migration System**: Version-controlled schema changes
- **Connection Pooling**: Optimized database connections
- **Query Optimization**: Intelligent query planning

#### Custom Client Generation

```typescript
// Generated client location: /src/generated/prisma
import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
```

## Project Structure

```tree
personal_finance/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with global providers
│   │   ├── page.tsx              # Home page with metadata
│   │   ├── globals.css           # Global styles and CSS variables
│   │   ├── favicon.ico           # Application favicon
│   │   ├── [locale]/             # Locale-aware routing (i18n)
│   │   │   ├── layout.tsx
│   │   │   ├── (public)/         # Public pages (auth, landing, ecc.)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── auth/
│   │   │   │       ├── signin/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── new-user/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── error/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── ...
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts   # NextAuth.js API route
│   │
│   ├── components/                # React UI components
│   │   ├── auth-form.tsx
│   │   ├── auth-button.tsx
│   │   ├── add-transaction-button.tsx
│   │   ├── current-month-label.tsx
│   │   ├── dashboard/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   ├── hooks/                     # Custom React hooks
│   │   └── use-mobile.ts
│   ├── i18n/                      # Internationalization utilities
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   ├── routing.ts
│   ├── lib/                       # Utility libraries and configurations
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── auth-utils.ts
│   │   ├── metadata.config.ts
│   │   ├── pages.config.ts
│   │   └── utils.ts
│   ├── types/                     # TypeScript type definitions
│   │   └── next-auth.d.ts
│   └── generated/                 # Auto-generated files (Git ignored)
│       └── prisma/
│           ├── client.js
│           ├── index.js
│           ├── schema.prisma
│           └── ...
│
├── messages/                      # Localized message files (i18n)
│   ├── en.json
│   └── it.json
│
├── prisma/                        # Database configuration
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│       ├── migration_lock.toml
│       └── 20250820124253_init/
│           └── migration.sql
│
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   ├── API.md
│   ├── DATABASE.md
│   └── CONTRIBUTING.md
│
├── components.json                # shadcn/ui configuration
├── eslint.config.mjs              # ESLint configuration
├── LICENSE                        # MIT License file
├── next.config.ts                 # Next.js configuration
├── package.json                   # Project dependencies
├── postcss.config.mjs             # PostCSS configuration
├── README.md                      # Project overview
└── tsconfig.json                  # TypeScript configuration
```

## Key Design Decisions

### 1. Custom Prisma Client Location

**Decision**: Generate Prisma client in `/src/generated/prisma`
**Rationale**:

- Keeps generated code separate from application code
- Easier to exclude from Git and IDE indexing
- Clear distinction between written and generated code

### 2. Metadata Configuration System

**Decision**: Page metadata (title, description, etc.) is localized and managed through the `messages/{locale}.json` files and next-intl APIs.

**Implementation**:

- Metadata is defined in the message files (`messages/en.json`, `messages/it.json`) under the `metadata` key.
- Each Next.js page imports metadata using next-intl hooks or functions, based on the active locale.

**Benefits**:

- Native multilingual SEO
- Centralized and scalable metadata management
- No risk of mismatch between content and metadata

### 3. Font Strategy

**Decision**: Roboto font with CSS variables
**Implementation**:

```typescript
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
```

**Benefits**:

- Optimized font loading
- CSS variable flexibility
- Consistent typography system

### 4. shadcn/ui Configuration

**Decision**: New York style with Zinc base color
**Configuration**:

```json
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "baseColor": "zinc",
    "cssVariables": true
  }
}
```

**Benefits**:

- Professional, clean design system
- React Server Component support
- CSS variables for theming

## Data Flow

### Request Lifecycle

1. **Client Request**: User interaction or page load
2. **Next.js Router**: Route resolution and component loading
3. **Server Components**: Initial data fetching
4. **Prisma Client**: Database queries with type safety
5. **Response Generation**: HTML/JSON response with optimizations
6. **Client Hydration**: Interactive components activation

### Database Operations

1. **Schema Definition**: Prisma schema in `prisma/schema.prisma`
2. **Migration Generation**: `prisma migrate dev` creates SQL migrations
3. **Client Generation**: `prisma generate` creates TypeScript client
4. **Query Execution**: Type-safe database operations
5. **Connection Management**: Prisma handles pooling and optimization

## Performance Considerations

### Frontend Optimizations

- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in optimization
- **Font Optimization**: Automatic font subset loading

### Backend Optimizations

- **Prisma Accelerate**: Global database cache and connection pooling
- **Query Optimization**: Intelligent query planning and execution
- **Connection Pooling**: Efficient database connection management

## Security Architecture

### Current Security Measures

- **Type Safety**: Prevents runtime errors and injection attacks
- **Environment Variables**: Secure configuration management
- **HTTPS Enforcement**: Secure data transmission
- **CORS Configuration**: Controlled cross-origin requests

### Planned Security Enhancements

- **Authentication**: NextAuth.js with multiple providers
- **Authorization**: Role-based access control
- **Data Encryption**: Sensitive financial data protection
- **Input Validation**: Server-side validation with Zod
- **Rate Limiting**: API abuse prevention
- **Audit Logging**: Activity tracking and monitoring

## Scalability Considerations

### Current Architecture Benefits

- **Serverless Ready**: Next.js Edge Runtime compatibility
- **Database Scaling**: Prisma Accelerate for global distribution
- **Static Generation**: Pre-rendered pages for performance
- **Incremental Static Regeneration**: Dynamic content with static benefits

### Future Scaling Plans

- **Microservices**: Service separation for complex features
- **Caching Layer**: Redis for session and data caching
- **CDN Integration**: Global content distribution
- **Load Balancing**: Horizontal scaling capabilities
- **Database Sharding**: Data partitioning for large datasets

## Internationalization & Localization

### Multilingual with next-intl

- **Library**: [next-intl](https://next-intl-docs.vercel.app/)
- **Supported locales**: `en` (English), `it` (Italian)
- **Message management**: JSON files in `/messages/en.json` and `/messages/it.json`
- **Locale-aware routing**: Next.js route structure with `[locale]` segment
- **Provider**: `NextIntlClientProvider` injects messages and language into the React context
- **Navigation**: Custom wrapper for Link, redirect, and router (`@/i18n/navigation`)
- **Fallback**: If the requested locale is not supported, the `defaultLocale` (`en`) is used

#### Configuration Example

```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ["en", "it"],
  defaultLocale: "en",
});

// src/i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

#### Localization Flow

1. The user accesses a route with a locale prefix (`/it/dashboard`)
2. Middleware and providers validate the locale
3. Localized messages are dynamically loaded
4. All UI texts are extracted using the `useTranslations()` hook

---

## Authentication Architecture

### NextAuth.js with multiple providers

- **Library**: [next-auth](https://next-auth.js.org/)
- **Supported providers**: Google OAuth (if configured), Credentials (email/password)
- **Adapter**: Prisma Adapter for user and session persistence
- **Session**: JWT (stateless), with extended payload (role, language, status, etc.)
- **Custom pages**: `/auth/signin`, `/auth/error`, `/auth/new-user`
- **Callbacks**: Customized to enrich tokens and sessions, validate user status, manage secure redirects
- **Events**: Logging of login/logout and onboarding new users

#### Authentication Flow

1. The user accesses `/auth/signin` and chooses Google or email/password
2. If OAuth, the user is redirected to Google and then validated on the backend
3. If credentials, the password is validated with bcrypt and the user status is checked
4. If login is successful, a JWT with extended user data is generated
5. The session is hydrated on the client side with all necessary data (role, language, etc.)
6. Redirects are always limited to the app domain

#### Configuration Excerpt

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [GoogleProvider, CredentialsProvider],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/new-user",
  },
  callbacks: {
    async signIn({ user, account }) {
      /* ... */
    },
    async jwt({ token, user }) {
      /* ... */
    },
    async session({ session, token }) {
      /* ... */
    },
    async redirect({ url, baseUrl }) {
      /* ... */
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      /* ... */
    },
    async signOut({ session, token }) {
      /* ... */
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
```

---

## Development Workflow

### Code Organization Principles

1. **Separation of Concerns**: Clear file and folder responsibilities
2. **Type Safety**: TypeScript throughout the stack
3. **Configuration Management**: Centralized settings and environment variables
4. **Documentation**: Self-documenting code with comprehensive docs

### Build Process

1. **Development**: `npm run dev` with Turbopack
2. **Type Checking**: Continuous TypeScript validation
3. **Linting**: ESLint with Next.js configuration
4. **Database**: Prisma migrations and client generation
5. **Production Build**: Optimized static and server assets

This architecture provides a solid foundation for building a comprehensive personal finance management application with room for future growth and feature expansion.
