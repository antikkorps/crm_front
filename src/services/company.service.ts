import type {
  Company,
  CompanyContact,
  CompanyCreateDto,
  CompanyNote,
  CompanyNoteCreateDto,
  CompanyQuote,
  CompanyTask,
  CompanyUpdateDto,
  Speciality,
} from '@/types/company.types'
import { apiRequest } from './api.service'

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

  // Récupérer les notes d'une entreprise
  async getCompanyNotes(companyId: string): Promise<CompanyNote[]> {
    const response = await apiRequest<{ items: CompanyNote[] }>(`/v1/notes/company/${companyId}`)
    return response.items
  },

  // Ajouter une note à une entreprise
  async addCompanyNote(data: CompanyNoteCreateDto): Promise<CompanyNote> {
    return apiRequest<CompanyNote>('/v1/notes', {
      method: 'POST',
      body: data,
    })
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
