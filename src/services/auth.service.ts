import router from '@/router'
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
    try {
      return await apiRequest<User>('/auth/me')
    } catch (error) {
      // Si l'erreur est due à une authentification invalide, déconnexion silencieuse
      if (
        (error as Error).message?.includes('Session expirée') ||
        (error as Error).message?.includes('authentification')
      ) {
        this.logout()
        throw new Error('Session utilisateur expirée')
      }
      throw error
    }
  },

  async updatePassword(passwordData: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    await apiRequest<void>('/auth/update-password', {
      method: 'PUT',
      body: passwordData,
    })
  },

  async updateProfile(profileData: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    jobTitle?: string
    bio?: string
  }): Promise<Partial<User>> {
    return await apiRequest<Partial<User>>('/auth/update-profile', {
      method: 'PUT',
      body: profileData,
    })
  },

  logout(redirectToLogin = false): void {
    removeToken()

    // Si demandé, rediriger vers la page de login
    if (redirectToLogin) {
      const currentPath = window.location.pathname
      const redirectParam =
        currentPath !== '/login' ? `?redirect=${encodeURIComponent(currentPath)}` : ''
      router.push(`/login${redirectParam}`)
    }
  },

  isAuthenticated(): boolean {
    return !!getToken()
  },

  // Vérifier la validité du token
  async checkTokenValidity(): Promise<boolean> {
    if (!this.isAuthenticated()) return false

    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      console.error('Token invalide ou expiré:', error)
      return false
    }
  },

  // Redirection si non authentifié
  async requireAuth(redirectPath?: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      this.redirectToLogin(redirectPath)
      return false
    }

    const tokenValid = await this.checkTokenValidity()
    if (!tokenValid) {
      this.redirectToLogin(redirectPath)
      return false
    }

    return true
  },

  // Utilitaire pour la redirection vers la page de login
  redirectToLogin(path?: string): void {
    const redirectPath = path || window.location.pathname
    const redirectParam =
      redirectPath !== '/login' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''
    router.push(`/login${redirectParam}`)
  },
}
