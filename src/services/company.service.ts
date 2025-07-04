import type { Activity, ActivityFilters } from '@/types/activity.types'
import type {
  Company,
  CompanyContact,
  CompanyCreateDto,
  CompanyQuote,
  CompanyTask,
  CompanyUpdateDto,
  ContactCreateDto,
  ContactUpdateDto,
  Speciality,
  Status,
} from '@/types/company.types'
import { ActivityService } from './activity.service'
import { apiRequest } from './api.service'
import { AuthService } from './auth.service'

export const CompanyService = {
  // Récupérer toutes les entreprises
  async getAllCompanies(): Promise<Company[]> {
    const response = await apiRequest<{ items: Company[] }>('/v1/companies')
    return response.items
  },

  // Récupérer une entreprise par son ID
  async getCompanyById(id: string): Promise<Company> {
    return apiRequest<Company>(`/v1/companies/${id}`)
  },

  // Créer une nouvelle entreprise
  async createCompany(data: CompanyCreateDto): Promise<Company> {
    return apiRequest<Company>('/v1/companies', {
      method: 'POST',
      body: data,
    })
  },

  // Mettre à jour une entreprise
  async updateCompany(id: string, data: CompanyUpdateDto): Promise<Company> {
    console.log('🔍 Company Service - updateCompany appelé avec:', {
      id,
      data,
      specialities: data.specialities,
      specialitiesLength: data.specialities?.length,
    })

    const result = await apiRequest<Company>(`/v1/companies/${id}`, {
      method: 'PUT',
      body: data,
    })

    console.log('🔍 Company Service - Réponse du backend:', {
      result,
      specialities: result.Specialities,
      specialitiesCount: result.Specialities?.length,
    })

    return result
  },

  // Supprimer une entreprise
  async deleteCompany(id: string): Promise<void> {
    await apiRequest<void>(`/v1/companies/${id}`, {
      method: 'DELETE',
    })
  },

  // Récupérer les contacts d'une entreprise
  async getCompanyContacts(companyId: string): Promise<CompanyContact[]> {
    const response = await apiRequest<{ items: CompanyContact[] }>(
      `/v1/contacts/company/${companyId}`,
    )
    return response.items
  },

  // Créer un nouveau contact pour une entreprise
  async createContact(data: ContactCreateDto): Promise<CompanyContact> {
    try {
      // Récupérer l'utilisateur connecté pour obtenir tenantId
      const currentUser = await AuthService.getCurrentUser()

      // Récupérer les statuts de type CONTACT pour obtenir le premier comme défaut
      const contactStatuses = await apiRequest<{ items: Status[] }>('/v1/statuses/type/CONTACT')
      const defaultStatus = contactStatuses.items?.[0]

      if (!defaultStatus) {
        throw new Error(
          'Aucun statut de contact disponible. Veuillez créer un statut de type CONTACT.',
        )
      }

      // Préparer les données avec tenantId et statusId
      const contactData = {
        ...data,
        tenantId: currentUser.tenantId,
        statusId: defaultStatus.id,
      }

      return apiRequest<CompanyContact>('/v1/contacts', {
        method: 'POST',
        body: contactData,
      })
    } catch (error) {
      console.error('Error creating contact:', error)
      throw error
    }
  },

  // Mettre à jour un contact
  async updateContact(id: string, data: ContactUpdateDto): Promise<CompanyContact> {
    return apiRequest<CompanyContact>(`/v1/contacts/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  // Supprimer un contact
  async deleteContact(id: string): Promise<void> {
    await apiRequest<void>(`/v1/contacts/${id}`, {
      method: 'DELETE',
    })
  },

  // Récupérer les notes d'une entreprise
  async getCompanyNotes(companyId: string): Promise<Activity[]> {
    const filters: ActivityFilters = {
      type: ['NOTE'],
      companyId,
    }
    return ActivityService.getAllActivities(filters)
  },

  // Ajouter une note à une entreprise
  async addCompanyNote(data: {
    title: string
    content: string
    companyId: string
  }): Promise<Activity> {
    return ActivityService.createSpecializedActivity({
      ...data,
      type: 'NOTE',
    })
  },

  // Mettre à jour une note
  async updateCompanyNote(
    id: string,
    data: { title?: string; content?: string },
  ): Promise<Activity> {
    return ActivityService.updateSpecializedActivity(id, { ...data, type: 'NOTE' })
  },

  // Supprimer une note
  async deleteCompanyNote(id: string): Promise<void> {
    return ActivityService.deleteActivity(id)
  },

  // Récupérer les tâches liées à une entreprise
  async getCompanyTasks(companyId: string): Promise<CompanyTask[]> {
    const response = await apiRequest<{ items: CompanyTask[] }>(
      `/v1/companies/${companyId}/activities`,
    )
    return response.items
  },

  // Récupérer les devis d'une entreprise
  async getCompanyQuotes(companyId: string): Promise<CompanyQuote[]> {
    const response = await apiRequest<{ items: CompanyQuote[] }>(
      `/v1/companies/${companyId}/quotes`,
    )
    return response.items
  },

  async fetchSpecialities(): Promise<Speciality[]> {
    const response = await apiRequest<{ items: Speciality[] }>('/v1/specialities?limit=-1')
    return response.items
  },

  async searchCompanies(params: Record<string, unknown>): Promise<unknown> {
    // Construire les paramètres de requête
    const queryParams = new URLSearchParams()

    console.log('params reçus dans le service:', params)

    // S'assurer que nous demandons toujours toutes les spécialités
    if (!params.includeAllSpecialities) {
      params.includeAllSpecialities = true
    }

    // Ajouter tous les paramètres à queryParams
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'boolean') {
          queryParams.append(key, value ? 'true' : 'false')
        } else {
          queryParams.append(key, String(value))
        }
      }
    })

    console.log('Query parameters finaux:', queryParams.toString())

    return await apiRequest(`/v1/companies/search?${queryParams.toString()}`)
  },
}
