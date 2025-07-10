import type {
  Contact,
  ContactBulkAction,
  ContactCreateDto,
  ContactExportOptions,
  ContactMergeData,
  ContactSearchParams,
  ContactStats,
  ContactUpdateDto,
  PaginatedContactResponse,
} from '@/types/contact.types'
import { apiRequest } from './api.service'

class ContactService {
  private readonly baseUrl = '/contacts'

  // Récupérer tous les contacts
  async getContacts(params?: ContactSearchParams): Promise<PaginatedContactResponse> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl
    return apiRequest<PaginatedContactResponse>(url)
  }

  // Récupérer un contact par ID
  async getContact(id: string): Promise<Contact> {
    return apiRequest<Contact>(`${this.baseUrl}/${id}`)
  }

  // Créer un nouveau contact
  async createContact(data: ContactCreateDto): Promise<Contact> {
    return apiRequest<Contact>(this.baseUrl, {
      method: 'POST',
      body: data,
    })
  }

  // Mettre à jour un contact
  async updateContact(id: string, data: ContactUpdateDto): Promise<Contact> {
    return apiRequest<Contact>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  // Supprimer un contact
  async deleteContact(id: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })
  }

  // Récupérer les statistiques des contacts
  async getContactStats(): Promise<ContactStats> {
    return apiRequest<ContactStats>(`${this.baseUrl}/stats`)
  }

  // Exporter les contacts
  async exportContacts(options: ContactExportOptions): Promise<Blob> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3030/api'}${this.baseUrl}/export`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(options),
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur lors de l'export: ${response.status}`)
    }

    return response.blob()
  }

  // Actions en lot sur les contacts
  async bulkActionOnContacts(data: ContactBulkAction): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/bulk`, {
      method: 'POST',
      body: data,
    })
  }

  // Fusionner des contacts
  async mergeContacts(data: ContactMergeData): Promise<Contact> {
    return apiRequest<Contact>(`${this.baseUrl}/merge`, {
      method: 'POST',
      body: data,
    })
  }

  // Récupérer les segments d'un contact
  async getContactSegments(contactId: string): Promise<
    Array<{
      id: string
      name: string
      isDynamic: boolean
      isManuallyAdded: boolean
      addedAt: string
    }>
  > {
    return apiRequest<
      Array<{
        id: string
        name: string
        isDynamic: boolean
        isManuallyAdded: boolean
        addedAt: string
      }>
    >(`${this.baseUrl}/${contactId}/segments`)
  }

  // Rechercher des contacts par nom ou email
  async searchContacts(query: string, limit = 10): Promise<Contact[]> {
    const response = await apiRequest<{ items: Contact[] }>(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    )
    return response.items
  }

  // Récupérer les contacts d'une entreprise
  async getCompanyContacts(companyId: string): Promise<Contact[]> {
    const response = await apiRequest<{ items: Contact[] }>(`${this.baseUrl}/company/${companyId}`)
    return response.items
  }

  // Récupérer les contacts assignés à un utilisateur
  async getAssignedContacts(userId: string): Promise<Contact[]> {
    const response = await apiRequest<{ items: Contact[] }>(`${this.baseUrl}/assigned/${userId}`)
    return response.items
  }

  // Récupérer les contacts par statut
  async getContactsByStatus(statusId: string): Promise<Contact[]> {
    const response = await apiRequest<{ items: Contact[] }>(`${this.baseUrl}/status/${statusId}`)
    return response.items
  }

  // Marquer un contact comme contact principal
  async setMainContact(contactId: string, companyId: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${contactId}/main`, {
      method: 'POST',
      body: { companyId },
    })
  }

  // Dupliquer un contact
  async duplicateContact(contactId: string): Promise<Contact> {
    return apiRequest<Contact>(`${this.baseUrl}/${contactId}/duplicate`, {
      method: 'POST',
    })
  }

  // Valider les données d'un contact
  async validateContact(
    data: ContactCreateDto | ContactUpdateDto,
  ): Promise<{ isValid: boolean; errors?: string[] }> {
    return apiRequest<{ isValid: boolean; errors?: string[] }>(`${this.baseUrl}/validate`, {
      method: 'POST',
      body: data,
    })
  }
}

export const contactService = new ContactService()
