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

      const result = (await CompanyService.searchCompanies(searchParams)) as {
        items: Company[]
        pagination: { totalItems: number }
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
    fetchCompanyNotes,
    addCompanyNote,
    fetchCompanyTasks,
    fetchCompanyQuotes,
    searchCompanies,
  }
})
