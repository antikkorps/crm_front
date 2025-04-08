<template>
  <div class="card bg-base-100 shadow-sm h-full">
    <div class="card-body">
      <!-- En-tête avec filtre amélioré -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 class="card-title mb-2 sm:mb-0">{{ title }}</h2>

        <div class="flex flex-wrap items-center gap-2">
          <!-- Filtre amélioré entre "Toutes les tâches" et "Mes tâches" -->
          <div class="join">
            <button
              class="join-item btn btn-sm"
              :class="!showOnlyMyTasks ? 'btn-primary' : 'btn-outline'"
              @click="toggleTaskFilter(false)"
            >
              <Iconify icon="mdi:clipboard-list" class="w-4 h-4 mr-1" />
              Toutes
            </button>
            <button
              class="join-item btn btn-sm"
              :class="showOnlyMyTasks ? 'btn-primary' : 'btn-outline'"
              @click="toggleTaskFilter(true)"
            >
              <Iconify icon="mdi:account-check" class="w-4 h-4 mr-1" />
              Mes tâches
            </button>
          </div>

          <button class="btn btn-sm btn-primary" @click="openTaskModal(null)">
            <Iconify icon="mdi:plus" class="w-4 h-4 mr-1" />
            {{ addButtonLabel }}
          </button>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="isLoading" class="flex justify-center my-4">
        <span class="loading loading-spinner loading-md"></span>
      </div>

      <!-- Message si aucune tâche -->
      <div v-else-if="tasks.length === 0" class="alert alert-info mt-4">
        <Iconify icon="mdi:information" class="w-5 h-5" />
        <span>Aucune tâche à afficher.</span>
      </div>

      <!-- Affichage des tâches en cartes au lieu d'un tableau -->
      <div v-else class="grid grid-cols-1 gap-3 overflow-y-auto max-h-[65vh] px-1">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="card card-compact bg-base-200 shadow-sm hover:shadow-md transition-shadow"
          :class="{
            'border-l-4 border-error': isTaskOverdue(task) && task.taskStatus !== 'COMPLETED',
            'opacity-75': task.taskStatus === 'COMPLETED',
            'border-l-4 border-success': task.taskStatus === 'COMPLETED',
            'border-l-4 border-warning': task.taskStatus === 'IN_PROGRESS',
          }"
        >
          <div class="card-body">
            <div class="flex items-start gap-2">
              <!-- Checkbox -->
              <input
                type="checkbox"
                :checked="task.taskStatus === 'COMPLETED'"
                class="checkbox checkbox-sm mt-1"
                @change="toggleTaskCompletion(task)"
              />

              <div class="flex-1">
                <!-- Titre et badges -->
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h3 class="font-bold">{{ task.title }}</h3>

                  <div class="badge" :class="getPriorityBadgeClass(task.priority)">
                    {{ formatPriority(task.priority) }}
                  </div>

                  <div class="badge badge-outline" :class="getStatusBadgeClass(task.taskStatus)">
                    {{ formatStatus(task.taskStatus) }}
                  </div>
                </div>

                <!-- Description -->
                <p v-if="task.content" class="text-sm mb-2">{{ task.content }}</p>

                <!-- Informations supplémentaires -->
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-opacity-80 mt-2">
                  <!-- Échéance -->
                  <div
                    class="flex items-center gap-1"
                    :class="{ 'text-error': isTaskOverdue(task) }"
                  >
                    <Iconify icon="mdi:calendar" class="w-4 h-4" />
                    <span>{{ formatDueDate(task.dueDate) }}</span>
                  </div>

                  <!-- Assignée à -->
                  <div class="flex items-center gap-1">
                    <Iconify icon="mdi:account" class="w-4 h-4" />
                    <span>
                      {{
                        task.assignedTo
                          ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                          : 'Non assigné'
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Menu d'actions -->
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
                  <Iconify icon="mdi:dots-vertical" class="w-5 h-5" />
                </label>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu menu-sm shadow bg-base-100 rounded-box w-48"
                >
                  <li>
                    <a @click="openTaskModal(task)"
                      ><Iconify icon="mdi:pencil" class="w-4 h-4" /> Modifier</a
                    >
                  </li>
                  <li v-if="task.taskStatus !== 'COMPLETED'">
                    <a @click="completeTask(task)"
                      ><Iconify icon="mdi:check-circle" class="w-4 h-4" /> Terminer</a
                    >
                  </li>
                  <li v-else>
                    <a @click="toggleTaskCompletion(task)"
                      ><Iconify icon="mdi:reload" class="w-4 h-4" /> Rouvrir</a
                    >
                  </li>
                  <li>
                    <a class="text-error" @click="deleteTask(task)">
                      <Iconify icon="mdi:delete" class="w-4 h-4" /> Supprimer
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour ajouter/modifier une tâche (amélioré) -->
    <dialog ref="taskModalRef" class="modal">
      <div class="modal-box max-w-xl">
        <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
          <Iconify
            :icon="isEditMode ? 'mdi:pencil' : 'mdi:plus-circle'"
            class="w-5 h-5 text-primary"
          />
          {{ isEditMode ? `Modifier : ${taskForm.title}` : 'Nouvelle tâche' }}
        </h3>

        <form @submit.prevent="saveTask" class="space-y-4">
          <!-- Titre -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Titre</span>
            </label>
            <input
              v-model="taskForm.title"
              type="text"
              placeholder="Titre de la tâche"
              class="input input-bordered"
              required
            />
          </div>

          <!-- Description -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Description</span>
            </label>
            <textarea
              v-model="taskForm.content"
              placeholder="Description de la tâche"
              class="textarea textarea-bordered h-24"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Statut -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Statut</span>
              </label>
              <select v-model="taskForm.taskStatus" class="select select-bordered w-full">
                <option :value="TaskStatus.PENDING">En attente</option>
                <option :value="TaskStatus.IN_PROGRESS">En cours</option>
                <option :value="TaskStatus.COMPLETED">Terminée</option>
                <option :value="TaskStatus.CANCELLED">Annulée</option>
              </select>
            </div>

            <!-- Priorité -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Priorité</span>
              </label>
              <select v-model="taskForm.priority" class="select select-bordered w-full">
                <option :value="TaskPriority.LOW">Basse</option>
                <option :value="TaskPriority.MEDIUM">Moyenne</option>
                <option :value="TaskPriority.HIGH">Haute</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Échéance -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Échéance</span>
              </label>
              <input v-model="taskForm.dueDate" type="date" class="input input-bordered" />
            </div>

            <!-- Assigné à (nouveau) -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Assigné à</span>
              </label>
              <select v-model="taskForm.assignedToId" class="select select-bordered w-full">
                <option :value="null">Non assigné</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>
            </div>
          </div>

          <!-- Contact et entreprise associés (optionnels) -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
            v-if="contacts.length > 0 || companies.length > 0"
          >
            <!-- Contact associé (si disponible) -->
            <div class="form-control" v-if="contacts.length > 0">
              <label class="label">
                <span class="label-text font-medium">Contact associé</span>
              </label>
              <select v-model="taskForm.contactId" class="select select-bordered w-full">
                <option :value="null">Aucun</option>
                <option v-for="contact in contacts" :key="contact.id" :value="contact.id">
                  {{ contact.firstName }} {{ contact.lastName }}
                </option>
              </select>
            </div>

            <!-- Entreprise associée (si disponible) -->
            <div class="form-control" v-if="companies.length > 0">
              <label class="label">
                <span class="label-text font-medium">Entreprise associée</span>
              </label>
              <select v-model="taskForm.companyId" class="select select-bordered w-full">
                <option :value="null">Aucune</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-action mt-6 pt-3 border-t">
            <button type="button" class="btn" @click="closeTaskModal">Annuler</button>
            <button type="submit" class="btn btn-primary">
              <Iconify :icon="isEditMode ? 'mdi:content-save' : 'mdi:plus'" class="w-5 h-5 mr-1" />
              {{ isEditMode ? 'Enregistrer' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  ActivityService,
  TaskPriority,
  TaskStatus,
  type TaskCreateDto,
  type TaskUpdateDto,
} from '@/services/activity.service'
import { apiRequest } from '@/services/api.service' // Ajout de l'import manquant
import { useToastStore } from '@/stores/toast'
import type { User } from '@/types/auth.types' // Typage pour les utilisateurs
import type { ApiActivity } from '@/types/dashboard.types'
import { onMounted, ref } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Tâches prioritaires',
  },
  addButtonLabel: {
    type: String,
    default: 'Nouvelle tâche',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showAllTasks: {
    type: Boolean,
    default: true,
  },
})

// État
const tasks = ref<ApiActivity[]>([])
const isLoading = ref(false)
const showOnlyMyTasks = ref(!props.showAllTasks)
const taskModalRef = ref<HTMLDialogElement | null>(null)
const isEditMode = ref(false)
const currentTaskId = ref<string | null>(null)
const toastStore = useToastStore()

// Interfaces pour les données associées
interface Contact {
  id: string
  firstName: string
  lastName: string
}

interface Company {
  id: string
  name: string
}

// Données pour les listes déroulantes avec des types appropriés
const users = ref<User[]>([])
const contacts = ref<Contact[]>([])
const companies = ref<Company[]>([])

// Formulaire de tâche
const taskForm = ref<TaskCreateDto | (TaskUpdateDto & { contactId?: string; companyId?: string })>({
  title: '',
  content: '',
  dueDate: null,
  priority: TaskPriority.MEDIUM,
  taskStatus: TaskStatus.PENDING,
  assignedToId: null,
  contactId: undefined,
  companyId: undefined,
})

// Récupérer les tâches
const fetchTasks = async () => {
  isLoading.value = true
  try {
    if (showOnlyMyTasks.value) {
      tasks.value = await ActivityService.getMyTasks()
    } else {
      tasks.value = await ActivityService.getAllTasks()
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error)
    toastStore.error('Erreur lors du chargement des tâches')
  } finally {
    isLoading.value = false
  }
}

// Récupérer les utilisateurs, contacts et entreprises
const fetchRelatedData = async () => {
  try {
    // Récupérer les utilisateurs
    const usersData = await apiRequest<{ items: User[] }>('/v1/users')
    users.value = usersData.items

    // Récupérer les contacts (limités à 10 pour ne pas surcharger la dropdown)
    const contactsData = await apiRequest<{ items: Contact[] }>('/v1/contacts?limit=10')
    contacts.value = contactsData.items

    // Récupérer les entreprises (limités à 10 pour ne pas surcharger la dropdown)
    const companiesData = await apiRequest<{ items: Company[] }>('/v1/companies?limit=10')
    companies.value = companiesData.items
  } catch (error) {
    console.error('Erreur lors du chargement des données associées:', error)
    toastStore.error('Impossible de charger les utilisateurs et contacts')
  }
}

// Formater la date d'échéance
const formatDueDate = (dueDate: string | null | undefined) => {
  if (!dueDate) return 'Aucune échéance'

  const date = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return "Aujourd'hui"
  if (date.toDateString() === tomorrow.toDateString()) return 'Demain'
  if (date.toDateString() === yesterday.toDateString()) return 'Hier'

  return date.toLocaleDateString('fr-FR')
}

// Vérifier si une tâche est en retard
const isTaskOverdue = (task: ApiActivity) => {
  if (!task.dueDate || task.taskStatus === 'COMPLETED' || task.taskStatus === 'CANCELLED')
    return false

  const now = new Date()
  const dueDate = new Date(task.dueDate)

  // Définir l'heure de dueDate à 23:59:59
  dueDate.setHours(23, 59, 59, 999)

  return now > dueDate
}

// Formatter la priorité
const formatPriority = (priority: string | null | undefined) => {
  if (!priority) return 'Moyenne'

  const priorityMap: Record<string, string> = {
    LOW: 'Basse',
    MEDIUM: 'Moyenne',
    HIGH: 'Haute',
  }

  return priorityMap[priority] || 'Moyenne'
}

// Formatter le statut
const formatStatus = (status: string | null | undefined) => {
  if (!status) return 'En attente'

  const statusMap: Record<string, string> = {
    PENDING: 'En attente',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminée',
    CANCELLED: 'Annulée',
  }

  return statusMap[status] || 'En attente'
}

// Obtenir la classe CSS pour la priorité
const getPriorityBadgeClass = (priority: string | null | undefined) => {
  if (!priority) return 'badge-info'

  const priorityClasses: Record<string, string> = {
    LOW: 'badge-info',
    MEDIUM: 'badge-warning',
    HIGH: 'badge-error',
  }

  return priorityClasses[priority] || 'badge-info'
}

// Obtenir la classe CSS pour le statut
const getStatusBadgeClass = (status: string | null | undefined) => {
  if (!status) return ''

  const statusClasses: Record<string, string> = {
    PENDING: 'badge-ghost',
    IN_PROGRESS: 'badge-warning text-warning-content',
    COMPLETED: 'badge-success text-success-content',
    CANCELLED: 'badge-error text-error-content',
  }

  return statusClasses[status] || ''
}

// Obtenir les initiales d'un utilisateur
// const getInitials = (user: { firstName?: string; lastName?: string }) => {
//   if (!user) return '--'
//   return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
// }

// Basculer entre "Toutes les tâches" et "Mes tâches"
const toggleTaskFilter = (showMine: boolean) => {
  showOnlyMyTasks.value = showMine
  fetchTasks()
}

// Ouvrir la modal pour ajouter/modifier une tâche
const openTaskModal = async (task: ApiActivity | null) => {
  // Charger les données associées si ce n'est pas déjà fait
  if (users.value.length === 0) {
    await fetchRelatedData()
  }

  if (task) {
    // Mode édition
    isEditMode.value = true
    currentTaskId.value = task.id
    taskForm.value = {
      title: task.title || '',
      content: task.content || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null,
      priority:
        (task.priority as string) === 'LOW'
          ? TaskPriority.LOW
          : (task.priority as string) === 'HIGH'
            ? TaskPriority.HIGH
            : TaskPriority.MEDIUM,
      taskStatus:
        (task.taskStatus as string) === 'COMPLETED'
          ? TaskStatus.COMPLETED
          : (task.taskStatus as string) === 'IN_PROGRESS'
            ? TaskStatus.IN_PROGRESS
            : (task.taskStatus as string) === 'CANCELLED'
              ? TaskStatus.CANCELLED
              : TaskStatus.PENDING,
      assignedToId: task.assignedToId || null,
      contactId: task.contactId || undefined,
      companyId: task.companyId || undefined,
    }
  } else {
    // Mode création
    isEditMode.value = false
    currentTaskId.value = null
    taskForm.value = {
      title: '',
      content: '',
      dueDate: null,
      priority: TaskPriority.MEDIUM,
      taskStatus: TaskStatus.PENDING,
      type: 'TASK',
      assignedToId: null,
      contactId: undefined,
      companyId: undefined,
    }
  }

  if (taskModalRef.value) {
    taskModalRef.value.showModal()
  }
}

// Fermer la modal
const closeTaskModal = () => {
  if (taskModalRef.value) {
    taskModalRef.value.close()
  }
}

// Enregistrer une tâche (création ou modification)
const saveTask = async () => {
  isLoading.value = true
  try {
    if (isEditMode.value && currentTaskId.value) {
      // Mettre à jour une tâche existante
      await ActivityService.updateTask(currentTaskId.value, taskForm.value)
      toastStore.success('Tâche mise à jour avec succès')
    } else {
      // Créer une nouvelle tâche
      await ActivityService.createTask(taskForm.value as TaskCreateDto)
      toastStore.success('Tâche créée avec succès')
    }

    // Rafraîchir les tâches et fermer la modal
    await fetchTasks()
    closeTaskModal()
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la tâche:", error)
    toastStore.error("Erreur lors de l'enregistrement de la tâche")
  } finally {
    isLoading.value = false
  }
}

// Compléter une tâche - Correction pour éviter l'erreur 500
const toggleTaskCompletion = async (task: ApiActivity) => {
  isLoading.value = true
  try {
    // Vérification pour s'assurer que task.taskStatus est une chaîne valide
    const currentStatus = task.taskStatus || 'PENDING'

    // Création d'un objet de mise à jour minimal
    const updateData: TaskUpdateDto = {
      taskStatus:
        currentStatus === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED,
    }

    // Appel API avec un objet minimal
    await ActivityService.updateTask(task.id, updateData)

    // Rafraîchir les tâches
    await fetchTasks()

    if (updateData.taskStatus === TaskStatus.COMPLETED) {
      toastStore.success('Tâche marquée comme terminée')
    } else {
      toastStore.info('Tâche marquée comme en attente')
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error)
    toastStore.error('Erreur lors de la mise à jour de la tâche')
  } finally {
    isLoading.value = false
  }
}

// Marquer une tâche comme terminée - Correction similaire
const completeTask = async (task: ApiActivity) => {
  if (task.taskStatus === TaskStatus.COMPLETED) {
    toastStore.info('Cette tâche est déjà marquée comme terminée')
    return
  }

  isLoading.value = true
  try {
    // Simplification de l'appel pour éviter l'erreur 500
    await ActivityService.updateTask(task.id, { taskStatus: TaskStatus.COMPLETED })
    await fetchTasks()
    toastStore.success('Tâche marquée comme terminée')
  } catch (error) {
    console.error('Erreur lors de la complétion de la tâche:', error)
    toastStore.error('Erreur lors de la mise à jour de la tâche')
  } finally {
    isLoading.value = false
  }
}

// Supprimer une tâche
const deleteTask = async (task: ApiActivity) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    return
  }

  isLoading.value = true
  try {
    await ActivityService.deleteTask(task.id)
    await fetchTasks()
    toastStore.success('Tâche supprimée avec succès')
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error)
    toastStore.error('Erreur lors de la suppression de la tâche')
  } finally {
    isLoading.value = false
  }
}

// Charger les tâches au montage du composant
onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
/* Ajouter une transition sur l'opacité pour les tâches terminées */
.card {
  transition:
    opacity 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}
</style>
