import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as statusService from '../services/status.service'
import type { CompanyStatus, Status } from '../types/company.types'

export const useStatusStore = defineStore('status', () => {
  // État
  const statuses = ref<Status[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getStatusById = computed(() => {
    return (id: string) => statuses.value.find((status) => status.id === id)
  })

  const getStatusesByType = computed(() => {
    return (type: string) => statuses.value.filter((status) => status.type === type)
  })

  const getStatusesOrdered = computed(() => {
    return [...statuses.value].sort((a, b) => a.order - b.order)
  })

  // Actions
  async function fetchStatuses() {
    isLoading.value = true
    error.value = null

    try {
      const data = await statusService.fetchStatuses()
      statuses.value = data
      return data
    } catch (err: Error | unknown) {
      error.value = (err as Error).message || 'Erreur lors du chargement des statuts'
      console.error('Erreur lors du chargement des statuts:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchStatusesByType(type: string): Promise<Status[]> {
    isLoading.value = true
    error.value = null

    try {
      const data = await statusService.fetchStatusesByType(type)

      // Now data is already an array of Status objects
      data.forEach((status) => {
        const index = statuses.value.findIndex((s) => s.id === status.id)
        if (index !== -1) {
          statuses.value[index] = status
        } else {
          statuses.value.push(status)
        }
      })
      return data
    } catch (err: Error | unknown) {
      error.value =
        (err as Error).message || `Erreur lors du chargement des statuts de type ${type}`
      console.error(`Erreur lors du chargement des statuts de type ${type}:`, err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function createStatus(statusData: Omit<CompanyStatus, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    error.value = null

    try {
      const newStatus = await statusService.createStatus(statusData)
      statuses.value.push(newStatus)
      return newStatus
    } catch (err: Error | unknown) {
      error.value = (err as Error).message || 'Erreur lors de la création du statut'
      console.error('Erreur lors de la création du statut:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateStatus(id: string, statusData: Partial<CompanyStatus>) {
    isLoading.value = true
    error.value = null

    try {
      const updated = await statusService.updateStatus(id, statusData)
      const index = statuses.value.findIndex((status) => status.id === id)
      if (index !== -1) {
        statuses.value[index] = updated
      }
      return updated
    } catch (err: Error | unknown) {
      error.value = (err as Error).message || 'Erreur lors de la mise à jour du statut'
      console.error('Erreur lors de la mise à jour du statut:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteStatus(id: string) {
    isLoading.value = true
    error.value = null

    try {
      await statusService.deleteStatus(id)
      statuses.value = statuses.value.filter((status) => status.id !== id)
    } catch (err: Error | unknown) {
      error.value = (err as Error).message || 'Erreur lors de la suppression du statut'
      console.error('Erreur lors de la suppression du statut:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateStatusOrder(statusIds: string[]) {
    isLoading.value = true
    error.value = null

    try {
      const updated = await statusService.updateStatusOrder(statusIds)
      // Mise à jour de tous les statuts avec leur nouvel ordre
      statuses.value = updated
      return updated
    } catch (err: Error | unknown) {
      error.value = (err as Error).message || "Erreur lors de la mise à jour de l'ordre des statuts"
      console.error("Erreur lors de la mise à jour de l'ordre des statuts:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // État
    statuses,
    isLoading,
    error,

    // Getters
    getStatusById,
    getStatusesByType,
    getStatusesOrdered,

    // Actions
    fetchStatuses,
    fetchStatusesByType,
    createStatus,
    updateStatus,
    deleteStatus,
    updateStatusOrder,
  }
})
