# 📡 API Documentation

## Overview

The Personal Finance Management App API is built with Next.js App Router, providing type-safe endpoints with full TypeScript integration. All API routes follow RESTful conventions and return JSON responses.

## Base URL

```text
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Current Database Schema

### User Model

```typescript
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String
  password    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### User Fields

| Field       | Type     | Description                | Constraints       |
| ----------- | -------- | -------------------------- | ----------------- |
| `id`        | String   | Unique identifier          | CUID, Primary Key |
| `email`     | String   | User email address         | Unique, Required  |
| `name`      | String   | User display name          | Required          |
| `password`  | String   | Hashed password            | Required          |
| `createdAt` | DateTime | Account creation timestamp | Auto-generated    |
| `updatedAt` | DateTime | Last update timestamp      | Auto-updated      |

## Future API Endpoints

The following endpoints are planned for implementation:

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```typescript
{
  email: string;
  name: string;
  password: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  token?: string;
}
```

#### POST /api/auth/login

Authenticate user credentials.

**Request Body:**

```typescript
{
  email: string;
  password: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  }
  token: string;
}
```

#### POST /api/auth/logout

Invalidate user session.

**Response:**

```typescript
{
  success: boolean;
  message: string;
}
```

### User Management

#### GET /api/users/profile

Get current user profile.

**Headers:**

```http
Authorization: Bearer <token>
```

**Response:**

```typescript
{
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
}
```

#### PUT /api/users/profile

Update user profile information.

**Headers:**

```http
Authorization: Bearer <token>
```

**Request Body:**

```typescript
{
  name?: string;
  email?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    updatedAt: string;
  }
}
```

### Transactions (Planned)

#### GET /api/transactions

Get user transactions with pagination and filtering.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `category` (string): Filter by category
- `type` (string): Filter by type (income/expense)
- `startDate` (string): Filter from date (ISO 8601)
- `endDate` (string): Filter to date (ISO 8601)

**Response:**

```typescript
{
  success: boolean;
  data: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
```

#### POST /api/transactions

Create a new transaction.

**Request Body:**

```typescript
{
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: string; // ISO 8601
  tags?: string[];
}
```

#### GET /api/transactions/:id

Get a specific transaction by ID.

#### PUT /api/transactions/:id

Update a transaction.

#### DELETE /api/transactions/:id

Delete a transaction.

### Categories (Planned)

#### GET /api/categories

Get all transaction categories.

#### POST /api/categories

Create a new category.

#### PUT /api/categories/:id

Update a category.

#### DELETE /api/categories/:id

Delete a category.

### Budgets (Planned)

#### GET /api/budgets

Get user budgets.

#### POST /api/budgets

Create a new budget.

#### PUT /api/budgets/:id

Update a budget.

#### DELETE /api/budgets/:id

Delete a budget.

### Analytics (Planned)

#### GET /api/analytics/summary

Get financial summary data.

**Query Parameters:**

- `period` (string): Time period (month/quarter/year)
- `year` (number): Specific year
- `month` (number): Specific month

**Response:**

```typescript
{
  success: boolean;
  data: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    topCategories: {
      category: string;
      amount: number;
      percentage: number;
    }
    [];
    monthlyTrend: {
      month: string;
      income: number;
      expenses: number;
    }
    [];
  }
}
```

#### GET /api/analytics/trends

Get spending trends and patterns.

## Error Handling

All API endpoints follow consistent error response format:

```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### Common Error Codes

| Code               | Status | Description              |
| ------------------ | ------ | ------------------------ |
| `VALIDATION_ERROR` | 400    | Invalid request data     |
| `UNAUTHORIZED`     | 401    | Authentication required  |
| `FORBIDDEN`        | 403    | Insufficient permissions |
| `NOT_FOUND`        | 404    | Resource not found       |
| `CONFLICT`         | 409    | Resource already exists  |
| `RATE_LIMITED`     | 429    | Too many requests        |
| `INTERNAL_ERROR`   | 500    | Server error             |

## Authentication

### JWT Token Structure

```typescript
{
  sub: string; // User ID
  email: string; // User email
  name: string; // User name
  iat: number; // Issued at
  exp: number; // Expires at
}
```

### Token Usage

Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Analytics endpoints**: 50 requests per minute

## Data Types

### Common TypeScript Interfaces

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense";
  date: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: "income" | "expense" | "both";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Budget {
  id: string;
  name: string;
  amount: number;
  period: "monthly" | "yearly";
  categoryId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Creating New Endpoints

1. Create route handler in `src/app/api/[route]/route.ts`
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Add input validation with Zod
4. Update this documentation
5. Add TypeScript types

### Example Route Handler

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const user = await prisma.user.create({
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
        },
      },
      { status: 400 }
    );
  }
}
```

## Testing

### API Testing Tools

- **Postman** - GUI-based API testing
- **Insomnia** - Lightweight API client
- **Thunder Client** - VS Code extension
- **curl** - Command-line testing

### Example Test Requests

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

This API documentation will be updated as new endpoints are implemented and the application evolves.
