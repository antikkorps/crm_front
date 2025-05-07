<template>
  <div class="companies-container">
    <div class="page-header flex justify-between items-center mb-6">
      <BackToDashboard />
      <h1 class="text-2xl font-bold">Entreprises</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <Iconify icon="mdi:plus" class="w-5 h-5 mr-1" />
        Ajouter
      </button>
    </div>
    <div class="mb-4">
      <SearchBar
        placeholder="Rechercher une entreprise..."
        :filters="companyFilters"
        :initial-filters="initialFilters"
        @search="handleSearch"
        @reset="resetSearch"
      />
    </div>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="!companies.length" class="text-center py-12">
      <h3 class="text-xl mb-2">No companies found</h3>
      <p class="text-gray-500 mb-4">Get started by adding your first company</p>
      <button class="btn btn-primary" @click="openCreateModal">Add Company</button>
    </div>

    <div v-else class="companies-grid">
      <!-- Version bureau du tableau (caché sur mobile) -->
      <div class="overflow-x-auto hidden md:block">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th class="text-right">Masse Salariale</th>
              <th>Adresse</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in companies" :key="company.id" class="hover:bg-gray-50">
              <td>
                <router-link
                  :to="{ name: 'company-detail', params: { id: company.id } }"
                  class="font-medium text-primary hover:underline"
                >
                  {{ company.name }}
                </router-link>
              </td>
              <td>{{ company.industry || 'N/A' }}</td>
              <td class="text-right">{{ company.size || 'N/A' }}</td>
              <td v-if="company.address">
                {{ company.address || 'N/A' }} - {{ company.zipCode || 'N/A' }}
                {{ company.city || 'N/A' }} - {{ company.country || 'N/A' }}
              </td>
              <td v-else>Pas d'adresse renseignée</td>
              <td>
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :class="getStatusClass(company.status?.name)"
                >
                  {{ company.status?.name || 'N/A' }}
                </span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button
                    class="text-gray-500 hover:text-primary"
                    @click="openEditModal(company)"
                    title="Edit"
                  >
                    <span class="sr-only">Edit</span>
                    <Iconify icon="heroicons:pencil-square" class="h-5 w-5" />
                  </button>
                  <button
                    class="text-gray-500 hover:text-red-500"
                    @click="confirmDelete(company)"
                    title="Delete"
                  >
                    <span class="sr-only">Delete</span>
                    <Iconify icon="heroicons:trash" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Version mobile du tableau (visible uniquement sur mobile) -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div
          v-for="company in companies"
          :key="company.id"
          class="bg-base-100 rounded-lg shadow p-4"
        >
          <div class="flex justify-between items-center mb-2">
            <router-link
              :to="{ name: 'company-detail', params: { id: company.id } }"
              class="font-medium text-primary text-lg hover:underline"
            >
              {{ company.name }}
            </router-link>

            <span
              class="px-2 py-1 rounded-full text-xs"
              :class="getStatusClass(company.status?.name)"
            >
              {{ company.status?.name || 'N/A' }}
            </span>
          </div>

          <!-- Informations secondaires qui pourraient être utiles en mobile -->
          <div class="text-sm text-gray-500 mb-3">
            {{ company.industry || 'Industrie non spécifiée' }}
          </div>

          <div class="flex justify-end space-x-3 mt-2">
            <button class="btn btn-sm btn-ghost" @click="openEditModal(company)" title="Edit">
              <Iconify icon="heroicons:pencil-square" class="h-4 w-4 mr-1" />
              Modifier
            </button>
            <button
              class="btn btn-sm btn-ghost text-red-500"
              @click="confirmDelete(company)"
              title="Delete"
            >
              <Iconify icon="heroicons:trash" class="h-4 w-4 mr-1" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Company Modal -->
    <div class="modal" :class="{ 'modal-open': showModal }" id="companyModal">
      <div class="modal-box">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Company' : 'Add Company' }}</h2>

        <form @submit.prevent="submitCompanyForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-group">
              <label class="label">Company Name*</label>
              <input
                v-model="companyForm.name"
                type="text"
                class="input input-bordered w-full"
                placeholder="Company Name"
                required
              />
            </div>

            <div class="form-group">
              <label class="label">Industry</label>
              <input
                v-model="companyForm.industry"
                type="text"
                class="input input-bordered w-full"
                placeholder="Industry"
              />
            </div>

            <div class="form-group">
              <label class="label">Size</label>
              <select v-model="companyForm.size" class="select select-bordered w-full">
                <option value="">Select Size</option>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="201-500">201-500 employés</option>
                <option value="501-1000">501-1000 employés</option>
                <option value="+1000">1000+ employés</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Adresse</label>
              <input
                v-model="companyForm.address"
                type="text"
                class="input input-bordered w-full"
                placeholder="Adresse"
              />
            </div>

            <div class="form-group">
              <label class="label">Ville</label>
              <input
                v-model="companyForm.city"
                type="text"
                class="input input-bordered w-full"
                placeholder="Ville"
              />
            </div>

            <div class="form-group">
              <label class="label">Code Postal</label>
              <input
                v-model="companyForm.zipCode"
                type="text"
                class="input input-bordered w-full"
                placeholder="Code Postal"
              />
            </div>

            <div class="form-group">
              <label class="label">Pays</label>
              <input
                v-model="companyForm.country"
                type="text"
                class="input input-bordered w-full"
                placeholder="Pays"
              />
            </div>

            <div class="form-group">
              <label class="label">Status</label>
              <select v-model="companyForm.statusId" class="select select-bordered w-full">
                <option value="">Select Status</option>
                <option v-for="status in companyStatuses" :key="status.id" :value="status.id">
                  {{ status.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Website</label>
              <input
                v-model="companyForm.website"
                type="url"
                class="input input-bordered w-full"
                placeholder="Website URL"
              />
            </div>
          </div>

          <div class="form-group mb-4">
            <label class="label">Description</label>
            <textarea
              v-model="companyForm.description"
              class="textarea textarea-bordered w-full"
              placeholder="Company description"
              rows="3"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" class="btn" @click="closeModal">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ isEditing ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="closeModal">
        <button>close</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'modal-open': showDeleteModal }" id="deleteModal">
      <div class="modal-box">
        <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>
          Are you sure you want to delete {{ companyToDelete?.name }}? This action cannot be undone.
        </p>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" class="btn" @click="showDeleteModal = false">Cancel</button>
          <button type="button" class="btn btn-error" @click="deleteCompany" :disabled="loading">
            Delete
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showDeleteModal = false">
        <button>close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackToDashboard from '@/components/common/BackToDashboard.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import { useCompanyStore } from '@/stores/company'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type { Company, CompanyCreateDto, CompanyUpdateDto } from '@/types/company.types'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const companyStore = useCompanyStore()
const statusStore = useStatusStore()
const toastStore = useToastStore()
const userStore = useUserStore()

// Company form
const companyForm = reactive<CompanyCreateDto & { id?: string }>({
  name: '',
  industry: '',
  size: '',
  address: '',
  city: '',
  zipCode: '',
  country: '',
  statusId: '',
  website: '',
  description: '',
})

// UI states
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const companyToDelete = ref<Company | null>(null)

// Computed properties and reactive refs
const companies = ref<Company[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const companyStatuses = computed(() => statusStore.getStatusesByType('COMPANY'))

// Load companies on component mount
onMounted(async () => {
  loading.value = true
  try {
    await statusStore.fetchStatusesByType('COMPANY')
    await userStore.fetchUsers()
    await companyStore.fetchCompanies()
    companies.value = companyStore.companies
    error.value = companyStore.error
  } catch (err) {
    console.error(err)
    toastStore.error('Failed to load companies')
    error.value = 'Failed to load companies'
  } finally {
    loading.value = false
  }
})

// Form handling
function openCreateModal() {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

function openEditModal(company: Company) {
  isEditing.value = true
  resetForm()
  Object.assign(companyForm, {
    id: company.id,
    name: company.name,
    industry: company.industry || '',
    size: company.size || '',
    address: company.address || '',
    city: company.city || '',
    zipCode: company.zipCode || '',
    country: company.country || '',
    statusId: company.status.id || '',
    website: company.website || '',
    description: company.description || '',
  })
  showModal.value = true
}

async function submitCompanyForm() {
  loading.value = true

  try {
    if (isEditing.value && companyForm.id) {
      // Update existing company
      const updateData: CompanyUpdateDto = {
        name: companyForm.name,
        industry: companyForm.industry,
        size: companyForm.size,
        address: companyForm.address,
        statusId: companyForm.statusId || undefined,
        website: companyForm.website,
        description: companyForm.description,
      }

      const result = await companyStore.updateCompany(companyForm.id, updateData)
      if (result) {
        toastStore.success('Company updated successfully')
        await companyStore.fetchCompanies()
        companies.value = companyStore.companies
        closeModal()
      } else {
        toastStore.error('Failed to update company')
      }
    } else {
      // Create new company
      const createData: CompanyCreateDto = {
        name: companyForm.name,
        industry: companyForm.industry,
        size: companyForm.size,
        address: companyForm.address,
        statusId: companyForm.statusId,
        website: companyForm.website,
        description: companyForm.description,
      }

      const result = await companyStore.createCompany(createData)
      if (result) {
        toastStore.success('Company created successfully')
        await companyStore.fetchCompanies()
        companies.value = companyStore.companies
        closeModal()
      } else {
        toastStore.error('Failed to create company')
      }
    }
  } catch (err) {
    console.error(err)
    toastStore.error('An error occurred')
  } finally {
    loading.value = false
  }
}

function confirmDelete(company: Company) {
  companyToDelete.value = company
  showDeleteModal.value = true
}

async function deleteCompany() {
  if (!companyToDelete.value) return

  loading.value = true
  try {
    const success = await companyStore.deleteCompany(companyToDelete.value.id)
    if (success) {
      toastStore.success('Company deleted successfully')
      companies.value = companyStore.companies
    } else {
      toastStore.error('Failed to delete company')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('An error occurred')
  } finally {
    loading.value = false
    showDeleteModal.value = false
    companyToDelete.value = null
  }
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  Object.assign(companyForm, {
    id: undefined,
    name: '',
    industry: '',
    size: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    statusId: '',
    website: '',
    description: '',
  })
}

function getStatusClass(status: string | undefined) {
  if (!status) return 'bg-gray-100 text-gray-800'

  switch (status) {
    case 'Inactive':
      return 'bg-gray-100 text-gray-800'
    case 'Prospect':
      return 'bg-blue-100 text-blue-800'
    case 'Customer':
      return 'bg-green-100 text-green-800'
    case 'Partner':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

//HANDLING SEARCH
const companyFilters = computed(() => [
  {
    key: 'industry',
    label: 'Industrie',
    type: 'text' as const,
    placeholder: 'Filtrer par industrie',
  },
  {
    key: 'size',
    label: 'Taille',
    type: 'select' as const,
    placeholder: 'Toutes tailles',
    options: [
      { label: '1-10 employés', value: '1-10' },
      { label: '11-50 employés', value: '11-50' },
      { label: '51-200 employés', value: '51-200' },
      { label: '201-500 employés', value: '201-500' },
      { label: '501-1000 employés', value: '501-1000' },
      { label: '+1000 employés', value: '+1000' },
    ],
  },
  {
    key: 'globalRevenue',
    label: "Chiffre d'affaires",
    type: 'range' as const,
    minKey: 'minRevenue',
    maxKey: 'maxRevenue',
  },
  {
    key: 'statusId',
    label: 'Statut',
    type: 'select' as const,
    placeholder: 'Tous statuts',
    options: statusStore.statuses
      .filter((s) => s.type === 'COMPANY')
      .map((status) => ({
        label: status.name,
        value: status.id,
      })),
  },
  {
    key: 'assignedToId',
    label: 'Assigné à',
    type: 'select' as const,
    placeholder: 'Tous les utilisateurs',
    options: userStore.users.map((user: { firstName: string; lastName: string; id: string }) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    })),
  },
  {
    key: 'city',
    label: 'Ville',
    type: 'text' as const,
    placeholder: 'Filtrer par ville',
  },
  {
    key: 'country',
    label: 'Pays',
    type: 'text' as const,
    placeholder: 'Filtrer par pays',
  },
])

const initialFilters = ref({
  industry: '',
  size: '',
  statusId: '',
  assignedToId: '',
  city: '',
  country: '',
  minRevenue: '',
  maxRevenue: '',
})

// Paramètres de recherche actuels
const searchParams = ref({
  query: '',
  filters: {},
  page: 1,
  limit: 10,
})

// Gérer la recherche
async function handleSearch(params: { query: string; filters: Record<string, unknown> }) {
  loading.value = true

  try {
    // Construire les paramètres de recherche pour l'API
    const apiParams: Record<string, unknown> = {}

    // Ajouter le terme de recherche comme filtre sur le nom si non vide
    if (params.query && params.query.trim()) {
      apiParams.name = params.query.trim()
    }

    // Ajouter tous les filtres non vides
    Object.entries(params.filters).forEach(([key, value]) => {
      // Vérifier si la valeur existe et n'est pas une chaîne vide
      if (value !== undefined && value !== null && value !== '') {
        // Pour les plages, traiter les cas spéciaux comme minRevenue/maxRevenue
        if (key === 'minRevenue' || key === 'maxRevenue') {
          apiParams[key] = Number(value)
        } else {
          apiParams[key] = value
        }
      }
    })

    // Ajouter pagination
    apiParams.page = 1
    apiParams.itemsPerPage = searchParams.value.limit || 10

    console.log('Recherche avec paramètres:', apiParams)

    // Appeler la fonction de recherche du store
    const result = await companyStore.searchCompanies(apiParams)
    companies.value = result.items || []

    // Mettre à jour les paramètres de recherche actuels
    searchParams.value = {
      query: params.query,
      filters: params.filters,
      page: 1,
      limit: searchParams.value.limit,
    }
  } catch (err) {
    console.error('Erreur lors de la recherche:', err)
    toastStore.error('Erreur lors de la recherche des entreprises')
    error.value = 'Failed to search companies'
  } finally {
    loading.value = false
  }
}

// Réinitialiser la recherche
async function resetSearch() {
  searchParams.value = {
    query: '',
    filters: {},
    page: 1,
    limit: 10,
  }
  try {
    // Charger la liste complète
    loading.value = true
    await companyStore.fetchCompanies()
    companies.value = companyStore.companies
  } catch (err) {
    console.error('Erreur lors du chargement des entreprises', err)
    toastStore.error('Erreur lors du chargement des entreprises')
  } finally {
    loading.value = false
  }
}

// Pagination
// function goToPage(pageNumber) {
//   searchParams.value.page = pageNumber

//   if (searchParams.value.query || Object.values(searchParams.value.filters).some(v => v)) {
//     // Si on a des filtres actifs, effectuer une recherche
//     companyStore.searchCompanies(searchParams.value)
//   } else {
//     // Sinon, charger simplement la page demandée
//     companyStore.fetchCompanies({
//       page: searchParams.value.page,
//       limit: searchParams.value.limit
//     })
//   }
// }
</script>

<style scoped>
.companies-container {
  padding: 1rem;
}
</style>
