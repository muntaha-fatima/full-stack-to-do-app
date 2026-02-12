/**
 * User type definitions.
 */

export interface User {
  id: string; // Better Auth uses string IDs
  email: string;
  name: string; // Better Auth uses 'name' instead of 'full_name'
  createdAt: string; // Better Auth uses 'createdAt' instead of 'created_at'
  updatedAt: string; // Better Auth uses 'updatedAt' instead of 'updated_at'
  // Additional fields that Better Auth might provide
  emailVerified?: string | null;
  image?: string | null;
}