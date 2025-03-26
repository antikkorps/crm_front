import type { User } from "~/types/user.ts"
export interface LoginResponse {
  token: string
  user: User
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiResponseType {
  data?: any
  [key: string]: any
}
