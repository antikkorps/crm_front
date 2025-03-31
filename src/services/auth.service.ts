import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth.types'
import { getToken, removeToken, setToken } from '../utils/token'
import { apiRequest } from './api.service'

export const AuthService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
      includeAuth: false,
    })

    if (response && response.token) {
      setToken(response.token)
    }

    return response
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: userData,
      includeAuth: false,
    })

    if (response && response.token) {
      setToken(response.token)
    }

    return response
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/auth/me')
  },

  logout(): void {
    removeToken()
  },

  isAuthenticated(): boolean {
    return !!getToken()
  },
}
