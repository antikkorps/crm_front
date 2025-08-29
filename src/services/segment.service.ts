import type {
  PaginatedSegmentContactResponse,
  PaginatedSegmentResponse,
  Segment,
  SegmentBulkAction,
  SegmentContactsSearchParams,
  SegmentCreateDto,
  SegmentEvaluationResult,
  SegmentExportOptions,
  SegmentPreview,
  SegmentRule,
  SegmentSearchParams,
  SegmentStats,
  SegmentUpdateDto,
} from '@/types/segment.types'
import { apiRequest } from './api.service'
import { getToken } from '@/utils/token'

class SegmentService {
  private readonly baseUrl = '/segments'

  // Récupérer tous les segments
  async getSegments(params?: SegmentSearchParams): Promise<PaginatedSegmentResponse> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }
    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl
    return apiRequest<PaginatedSegmentResponse>(url)
  }

  // Récupérer un segment par ID
  async getSegment(id: string): Promise<Segment> {
    return apiRequest<Segment>(`${this.baseUrl}/${id}`)
  }

  // Créer un nouveau segment
  async createSegment(data: SegmentCreateDto): Promise<Segment> {
    return apiRequest<Segment>(this.baseUrl, {
      method: 'POST',
      body: data,
    })
  }

  // Mettre à jour un segment
  async updateSegment(id: string, data: SegmentUpdateDto): Promise<Segment> {
    return apiRequest<Segment>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  // Supprimer un segment
  async deleteSegment(id: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })
  }

  // Prévisualiser les règles d'un segment
  async previewSegmentRules(rules: SegmentRule[]): Promise<SegmentPreview> {
    return apiRequest<SegmentPreview>(`${this.baseUrl}/preview`, {
      method: 'POST',
      body: { rules },
    })
  }

  // Récupérer les contacts d'un segment
  async getSegmentContacts(
    segmentId: string,
    params?: Omit<SegmentContactsSearchParams, 'segmentId'>,
  ): Promise<PaginatedSegmentContactResponse> {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })
    }
    const url = queryParams.toString()
      ? `${this.baseUrl}/${segmentId}/contacts?${queryParams.toString()}`
      : `${this.baseUrl}/${segmentId}/contacts`
    return apiRequest<PaginatedSegmentContactResponse>(url)
  }

  // Évaluer un segment (recalculer les membres)
  async evaluateSegment(segmentId: string): Promise<SegmentEvaluationResult> {
    return apiRequest<SegmentEvaluationResult>(`${this.baseUrl}/${segmentId}/evaluate`, {
      method: 'POST',
    })
  }

  // Ajouter un contact à un segment
  async addContactToSegment(segmentId: string, contactId: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${segmentId}/contacts/${contactId}`, {
      method: 'POST',
    })
  }

  // Ajouter plusieurs contacts à un segment
  async addContactsToSegment(segmentId: string, contactIds: string[]): Promise<{
    added: number
    updated: number
    ignored: number
    totalProcessed: number
  }> {
    return apiRequest<{
      added: number
      updated: number
      ignored: number
      totalProcessed: number
    }>(`${this.baseUrl}/${segmentId}/contacts`, {
      method: 'POST',
      body: { contactIds },
    })
  }

  // Retirer un contact d'un segment
  async removeContactFromSegment(segmentId: string, contactId: string): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${segmentId}/contacts/${contactId}`, {
      method: 'DELETE',
    })
  }

  // Actions en lot sur les contacts d'un segment
  async bulkActionOnContacts(data: SegmentBulkAction): Promise<void> {
    return apiRequest<void>(`${this.baseUrl}/${data.segmentId}/contacts/bulk`, {
      method: 'POST',
      body: data,
    })
  }

  // Exporter les contacts d'un segment
  async exportSegmentContacts(options: SegmentExportOptions): Promise<Blob> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3030/api'}${this.baseUrl}/${options.segmentId}/export`,
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

  // Exporter un segment avec les nouveaux paramètres
  async exportSegment(segmentId: string, format: 'csv' | 'xlsx' | 'json' = 'csv', includeAll: boolean = false): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(includeAll && { includeAll: 'true' })
    })
    
    const token = getToken()
    const headers: Record<string, string> = {}
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3030/api'}${this.baseUrl}/${segmentId}/export?${params.toString()}`,
      {
        method: 'GET',
        headers,
        credentials: 'include',
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur lors de l'export: ${response.status}`)
    }

    return response.blob()
  }

  // Récupérer les statistiques des segments
  async getSegmentStats(): Promise<SegmentStats> {
    return apiRequest<SegmentStats>(`${this.baseUrl}/stats`)
  }

  // Dupliquer un segment
  async duplicateSegment(segmentId: string, newName: string): Promise<Segment> {
    return apiRequest<Segment>(`${this.baseUrl}/${segmentId}/duplicate`, {
      method: 'POST',
      body: { name: newName },
    })
  }

  // Valider les règles d'un segment
  async validateSegmentRules(
    rules: SegmentRule[],
  ): Promise<{ isValid: boolean; errors?: string[] }> {
    return apiRequest<{ isValid: boolean; errors?: string[] }>(`${this.baseUrl}/validate-rules`, {
      method: 'POST',
      body: { rules },
    })
  }

  // Récupérer les champs disponibles pour les règles
  async getAvailableFields(): Promise<
    Array<{
      field: string
      label: string
      type: 'string' | 'number' | 'boolean' | 'date' | 'array'
      operators: string[]
    }>
  > {
    return apiRequest<
      Array<{
        field: string
        label: string
        type: 'string' | 'number' | 'boolean' | 'date' | 'array'
        operators: string[]
      }>
    >(`${this.baseUrl}/available-fields`)
  }

  // Récupérer les opérateurs disponibles
  async getAvailableOperators(): Promise<
    Array<{
      operator: string
      label: string
      description: string
      supportedTypes: string[]
    }>
  > {
    return apiRequest<
      Array<{
        operator: string
        label: string
        description: string
        supportedTypes: string[]
      }>
    >(`${this.baseUrl}/available-operators`)
  }
}

export const segmentService = new SegmentService()
