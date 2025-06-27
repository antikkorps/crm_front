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
  avatarStyle?: string
  avatarSeed?: string
  avatarBackgroundColor?: string
  avatarScale?: number
  avatarRotation?: number
  phone?: string
  jobTitle?: string
  bio?: string
  lastLoginAt?: string
  isActive?: boolean
  isSuperAdmin?: boolean
  createdAt?: string
  updatedAt?: string
  role?: {
    id: string
    name: string
    permissions: string[] | Record<string, boolean>
  }
  Role?: {
    id: string
    name: string
    permissions: Record<string, Record<string, boolean>>
    tenantId: string
    createdAt: string
    updatedAt: string
  }
  tenant?: {
    id: string
    name: string
    domain: string
  }
  Tenant?: {
    id: string
    name: string
    domain: string
    createdAt: string
    updatedAt: string
  }
}

export interface AuthResponse {
  user: User
  token: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  jobTitle?: string
  bio?: string
  avatarUrl?: string
  avatarStyle?: string
  avatarSeed?: string
  avatarBackgroundColor?: string
  avatarScale?: number
  avatarRotation?: number
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateAvatarRequest {
  avatarUrl: string
}
