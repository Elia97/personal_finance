// Define types for user roles and statuses
export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

// Extended User type definition
export interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  password?: string;
  role?: UserRole;
  phone?: string | null;
  language?: string | null;
  country?: string | null;
  dateOfBirth?: Date | null;
  status?: UserStatus;
  lastLogin?: Date | null;
  settings?: Record<string, unknown>; // JSON field for user preferences
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extended Session type definition
export interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    phone?: string | null;
    language?: string | null;
    country?: string | null;
    status?: UserStatus;
    lastLogin?: Date | null;
  };
}

// Extended JWT type definition
export interface ExtendedJWT {
  id?: string;
  role?: UserRole;
  emailVerified?: Date | null;
  phone?: string | null;
  language?: string | null;
  country?: string | null;
  status?: UserStatus;
  lastLogin?: Date | null;
}
