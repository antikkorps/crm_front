import { contactService } from '@/services/contact.service'
import type {
  Contact,
  ContactBulkAction,
  ContactCreateDto,
  ContactMergeData,
  ContactSearchParams,
  ContactStats,
  ContactUpdateDto,
  PaginatedContactResponse,
} from '@/types/contact.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToastStore } from './toast'

export const useContactStore = defineStore('contact', () => {
  // État
  const contacts = ref<Contact[]>([])
  const currentContact = ref<Contact | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const stats = ref<ContactStats | null>(null)
  const pagination = ref({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  // Getters
  const getContactById = computed(() => {
    return (id: string) => contacts.value.find((contact) => contact.id === id)
  })

  const mainContacts = computed(() => {
    return contacts.value.filter((contact) => contact.isMainContact)
  })

  const secondaryContacts = computed(() => {
    return contacts.value.filter((contact) => !contact.isMainContact)
  })

  const contactsByStatus = computed(() => {
    const grouped: Record<string, Contact[]> = {}
    contacts.value.forEach((contact) => {
      const statusId = contact.status.id
      if (!grouped[statusId]) {
        grouped[statusId] = []
      }
      grouped[statusId].push(contact)
    })
    return grouped
  })

  const contactsByCompany = computed(() => {
    const grouped: Record<string, Contact[]> = {}
    contacts.value.forEach((contact) => {
      if (contact.company) {
        const companyId = contact.company.id
        if (!grouped[companyId]) {
          grouped[companyId] = []
        }
        grouped[companyId].push(contact)
      }
    })
    return grouped
  })

  // Actions
  const fetchContacts = async (params?: ContactSearchParams) => {
    loading.value = true
    error.value = null

    try {
      const response: PaginatedContactResponse = await contactService.getContacts(params)
      contacts.value = response.items
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

  const fetchContact = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const contact = await contactService.getContact(id)
      currentContact.value = contact

      // Mettre à jour le contact dans la liste s'il existe
      const index = contacts.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        contacts.value[index] = contact
      } else {
        contacts.value.push(contact)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement du contact'
      console.error('Erreur lors du chargement du contact:', err)
    } finally {
      loading.value = false
    }
  }

  const createContact = async (data: ContactCreateDto) => {
    loading.value = true
    error.value = null

    try {
      const newContact = await contactService.createContact(data)
      contacts.value.push(newContact)

      const toastStore = useToastStore()
      toastStore.success('Contact créé avec succès')

      return newContact
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la création du contact'
      console.error('Erreur lors de la création du contact:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const updateContact = async (id: string, data: ContactUpdateDto) => {
    loading.value = true
    error.value = null

    try {
      const updatedContact = await contactService.updateContact(id, data)

      // Mettre à jour dans la liste
      const index = contacts.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        contacts.value[index] = updatedContact
      }

      // Mettre à jour le contact courant s'il s'agit du même
      if (currentContact.value?.id === id) {
        currentContact.value = updatedContact
      }

      const toastStore = useToastStore()
      toastStore.success('Contact mis à jour avec succès')

      return updatedContact
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du contact'
      console.error('Erreur lors de la mise à jour du contact:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteContact = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await contactService.deleteContact(id)

      // Retirer de la liste
      contacts.value = contacts.value.filter((c) => c.id !== id)

      // Vider le contact courant s'il s'agit du même
      if (currentContact.value?.id === id) {
        currentContact.value = null
      }

      const toastStore = useToastStore()
      toastStore.success('Contact supprimé avec succès')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression du contact'
      console.error('Erreur lors de la suppression du contact:', err)

      const toastStore = useToastStore()
      toastStore.error(error.value)

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchContactStats = async () => {
    try {
      stats.value = await contactService.getContactStats()
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err)
    }
  }

  const searchContacts = async (query: string, limit = 10, excludeSegment?: string) => {
    try {
      return await contactService.searchContacts(query, limit, excludeSegment)
    } catch (err) {
      console.error('Erreur lors de la recherche:', err)
      return []
    }
  }

  const getCompanyContacts = async (companyId: string) => {
    try {
      return await contactService.getCompanyContacts(companyId)
    } catch (err) {
      console.error("Erreur lors du chargement des contacts de l'entreprise:", err)
      return []
    }
  }

  const getAssignedContacts = async (userId: string) => {
    try {
      return await contactService.getAssignedContacts(userId)
    } catch (err) {
      console.error('Erreur lors du chargement des contacts assignés:', err)
      return []
    }
  }

  const getContactsByStatus = async (statusId: string) => {
    try {
      return await contactService.getContactsByStatus(statusId)
    } catch (err) {
      console.error('Erreur lors du chargement des contacts par statut:', err)
      return []
    }
  }

  const setMainContact = async (contactId: string, companyId: string) => {
    try {
      await contactService.setMainContact(contactId, companyId)

      // Mettre à jour le contact dans la liste
      const index = contacts.value.findIndex((c) => c.id === contactId)
      if (index !== -1) {
        contacts.value[index].isMainContact = true
      }

      // Mettre à jour le contact courant s'il s'agit du même
      if (currentContact.value?.id === contactId) {
        currentContact.value.isMainContact = true
      }

      const toastStore = useToastStore()
      toastStore.success('Contact défini comme contact principal')
    } catch (err) {
      const toastStore = useToastStore()
      toastStore.error('Erreur lors de la définition du contact principal')
      throw err
    }
  }

  const duplicateContact = async (contactId: string) => {
    try {
      const duplicatedContact = await contactService.duplicateContact(contactId)
      contacts.value.push(duplicatedContact)

      const toastStore = useToastStore()
      toastStore.success('Contact dupliqué avec succès')

      return duplicatedContact
    } catch (err) {
      const toastStore = useToastStore()
      toastStore.error('Erreur lors de la duplication du contact')
      throw err
    }
  }

  const bulkActionOnContacts = async (data: ContactBulkAction) => {
    try {
      await contactService.bulkActionOnContacts(data)

      // Recharger les contacts pour refléter les changements
      await fetchContacts()

      const toastStore = useToastStore()
      toastStore.success('Action en lot effectuée avec succès')
    } catch (err) {
      const toastStore = useToastStore()
      toastStore.error("Erreur lors de l'action en lot")
      throw err
    }
  }

  const mergeContacts = async (data: ContactMergeData) => {
    try {
      const mergedContact = await contactService.mergeContacts(data)

      // Retirer les contacts fusionnés de la liste
      contacts.value = contacts.value.filter((c) => !data.secondaryContactIds.includes(c.id))

      // Ajouter le contact fusionné
      contacts.value.push(mergedContact)

      const toastStore = useToastStore()
      toastStore.success('Contacts fusionnés avec succès')

      return mergedContact
    } catch (err) {
      const toastStore = useToastStore()
      toastStore.error('Erreur lors de la fusion des contacts')
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentContact = () => {
    currentContact.value = null
  }

  return {
    // État
    contacts,
    currentContact,
    loading,
    error,
    stats,
    pagination,

    // Getters
    getContactById,
    mainContacts,
    secondaryContacts,
    contactsByStatus,
    contactsByCompany,

    // Actions
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    fetchContactStats,
    searchContacts,
    getCompanyContacts,
    getAssignedContacts,
    getContactsByStatus,
    setMainContact,
    duplicateContact,
    bulkActionOnContacts,
    mergeContacts,
    clearError,
    clearCurrentContact,
  }
})
