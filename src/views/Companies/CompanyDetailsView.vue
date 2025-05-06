<template>
  <div class="company-details-container">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="!company" class="text-center py-12">
      <h3 class="text-xl mb-2">Company not found</h3>
      <p class="text-gray-500 mb-4">The requested company could not be found</p>
      <router-link to="/companies" class="btn btn-primary">Back to Companies</router-link>
    </div>

    <div v-else>
      <!-- Company Header -->
      <div class="flex justify-between items-center mb-4">
        <router-link to="/companies" class="btn btn-outline btn-sm mb-2 flex items-center gap-1">
          <Iconify icon="mdi:arrow-left" class="w-4 h-4" />
          Retour à la liste
        </router-link>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <div
              class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-2xl text-primary font-bold"
            >
              {{ company.name.substring(0, 2).toUpperCase() }}
            </div>
          </div>
          <div>
            <h1 class="text-2xl font-bold mt-2 sm:mt-0">{{ company.name }}</h1>
            <div class="flex flex-wrap items-center mt-1 text-sm text-gray-600 gap-2">
              <span v-if="company.industry" class="mr-3">{{ company.industry }}</span>
              <span v-if="company.size" class="mr-3">{{ company.size }} employees</span>
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="getStatusClass(company.status.name)"
              >
                {{ formatStatusToFrench(company.status.name) || 'N/A' }}
              </span>
            </div>
            <div class="flex flex-wrap items-center mt-1 text-sm text-gray-600 gap-2">
              <span v-if="company.globalRevenue" class="mr-3"
                >Chiffre d'affaire global {{ formattedRevenue(company.globalRevenue) }}</span
              >
              <span v-if="company.generatedRevenue" class="mr-3"
                >Chiffre d'affaire généré {{ formattedRevenue(company.generatedRevenue) }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex space-x-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button class="btn btn-outline flex-1 sm:flex-none" @click="openEditModal">
            <Iconify icon="mdi:pen" class="w-4 h-4" />
            Modifier
          </button>
          <button class="btn btn-error flex-1 sm:flex-none" @click="confirmDelete">
            <Iconify icon="mdi:trash-can" class="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>

      <!-- Company Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Information -->
        <div class="col-span-1 lg:col-span-2">
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <h2 class="text-xl font-bold mb-4">Détails</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Site Web</p>
                <p v-if="company.website" class="font-medium">
                  <a
                    :href="formatWebsiteUrl(company.website)"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ company.website }}
                  </a>
                </p>
                <p v-else class="text-gray-400">Non fourni</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Adresse</p>
                <p v-if="company.address" class="font-medium">{{ company.address }}</p>
                <p v-else class="text-gray-400">Non fournie</p>
                <p v-if="company.address" class="text-sm text-gray-500">
                  {{ company.zipCode }} - {{ company.city }} -
                  {{ company.country }}
                </p>
              </div>
            </div>

            <div class="mt-6">
              <p class="text-sm text-gray-500 mb-2">Description</p>
              <p v-if="company.description" class="text-gray-700">
                {{ company.description }}
              </p>
              <p v-else class="text-gray-400">Aucune description fournie</p>
            </div>
          </div>

          <!-- Contacts Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Contacts</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                Ajouter un contact
              </button>
            </div>
            <div class="text-center py-8 text-gray-500">
              <p>Pas de contacts pour le moment</p>
            </div>
          </div>

          <!-- Notes Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Notes</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                Ajouter une note
              </button>
            </div>
            <div class="text-center py-8 text-gray-500">
              <p>Pas de notes pour le moment</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-1 w-full">
          <!-- Activities Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">Activités récentes</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                Ajouter
              </button>
            </div>
            <div class="text-center py-8 text-gray-500">
              <p>Pas d'activités enregistrées pour le moment</p>
            </div>
          </div>

          <!-- Tasks Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">Tâches</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                Ajouter une tâche
              </button>
            </div>
            <div class="text-center py-8 text-gray-500">
              <p>Pas de tâches assignées pour le moment</p>
            </div>
          </div>

          <!-- Quotes Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">Devis</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                Ajouter un devis
              </button>
            </div>
            <div class="text-center py-8 text-gray-500">
              <p>Pas de devis créés pour le moment</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Company Modal (Reused from CompaniesListView) -->
    <dialog id="editCompanyModal" class="modal" :open="showModal">
      <div class="modal-box w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4">Modifier l'entreprise</h2>

        <form @submit.prevent="submitCompanyForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-group">
              <label class="label">Nom de l'entreprise*</label>
              <input
                v-model="companyForm.name"
                type="text"
                class="input input-bordered w-full"
                placeholder="Company Name"
                required
              />
            </div>

            <div class="form-group">
              <label class="label">Secteur d'activité</label>
              <input
                v-model="companyForm.industry"
                type="text"
                class="input input-bordered w-full"
                placeholder="Industry"
              />
            </div>

            <div class="form-group">
              <label class="label">Taille</label>
              <select v-model="companyForm.size" class="select select-bordered w-full">
                <option value="">Sélectionner la taille</option>
                <option value="1-10">1-10 employés</option>
                <option value="11-50">11-50 employés</option>
                <option value="51-200">51-200 employés</option>
                <option value="201-500">201-500 employés</option>
                <option value="501-1000">501-1000 employés</option>
                <option value="1000+">1000+ employés</option>
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
              <label class="label">Status</label>
              <select v-model="companyForm.status" class="select select-bordered w-full">
                <option value="">Choisir un Status</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
                <option value="Client">Client</option>
                <option value="Partner">Partenaire</option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">Site Web</label>
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
            <button type="button" class="btn btn-outline" @click="closeModal">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">Mettre à jour</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">fermer</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog id="deleteConfirmModal" class="modal" :open="showDeleteModal">
      <div class="modal-box w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Confirmer la suppression</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer {{ company?.name }} ? Cette action ne peut pas être
          annulée.
        </p>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" class="btn btn-outline" @click="showDeleteModal = false">
            Annuler
          </button>
          <button type="button" class="btn btn-error" :disabled="loading" @click="deleteCompany">
            Supprimer
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showDeleteModal = false">fermer</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { useCompanyStore } from '@/stores/company'
import { useToastStore } from '@/stores/toast'
import type { Company, CompanyUpdateDto } from '@/types/company.types'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()
const toastStore = useToastStore()

// Company data
const company = ref<Company | null>(null)
const companyId = ref<string>(route.params.id as string)

// Company form
const companyForm = reactive<CompanyUpdateDto & { id?: string }>({
  name: '',
  industry: '',
  size: '',
  address: {
    street: '',
    city: '',
    country: '',
    zipCode: '',
  },
  status: '',
  website: '',
  description: '',
})

// UI states
const loading = ref(false)
const error = ref<string | null>(null)
const showModal = ref(false)
const showDeleteModal = ref(false)

// Load company details on component mount
onMounted(async () => {
  if (!companyId.value) {
    error.value = 'No company ID provided'
    return
  }

  loading.value = true
  try {
    await companyStore.fetchCompanyById(companyId.value)
    if (companyStore.currentCompany) {
      company.value = companyStore.currentCompany
    } else {
      error.value = 'Company not found'
    }
  } catch (err) {
    console.error(err)
    toastStore.error('Failed to load company details')
    error.value = 'Failed to load company details'
  } finally {
    loading.value = false
  }
})

// Form handling
function openEditModal() {
  resetForm()
  Object.assign(companyForm, {
    id: company.value?.id,
    name: company.value?.name || '',
    industry: company.value?.industry || '',
    size: company.value?.size || '',
    address: company.value?.address || '',
    status: company.value?.status || '',
    website: company.value?.website || '',
    description: company.value?.description || '',
  })
  showModal.value = true
}

async function submitCompanyForm() {
  if (!company.value || !companyForm.id) return

  loading.value = true
  try {
    const updateData: CompanyUpdateDto = {
      name: companyForm.name,
      industry: companyForm.industry,
      size: companyForm.size,
      address: companyForm.address,
      status: companyForm.status,
      website: companyForm.website,
      description: companyForm.description,
    }

    const result = await companyStore.updateCompany(companyForm.id, updateData)
    if (result) {
      company.value = result
      toastStore.success('Company updated successfully')
      closeModal()
    } else {
      toastStore.error('Failed to update company')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('An error occurred')
  } finally {
    loading.value = false
  }
}

function confirmDelete() {
  showDeleteModal.value = true
}

async function deleteCompany() {
  if (!company.value) return

  loading.value = true
  try {
    const success = await companyStore.deleteCompany(company.value.id)
    if (success) {
      toastStore.success('Company deleted successfully')
      router.push('/companies')
    } else {
      toastStore.error('Failed to delete company')
    }
  } catch (err) {
    console.error(err)
    toastStore.error('An error occurred')
  } finally {
    loading.value = false
    showDeleteModal.value = false
  }
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  Object.assign(companyForm, {
    name: '',
    industry: '',
    size: '',
    address: '',
    status: '',
    website: '',
    description: '',
  })
}

// Format website URL to ensure it starts with http:// or https://
function formatWebsiteUrl(url: string): string {
  if (!url) return ''
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
}

// Helper function to determine CSS classes for company status
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

function formattedRevenue(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    useGrouping: true,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\s/g, ' ')
}

function formatStatusToFrench(value: string): string {
  switch (value) {
    case 'Inactive':
      return 'Inactif'
    case 'Prospect':
      return 'Prospect'
    case 'Customer':
      return 'Client'
    case 'Partner':
      return 'Partenaire'
    default:
      return value
  }
}
</script>
