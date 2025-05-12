import type { CompanyStatus, PaginatedStatusResponse, Status } from '../types/company.types'
import { apiRequest } from './api.service'

const STATUS_API_URL = '/v1/statuses'

/**
 * Récupère la liste des statuts d'entreprise
 */
export async function fetchStatuses(): Promise<CompanyStatus[]> {
  const response = await apiRequest<PaginatedStatusResponse>(STATUS_API_URL)
  // Return the items array from the response
  return response.items || []
}

/**
 * Récupère un statut spécifique par son ID
 */
export async function fetchStatusById(id: string): Promise<CompanyStatus> {
  return await apiRequest<CompanyStatus>(`${STATUS_API_URL}/${id}`)
}

/**
 * Crée un nouveau statut d'entreprise
 */
export async function createStatus(
  statusData: Omit<CompanyStatus, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CompanyStatus> {
  return await apiRequest<CompanyStatus>(STATUS_API_URL, {
    method: 'POST',
    body: statusData,
  })
}

/**
 * Met à jour un statut d'entreprise existant
 */
export async function updateStatus(
  id: string,
  statusData: Partial<CompanyStatus>,
): Promise<CompanyStatus> {
  return await apiRequest<CompanyStatus>(`${STATUS_API_URL}/${id}`, {
    method: 'PUT',
    body: statusData,
  })
}

/**
 * Supprime un statut d'entreprise
 */
export async function deleteStatus(id: string): Promise<void> {
  await apiRequest<void>(`${STATUS_API_URL}/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Récupère les statuts d'entreprise par type
 */
export async function fetchStatusesByType(type: string): Promise<Status[]> {
  const response = await apiRequest<PaginatedStatusResponse>(`${STATUS_API_URL}/type/${type}`)
  // Return the items array from the response
  return response.items || []
}

/**
 * Modifie l'ordre d'affichage des statuts
 */
export async function updateStatusOrder(statusIds: string[]): Promise<CompanyStatus[]> {
  return await apiRequest<CompanyStatus[]>(`${STATUS_API_URL}/reorder`, {
    method: 'PUT',
    body: { statusIds },
  })
}
