import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: number
      email?: string
      name?: string
      username?: string
      is_staff?: boolean
      is_active?: boolean
      is_superuser?: boolean
      last_login?: string
      date_joined?: string
      type?: string
    }
  }
}