<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Type d'activité -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('activities.type') }} *</span>
      </label>
      <select
        v-model="formData.type"
        class="select select-bordered w-full"
        :disabled="isEditMode"
        required
      >
        <option value="">{{ t('common.select') }}</option>
        <option value="CALL">{{ t('activities.types.call') }}</option>
        <option value="MEETING">{{ t('activities.types.meeting') }}</option>
        <option value="EMAIL">{{ t('activities.types.email') }}</option>
        <option value="TASK">{{ t('activities.types.task') }}</option>
        <option value="NOTE">{{ t('activities.types.note') }}</option>
      </select>
    </div>

    <!-- Titre -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('common.title') }} *</span>
      </label>
      <input
        v-model="formData.title"
        type="text"
        class="input input-bordered w-full"
        :placeholder="t('activities.titlePlaceholder')"
        required
      />
    </div>

    <!-- Description -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('common.description') }}</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-24"
        :placeholder="t('activities.descriptionPlaceholder')"
      ></textarea>
    </div>

    <!-- Champs spécialisés selon le type -->
    <CallFields v-if="formData.type === 'CALL'" v-model="formData" />

    <MeetingFields v-if="formData.type === 'MEETING'" v-model="formData" />

    <EmailFields v-if="formData.type === 'EMAIL'" v-model="formData" />

    <!-- Assignation (pour tous les types sauf NOTE) -->
    <div v-if="formData.type !== 'NOTE'" class="form-control">
      <label class="label">
        <span class="label-text">{{ t('activities.assignedTo') }}</span>
      </label>
      <select v-model="formData.assignedToId" class="select select-bordered w-full">
        <option value="">{{ t('common.notAssigned') }}</option>
        <option v-for="user in availableUsers" :key="user.id" :value="user.id">
          {{ user.firstName }} {{ user.lastName }}
        </option>
      </select>
    </div>

    <!-- Date d'échéance (pour TASK) -->
    <div v-if="formData.type === 'TASK'" class="form-control">
      <label class="label">
        <span class="label-text">{{ t('tasks.dueDate') }}</span>
      </label>
      <input v-model="formData.dueDate" type="date" class="input input-bordered w-full" />
    </div>

    <!-- Priorité (pour TASK et MEETING) -->
    <div v-if="['TASK', 'MEETING'].includes(formData.type)" class="form-control">
      <label class="label">
        <span class="label-text">{{ t('activities.priority') }}</span>
      </label>
      <select v-model="formData.priority" class="select select-bordered w-full">
        <option value="LOW">{{ t('activities.priority.low') }}</option>
        <option value="MEDIUM">{{ t('activities.priority.medium') }}</option>
        <option value="HIGH">{{ t('activities.priority.high') }}</option>
      </select>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-2 pt-4">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
        {{ isEditMode ? t('common.update') : t('common.create') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import type { Activity, CreateActivityDto, UpdateActivityDto } from '@/types/activity.types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CallFields from './CallFields.vue'
import EmailFields from './EmailFields.vue'
import MeetingFields from './MeetingFields.vue'

const { t } = useI18n()
const userStore = useUserStore()

// Props
const props = defineProps<{
  activity?: Activity | null
  isEditMode?: boolean
  companyId?: string
  contactId?: string
}>()

// Emits
const emit = defineEmits<{
  submit: [data: CreateActivityDto | UpdateActivityDto]
  cancel: []
}>()

// État local
const availableUsers = computed(() => userStore.users)

// Données du formulaire
const formData = ref<CreateActivityDto>({
  type: 'CALL',
  title: '',
  content: '',
  companyId: props.companyId || '',
  contactId: props.contactId || '',
  assignedToId: '',
  priority: 'MEDIUM',
})

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.type && formData.value.title.trim()
})

// Initialiser les données si en mode édition
watch(
  () => props.activity,
  (activity) => {
    if (activity && props.isEditMode) {
      Object.assign(formData.value, {
        type: activity.type,
        title: activity.title,
        content: activity.content || '',
        assignedToId: activity.assignedToId || '',
        priority: activity.priority || 'MEDIUM',
        dueDate: activity.dueDate || '',
        // Propriétés spécifiques aux appels
        callDirection: activity.callDirection,
        duration: activity.duration,
        callOutcome: activity.callOutcome,
        // Propriétés spécifiques aux réunions
        meetingType: activity.meetingType,
        location: activity.location,
        // Propriétés spécifiques aux emails
        emailSubject: activity.emailSubject,
        emailStatus: activity.emailStatus,
      })
    }
  },
  { immediate: true },
)

// Charger les utilisateurs au montage
onMounted(async () => {
  if (availableUsers.value.length === 0) {
    await userStore.fetchUsers()
  }
})

// Gérer la soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  // Nettoyer les données selon le type
  const cleanedData = { ...formData.value }

  // Retirer les propriétés non pertinentes selon le type
  if (formData.value.type !== 'CALL') {
    delete cleanedData.callDirection
    delete cleanedData.duration
    delete cleanedData.callOutcome
  }

  if (formData.value.type !== 'MEETING') {
    delete cleanedData.meetingType
    delete cleanedData.location
  }

  if (formData.value.type !== 'EMAIL') {
    delete cleanedData.emailSubject
    delete cleanedData.emailStatus
  }

  if (formData.value.type !== 'TASK') {
    delete cleanedData.dueDate
  }

  if (!['TASK', 'MEETING'].includes(formData.value.type)) {
    delete cleanedData.priority
  }

  emit('submit', cleanedData)
}
</script>
