<template>
  <div class="companies-container">
    <div class="page-header flex justify-between items-center mb-6">
      <BackToDashboard />
      <h1 class="text-2xl font-bold">{{ t('companies.title') }}</h1>
      <button class="btn btn-primary" @click="openCreateModal">
        <Iconify icon="mdi:plus" class="w-5 h-5 mr-1" />
        {{ t('common.add') }}
      </button>
    </div>
    <div class="mb-4">
      <SearchBar
        ref="searchBarRef"
        :placeholder="t('companies.searchCompanyPlaceholder')"
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
      <h3 class="text-xl mb-2">{{ t('companies.noCompany') }}</h3>
      <p class="text-gray-500 mb-4">{{ t('companies.startAdding') }}</p>
      <button class="btn btn-primary" @click="openCreateModal">
        {{ t('companies.addCompany') }}
      </button>
    </div>

    <div v-else class="companies-grid">
      <!-- Version bureau du tableau (caché sur mobile) -->
      <div class="overflow-x-auto hidden md:block">
        <table class="table w-full">
          <thead>
            <tr>
              <th>{{ t('common.name') }}</th>
              <th>{{ t('common.industry') }}</th>
              <th class="text-right">{{ t('common.size') }}</th>
              <th>{{ t('common.address') }}</th>
              <th>{{ t('common.specialities') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in companies" :key="company.id" class="hover hover:bg-base-200">
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
              <td v-else>{{ t('common.noAddress') }}</td>
              <td>
                <SpecialityBadgeWithTooltip
                  v-if="company.Specialities && company.Specialities.length"
                  :specialities="company.Specialities"
                  @speciality-click="filterBySpeciality"
                />
                <span v-else>{{ t('common.noSpecialities') }}</span>
              </td>
              <td>
                <span
                  class="badge px-2 py-1 rounded-full text-xs"
                  :class="getStatusClass(company.status?.name)"
                >
                  {{
                    company.status
                      ? t(`status.${company.status.name.toLowerCase()}`, company.status.name)
                      : 'N/A'
                  }}
                </span>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button
                    class="text-gray-500 hover:text-primary"
                    @click="openEditModal(company)"
                    title="Edit"
                  >
                    <span class="sr-only">{{ t('common.edit') }}</span>
                    <Iconify icon="heroicons:pencil-square" class="h-5 w-5" />
                  </button>
                  <button
                    class="text-gray-500 hover:text-red-500"
                    @click="confirmDelete(company)"
                    title="Delete"
                  >
                    <span class="sr-only">{{ t('common.delete') }}</span>
                    <Iconify icon="heroicons:trash" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Version mobile du tableau -->
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
              class="badge px-2 py-1 rounded-full text-xs"
              :class="getStatusClass(company.status?.name)"
            >
              {{
                company.status
                  ? t(`status.${company.status.name.toLowerCase()}`, company.status.name)
                  : 'N/A'
              }}
            </span>
          </div>

          <!-- Informations secondaires mobile -->
          <div class="text-sm text-gray-500 mb-3">
            {{ company.industry || t('companies.industryNotSpecified') }}
          </div>

          <!-- Specialities mobile -->
          <SpecialityBadgeWithTooltip
            v-if="company.Specialities && company.Specialities.length"
            :specialities="company.Specialities"
            class="mb-2"
            @speciality-click="filterBySpeciality"
          />

          <div class="flex justify-end space-x-3 mt-2">
            <button class="btn btn-sm btn-ghost" @click="openEditModal(company)" title="Edit">
              <Iconify icon="heroicons:pencil-square" class="h-4 w-4 mr-1" />
              {{ t('common.edit') }}
            </button>
            <button
              class="btn btn-sm btn-ghost text-red-500"
              @click="confirmDelete(company)"
              title="Delete"
            >
              <Iconify icon="heroicons:trash" class="h-4 w-4 mr-1" />
              {{ t('common.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Company Modal -->
    <div class="modal" :class="{ 'modal-open': showModal }" id="companyModal">
      <div class="modal-box">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? t('companies.editCompany') : t('companies.addCompany') }}
        </h2>

        <form @submit.prevent="submitCompanyForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-group">
              <label class="label">{{ t('companies.name') }}*</label>
              <input
                v-model="companyForm.name"
                type="text"
                class="input input-bordered w-full"
                :placeholder="t('companies.name')"
                required
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.industry') }}</label>
              <input
                v-model="companyForm.industry"
                type="text"
                class="input input-bordered w-full"
                :placeholder="t('common.industry')"
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.size') }}</label>
              <select v-model="companyForm.size" class="select select-bordered w-full">
                <option value="">{{ t('common.selectSize') }}</option>
                <option value="1-10">{{ t('common.size1to10') }}</option>
                <option value="11-50">{{ t('common.size11to50') }}</option>
                <option value="51-200">{{ t('common.size51to200') }}</option>
                <option value="201-500">{{ t('common.size201to500') }}</option>
                <option value="501-1000">{{ t('common.size501to1000') }}</option>
                <option value="+1000">{{ t('common.sizeMoreThan1000') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.address') }}</label>
              <input
                v-model="companyForm.address"
                type="text"
                class="input input-bordered w-full"
                :placeholder="t('companies.address')"
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.city') }}</label>
              <input
                v-model="companyForm.city"
                type="text"
                class="input input-bordered w-full"
                :placeholder="t('common.city')"
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.zipCode') }}</label>
              <input
                v-model="companyForm.zipCode"
                type="text"
                class="input input-bordered w-full"
                :placeholder="t('common.zipCode')"
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.country') }}</label>
              <input
                v-model="companyForm.country"
                type="text"
                class="input input-bordered w-full"
                :placeholder="t('common.country')"
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.status') }}</label>
              <select v-model="companyForm.statusId" class="select select-bordered w-full">
                <option value="">{{ t('common.selectStatus') }}</option>
                <option v-for="status in companyStatuses" :key="status.id" :value="status.id">
                  {{ t(`status.${status.name.toLowerCase()}`, status.name) }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.website') }}</label>
              <input
                v-model="companyForm.website"
                type="url"
                class="input input-bordered w-full"
                :placeholder="t('common.website')"
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.operatingRooms') }}</label>
              <input
                v-model="companyForm.operatingRooms"
                type="number"
                min="0"
                class="input input-bordered w-full"
                :placeholder="t('common.operatingRooms')"
              />
            </div>
          </div>

          <div class="form-group mb-4">
            <label class="label">{{ t('common.specialities') }}</label>
            <select
              v-model="companyForm.specialities"
              class="select select-bordered w-full"
              multiple
            >
              <option
                v-for="speciality in availableSpecialities"
                :key="speciality.id"
                :value="speciality.id"
              >
                {{ speciality.name }}
              </option>
            </select>
          </div>

          <div class="form-group mb-4">
            <label class="label">{{ t('common.description') }}</label>
            <textarea
              v-model="companyForm.description"
              class="textarea textarea-bordered w-full"
              :placeholder="t('common.description')"
              rows="3"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" class="btn" @click="closeModal">{{ t('common.cancel') }}</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ isEditing ? t('common.update') : t('common.create') }}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="closeModal">
        <button>{{ t('common.close') }}</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'modal-open': showDeleteModal }" id="deleteModal">
      <div class="modal-box">
        <h2 class="text-xl font-bold mb-4">{{ t('common.confirmDelete') }}</h2>
        <p>
          {{ t('common.areYouSureToDelete') }} {{ companyToDelete?.name }}?
          {{ t('common.cannotBeUndone') }}
        </p>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" class="btn" @click="showDeleteModal = false">
            {{ t('common.cancel') }}
          </button>
          <button type="button" class="btn btn-error" @click="deleteCompany" :disabled="loading">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="showDeleteModal = false">
        <button>{{ t('common.close') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackToDashboard from '@/components/common/BackToDashboard.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import SpecialityBadgeWithTooltip from '@/components/common/SpecialityBadgeWithTooltip.vue'
import { useCompanyStore } from '@/stores/company'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type { Company, CompanyCreateDto, CompanyUpdateDto, Speciality } from '@/types/company.types'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  operatingRooms: null,
  specialities: [] as string[],
})

// UI states
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const companyToDelete = ref<Company | null>(null)
const filtersVisible = ref(false) // État pour contrôler la visibilité des filtres

// Computed properties and reactive refs
const companies = ref<Company[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)

const companyStatuses = computed(() => statusStore.getStatusesByType('COMPANY'))
const availableSpecialities = ref<Speciality[]>([])

// Fetch specialities list
async function fetchSpecialities() {
  try {
    // Replace this with actual API call to get specialities
    const specialitiesResponse = await companyStore.fetchSpecialities()
    availableSpecialities.value = specialitiesResponse || []
  } catch (err) {
    console.error('Failed to fetch specialities', err)
    toastStore.error(t('common.failedToFetchSpecialities'))
  }
}

// Load companies on component mount
onMounted(async () => {
  loading.value = true
  try {
    await statusStore.fetchStatusesByType('COMPANY')
    await userStore.fetchUsers()
    await companyStore.fetchCompanies()
    await fetchSpecialities()
    companies.value = companyStore.companies
    error.value = companyStore.error
  } catch (err) {
    console.error(err)
    toastStore.error(t('companies.failedToLoadCompanies'))
    error.value = t('companies.failedToLoadCompanies')
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
    operatingRooms: company.operatingRooms,
    specialities: company.Specialities ? company.Specialities.map((spec) => spec.id) : [],
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
        operatingRooms: companyForm.operatingRooms,
        specialities: companyForm.specialities,
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
        operatingRooms: companyForm.operatingRooms,
        specialities: companyForm.specialities,
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
    operatingRooms: null,
    specialities: [] as string[],
  })
}

function getStatusClass(status: string | undefined) {
  if (!status) return 'badge-neutral opacity-70'

  // Récupérer les traductions
  const statusLower = status.toLowerCase()
  const translations = {
    inactive: t('status.inactive').toLowerCase(),
    prospect: t('status.prospect').toLowerCase(),
    customer: t('status.customer').toLowerCase(),
    partner: t('status.partner').toLowerCase(),
  }

  // Vérifier si le statut correspond à l'une des traductions en utilisant les classes DaisyUI
  if (statusLower === 'inactive' || statusLower === translations.inactive) {
    return 'badge-neutral opacity-70'
  } else if (statusLower === 'prospect' || statusLower === translations.prospect) {
    return 'badge-info text-info-content'
  } else if (statusLower === 'customer' || statusLower === translations.customer) {
    return 'badge-success text-success-content'
  } else if (statusLower === 'partner' || statusLower === translations.partner) {
    return 'badge-secondary text-secondary-content'
  } else {
    return 'badge-neutral opacity-70'
  }
}

//HANDLING SEARCH
// On crée une référence réactive pour les filtres qui sera mise à jour quand les spécialités sont chargées
const companyFilters = ref([
  {
    key: 'industry',
    label: t('common.industry'),
    type: 'text' as const,
    placeholder: t('common.filterByIndustry'),
  },
  {
    key: 'size',
    label: t('common.size'),
    type: 'select' as const,
    placeholder: t('common.allSizes'),
    options: [
      { label: t('common.size1to10'), value: '1-10' },
      { label: t('common.size11to50'), value: '11-50' },
      { label: t('common.size51to200'), value: '51-200' },
      { label: t('common.size201to500'), value: '201-500' },
      { label: t('common.size501to1000'), value: '501-1000' },
      { label: t('common.sizeMoreThan1000'), value: '+1000' },
    ],
  },
  {
    key: 'specialityId',
    label: t('common.specialities'),
    type: 'select' as const,
    placeholder: t('common.allSpecialities'),
    options: availableSpecialities.value.map((spec) => ({
      label: spec.name,
      value: spec.id,
    })),
  },
  {
    key: 'operatingRooms',
    label: t('common.operatingRooms'),
    type: 'range' as const,
    minKey: 'minOperatingRooms',
    maxKey: 'maxOperatingRooms',
  },
  {
    key: 'globalRevenue',
    label: t('common.globalRevenue'),
    type: 'range' as const,
    minKey: 'minRevenue',
    maxKey: 'maxRevenue',
  },
  {
    key: 'statusId',
    label: t('common.status'),
    type: 'select' as const,
    placeholder: t('common.allStatuses'),
    options: statusStore.statuses
      .filter((s) => s.type === 'COMPANY')
      .map((status) => ({
        label: t(`status.${status.name.toLowerCase()}`, status.name),
        value: status.id,
      })),
  },
  {
    key: 'assignedToId',
    label: t('common.assignedTo'),
    type: 'select' as const,
    placeholder: t('common.allUsers'),
    options: userStore.users.map((user: { firstName: string; lastName: string; id: string }) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    })),
  },
  {
    key: 'city',
    label: t('common.city'),
    type: 'text' as const,
    placeholder: t('common.filterByCity'),
  },
  {
    key: 'country',
    label: t('common.country'),
    type: 'text' as const,
    placeholder: t('common.filterByCountry'),
  },
])

// Met à jour les filtres quand les données sont chargées (spécialités, statuts, utilisateurs)

watchEffect(() => {
  // Mise à jour des options de spécialités
  if (availableSpecialities.value.length > 0) {
    // Trouver l'index du filtre specialityId s'il existe déjà
    const specialityFilterIndex = companyFilters.value.findIndex(
      (filter) => filter.key === 'specialityId',
    )

    // Mettre à jour les options du filtre
    if (specialityFilterIndex !== -1) {
      companyFilters.value[specialityFilterIndex].options = availableSpecialities.value.map(
        (spec) => ({
          label: spec.name,
          value: spec.id,
        }),
      )
    }
  }

  // Mise à jour des options de statuts
  const companyStatusesArray = statusStore.getStatusesByType('COMPANY')
  if (companyStatusesArray.length > 0) {
    const statusFilterIndex = companyFilters.value.findIndex((filter) => filter.key === 'statusId')

    if (statusFilterIndex !== -1) {
      companyFilters.value[statusFilterIndex].options = companyStatusesArray.map((status) => ({
        label: t(`status.${status.name.toLowerCase()}`, status.name),
        value: status.id,
      }))
    }
  }

  // Mise à jour des options d'utilisateurs assignés
  if (userStore.users.length > 0) {
    const userFilterIndex = companyFilters.value.findIndex(
      (filter) => filter.key === 'assignedToId',
    )

    if (userFilterIndex !== -1) {
      companyFilters.value[userFilterIndex].options = userStore.users.map(
        (user: { firstName: string; lastName: string; id: string }) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.id,
        }),
      )
    }
  }
})

const initialFilters = ref({
  industry: '',
  size: '',
  statusId: '',
  assignedToId: '',
  city: '',
  country: '',
  minRevenue: '',
  maxRevenue: '',
  specialityId: '',
  minOperatingRooms: '',
  maxOperatingRooms: '',
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
        // Pour les plages numériques, convertir en nombre
        if (['minRevenue', 'maxRevenue', 'minOperatingRooms', 'maxOperatingRooms'].includes(key)) {
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
    console.log('Résultat de la recherche:', result)

    // Vérifier la structure des données reçues
    if (result.items && result.items.length > 0) {
      console.log('Premier élément:', result.items[0])
      console.log('Specialités du premier élément:', result.items[0].Specialities)
    }

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

// Filtrer les entreprises par spécialité lorsque l'utilisateur clique sur un badge de spécialité
async function filterBySpeciality(speciality: Speciality) {
  if (!speciality || !speciality.id) return

  // Afficher un toast pour informer l'utilisateur
  toastStore.info(`${t('common.filtering')}: ${speciality.name}`)

  // Mettre à jour les paramètres de recherche
  const newSearchParams = {
    query: '',
    filters: {
      specialityId: speciality.id,
    },
  }

  // Si nous avons accès à la référence du SearchBar, utiliser sa méthode exposée
  if (searchBarRef.value) {
    // Utiliser la méthode exposée par le SearchBar pour mettre à jour le filtre
    searchBarRef.value.setFilter('specialityId', speciality.id)

    // Assurons-nous que les filtres sont visibles
    filtersVisible.value = true
  } else {
    // Sinon, effectuer la recherche directement
    await handleSearch(newSearchParams)

    // Mettre à jour l'état de recherche
    searchParams.value = {
      ...searchParams.value,
      query: '',
      filters: { specialityId: speciality.id },
    }
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
