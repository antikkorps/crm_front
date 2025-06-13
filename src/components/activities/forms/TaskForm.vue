<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- En-tête avec icône -->
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div
        class="w-10 h-10 rounded-lg bg-iimport type { CreateActivityDto, UpdateActivityDto } from '@/types/activity.types' import type { User } from '@/types/auth.types' import { computed, ref, watch } from 'vue' import { useI18n } from 'vue-i18n'10 flex items-center justify-center"
      >
        <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold">
          {{ isEditMode ? t('activities.edit.task') : t('activities.new.task') }}
        </h3>
        <p class="text-sm text-base-content/70">{{ t('activities.taskDescription') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Colonne gauche - Informations principales -->
      <div class="space-y-4">
        <!-- Titre -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('common.title') }} *</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="input input-bordered w-full"
            :placeholder="t('activities.taskTitlePlaceholder')"
            required
          />
        </div>

        <!-- Priorité -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.priority') }}</span>
          </label>
          <div class="flex gap-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.priority"
                type="radio"
                value="LOW"
                class="radio radio-success radio-sm"
              />
              <span class="text-sm">{{ t('activities.priority.low') }}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.priority"
                type="radio"
                value="MEDIUM"
                class="radio radio-warning radio-sm"
              />
              <span class="text-sm">{{ t('activities.priority.medium') }}</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="formData.priority"
                type="radio"
                value="HIGH"
                class="radio radio-error radio-sm"
              />
              <span class="text-sm">{{ t('activities.priority.high') }}</span>
            </label>
          </div>
        </div>

        <!-- Statut de la tâche -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.task.status') }}</span>
          </label>
          <select v-model="formData.taskStatus" class="select select-bordered w-full">
            <option value="TODO">{{ t('activities.task.statuses.todo') }}</option>
            <option value="IN_PROGRESS">{{ t('activities.task.statuses.inProgress') }}</option>
            <option value="COMPLETED">{{ t('activities.task.statuses.completed') }}</option>
            <option value="CANCELLED">{{ t('activities.task.statuses.cancelled') }}</option>
          </select>
        </div>

        <!-- Assigné à -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.assignedTo') }}</span>
          </label>
          <select v-model="formData.assignedToId" class="select select-bordered w-full">
            <option value="">{{ t('common.notAssigned') }}</option>
            <option v-for="user in availableUsers" :key="user.id" :value="user.id">
              {{ user.firstName }} {{ user.lastName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Colonne droite - Planification -->
      <div class="space-y-4">
        <!-- Date d'échéance -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.task.dueDate') }}</span>
          </label>
          <input v-model="formData.dueDate" type="date" class="input input-bordered w-full" />
        </div>

        <!-- Heure d'échéance -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.task.dueTime') }}</span>
          </label>
          <input v-model="dueTime" type="time" class="input input-bordered w-full" />
        </div>

        <!-- Durée estimée -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.task.estimatedDuration') }}</span>
          </label>
          <div class="flex gap-2">
            <input
              v-model.number="estimatedHours"
              type="number"
              min="0"
              max="999"
              class="input input-bordered flex-1"
              placeholder="0"
            />
            <span class="flex items-center text-sm text-base-content/70">{{
              t('activities.task.hours')
            }}</span>
            <input
              v-model.number="estimatedMinutes"
              type="number"
              min="0"
              max="59"
              class="input input-bordered flex-1"
              placeholder="0"
            />
            <span class="flex items-center text-sm text-base-content/70">{{
              t('activities.task.minutes')
            }}</span>
          </div>
        </div>

        <!-- Progression -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.task.progress') }}</span>
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="formData.taskProgress"
              type="range"
              min="0"
              max="100"
              class="range range-info"
            />
            <span class="text-sm font-medium w-12">{{ formData.taskProgress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('common.description') }}</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-32"
        :placeholder="t('activities.task.descriptionPlaceholder')"
      ></textarea>
    </div>

    <!-- Indicateur de date d'échéance -->
    <div v-if="formData.dueDate" class="alert" :class="getDueDateAlertClass()">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ getDueDateMessage() }}</span>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-3 pt-6 border-t border-base-200">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-info" :disabled="!isFormValid">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ isEditMode ? t('common.update') : t('common.create') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Activity, CreateActivityDto, UpdateActivityDto } from '@/types/activity.types'
import type { User } from '@/types/auth.types'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  activity?: Activity | null
  availableUsers?: User[]
  isEditMode?: boolean
}>()

const emit = defineEmits<{
  save: [data: CreateActivityDto | UpdateActivityDto]
  cancel: []
}>()

// État du formulaire
const formData = ref({
  type: 'TASK' as const,
  title: '',
  content: '',
  assignedToId: '',
  priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
  taskStatus: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  dueDate: '',
  taskProgress: 0,
  taskEstimatedDuration: 0,
})

// Gestion de l'heure séparément
const dueTime = ref('')
const estimatedHours = ref(0)
const estimatedMinutes = ref(0)

// Initialiser le formulaire si on édite
if (props.activity) {
  // Mapping des champs de l'activité vers le formulaire
  formData.value = {
    ...formData.value,
    title: props.activity.title || '',
    content: props.activity.content || '',
    assignedToId: props.activity.assignedToId || '',
    priority: (props.activity.priority as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
    taskStatus:
      (props.activity.taskStatus as 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') || 'TODO',
    dueDate: props.activity.dueDate || '',
    taskProgress: props.activity.taskProgress || 0,
    taskEstimatedDuration: props.activity.taskEstimatedDuration || 0,
  }

  // Extraire l'heure de la date d'échéance
  if (props.activity.dueDate) {
    const date = new Date(props.activity.dueDate)
    if (!isNaN(date.getTime())) {
      formData.value.dueDate = date.toISOString().split('T')[0]
      dueTime.value = date.toTimeString().slice(0, 5)
    }
  }

  // Convertir la durée estimée
  if (props.activity.taskEstimatedDuration) {
    const totalMinutes = props.activity.taskEstimatedDuration
    estimatedHours.value = Math.floor(totalMinutes / 60)
    estimatedMinutes.value = totalMinutes % 60
  }
}

// Mettre à jour la date d'échéance complète quand date ou heure change
watch([() => formData.value.dueDate, dueTime], () => {
  if (formData.value.dueDate) {
    const dateTime = dueTime.value
      ? `${formData.value.dueDate}T${dueTime.value}:00`
      : `${formData.value.dueDate}T23:59:59`
    formData.value.dueDate = dateTime
  }
})

// Mettre à jour la durée estimée totale
watch([estimatedHours, estimatedMinutes], () => {
  formData.value.taskEstimatedDuration = estimatedHours.value * 60 + estimatedMinutes.value
})

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.title.trim().length > 0
})

// Classe CSS pour l'alerte de date d'échéance
function getDueDateAlertClass() {
  if (!formData.value.dueDate) return ''

  const dueDate = new Date(formData.value.dueDate)
  const now = new Date()
  const timeDiff = dueDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysDiff < 0) return 'alert-error'
  if (daysDiff === 0) return 'alert-warning'
  if (daysDiff <= 2) return 'alert-info'
  return 'alert-success'
}

// Message pour la date d'échéance
function getDueDateMessage() {
  if (!formData.value.dueDate) return ''

  const dueDate = new Date(formData.value.dueDate)
  const now = new Date()
  const timeDiff = dueDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (daysDiff < 0) return t('activities.task.overdue', { days: Math.abs(daysDiff) })
  if (daysDiff === 0) return t('activities.task.dueToday')
  if (daysDiff === 1) return t('activities.task.dueTomorrow')
  return t('activities.task.dueInDays', { days: daysDiff })
}

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  const data = { ...formData.value } as Record<string, unknown>

  // Nettoyer les champs vides
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || data[key] === 0) {
      delete data[key]
    }
  })

  emit('save', data as CreateActivityDto | UpdateActivityDto)
}
</script>
