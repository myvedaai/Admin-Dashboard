export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "manager" | "viewer"
  lastLogin?: Date
  avatar?: string
}

