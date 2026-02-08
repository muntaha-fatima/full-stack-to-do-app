import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/adapter-drizzle";
import { db } from "@/lib/db"; // Assuming you have a db instance
// Note: You might need to adjust the import based on your actual database setup

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    // If you're using different table names, adjust accordingly
    // user: "users", // default
    // account: "accounts", // default
    // session: "sessions", // default
  }),
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustHost: true,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Enable email verification
    minPasswordLength: 8,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    // Add social providers if needed
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
  },
  email: {
    // Configure your email provider
    // For development, you can use a service like Ethereal
    from: process.env.BETTER_AUTH_EMAIL_FROM || "noreply@yourdomain.com",
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Add any additional configuration as needed
});