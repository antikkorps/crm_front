import type { User } from '@/types/auth.types'

export interface UserSearchParams {
  query?: string
  role?: string
  active?: boolean
  page?: number
  limit?: number
}

export interface UserResponse {
  users: User[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
}
