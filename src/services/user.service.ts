import type { User } from '@/types/auth.types'
import type { UserResponse, UserSearchParams } from '@/types/user.types'
import { apiRequest } from './api.service'

export const UserService = {
  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    const response = await apiRequest<{ items: User[] }>('/v1/users')
    console.log('Response getAllUsers:', response.items)
    return response.items
  },

  // Récupérer un utilisateur par son ID
  async getUserById(id: string): Promise<User> {
    return apiRequest<User>(`/v1/users/${id}`)
  },

  // Mettre à jour un utilisateur
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return apiRequest<User>(`/v1/users/${id}`, {
      method: 'PUT',
      body: userData,
    })
  },

  // Désactiver un utilisateur
  async deactivateUser(id: string): Promise<void> {
    await apiRequest<void>(`/users/${id}/deactivate`, {
      method: 'POST',
    })
  },

  // Activer un utilisateur
  async activateUser(id: string): Promise<void> {
    await apiRequest<void>(`/users/${id}/activate`, {
      method: 'POST',
    })
  },

  // Rechercher des utilisateurs
  async searchUsers(params: UserSearchParams): Promise<UserResponse> {
    // Construire les paramètres de requête
    const queryParams = new URLSearchParams()

    // Ajouter les paramètres à la querystring
    if (params.query) queryParams.append('query', params.query)
    if (params.role) queryParams.append('role', params.role)
    if (params.active !== undefined) queryParams.append('active', String(params.active))
    if (params.page) queryParams.append('page', String(params.page))
    if (params.limit) queryParams.append('limit', String(params.limit))

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
    return apiRequest<UserResponse>(`/users/search${queryString}`)
  },

  // Modifier le mot de passe de l'utilisateur
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiRequest<void>(`/users/${userId}/change-password`, {
      method: 'POST',
      body: {
        currentPassword,
        newPassword,
      },
    })
  },

  // Mettre à jour l'avatar de l'utilisateur
  async updateAvatar(userId: string, avatarFile: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', avatarFile)

    return apiRequest<{ avatarUrl: string }>(`/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
    })
  },

  // Récupérer les paramètres de l'utilisateur
  async getUserSettings(userId: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/users/${userId}/settings`)
  },

  // Mettre à jour les paramètres de l'utilisateur
  async updateUserSettings(
    userId: string,
    settings: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/users/${userId}/settings`, {
      method: 'PUT',
      body: settings,
    })
  },
}
