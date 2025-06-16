<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- En-tête avec icône -->
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
        <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold">
          {{ isEditMode ? t('activities.edit.meeting') : t('activities.new.meeting') }}
        </h3>
        <p class="text-sm text-base-content/70">{{ t('activities.meetingDescription') }}</p>
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
            :placeholder="t('activities.meetingTitlePlaceholder')"
            required
          />
        </div>

        <!-- Type de réunion -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.meeting.type') }}</span>
          </label>
          <select v-model="formData.meetingType" class="select select-bordered w-full">
            <option value="">{{ t('common.select') }}</option>
            <option value="IN_PERSON">{{ t('activities.meeting.types.inPerson') }}</option>
            <option value="VIDEO_CALL">{{ t('activities.meeting.types.videoCall') }}</option>
            <option value="PHONE_CALL">{{ t('activities.meeting.types.phoneCall') }}</option>
          </select>
        </div>

        <!-- Lieu/Lien -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">
              {{
                formData.meetingType === 'IN_PERSON'
                  ? t('activities.meeting.location')
                  : t('activities.meeting.link')
              }}
            </span>
          </label>
          <input
            v-model="formData.location"
            type="text"
            class="input input-bordered w-full"
            :placeholder="getMeetingLocationPlaceholder()"
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
      </div>

      <!-- Colonne droite - Planification -->
      <div class="space-y-4">
        <!-- Date et heure de début -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium"
              >{{ t('activities.meeting.startDateTime') }} *</span
            >
          </label>
          <input
            v-model="formData.startTime"
            type="datetime-local"
            class="input input-bordered w-full"
            required
          />
        </div>

        <!-- Date et heure de fin -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.meeting.endDateTime') }}</span>
          </label>
          <input
            v-model="formData.endTime"
            type="datetime-local"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Participants -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.meeting.participants') }}</span>
          </label>
          <textarea
            v-model="formData.attendees"
            class="textarea textarea-bordered h-20"
            :placeholder="t('activities.meeting.participantsPlaceholder')"
          ></textarea>
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
    </div>

    <!-- Ordre du jour / Notes -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('activities.meeting.agenda') }}</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-32"
        :placeholder="t('activities.meeting.agendaPlaceholder')"
      ></textarea>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-3 pt-6 border-t border-base-200">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-secondary" :disabled="!isFormValid">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
import { computed, ref } from 'vue'
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
  type: 'MEETING' as const,
  title: '',
  content: '',
  assignedToId: '',
  priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
  meetingType: '',
  location: '',
  startTime: '',
  endTime: '',
  attendees: '',
})

// Initialiser le formulaire si on édite
if (props.activity) {
  // Mapping des champs de l'activité vers le formulaire
  formData.value = {
    ...formData.value,
    title: props.activity.title || '',
    content: props.activity.content || '',
    assignedToId: props.activity.assignedToId || '',
    priority: (props.activity.priority as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
    meetingType: props.activity.meetingType || '',
    location: props.activity.location || '',
    startTime: props.activity.startTime || '',
    endTime: props.activity.endTime || '',
    attendees: props.activity.attendees || '',
  }
}

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.title.trim().length > 0 && formData.value.startTime
})

// Placeholder dynamique pour le lieu/lien
function getMeetingLocationPlaceholder() {
  switch (formData.value.meetingType) {
    case 'IN_PERSON':
      return t('activities.meeting.locationPlaceholder')
    case 'VIDEO_CALL':
      return t('activities.meeting.videoLinkPlaceholder')
    case 'PHONE_CALL':
      return t('activities.meeting.phonePlaceholder')
    default:
      return t('activities.meeting.locationPlaceholder')
  }
}

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  const data = { ...formData.value } as Record<string, unknown>

  // Nettoyer les champs vides
  const fieldsToClean = ['assignedToId', 'meetingType', 'location', 'endTime', 'attendees']
  fieldsToClean.forEach((field) => {
    if (data[field] === '') {
      delete data[field]
    }
  })

  emit('save', data as CreateActivityDto | UpdateActivityDto)
}
</script>
