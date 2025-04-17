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
  series: Array<{
    name: string
    data: number[]
  }>
}

export interface OpportunitiesValueSummary {
  totalValue: number
  averageValue: number
  medianValue: number
  winRate: number
  percentChangeLastMonth: number
}

export const PipelineService = {
  // Récupérer tous les statuts
  async getAllStatuses(): Promise<Status[]> {
    const response = await apiRequest<{ items: Status[] }>('/statuses')
    return response.items
  },

  // Récupérer un statut par son ID
  async getStatusById(id: string): Promise<Status> {
    return apiRequest<Status>(`/statuses/${id}`)
  },

  // Récupérer les statuts par type (ex: "OPPORTUNITY")
  async getStatusesByType(type: string): Promise<Status[]> {
    const response = await apiRequest<{ items: Status[] }>(`/statuses/type/${type}`)
    return response.items
  },

  // Récupérer les données de pipeline pour le graphique (opportunités par statut)
  async getOpportunitiesPipeline(): Promise<PipelineStage[]> {
    try {
      // Route mise à jour pour correspondre au backend
      const response = await apiRequest<{ items: PipelineStage[] }>(
        '/v1/analytics/opportunities-pipeline',
      )
      console.log('Données du pipeline récupérées:', response.items)
      return response.items
    } catch (error) {
      console.error('Erreur lors de la récupération des données du pipeline:', error)
      // Retourner des données fictives en cas d'erreur
      return [
        { name: 'Prospection', count: 12, value: 25000, color: '#4fc3f7' },
        { name: 'Qualification', count: 8, value: 35000, color: '#7bdcb5' },
        { name: 'Proposition', count: 5, value: 42000, color: '#ffd54f' },
        { name: 'Négociation', count: 3, value: 68000, color: '#ff9800' },
        { name: 'Gagné', count: 2, value: 45000, color: '#4caf50' },
      ]
    }
  },

  // Récupérer les données d'opportunités par mois pour le graphique
  async getOpportunitiesByMonth(): Promise<OpportunitiesByMonth> {
    try {
      // Route mise à jour pour correspondre au backend
      return await apiRequest<OpportunitiesByMonth>('/v1/analytics/opportunities-by-month')
    } catch (error) {
      console.error('Erreur lors de la récupération des données mensuelles:', error)
      // Retourner des données fictives en cas d'erreur
      return {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        series: [
          {
            name: 'Prospection',
            data: [44, 55, 57, 56, 61, 58],
          },
          {
            name: 'Qualification',
            data: [76, 85, 101, 98, 87, 105],
          },
          {
            name: 'Proposition',
            data: [35, 41, 36, 26, 45, 48],
          },
          {
            name: 'Négociation',
            data: [35, 41, 36, 26, 45, 48],
          },
          {
            name: 'Gagné',
            data: [25, 31, 26, 36, 25, 28],
          },
        ],
      }
    }
  },

  // Récupérer le résumé des valeurs d'opportunités
  async getOpportunitiesValueSummary(): Promise<OpportunitiesValueSummary> {
    try {
      return await apiRequest<OpportunitiesValueSummary>(
        '/v1/analytics/opportunities-value-summary',
      )
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé des valeurs:', error)
      // Retourner des données fictives en cas d'erreur
      return {
        totalValue: 245000,
        averageValue: 35000,
        medianValue: 28000,
        winRate: 0.32,
        percentChangeLastMonth: 0.15,
      }
    }
  },

  // Créer un nouveau statut
  async createStatus(data: Omit<Status, 'id' | 'createdAt' | 'updatedAt'>): Promise<Status> {
    return apiRequest<Status>('/statuses', {
      method: 'POST',
      body: data,
    })
  },

  // Mettre à jour un statut
  async updateStatus(
    id: string,
    data: Partial<Omit<Status, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Status> {
    return apiRequest<Status>(`/statuses/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  // Supprimer un statut
  async deleteStatus(id: string): Promise<void> {
    await apiRequest<void>(`/statuses/${id}`, {
      method: 'DELETE',
    })
  },
}
