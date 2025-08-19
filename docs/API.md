# API Documentation

## Overview

The Personal Finance Management App API is built with Next.js (App Router), TypeScript, and Prisma ORM. All endpoints are RESTful and return JSON. This documentation is always aligned with the current database schema.

---

## Data Model Summary

### User

```typescript
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String
  password       String
  role           UserRole?
  phone          String?
  avatarUrl      String?
  language       String?
  country        String?
  dateOfBirth    DateTime?
  status         UserStatus @default(ACTIVE)
  lastLogin      DateTime?
  emailVerified  Boolean   @default(false)
  settings       Json?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  // ...relations
}
```

### Account

```typescript
model Account {
  id            String   @id @default(cuid())
  userId        String
  name          String
  accountNumber String?
  type          AccountType
  currency      String   @default("EUR")
  balance       Decimal  @db.Decimal(10, 2) @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  // ...relations
}
```

### Category

```typescript
model Category {
  id          String       @id @default(cuid())
  type        CategoryType
  name        String?
  parentId    String?
  userId      String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  // ...relations
}
```

### Transaction

```typescript
model Transaction {
  id          String          @id @default(cuid())
  userId      String
  accountId   String
  categoryId  String
  amount      Decimal         @db.Decimal(10, 2)
  date        DateTime
  description String?
  type        TransactionType
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  // ...relations
}
```

### Transfer

```typescript
model Transfer {
  id              String    @id @default(cuid())
  userId          String
  fromAccountId   String
  toAccountId     String
  amount          Decimal   @db.Decimal(10, 2)
  date            DateTime
  description     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  // ...relations
}
```

### Budget & BudgetCategory

```typescript
model Budget {
  id          String    @id @default(cuid())
  userId      String
  name        String
  periodStart DateTime
  periodEnd   DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  // ...relations
}

model BudgetCategory {
  id              String   @id @default(cuid())
  budgetId        String
  categoryId      String
  allocatedAmount Decimal   @db.Decimal(10, 2)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  // ...relations
}
```

### Goal

```typescript
model Goal {
  id            String   @id @default(cuid())
  userId        String
  name          String
  targetAmount  Decimal  @db.Decimal(10, 2)
  currentAmount Decimal  @db.Decimal(10, 2) @default(0)
  deadline      DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  // ...relations
}
```

### Investment (Advanced Structure)

```typescript
model InvestmentAsset {
  id        String   @id @default(cuid())
  name      String
  symbol    String?
  isin      String?
  type      AssetType
  currency  String
  exchange  String?
  country   String?
  sector    String?
  note      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ...relations
}

enum AssetType {
  STOCK
  CRYPTO
  ETF
  FUND
  BOND
  DERIVATIVE
  COMMODITY
  OTHER
}

model Investment {
  id            String   @id @default(cuid())
  userId        String
  assetId       String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  // ...relations
}

model InvestmentTransaction {
  id            String   @id @default(cuid())
  investmentId  String
  accountId     String
  date          DateTime
  type          InvestmentTransactionType
  quantity      Decimal
  price         Decimal
  total         Decimal
  fee           Decimal?
  note          String?
  // ...relations
}

enum InvestmentTransactionType {
  BUY
  SELL
  DIVIDEND
  FEE
  INTEREST
  OTHER
}
```

---

## Main Endpoints (to implement)

- Authentication: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- User management: `/api/users/profile` (GET/PUT)
- Accounts: `/api/accounts` (CRUD)
- Transactions: `/api/transactions` (CRUD, filters, pagination)
- Transfers: `/api/transfers` (CRUD)
- Categories: `/api/categories` (CRUD, hierarchy, customization)
- Budgets: `/api/budgets` (CRUD)
- Goals: `/api/goals` (CRUD)
- Investments: `/api/investments`, `/api/investment-assets`, `/api/investment-transactions` (CRUD)
- Analytics: `/api/analytics/summary`, `/api/analytics/trends`

---

## Error Handling

All endpoints return errors in the following format:

```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

---

## Development Notes

- All changes to the Prisma schema must be reflected here.
- Add new endpoints and models as the backend evolves.
- Use TypeScript types and Zod for validation in all route handlers.

---

This document is the single source of truth for backend and API development. Always keep it up to date with the codebase.
