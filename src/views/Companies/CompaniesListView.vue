<template>
  <div class="companies-container">
    <div class="page-header flex justify-between items-center mb-6">
      <BackToDashboard />
      <h1 class="text-2xl font-bold">Companies</h1>
      <button class="btn btn-primary" @click="openCreateModal">Add Company</button>
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
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Industry</th>
              <th class="flex justify-end">Masse Salariale</th>
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
              <td class="flex justify-end">{{ company.size || 'N/A' }}</td>
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
                    <!-- Edit icon (you can replace with your own icon component) -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                  </button>
                  <button
                    class="text-gray-500 hover:text-red-500"
                    @click="confirmDelete(company)"
                    title="Delete"
                  >
                    <span class="sr-only">Delete</span>
                    <!-- Delete icon (you can replace with your own icon component) -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
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
import { useCompanyStore } from '@/stores/company'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'
import type { Company, CompanyCreateDto, CompanyUpdateDto } from '@/types/company.types'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const companyStore = useCompanyStore()
const statusStore = useStatusStore()
const toastStore = useToastStore()

// Company form
const companyForm = reactive<CompanyCreateDto & { id?: string }>({
  name: '',
  industry: '',
  size: '',
  address: {
    street: '',
    city: '',
    zipCode: '',
    country: '',
  },
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
    location: '',
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
</script>

<style scoped>
.companies-container {
  padding: 1rem;
}
</style>
