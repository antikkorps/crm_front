import { apiRequest } from './api.service'

export interface Status {
  id: string
  name: string
  description?: string
  type: string
  color?: string
  order: number
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface PipelineStage {
  name: string
  count: number
  value: number
  color?: string
}

export interface OpportunitiesByMonth {
  categories: string[]
  series: { name: string; data: number[] }[]
  valueSeries?: { name: string; data: number[] }[]
}

export interface OpportunityStatusDistribution {
  name: string
  count: number
  value: number
  color?: string
}

export interface OpportunityValueSummary {
  summary: {
    totalCount: number
    totalValue: number
    weightedValue: number
    averageValue: number
  }
  byStatus: Array<{
    statusId: string
    name: string
    color: string
    count: number
    totalValue: number
    weightedValue: number
    averageValue: number
  }>
  byUser: Array<{
    userId: string
    name: string
    count: number
    totalValue: number
    weightedValue: number
  }>
}

export const PipelineService = {
  // Récupérer tous les statuts
  async getAllStatuses(): Promise<Status[]> {
    const response = await apiRequest<{ items: Status[] }>('/v1/statuses')
    return response.items
  },

  // Récupérer un statut par son ID
  async getStatusById(id: string): Promise<Status> {
    return apiRequest<Status>(`/v1/statuses/${id}`)
  },

  // Récupérer les statuts par type (ex: "OPPORTUNITY")
  async getStatusesByType(type: string): Promise<Status[]> {
    const response = await apiRequest<{ items: Status[] }>(`/v1/statuses/type/${type}`)
    return response.items
  },

  // Récupérer les données de pipeline pour le graphique (opportunités par statut)
  async getOpportunitiesPipeline(): Promise<OpportunityStatusDistribution[]> {
    try {
      const response = await apiRequest<{ items: OpportunityStatusDistribution[] }>(
        '/v1/analytics/opportunities-pipeline',
      )
      return response.items
    } catch (error) {
      console.error('Erreur lors de la récupération des données de pipeline:', error)
      return []
    }
  },

  // Récupérer les opportunités par mois
  async getOpportunitiesByMonth(): Promise<OpportunitiesByMonth> {
    try {
      return await apiRequest<OpportunitiesByMonth>('/v1/analytics/opportunities-by-month')
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités par mois:', error)
      return { categories: [], series: [] }
    }
  },

  // Récupérer le résumé des valeurs des opportunités
  async getOpportunitiesValueSummary(): Promise<OpportunityValueSummary> {
    try {
      return await apiRequest<OpportunityValueSummary>('/v1/analytics/opportunities-value-summary')
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé des valeurs des opportunités:', error)
      return {
        summary: { totalCount: 0, totalValue: 0, weightedValue: 0, averageValue: 0 },
        byStatus: [],
        byUser: [],
      }
    }
  },

  // Créer un nouveau statut
  async createStatus(data: Omit<Status, 'id' | 'createdAt' | 'updatedAt'>): Promise<Status> {
    return apiRequest<Status>('/v1/statuses', {
      method: 'POST',
      body: data,
    })
  },

  // Mettre à jour un statut
  async updateStatus(
    id: string,
    data: Partial<Omit<Status, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Status> {
    return apiRequest<Status>(`/v1/statuses/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  // Supprimer un statut
  async deleteStatus(id: string): Promise<void> {
    await apiRequest<void>(`/v1/statuses/${id}`, {
      method: 'DELETE',
    })
  },
}
