# Architecture - Personal Finance App

## Introduction

The initial development phase focuses on authentication, user profile management, and multilingual support. This document provides a technical overview of key components, operational flows, and architectural decisions made during this phase.

## Scope and Audience

- **Scope**: To provide a technical guide for developers and stakeholders interested in the authentication implementation and related features.
- **Audience**: Developers, software architects, and code reviewers.

## General Architecture

The application is built on **Next.js with App Router**, using **NextAuth.js** for authentication management. The database is **PostgreSQL** with **Prisma ORM** for data access. Multilingual support is implemented via **next-intl**. Email communications use **Resend**, while logging is handled by **Winston**.

### Core Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js with JWT strategy
- **Internationalization**: next-intl
- **Email**: Resend
- **Logging**: Winston

## Key Components

### Authentication

Authentication is managed by NextAuth.js with support for multiple providers:

- **Credentials Provider**: Email and password authentication with bcrypt hashing.
- **Google OAuth Provider**: Optional Google authentication, configurable via environment variables.

**Key Files**:

- `src/lib/auth.ts`: NextAuth configuration
- `src/lib/auth-providers.ts`: Provider definitions
- `src/lib/auth-callbacks.ts`: Callbacks for sign-in, JWT, and session
- `src/app/api/auth/[...nextauth]/route.ts`: API handler

### User Profile Management

The user profile includes fields like name, email, image, language, country, and preferences. The API allows reading and updating the profile, with automatic JWT token refresh.

**Key Files**:

- `src/app/api/user/profile/route.ts`: GET/PUT endpoint for profile
- `src/lib/auth-utils.ts`: Helpers for profile management

### Internationalization (i18n)

Support for multiple languages (English and Italian) with locale-based routing. The middleware handles automatic redirects to the user's preferred language.

**Key Files**:

- `src/middleware.tsx`: Middleware for i18n and auth
- `src/i18n/routing.ts`: Routing configuration
- `messages/`: Translation files

### Security

- Password hashing with bcrypt
- Mandatory email verification
- Role and user status checks
- Secure redirects
- Secrets management via environment variables

**Key Files**:

- `src/lib/auth-utils.ts`: Security helpers

### Database

Main models for authentication and profile:

- **User**: User information, relations to sessions and accounts
- **Session**: JWT session management
- **Account**: OAuth provider links
- **VerificationToken**: Email verification tokens

**Key Files**:

- `prisma/schema.prisma`: Database schema

### Logging and Communications

- **Logging**: Winston for console and file output, tracking auth events
- **Email**: Resend for sending verification emails

**Key Files**:

- `src/lib/logger.ts`: Logger configuration
- `src/lib/resend.ts`: Email sending

## Operational Flows

### Registration and Email Verification

1. User sends POST request to `/api/auth/signup`
2. User creation with hashed password
3. Verification token generation
4. Email sent via Resend
5. User verifies via GET `/api/auth/verify-email?token=...`
6. Update `emailVerified` and delete token

### Sign-In

1. User signs in via NextAuth handler
2. Credentials or OAuth validation
3. Email verification check
4. JWT session creation
5. Periodic refresh from database

### Profile Update

1. PUT request to `/api/user/profile`
2. Database update
3. JWT token refresh via callback

## Architectural Decisions

- **JWT Strategy**: Chosen for stateless sessions and serverless performance
- **Mandatory Email Verification**: To ensure valid identities
- **Periodic Token Refresh**: For user data synchronization
- **i18n Routing**: For seamless multilingual support

## Security Measures

- Passwords hashed with bcrypt (12 rounds)
- Email verification within 30 days for credentials
- Immediate block for unverified OAuth
- Helpers for authentication and role checks
- Logging of all security events

## Operations

- **Database**: Standard Prisma migrations
- **Email**: Verified domain setup on Resend
- **Logging**: Debug level in development, error in production
- **Sessions**: 30-day expiration, update every 24 hours

## Current Status and Next Steps

The initial phase is complete with working authentication, profile management, and i18n. Upcoming developments will include financial features like accounts, transactions, and budgets, plus security enhancements such as 2FA and password reset.
