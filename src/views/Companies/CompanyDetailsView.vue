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

            <!-- Ligne 1: Secteur et Statut -->
            <div class="flex flex-wrap items-center mt-1 text-sm text-gray-600 gap-3">
              <span v-if="company.industry">{{ company.industry }}</span>
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

            <!-- Ligne 2: Nombre d'employés et Salles d'opération -->
            <div class="flex flex-wrap items-center mt-1 text-sm text-gray-600 gap-3">
              <span v-if="company.size">
                {{ company.size }}
                {{ t('companies.employee', getEmployeeCount(company.size)) }}
              </span>
              <span v-if="company.operatingRooms !== null && company.operatingRooms !== undefined">
                {{ company.operatingRooms }} {{ t('common.operatingRooms') }}
              </span>
            </div>

            <!-- Ligne 3: Chiffres d'affaires -->
            <div class="mt-1 text-sm text-gray-600">
              <!-- Version mobile : en colonne -->
              <div class="flex flex-col gap-1 sm:hidden">
                <span v-if="company.globalRevenue"
                  >{{ t('companies.globalRevenue') }}:
                  {{ formattedRevenue(company.globalRevenue) }}</span
                >
                <span v-if="company.generatedRevenue"
                  >{{ t('companies.revenue') }}:
                  {{ formattedRevenue(company.generatedRevenue) }}</span
                >
              </div>
              <!-- Version desktop : en ligne -->
              <div class="hidden sm:flex flex-wrap items-center gap-3">
                <span v-if="company.globalRevenue"
                  >{{ t('companies.globalRevenue') }}:
                  {{ formattedRevenue(company.globalRevenue) }}</span
                >
                <span v-if="company.generatedRevenue"
                  >{{ t('companies.revenue') }}:
                  {{ formattedRevenue(company.generatedRevenue) }}</span
                >
              </div>
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
                <p v-if="company.addressComplement" class="font-medium text-sm text-gray-600">
                  {{ company.addressComplement }}
                </p>
                <p v-if="!company.address && !company.addressComplement" class="text-gray-400">
                  {{ t('common.notProvided') }}
                </p>
                <p
                  v-if="company.address || company.addressComplement"
                  class="text-sm text-gray-500"
                >
                  {{ company.zipCode }} - {{ company.city }} -
                  {{ company.country }}
                </p>
              </div>

              <!-- Numéro de client -->
              <div v-if="company.clientNumber">
                <p class="text-sm text-gray-500">{{ t('companies.clientNumber') }}</p>
                <p class="font-medium">{{ company.clientNumber }}</p>
              </div>

              <!-- Groupe de clients -->
              <div v-if="company.clientGroup">
                <p class="text-sm text-gray-500">{{ t('companies.clientGroup') }}</p>
                <p class="font-medium">{{ company.clientGroup }}</p>
              </div>

              <!-- Code régional -->
              <div v-if="company.codeRegional">
                <p class="text-sm text-gray-500">{{ t('companies.codeRegional') }}</p>
                <p class="font-medium">{{ company.codeRegional }}</p>
              </div>

              <!-- Email -->
              <div v-if="company.email">
                <p class="text-sm text-gray-500">{{ t('common.email') }}</p>
                <p class="font-medium">
                  <a :href="`mailto:${company.email}`" class="text-primary hover:underline">
                    {{ company.email }}
                  </a>
                </p>
              </div>

              <!-- Téléphone -->
              <div v-if="company.phone">
                <p class="text-sm text-gray-500">{{ t('common.phone') }}</p>
                <p class="font-medium">
                  <a :href="`tel:${company.phone}`" class="text-primary hover:underline">
                    {{ company.phone }}
                  </a>
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
          <ContactsSection
            :contacts="contacts"
            :loading="loadingContacts"
            :show-actions="true"
            :clickable="false"
            @add-contact="handleAddContact"
            @edit-contact="handleEditContact"
            @delete-contact="handleDeleteContact"
            @contact-click="handleContactClick"
          />

          <!-- Tasks Section -->
          <TasksSection
            ref="tasksSectionRef"
            :tasks="companyTasks"
            :loading="loadingTasks"
            :show-preview="true"
            :clickable="false"
            :companyId="companyId"
            :companyName="company?.name"
            :companyContacts="contacts"
            @view-task="openTaskDetails"
            @complete-task="completeTaskHandler"
            @reopen-task="reopenTaskHandler"
            @task-click="openTaskDetails"
            @task-created="handleTaskCreated"
            @task-updated="handleTaskUpdated"
          />

          <!-- Notes Section -->
          <NotesSection
            :notes="notes"
            :loading="loadingNotes"
            :show-actions="true"
            :clickable="false"
            @add="handleAddNote"
            @view="handleViewNote"
            @edit="handleEditNote"
            @delete="handleDeleteNote"
            @note-click="handleNoteClick"
          />

          <!-- Activities Section -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
            <ActivitiesSection :company-id="companyId" />
          </div>
        </div>
        <!-- Sidebar -->
        <div class="col-span-1 w-full">
          <!-- Quotes Section (Placeholder) -->
          <div class="rounded-lg shadow-md p-6 mb-6 w-full">
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

          <!-- Quick Stats ou autre contenu sidebar -->
          <div class="rounded-lg shadow-md p-6 w-full">
            <h2 class="text-lg font-bold mb-4">{{ t('companies.quickStats') }}</h2>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ t('contacts.title') }}</span>
                <span class="font-medium">{{ contacts.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ t('tasks.title') }}</span>
                <span class="font-medium">{{ companyTasks.length }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ t('notes.title') }}</span>
                <span class="font-medium">{{ notes.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Company Modal -->
    <dialog id="editCompanyModal" class="modal" :open="showModal">
      <div class="modal-box w-full max-w-4xl">
        <h2 class="text-xl font-bold mb-4">{{ t('companies.editCompany') }}</h2>

        <CompanyForm
          :company="company"
          :isEditMode="true"
          :statuses="companyStatuses"
          :specialities="availableSpecialities"
          :users="users"
          :isSubmitting="loading"
          @submit="submitCompanyForm"
          @cancel="closeModal"
        />
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

    <!-- Contact Modal -->
    <ContactModal
      :is-open="showContactModal"
      :contact="selectedContact"
      :company-id="companyId"
      :is-edit-mode="isEditingContact"
      :is-submitting="isSubmittingContact"
      @submit="handleContactSubmit"
      @close="handleCloseContactModal"
    />

    <!-- Note Modal -->
    <NoteModal
      :is-open="showNoteModal"
      :note="selectedNote"
      :company-id="companyId"
      :is-edit-mode="isEditingNote"
      :is-submitting="isSubmittingNote"
      @submit="handleNoteSubmit"
      @close="handleCloseNoteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ActivitiesSection } from '@/components/activities'
import { SpecialityBadgeWithTooltip } from '@/components/common'
import { CompanyForm } from '@/components/companies'
import { ContactModal, ContactsSection } from '@/components/contacts'
import { NoteModal, NotesSection } from '@/components/notes'
import { TaskDetailsDialog, TasksSection } from '@/components/tasks'
import type { TaskCreateDto, TaskUpdateDto } from '@/services/activity.service'
import type { NoteCreateDto, NoteUpdateDto } from '@/services/note.service'
import { useActivityStore } from '@/stores/activity'
import { useCompanyStore } from '@/stores/company'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type { Activity } from '@/types/activity.types'
import type {
  Company,
  CompanyContact,
  CompanyUpdateDto,
  ContactCreateDto,
  ContactUpdateDto,
  Speciality,
} from '@/types/company.types'
import { computed, onMounted, ref } from 'vue'
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
const notes = ref<Activity[]>([])

// Component refs
const tasksSectionRef = ref<InstanceType<typeof TasksSection> | null>(null)

// Activities
const companyTasks = ref<Activity[]>([])
const loadingTasks = ref(false)
const loadingContacts = ref(false)
const loadingNotes = ref(false)

// UI states
const loading = ref(false)
const error = ref<string | null>(null)
const showModal = ref(false)
const showDeleteModal = ref(false)
const showTaskDialog = ref(false)
const selectedTask = ref<Activity | null>(null)

// Contact modal states
const showContactModal = ref(false)
const selectedContact = ref<CompanyContact | null>(null)
const isEditingContact = ref(false)
const isSubmittingContact = ref(false)

// Note modal states
const showNoteModal = ref(false)
const selectedNote = ref<Activity | null>(null)
const isEditingNote = ref(false)
const isSubmittingNote = ref(false)

// Computed properties
const companyStatuses = computed(() => statusStore.getStatusesByType('COMPANY'))
const users = computed(() => userStore.users)
const availableSpecialities = ref<Speciality[]>([])

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
  loadingContacts.value = true
  try {
    await companyStore.fetchCompanyContacts(companyId.value)
    contacts.value = companyStore.companyContacts
    console.log('Contacts fetched:', contacts.value)
  } catch (err) {
    console.error('Failed to fetch contacts', err)
    toastStore.error(t('common.failedToFetchContacts', 'Erreur lors du chargement des contacts'))
  } finally {
    loadingContacts.value = false
  }
}

async function fetchNotes() {
  loadingNotes.value = true
  try {
    await companyStore.fetchCompanyNotes(companyId.value)
    notes.value = companyStore.companyNotes
  } catch (err) {
    console.error('Failed to fetch notes', err)
    toastStore.error(t('common.failedToFetchNotes', 'Erreur lors du chargement des notes'))
  } finally {
    loadingNotes.value = false
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
  showModal.value = true
}

async function submitCompanyForm(formData: CompanyUpdateDto) {
  if (!company.value) return

  loading.value = true
  try {
    const result = await companyStore.updateCompany(company.value.id, formData)
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

// Fonction pour déterminer le nombre d'employés pour le pluriel
function getEmployeeCount(size: string): number {
  if (!size) return 1

  // Extraire le premier nombre de la chaîne de taille
  const match = size.match(/(\d+)/)
  if (match) {
    return parseInt(match[1]) === 1 ? 1 : 2
  }

  // Par défaut, utiliser le pluriel
  return 2
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

async function reopenTaskHandler(taskId: string) {
  try {
    await activityStore.reopenTask(taskId)
    toastStore.success(t('tasks.reopenedSuccessfully', 'Tâche rouverte avec succès'))
    // Rafraîchir les tâches
    fetchCompanyTasks()
  } catch (error) {
    console.error('Failed to reopen task:', error)
    toastStore.error(t('tasks.failedToReopen', 'Échec de la réouverture de la tâche'))
  }
  closeTaskDetails()
}

function editTaskHandler(task: Activity) {
  // Fermer le dialog des détails de la tâche
  closeTaskDetails()

  // Ouvrir le modal d'édition dans TasksSection
  if (tasksSectionRef.value) {
    tasksSectionRef.value.openTaskModal(task)
  }
}

// Handlers pour les contacts
function handleAddContact() {
  selectedContact.value = null
  isEditingContact.value = false
  showContactModal.value = true
}

function handleEditContact(contact: CompanyContact) {
  selectedContact.value = contact
  isEditingContact.value = true
  showContactModal.value = true
}

async function handleDeleteContact(contact: CompanyContact) {
  if (!confirm(t('contacts.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce contact ?'))) {
    return
  }

  try {
    const success = await companyStore.deleteContact(contact.id)
    if (success) {
      toastStore.success(t('contacts.deletedSuccessfully', 'Contact supprimé avec succès'))
    } else {
      toastStore.error(t('contacts.failedToDelete', 'Échec de la suppression du contact'))
    }
  } catch (error) {
    console.error('Failed to delete contact:', error)
    toastStore.error(t('contacts.failedToDelete', 'Échec de la suppression du contact'))
  }
}

function handleContactClick(contact: CompanyContact) {
  console.log('View contact details:', contact)
  // À implémenter - navigation vers les détails du contact
}

async function handleContactSubmit(data: ContactCreateDto | (ContactUpdateDto & { id: string })) {
  isSubmittingContact.value = true

  try {
    if (isEditingContact.value && 'id' in data) {
      // Mode édition
      const result = await companyStore.updateContact(data.id, data)
      if (result) {
        toastStore.success(t('contacts.updatedSuccessfully', 'Contact mis à jour avec succès'))
        showContactModal.value = false
      } else {
        toastStore.error(t('contacts.failedToUpdate', 'Échec de la mise à jour du contact'))
      }
    } else {
      // Mode création
      const result = await companyStore.createContact(data as ContactCreateDto)
      if (result) {
        toastStore.success(t('contacts.createdSuccessfully', 'Contact créé avec succès'))
        showContactModal.value = false
      } else {
        toastStore.error(t('contacts.failedToCreate', 'Échec de la création du contact'))
      }
    }
  } catch (error) {
    console.error('Failed to save contact:', error)
    const errorMessage = isEditingContact.value
      ? t('contacts.failedToUpdate', 'Échec de la mise à jour du contact')
      : t('contacts.failedToCreate', 'Échec de la création du contact')
    toastStore.error(errorMessage)
  } finally {
    isSubmittingContact.value = false
  }
}

function handleCloseContactModal() {
  showContactModal.value = false
  selectedContact.value = null
  isEditingContact.value = false
}

// Handlers pour les notes
function handleAddNote() {
  selectedNote.value = null
  isEditingNote.value = false
  showNoteModal.value = true
}

function handleEditNote(note: Activity) {
  selectedNote.value = note
  isEditingNote.value = true
  showNoteModal.value = true
}

function handleViewNote(note: Activity) {
  // Pour l'instant, on ouvre en mode édition. On peut changer ça plus tard pour un mode lecture seule
  handleEditNote(note)
}

async function handleDeleteNote(note: Activity) {
  if (!confirm(t('notes.confirmDelete', 'Êtes-vous sûr de vouloir supprimer cette note ?'))) {
    return
  }

  try {
    const result = await companyStore.deleteCompanyNote(note.id)
    if (result) {
      toastStore.success(t('notes.deletedSuccessfully', 'Note supprimée avec succès'))
      // Rafraîchir la liste des notes
      await fetchNotes()
    } else {
      toastStore.error(t('notes.failedToDelete', 'Échec de la suppression de la note'))
    }
  } catch (error) {
    console.error('Failed to delete note:', error)
    toastStore.error(t('notes.failedToDelete', 'Échec de la suppression de la note'))
  }
}

function handleNoteClick(note: Activity) {
  console.log('View note details:', note)
  // À implémenter - navigation vers les détails de la note ou affichage dans un modal
}

async function handleNoteSubmit(data: NoteCreateDto | (NoteUpdateDto & { id: string })) {
  isSubmittingNote.value = true

  try {
    if (isEditingNote.value && 'id' in data) {
      // Mode édition
      const updateData = {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
      }
      const result = await companyStore.updateCompanyNote(data.id, updateData)
      if (result) {
        toastStore.success(t('notes.updatedSuccessfully', 'Note mise à jour avec succès'))
        showNoteModal.value = false
        // Rafraîchir la liste des notes
        await fetchNotes()
      } else {
        toastStore.error(t('notes.failedToUpdate', 'Échec de la mise à jour de la note'))
      }
    } else {
      // Mode création - on s'assure que les champs requis sont présents
      const createData = data as NoteCreateDto
      if (!createData.title || !createData.content) {
        toastStore.error(t('notes.titleAndContentRequired', 'Le titre et le contenu sont requis'))
        return
      }

      const noteData = {
        title: createData.title,
        content: createData.content,
        companyId: companyId.value,
      }
      const result = await companyStore.addCompanyNote(noteData)
      if (result) {
        toastStore.success(t('notes.createdSuccessfully', 'Note créée avec succès'))
        showNoteModal.value = false
        // Rafraîchir la liste des notes
        await fetchNotes()
      } else {
        toastStore.error(t('notes.failedToCreate', 'Échec de la création de la note'))
      }
    }
  } catch (error) {
    console.error('Failed to save note:', error)
    const errorMessage = isEditingNote.value
      ? t('notes.failedToUpdate', 'Échec de la mise à jour de la note')
      : t('notes.failedToCreate', 'Échec de la création de la note')
    toastStore.error(errorMessage)
  } finally {
    isSubmittingNote.value = false
  }
}

function handleCloseNoteModal() {
  showNoteModal.value = false
  selectedNote.value = null
  isEditingNote.value = false
}

// Handlers pour les tâches
async function handleTaskCreated(taskData: TaskCreateDto) {
  try {
    // Ajouter l'ID de l'entreprise aux données de la tâche
    const taskWithCompany = {
      ...taskData,
      companyId: companyId.value,
    }

    await activityStore.createTask(taskWithCompany)
    toastStore.success(t('tasks.createdSuccessfully', 'Tâche créée avec succès'))
    // Rafraîchir les tâches
    fetchCompanyTasks()
  } catch (error) {
    console.error('Failed to create task:', error)
    toastStore.error(t('tasks.failedToCreate', 'Échec de la création de la tâche'))
  }
}

async function handleTaskUpdated(taskData: TaskUpdateDto & { id: string }) {
  try {
    await activityStore.updateTask(taskData.id, taskData)
    toastStore.success(t('tasks.updatedSuccessfully', 'Tâche mise à jour avec succès'))
    // Rafraîchir les tâches
    fetchCompanyTasks()
  } catch (error) {
    console.error('Failed to update task:', error)
    toastStore.error(t('tasks.failedToUpdate', 'Échec de la mise à jour de la tâche'))
  }
}
</script>
