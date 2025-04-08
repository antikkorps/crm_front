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

      <!-- Affichage des tâches en cartes -->
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

    <!-- Modal pour ajouter/modifier une tâche (utilisant le composant réutilisable) -->
    <dialog ref="taskModalRef" class="modal">
      <div class="modal-box max-w-xl">
        <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
          <Iconify
            :icon="isEditMode ? 'mdi:pencil' : 'mdi:plus-circle'"
            class="w-5 h-5 text-primary"
          />
          {{ isEditMode ? `Modifier : ${currentTask?.title}` : 'Nouvelle tâche' }}
        </h3>

        <TaskForm
          :task="currentTask"
          :isEditMode="isEditMode"
          @submit="saveTask"
          @cancel="closeTaskModal"
        />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <!-- Dialog de confirmation pour la suppression -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Confirmer la suppression"
      message="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
      confirmText="Supprimer"
      confirmButtonClass="btn-error"
      icon="mdi:delete-alert"
      iconClass="text-error"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import TaskForm from '@/components/forms/tasks/TaskForm.vue'
import {
  ActivityService,
  TaskStatus,
  type TaskCreateDto,
  type TaskUpdateDto,
} from '@/services/activity.service'
import { useToastStore } from '@/stores/toast'
import type { ApiActivity } from '@/types/dashboard.types'
import { computed, onMounted, ref } from 'vue'

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
  // Nouvelle prop pour contrôler l'affichage des tâches complétées
  hideCompletedTasks: {
    type: Boolean,
    default: true, // Par défaut, cacher les tâches terminées sur le tableau de bord
  },
})

// État
const allTasks = ref<ApiActivity[]>([])
const isLoading = ref(false)
const showOnlyMyTasks = ref(!props.showAllTasks)
const taskModalRef = ref<HTMLDialogElement | null>(null)
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null)
const isEditMode = ref(false)
const currentTask = ref<ApiActivity | null>(null)
const taskToDelete = ref<ApiActivity | null>(null)
const toastStore = useToastStore()

// Tâches filtrées (excluant les tâches terminées si hideCompletedTasks est true)
const tasks = computed(() => {
  if (props.hideCompletedTasks) {
    return allTasks.value.filter((task) => task.taskStatus !== TaskStatus.COMPLETED)
  }
  return allTasks.value
})

// Récupérer les tâches
const fetchTasks = async () => {
  isLoading.value = true
  try {
    if (showOnlyMyTasks.value) {
      allTasks.value = await ActivityService.getMyTasks()
    } else {
      allTasks.value = await ActivityService.getAllTasks()
    }
  } catch (error: unknown) {
    console.error('Erreur lors de la récupération des tâches:', error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes('Session expirée')) {
      toastStore.error('Votre session a expiré, vous allez être redirigé vers la page de connexion')
      return
    } else {
      toastStore.error('Erreur lors du chargement des tâches')
    }
  } finally {
    isLoading.value = false
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

// Basculer entre "Toutes les tâches" et "Mes tâches"
const toggleTaskFilter = (showMine: boolean) => {
  showOnlyMyTasks.value = showMine
  fetchTasks()
}

// Ouvrir la modal pour ajouter/modifier une tâche
const openTaskModal = (task: ApiActivity | null) => {
  currentTask.value = task
  isEditMode.value = !!task

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
const saveTask = async (formData: TaskCreateDto | TaskUpdateDto) => {
  isLoading.value = true
  try {
    if (isEditMode.value && currentTask.value) {
      // Mettre à jour une tâche existante
      await ActivityService.updateTask(currentTask.value.id, formData)
      toastStore.success('Tâche mise à jour avec succès')
    } else {
      // Créer une nouvelle tâche
      await ActivityService.createTask(formData as TaskCreateDto)
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

// Afficher le dialogue de confirmation pour la suppression
const deleteTask = (task: ApiActivity) => {
  taskToDelete.value = task
  if (confirmDialogRef.value) {
    confirmDialogRef.value.showDialog()
  }
}

// Confirmer et exécuter la suppression
const confirmDelete = async () => {
  if (!taskToDelete.value) return

  isLoading.value = true
  try {
    await ActivityService.deleteTask(taskToDelete.value.id)
    await fetchTasks()
    toastStore.success('Tâche supprimée avec succès')
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error)
    toastStore.error('Erreur lors de la suppression de la tâche')
  } finally {
    isLoading.value = false
    taskToDelete.value = null
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
