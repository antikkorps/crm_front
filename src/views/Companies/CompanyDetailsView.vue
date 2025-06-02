<template>
  <div class="company-details-container">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="!company" class="text-center py-12">
      <h3 class="text-xl mb-2">{{ t('companies.companyNotFound') }}</h3>
      <p class="text-gray-500 mb-4">{{ t('companies.companyNotFoundMessage') }}</p>
      <router-link to="/companies" class="btn btn-primary">{{
        t('common.backToList')
      }}</router-link>
    </div>

    <div v-else>
      <!-- Company Header -->
      <div class="flex justify-between items-center mb-4">
        <router-link to="/companies" class="btn btn-outline btn-sm mb-2 flex items-center gap-1">
          <Iconify icon="mdi:arrow-left" class="w-4 h-4" />
          {{ t('common.backToList') }}
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
              <span v-if="company.size" class="mr-3">
                {{ company.size }}
                {{ t('companies.employee', company.size.includes('1-') ? 1 : 2) }}
              </span>
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
            <div class="flex flex-wrap items-center mt-1 text-sm text-gray-600 gap-2">
              <span v-if="company.globalRevenue" class="mr-3"
                >{{ t('companies.globalRevenue') }}
                {{ formattedRevenue(company.globalRevenue) }}</span
              >
              <span v-if="company.generatedRevenue" class="mr-3"
                >{{ t('companies.revenue') }} {{ formattedRevenue(company.generatedRevenue) }}</span
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
            <h2 class="text-xl font-bold mb-4">{{ t('common.details') }}</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">{{ t('common.website') }}</p>
                <p v-if="company.website" class="font-medium">
                  <a
                    :href="formatWebsiteUrl(company.website)"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ company.website }}
                  </a>
                </p>
                <p v-else class="text-gray-400">{{ t('common.notProvided') }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">{{ t('common.assignedTo') }}</p>
                <div v-if="company.assignedTo" class="flex items-center mt-1">
                  <div class="avatar mr-2">
                    <div class="w-8 h-8 rounded-full" v-if="company.assignedTo">
                      <template v-if="company.assignedTo.avatarUrl">
                        <img
                          :src="company.assignedTo.avatarUrl"
                          :alt="`${company.assignedTo.firstName} ${company.assignedTo.lastName}`"
                        />
                      </template>
                      <div
                        v-else
                        class="w-full h-full bg-primary text-primary-content flex items-center justify-center text-xs font-medium"
                      >
                        {{ getInitials(company.assignedTo.firstName, company.assignedTo.lastName) }}
                      </div>
                    </div>
                  </div>
                  <span class="font-medium">
                    {{ company.assignedTo.firstName }} {{ company.assignedTo.lastName }}
                  </span>
                </div>
                <p v-else class="text-gray-400">{{ t('common.notAssigned', 'Non assigné') }}</p>
              </div>

              <!-- Spécialités -->
              <div>
                <p class="text-sm text-gray-500">{{ t('common.specialities') }}</p>
                <div class="mt-2">
                  <SpecialityBadgeWithTooltip
                    v-if="company.Specialities && company.Specialities.length"
                    :specialities="company.Specialities"
                    :display-limit="3"
                  />
                  <p v-else class="text-gray-400">{{ t('common.noSpecialities') }}</p>
                </div>
              </div>

              <div>
                <p class="text-sm text-gray-500">{{ t('common.address') }}</p>
                <p v-if="company.address" class="font-medium">{{ company.address }}</p>
                <p v-else class="text-gray-400">{{ t('common.notProvided') }}</p>
                <p v-if="company.address" class="text-sm text-gray-500">
                  {{ company.zipCode }} - {{ company.city }} -
                  {{ company.country }}
                </p>
              </div>
            </div>

            <div class="mt-6">
              <p class="text-sm text-gray-500 mb-2">{{ t('common.description') }}</p>
              <p v-if="company.description" class="text-gray-700">
                {{ company.description }}
              </p>
              <p v-else class="text-gray-400">{{ t('common.noDescription') }}</p>
            </div>
          </div>

          <!-- Contacts Section -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">{{ t('contacts.title') }}</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                {{ t('contacts.add') }}
              </button>
            </div>
            <div v-if="contacts.length">
              <!-- Desktop Table -->
              <div class="overflow-x-auto hidden md:block">
                <table class="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>{{ t('common.fullName') }}</th>
                      <th>{{ t('common.email') }}</th>
                      <th>{{ t('common.phone') }}</th>
                      <th>{{ t('common.position') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="contact in contacts" :key="contact.id" class="hover:bg-base-300">
                      <td>
                        {{ contact.firstName }} {{ contact.lastName }}
                        <span v-if="contact.isMainContact" class="badge badge-success badge-sm">
                          {{ t('contacts.main') }}
                        </span>
                        <span v-else class="badge badge-ghost badge-sm">
                          {{ t('contacts.secondary') }}
                        </span>
                      </td>
                      <td>
                        <a href="mailto:{{ contact.email }}">{{ contact.email }}</a>
                      </td>
                      <td>{{ contact.phone }}</td>
                      <td>{{ contact.position }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- Mobile Cards -->
              <div class="grid grid-cols-1 gap-4 md:hidden">
                <div
                  v-for="contact in contacts"
                  :key="contact.id"
                  class="card bg-base-100 shadow-sm"
                >
                  <div class="card-body p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="font-bold text-lg">
                        {{ contact.firstName }} {{ contact.lastName }}
                      </div>
                      <span v-if="contact.isMainContact" class="badge badge-success badge-sm">
                        {{ t('contacts.main') }}
                      </span>
                      <span v-else class="badge badge-ghost badge-sm">
                        {{ t('contacts.secondary') }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500 mb-1">
                      <span v-if="contact.position">{{ contact.position }}</span>
                    </div>
                    <div class="text-sm mb-1">
                      <a
                        v-if="contact.email"
                        :href="`mailto:${contact.email}`"
                        class="text-primary hover:underline"
                      >
                        {{ contact.email }}
                      </a>
                    </div>
                    <div class="text-sm">
                      <span v-if="contact.phone">{{ contact.phone }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>{{ t('contacts.noContacts') }}</p>
            </div>
          </div>

          <!-- Tasks Section -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">{{ t('tasks.title') }}</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                {{ t('tasks.add') }}
              </button>
            </div>

            <div v-if="loadingTasks" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>

            <div v-else-if="companyTasks.length">
              <!-- Desktop Table -->
              <div class="overflow-x-auto hidden md:block">
                <table class="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>{{ t('form.title', 'Titre') }}</th>
                      <th>{{ t('common.status', 'Status') }}</th>
                      <th>{{ t('tasks.dueDate') }}</th>
                      <th>{{ t('tasks.priority') }}</th>
                      <th class="w-10">{{ t('common.actions') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in companyTasks" :key="task.id" class="hover:bg-base-300">
                      <td>{{ task.title }}</td>
                      <td>
                        <span
                          :class="getTaskStatusClass(task.taskStatus || '')"
                          class="px-2 py-1 text-xs rounded-full"
                        >
                          {{ getTaskStatusLabel(task.taskStatus || '') }}
                        </span>
                      </td>
                      <td>{{ task.dueDate ? formatDate(task.dueDate) : '-' }}</td>
                      <td>
                        <span :class="getTaskPriorityClass(task.priority || '')" class="badge">
                          {{ getTaskPriorityLabel(task.priority || '') }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-ghost" @click="openTaskDetails(task)">
                          <Iconify icon="mdi:eye" class="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards -->
              <div class="grid grid-cols-1 gap-4 md:hidden">
                <div v-for="task in companyTasks" :key="task.id" class="card bg-base-100 shadow-sm">
                  <div class="card-body p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="font-medium">{{ task.title }}</div>
                      <button class="btn btn-sm btn-ghost" @click="openTaskDetails(task)">
                        <Iconify icon="mdi:eye" class="w-4 h-4" />
                      </button>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        :class="getTaskStatusClass(task.taskStatus || '')"
                        class="px-2 py-1 text-xs rounded-full"
                      >
                        {{ getTaskStatusLabel(task.taskStatus || '') }}
                      </span>
                      <span :class="getTaskPriorityClass(task.priority || '')" class="badge">
                        {{ getTaskPriorityLabel(task.priority || '') }}
                      </span>
                    </div>
                    <div v-if="task.dueDate" class="text-sm text-gray-500">
                      {{ t('tasks.dueDate') }}: {{ formatDate(task.dueDate) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <p>{{ t('tasks.noTasks') }}</p>
            </div>
          </div>

          <!-- Notes Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">{{ t('notes.title') }}</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                {{ t('notes.add') }}
              </button>
            </div>
            <div v-if="notes.length" class="divide-y">
              <div v-for="note in notes" :key="note.id" class="py-2">
                <div class="text-sm text-gray-500">{{ formatDate(note.createdAt) }}</div>
                <div class="font-medium">{{ note.content }}</div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>{{ t('notes.noNotes') }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-1 w-full">
          <!-- Activities Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">{{ t('activities.recentActivities') }}</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                {{ t('activities.add') }}
              </button>
            </div>

            <div v-if="loadingActivities" class="flex justify-center py-4">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>

            <div v-else-if="companyActivities.length" class="divide-y">
              <div v-for="activity in companyActivities" :key="activity.id" class="py-3">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium">{{ activity.title }}</div>
                    <div class="text-sm text-gray-500">{{ formatDate(activity.createdAt) }}</div>
                    <p v-if="activity.content" class="text-sm mt-1">{{ activity.content }}</p>
                  </div>
                  <span class="badge badge-primary badge-outline text-xs">{{ activity.type }}</span>
                </div>
                <div v-if="activity.createdBy" class="text-xs text-gray-500 mt-1">
                  Par {{ activity.createdBy.firstName }} {{ activity.createdBy.lastName }}
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <p>{{ t('activities.noActivities') }}</p>
            </div>
          </div>

          <!-- Quotes Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 w-full">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold">{{ t('quotes.title') }}</h2>
              <button class="btn btn-sm btn-outline">
                <Iconify icon="mdi:plus" class="w-4 h-4" />
                {{ t('quotes.add') }}
              </button>
            </div>
            <div class="text-center py-8 text-gray-500">
              <p>{{ t('quotes.noQuotes') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Company Modal (Reused from CompaniesListView) -->
    <dialog id="editCompanyModal" class="modal" :open="showModal">
      <div class="modal-box w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4">{{ t('companies.editCompany') }}</h2>

        <form @submit.prevent="submitCompanyForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="form-group">
              <label class="label">{{ t('companies.name') }}</label>
              <input
                v-model="companyForm.name"
                type="text"
                class="input input-bordered w-full"
                placeholder="Company Name"
                required
              />
            </div>

            <div class="form-group">
              <label class="label">{{ t('companies.industry') }}</label>
              <input
                v-model="companyForm.industry"
                type="text"
                class="input input-bordered w-full"
                placeholder="Industry"
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
                placeholder="Adresse"
              />
            </div>
            <div class="form-group">
              <label class="label">{{ t('common.city') }}</label>
              <input
                v-model="companyForm.city"
                type="text"
                class="input input-bordered w-full"
                placeholder="Ville"
              />
            </div>
            <div class="form-group">
              <label class="label">{{ t('common.zipCode') }}</label>
              <input
                v-model="companyForm.zipCode"
                type="text"
                class="input input-bordered w-full"
                placeholder="Code Postal"
              />
            </div>
            <div class="form-group">
              <label class="label">{{ t('common.country') }}</label>
              <input
                v-model="companyForm.country"
                type="text"
                class="input input-bordered w-full"
                placeholder="Pays"
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
              <label class="label">{{ t('common.assignedTo') }}</label>
              <select v-model="companyForm.assignedToId" class="select select-bordered w-full">
                <option value="">{{ t('common.notAssigned', 'Non assigné') }}</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="label">{{ t('common.website') }}</label>
              <input
                v-model="companyForm.website"
                type="url"
                class="input input-bordered w-full"
                placeholder="Website URL"
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
              placeholder="Company description"
              rows="3"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" class="btn btn-outline" @click="closeModal">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ t('common.update') }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">{{ t('common.close') }}</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog id="deleteConfirmModal" class="modal" :open="showDeleteModal">
      <div class="modal-box w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">{{ t('common.confirmDelete') }}</h2>
        <p>
          {{ t('common.areYouSureToDelete') }} {{ company?.name }} ?
          {{ t('common.thisActionCannotBeUndone') }}
        </p>

        <div class="flex justify-end space-x-3 mt-6">
          <button type="button" class="btn btn-outline" @click="showDeleteModal = false">
            {{ t('common.cancel') }}
          </button>
          <button type="button" class="btn btn-error" :disabled="loading" @click="deleteCompany">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showDeleteModal = false">{{ t('common.close') }}</button>
      </form>
    </dialog>

    <!-- Task Details Dialog -->
    <TaskDetailsDialog
      v-if="showTaskDialog"
      :task="selectedTask"
      :is-open="showTaskDialog"
      @close="closeTaskDetails"
      @complete="completeTaskHandler"
      @edit="editTaskHandler"
    />
  </div>
</template>

<script setup lang="ts">
import SpecialityBadgeWithTooltip from '@/components/common/SpecialityBadgeWithTooltip.vue'
import TaskDetailsDialog from '@/components/forms/tasks/TaskDetailsDialog.vue'
import { useActivityStore } from '@/stores/activity'
import { useCompanyStore } from '@/stores/company'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type { Activity } from '@/types/activity.types'
import type { Company, CompanyContact, CompanyNote, CompanyUpdateDto } from '@/types/company.types'
import { formatDate } from '@/utils/date'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()
const activityStore = useActivityStore()
const statusStore = useStatusStore()
const userStore = useUserStore()
const toastStore = useToastStore()
const { t } = useI18n()

// Company data
const company = ref<Company | null>(null)
const companyId = ref<string>(route.params.id as string)
const contacts = ref<CompanyContact[]>([])
const notes = ref<CompanyNote[]>([])

// Company form
const companyForm = reactive<CompanyUpdateDto & { id?: string }>({
  name: '',
  industry: '',
  size: '',
  address: '',
  city: '',
  country: '',
  zipCode: '',
  statusId: '',
  website: '',
  description: '',
  assignedToId: '',
  specialities: [] as string[],
})

// Activities
const companyActivities = ref<Activity[]>([])
const companyTasks = ref<Activity[]>([])
const loadingActivities = ref(false)
const loadingTasks = ref(false)

// UI states
const loading = ref(false)
const error = ref<string | null>(null)
const showModal = ref(false)
const showDeleteModal = ref(false)
const showTaskDialog = ref(false)
const selectedTask = ref<Activity | null>(null)

// Computed properties
const companyStatuses = computed(() => statusStore.getStatusesByType('COMPANY'))
const users = computed(() => userStore.users)
const availableSpecialities = ref<Array<{ id: string; name: string }>>([])

// Fetch specialities list
async function fetchSpecialities() {
  try {
    const specialitiesResponse = await companyStore.fetchSpecialities()
    availableSpecialities.value = specialitiesResponse || []
  } catch (err) {
    console.error('Failed to fetch specialities', err)
    toastStore.error(
      t('common.failedToFetchSpecialities', 'Erreur lors du chargement des spécialités'),
    )
  }
}

// Fetch Recent Activities
async function fetchCompanyActivities() {
  loadingActivities.value = true
  try {
    await activityStore.fetchRecentActivities()
    companyActivities.value = activityStore.activities.filter(
      (activity) => activity.companyId === companyId.value,
    )
  } catch (err) {
    console.error('Failed to fetch company activities', err)
    toastStore.error(t('activities.failedToFetch', 'Erreur lors du chargement des activités'))
  } finally {
    loadingActivities.value = false
  }
}

// Fonction pour charger les tâches de l'entreprise
async function fetchCompanyTasks() {
  loadingTasks.value = true
  try {
    await activityStore.fetchTasks()
    companyTasks.value = activityStore.activities.filter(
      (activity) => activity.type === 'TASK' && activity.companyId === companyId.value,
    )
  } catch (err) {
    console.error('Failed to fetch company tasks', err)
    toastStore.error(t('tasks.failedToFetch', 'Erreur lors du chargement des tâches'))
  } finally {
    loadingTasks.value = false
  }
}

// Fetch Contacts
async function fetchContacts() {
  try {
    await companyStore.fetchCompanyContacts(companyId.value)
    contacts.value = companyStore.companyContacts
    console.log('Contacts fetched:', contacts.value)
  } catch (err) {
    console.error('Failed to fetch contacts', err)
    toastStore.error(t('common.failedToFetchContacts', 'Erreur lors du chargement des contacts'))
  }
}

// Fetch Notes
async function fetchNotes() {
  try {
    await companyStore.fetchCompanyNotes(companyId.value)
    notes.value = companyStore.companyNotes
  } catch (err) {
    console.error('Failed to fetch notes', err)
    toastStore.error(t('common.failedToFetchNotes', 'Erreur lors du chargement des notes'))
  }
}

// Load company details on component mount
onMounted(async () => {
  if (!companyId.value) {
    error.value = 'No company ID provided'
    return
  }

  loading.value = true
  try {
    // Chargement parallèle des statuts, des utilisateurs et des spécialités
    await Promise.all([
      statusStore.fetchStatusesByType('COMPANY'),
      userStore.fetchUsers(),
      fetchSpecialities(),
      fetchContacts(),
      fetchNotes(),
      fetchCompanyActivities(),
      fetchCompanyTasks(),
    ])

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
  console.log('Company size from DB:', company.value?.size)
  Object.assign(companyForm, {
    id: company.value?.id,
    name: company.value?.name || '',
    industry: company.value?.industry || '',
    size: company.value?.size || '',
    address: company.value?.address || '',
    city: company.value?.city || '',
    zipCode: company.value?.zipCode || '',
    country: company.value?.country || '',
    statusId: company.value?.status?.id || '',
    website: company.value?.website || '',
    description: company.value?.description || '',
    assignedToId: company.value?.assignedTo?.id || '',
    specialities: company.value?.Specialities
      ? company.value.Specialities.map((spec) => spec.id)
      : [],
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
      city: companyForm.city,
      zipCode: companyForm.zipCode,
      country: companyForm.country,
      statusId: companyForm.statusId,
      website: companyForm.website,
      description: companyForm.description,
      assignedToId: companyForm.assignedToId,
      specialities: companyForm.specialities,
    }

    const result = await companyStore.updateCompany(companyForm.id, updateData)
    if (result) {
      await companyStore.fetchCompanyById(companyId.value)
      if (companyStore.currentCompany) {
        company.value = companyStore.currentCompany
      }

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
    city: '',
    zipCode: '',
    country: '',
    statusId: '',
    website: '',
    description: '',
    assignedToId: '',
    specialities: [],
  })
}

// Format website URL to ensure it starts with http:// or https://
function formatWebsiteUrl(url: string): string {
  if (!url) return ''
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
}

// Helper function to determine CSS classes for company status
function getStatusClass(status: string | undefined) {
  if (!status) return 'badge-neutral opacity-70'

  // Version avec traductions i18n
  const statusLower = status.toLowerCase()
  const inactive = t('status.inactive').toLowerCase()
  const prospect = t('status.prospect').toLowerCase()
  const customer = t('status.customer').toLowerCase()
  const partner = t('status.partner').toLowerCase()

  if (statusLower === 'inactive' || statusLower === inactive) {
    return 'badge-neutral opacity-70'
  } else if (statusLower === 'prospect' || statusLower === prospect) {
    return 'badge-info text-info-content'
  } else if (statusLower === 'customer' || statusLower === customer) {
    return 'badge-success text-success-content'
  } else if (statusLower === 'partner' || statusLower === partner) {
    return 'badge-secondary text-secondary-content'
  } else {
    return 'badge-neutral opacity-70'
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

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Helpers
function getTaskStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return t('tasks.status.pending', 'En attente')
    case 'IN_PROGRESS':
      return t('tasks.status.inProgress', 'En cours')
    case 'COMPLETED':
      return t('tasks.status.completed', 'Terminée')
    case 'CANCELLED':
      return t('tasks.status.cancelled', 'Annulée')
    default:
      return status
  }
}

function getTaskStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-200 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100'
  }
}

function getTaskPriorityLabel(priority: string): string {
  switch (priority) {
    case 'LOW':
      return t('tasks.priorityLevel.low', 'Faible')
    case 'MEDIUM':
      return t('tasks.priorityLevel.medium', 'Moyenne')
    case 'HIGH':
      return t('tasks.priorityLevel.high', 'Élevée')
    default:
      return priority
  }
}

function getTaskPriorityClass(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'badge-info'
    case 'MEDIUM':
      return 'badge-warning'
    case 'HIGH':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}

// Fonctions pour les tâches
function openTaskDetails(task: Activity) {
  selectedTask.value = task
  showTaskDialog.value = true
}

function closeTaskDetails() {
  showTaskDialog.value = false
  selectedTask.value = null
}

async function completeTaskHandler(taskId: string) {
  try {
    await activityStore.completeTask(taskId)
    toastStore.success(t('tasks.completedSuccessfully', 'Tâche marquée comme terminée'))
    // Rafraîchir les tâches
    fetchCompanyTasks()
  } catch (error) {
    console.error('Failed to complete task:', error)
    toastStore.error(t('tasks.failedToComplete', 'Échec de la mise à jour de la tâche'))
  }
  closeTaskDetails()
}

function editTaskHandler(task: Activity) {
  console.log('Edit task:', task)
  // À implémenter pour l'édition de tâche
  closeTaskDetails()
}
</script>
