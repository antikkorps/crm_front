import { segmentService } from '@/services/segment.service'
import type {
  PaginatedSegmentContactResponse,
  PaginatedSegmentResponse,
  Segment,
  SegmentContactsSearchParams,
  SegmentCreateDto,
  SegmentRule,
  SegmentSearchParams,
  SegmentStats,
  SegmentUpdateDto,
} from '@/types/segment.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToastStore } from './toast'

export const useSegmentStore = defineStore('segment', () => {
  // État
  const segments = ref<Segment[]>([])
  const currentSegment = ref<Segment | null>(null)
  const segmentContacts = ref<
    Array<{
      id: string
      firstName: string
      lastName: string
      email?: string
      phone?: string
      position?: string
      status: {
        id: string
        name: string
        type: string
        color: string
      }
      company?: {
        id: string
        name: string
        industry?: string
      }
      assignedTo?: {
        id: string
        firstName: string
        lastName: string
        avatarUrl?: string
      }
      isManuallyAdded: boolean
      addedAt: string
      segmentId: string
    }>
  >([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const stats = ref<SegmentStats | null>(null)
  const pagination = ref({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  // Getters
  const getSegmentById = computed(() => {
    return (id: string) => segments.value.find((segment) => segment.id === id)
  })

  const dynamicSegments = computed(() => {
    return segments.value.filter((segment) => segment.isDynamic)
  })

  const manualSegments = computed(() => {
    return segments.value.filter((segment) => !segment.isDynamic)
  })

  const totalContactCount = computed(() => {
    return segments.value.reduce((total, segment) => total + segment.contactCount, 0)
  })

  // Actions
  const fetchSegments = async (params?: SegmentSearchParams) => {
    loading.value = true
    error.value = null

    try {
      const response: PaginatedSegmentResponse = await segmentService.getSegments(params)
      segments.value = response.items
      if (response.pagination) {
        pagination.value = {
          totalItems: response.pagination.totalItems || 0,
          totalPages: response.pagination.totalPages || 0,
          currentPage: response.pagination.currentPage || 1,
          itemsPerPage: response.pagination.itemsPerPage || 20,
          hasNextPage: response.pagination.hasNextPage || false,
          hasPreviousPage: response.pagination.hasPreviousPage || false,
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des segments'
      console.error('Erreur lors du chargement des segments:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSegment = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const segment = await segmentService.getSegment(id)
      currentSegment.value = segment

      // Mettre à jour le segment dans la liste s'il existe
      const index = segments.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        segments.value[index] = segment
      } else {
        segments.value.push(segment)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du segment'
      console.error('Erreur lors du chargement du segment:', err)
    } finally {
      loading.value = false
    }
  }

  const createSegment = async (data: SegmentCreateDto) => {
    loading.value = true
    error.value = null

    try {
      const newSegment = await segmentService.createSegment(data)
      segments.value.push(newSegment)

      const toastStore = useToastStore()
      toastStore.success('Segment créé avec succès')

      return newSegment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la création du segment'
      console.error('Erreur lors de la création du segment:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSegment = async (id: string, data: SegmentUpdateDto) => {
    loading.value = true
    error.value = null

    try {
      const updatedSegment = await segmentService.updateSegment(id, data)

      // Mettre à jour dans la liste
      const index = segments.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        segments.value[index] = updatedSegment
      }

      // Mettre à jour le segment courant s'il s'agit du même
      if (currentSegment.value?.id === id) {
        currentSegment.value = updatedSegment
      }

      const toastStore = useToastStore()
      toastStore.success('Segment mis à jour avec succès')

      return updatedSegment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du segment'
      console.error('Erreur lors de la mise à jour du segment:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSegment = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await segmentService.deleteSegment(id)

      // Retirer de la liste
      segments.value = segments.value.filter((s) => s.id !== id)

      // Vider le segment courant s'il s'agit du même
      if (currentSegment.value?.id === id) {
        currentSegment.value = null
      }

      const toastStore = useToastStore()
      toastStore.success('Segment supprimé avec succès')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du segment'
      console.error('Erreur lors de la suppression du segment:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSegmentContacts = async (
    segmentId: string,
    params?: Omit<SegmentContactsSearchParams, 'segmentId'>,
  ) => {
    loading.value = true
    error.value = null

    try {
      const response: PaginatedSegmentContactResponse = await segmentService.getSegmentContacts(
        segmentId,
        params,
      )
      segmentContacts.value = response.items
      if (response.pagination) {
        pagination.value = {
          totalItems: response.pagination.totalItems || 0,
          totalPages: response.pagination.totalPages || 0,
          currentPage: response.pagination.currentPage || 1,
          itemsPerPage: response.pagination.itemsPerPage || 20,
          hasNextPage: response.pagination.hasNextPage || false,
          hasPreviousPage: response.pagination.hasPreviousPage || false,
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des contacts'
      console.error('Erreur lors du chargement des contacts:', err)
    } finally {
      loading.value = false
    }
  }

  const evaluateSegment = async (segmentId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log("🔍 [DEBUG] Début de l'évaluation du segment:", segmentId)

      const result = await segmentService.evaluateSegment(segmentId)

      console.log("🔍 [DEBUG] Résultat de l'évaluation:", result)
      console.log('🔍 [DEBUG] Type de contactCount:', typeof result.contactCount)
      console.log('🔍 [DEBUG] Valeur de contactCount:', result.contactCount)

      // Gérer le cas où contactCount est undefined ou null
      const contactCount = result.contactCount ?? 0

      console.log('🔍 [DEBUG] ContactCount après traitement:', contactCount)

      // Mettre à jour le segment dans la liste
      const index = segments.value.findIndex((s) => s.id === segmentId)
      if (index !== -1) {
        segments.value[index].contactCount = contactCount
        segments.value[index].lastEvaluatedAt = new Date().toISOString()
      }

      // Mettre à jour le segment courant s'il s'agit du même
      if (currentSegment.value?.id === segmentId) {
        currentSegment.value.contactCount = contactCount
        currentSegment.value.lastEvaluatedAt = new Date().toISOString()
      }

      const toastStore = useToastStore()
      const contactText = contactCount === 1 ? 'contact ajouté' : 'contacts ajoutés'
      toastStore.success(`${contactCount} ${contactText}`)

      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de l'évaluation du segment"
      console.error("Erreur lors de l'évaluation du segment:", err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const previewSegmentRules = async (rules: SegmentRule[]) => {
    try {
      return await segmentService.previewSegmentRules(rules)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la prévisualisation'
      console.error('Erreur lors de la prévisualisation:', err)
      throw err
    }
  }

  const fetchStats = async () => {
    try {
      stats.value = await segmentService.getSegmentStats()
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err)
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentSegment = () => {
    currentSegment.value = null
  }

  const clearSegmentContacts = () => {
    segmentContacts.value = []
  }

  const duplicateSegment = async (segmentId: string, newName: string) => {
    loading.value = true
    error.value = null

    try {
      const duplicatedSegment = await segmentService.duplicateSegment(segmentId, newName)
      segments.value.unshift(duplicatedSegment) // Ajouter en début de liste

      const toastStore = useToastStore()
      toastStore.success('Segment dupliqué avec succès')

      return duplicatedSegment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la duplication du segment'
      console.error('Erreur lors de la duplication du segment:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const addContactsToSegment = async (segmentId: string, contactIds: string[]) => {
    loading.value = true
    error.value = null

    try {
      const result = await segmentService.addContactsToSegment(segmentId, contactIds)

      // Recharger le segment pour mettre à jour le compteur
      await fetchSegment(segmentId)

      const toastStore = useToastStore()
      if (result.added > 0) {
        const contactText = result.added === 1 ? 'contact ajouté' : 'contacts ajoutés'
        toastStore.success(`${result.added} ${contactText} au segment`)
      }
      if (result.ignored > 0) {
        toastStore.info(`${result.ignored} contact(s) déjà présent(s) dans le segment`)
      }

      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'ajout des contacts'
      console.error('Erreur lors de l\'ajout des contacts:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const exportSegment = async (segmentId: string, format: 'csv' | 'xlsx' | 'json' = 'csv', includeAll: boolean = false) => {
    loading.value = true
    error.value = null

    try {
      const blob = await segmentService.exportSegment(segmentId, format, includeAll)
      
      const toastStore = useToastStore()
      toastStore.success('Export réussi')
      
      return blob
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'export'
      console.error('Erreur lors de l\'export:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    segments,
    currentSegment,
    segmentContacts,
    loading,
    error,
    stats,
    pagination,

    // Getters
    getSegmentById,
    dynamicSegments,
    manualSegments,
    totalContactCount,

    // Actions
    fetchSegments,
    fetchSegment,
    createSegment,
    updateSegment,
    deleteSegment,
    duplicateSegment,
    addContactsToSegment,
    exportSegment,
    fetchSegmentContacts,
    evaluateSegment,
    previewSegmentRules,
    fetchStats,
    clearError,
    clearCurrentSegment,
    clearSegmentContacts,
  }
})
