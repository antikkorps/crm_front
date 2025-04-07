import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getToken, removeToken, setToken } from '../../src/utils/token'
import { apiRequest } from '../../src/services/api.service'
import { AuthService } from '../../src/services/auth.service'

// Mock les dépendances
vi.mock('../../src/services/api.service', () => ({
  apiRequest: vi.fn(),
}))

vi.mock('../../src/utils/token', () => ({
  setToken: vi.fn(),
  getToken: vi.fn(),
  removeToken: vi.fn(),
}))

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call apiRequest with correct params and store token on success', async () => {
      // Données simulées
      const mockCredentials = { email: 'test@example.com', password: 'password123' }
      const mockResponse = { token: 'fake-token', user: { id: '1', email: 'test@example.com' } }

      // Configure le mock pour renvoyer la réponse attendue
      vi.mocked(apiRequest).mockResolvedValue(mockResponse)

      // Appelle la méthode à tester
      const result = await AuthService.login(mockCredentials)

      // Vérifie que apiRequest a été appelé avec les bons paramètres
      expect(apiRequest).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: mockCredentials,
        includeAuth: false,
      })

      // Vérifie que le token a été stocké
      expect(setToken).toHaveBeenCalledWith('fake-token')

      // Vérifie que le résultat est celui attendu
      expect(result).toEqual(mockResponse)
    })

    it('should throw an error when apiRequest fails', async () => {
      const mockCredentials = { email: 'test@example.com', password: 'wrong' }
      const mockError = new Error('Invalid credentials')

      vi.mocked(apiRequest).mockRejectedValue(mockError)

      await expect(AuthService.login(mockCredentials)).rejects.toThrow('Invalid credentials')
      expect(setToken).not.toHaveBeenCalled()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      vi.mocked(getToken).mockReturnValue('fake-token')
      expect(AuthService.isAuthenticated()).toBe(true)
    })

    it('should return false when token does not exist', () => {
      vi.mocked(getToken).mockReturnValue(null)
      expect(AuthService.isAuthenticated()).toBe(false)
    })
  })

  describe('logout', () => {
    it('should call removeToken', () => {
      AuthService.logout()
      expect(removeToken).toHaveBeenCalled()
    })
  })
})