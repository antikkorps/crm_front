export interface LoginRequest {
  email: string
  password: string
  tenantDomain?: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantId: string
  roleId?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  tenantId: string
  avatarUrl?: string
  role?: {
    id: string
    name: string
    permissions: string[] | Record<string, boolean>
  }
  tenant?: {
    id: string
    name: string
    domain: string
  }
}

export interface AuthResponse {
  user: User
  token: string
}
