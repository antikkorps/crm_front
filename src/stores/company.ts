import { CompanyService } from '@/services/company.service'
import type {
  Company,
  CompanyContact,
  CompanyCreateDto,
  CompanyNote,
  CompanyQuote,
  CompanySearchParams,
  CompanyTask,
  CompanyUpdateDto,
  ContactCreateDto,
  ContactUpdateDto,
  Speciality,
} from '@/types/company.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCompanyStore = defineStore('company', () => {
  // State
  const companies = ref<Company[]>([])
  const currentCompany = ref<Company | null>(null)
  const companyContacts = ref<CompanyContact[]>([])
  const companyNotes = ref<CompanyNote[]>([])
  const companyTasks = ref<CompanyTask[]>([])
  const companyQuotes = ref<CompanyQuote[]>([])
  const specialities = ref<Speciality[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getCompanyById = computed(() => (id: string) => {
    return companies.value.find((company) => company.id === id) || null
  })

  // Actions
  async function fetchCompanies() {
    loading.value = true
    error.value = null

    try {
      companies.value = await CompanyService.getAllCompanies()
    } catch (err) {
      error.value = 'Failed to fetch companies'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyById(id: string) {
    loading.value = true
    error.value = null

    try {
      currentCompany.value = await CompanyService.getCompanyById(id)
    } catch (err) {
      error.value = 'Failed to fetch company details'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createCompany(data: CompanyCreateDto) {
    loading.value = true
    error.value = null

    try {
      const newCompany = await CompanyService.createCompany(data)
      companies.value = [...companies.value, newCompany]
      return newCompany
    } catch (err) {
      error.value = 'Failed to create company'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }
  async function updateCompany(id: string, data: CompanyUpdateDto) {
    loading.value = true
    error.value = null

    try {
      const updatedCompany = await CompanyService.updateCompany(id, data)

      // Update in companies list
      const index = companies.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        companies.value[index] = updatedCompany
      }

      // Update currentCompany if it's the one being edited
      if (currentCompany.value?.id === id) {
        currentCompany.value = updatedCompany
      }

      return updatedCompany
    } catch (err) {
      error.value = 'Failed to update company'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCompany(id: string) {
    loading.value = true
    error.value = null

    try {
      await CompanyService.deleteCompany(id)
      companies.value = companies.value.filter((c) => c.id !== id)

      // Clear currentCompany if it's the one being deleted
      if (currentCompany.value?.id === id) {
        currentCompany.value = null
      }

      return true
    } catch (err) {
      error.value = 'Failed to delete company'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyContacts(companyId: string) {
    loading.value = true
    error.value = null

    try {
      companyContacts.value = await CompanyService.getCompanyContacts(companyId)
    } catch (err) {
      error.value = 'Failed to fetch company contacts'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Contact management methods
  async function createContact(data: ContactCreateDto) {
    loading.value = true
    error.value = null

    try {
      const newContact = await CompanyService.createContact(data)
      // Add to contacts list if we're viewing the same company
      if (
        companyContacts.value.length > 0 &&
        companyContacts.value[0]?.companyId === data.companyId
      ) {
        companyContacts.value.push(newContact)
      }
      return newContact
    } catch (err) {
      error.value = 'Failed to create contact'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateContact(id: string, data: ContactUpdateDto) {
    loading.value = true
    error.value = null

    try {
      const updatedContact = await CompanyService.updateContact(id, data)
      // Update in contacts list
      const index = companyContacts.value.findIndex((contact) => contact.id === id)
      if (index !== -1) {
        companyContacts.value[index] = updatedContact
      }
      return updatedContact
    } catch (err) {
      error.value = 'Failed to update contact'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteContact(id: string) {
    loading.value = true
    error.value = null

    try {
      await CompanyService.deleteContact(id)
      // Remove from contacts list
      const index = companyContacts.value.findIndex((contact) => contact.id === id)
      if (index !== -1) {
        companyContacts.value.splice(index, 1)
      }
      return true
    } catch (err) {
      error.value = 'Failed to delete contact'
      console.error(err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyNotes(companyId: string) {
    loading.value = true
    error.value = null

    try {
      companyNotes.value = await CompanyService.getCompanyNotes(companyId)
    } catch (err) {
      error.value = 'Failed to fetch company notes'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function addCompanyNote(content: string, companyId: string) {
    loading.value = true
    error.value = null

    try {
      const newNote = await CompanyService.addCompanyNote({ content, companyId })
      companyNotes.value = [newNote, ...companyNotes.value]
      return newNote
    } catch (err) {
      error.value = 'Failed to add company note'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyTasks(companyId: string) {
    loading.value = true
    error.value = null

    try {
      companyTasks.value = await CompanyService.getCompanyTasks(companyId)
    } catch (err) {
      error.value = 'Failed to fetch company tasks'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyQuotes(companyId: string) {
    loading.value = true
    error.value = null

    try {
      companyQuotes.value = await CompanyService.getCompanyQuotes(companyId)
    } catch (err) {
      error.value = 'Failed to fetch company quotes'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchSpecialities() {
    loading.value = true
    error.value = null

    try {
      specialities.value = await CompanyService.fetchSpecialities()
      return specialities.value
    } catch (err) {
      error.value = 'Failed to fetch specialities'
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function searchCompanies(params: CompanySearchParams = {}) {
    loading.value = true
    error.value = null

    try {
      const searchParams: Record<string, unknown> = {}

      // Ajouter chaque propriété non-undefined au searchParams
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams[key] = value
        }
      })

      // Inclure les paramètres pour s'assurer que les relations sont chargées
      searchParams.includeSpecialities = true
      searchParams.includeAllSpecialities = true // Demande explicitement toutes les spécialités, même en filtrant
      searchParams.includeStatus = true
      searchParams.includeAssignedTo = true

      const result = (await CompanyService.searchCompanies(searchParams)) as {
        items: Company[]
        pagination: { totalItems: number }
      }

      // Si on filtre par spécialité, ou si les entreprises renvoyées n'ont pas toutes les spécialités
      if (params.specialityId && result.items && result.items.length > 0) {
        console.log('Récupération des détails complets pour les entreprises filtrées...')

        // Récupérer les détails complets pour chaque entreprise
        const companiesWithDetails = await Promise.all(
          result.items.map(async (company) => {
            try {
              return await CompanyService.getCompanyById(company.id)
            } catch (err) {
              console.error(`Erreur lors de la récupération des détails pour ${company.id}`, err)
              return company
            }
          }),
        )

        result.items = companiesWithDetails
      }

      companies.value = result.items || []
      console.log('Companies recherchées:', companies.value)
      return result
    } catch (err) {
      error.value = 'Failed to search companies'
      console.error(err)
      return { items: [], pagination: { totalItems: 0 } }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    companies,
    currentCompany,
    companyContacts,
    companyNotes,
    companyTasks,
    companyQuotes,
    specialities,
    loading,
    error,

    // Getters
    getCompanyById,

    // Actions
    fetchCompanies,
    fetchCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    fetchCompanyContacts,
    createContact,
    updateContact,
    deleteContact,
    fetchCompanyNotes,
    addCompanyNote,
    fetchCompanyTasks,
    fetchCompanyQuotes,
    fetchSpecialities,
    searchCompanies,
  }
})
