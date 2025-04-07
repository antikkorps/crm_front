import type { RequestOptions } from '../types/api.types'
import { getToken } from '../utils/token'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api'

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, includeAuth = true } = options

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // Ajouter le token d'authentification si disponible et requis
  if (includeAuth) {
    const token = getToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, requestOptions)

    // Gérer les erreurs HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
    }

    // Pour les réponses 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    console.error('Échec de la requête API:', error)
    throw error
  }
}
