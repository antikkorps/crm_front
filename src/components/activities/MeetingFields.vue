<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Type de réunion -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('meetings.type') }} *</span>
      </label>
      <select
        :model-value="modelValue.meetingType"
        @update:model-value="updateField('meetingType', $event)"
        class="select select-bordered w-full"
        required
      >
        <option value="">{{ t('common.select') }}</option>
        <option value="IN_PERSON">{{ t('meetings.type.inPerson') }}</option>
        <option value="VIDEO_CALL">{{ t('meetings.type.videoCall') }}</option>
        <option value="PHONE_CONFERENCE">{{ t('meetings.type.phoneCall') }}</option>
      </select>
    </div>

    <!-- Lieu de la réunion -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('meetings.location') }}</span>
      </label>
      <input
        :model-value="modelValue.location || ''"
        @input="updateField('location', ($event.target as HTMLInputElement)?.value)"
        type="text"
        class="input input-bordered w-full"
        :placeholder="getLocationPlaceholder()"
      />
    </div>

    <!-- Date et heure de début -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('meetings.startDate') }} *</span>
      </label>
      <input
        :model-value="modelValue.startTime"
        @input="updateField('startTime', ($event.target as HTMLInputElement)?.value)"
        type="datetime-local"
        class="input input-bordered w-full"
        required
      />
    </div>

    <!-- Date et heure de fin -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('meetings.endDate') }}</span>
      </label>
      <input
        :model-value="modelValue.endTime || ''"
        @input="updateField('endTime', ($event.target as HTMLInputElement)?.value)"
        type="datetime-local"
        class="input input-bordered w-full"
      />
    </div>

    <!-- Indicateurs visuels -->
    <div class="md:col-span-2">
      <div class="flex flex-wrap gap-2">
        <div v-if="modelValue.meetingType" class="badge badge-primary">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="modelValue.meetingType === 'IN_PERSON'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              v-else-if="modelValue.meetingType === 'VIDEO_CALL'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
            <path
              v-else-if="modelValue.meetingType === 'PHONE_CONFERENCE'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          {{ t(`meetings.type.${modelValue.meetingType.toLowerCase()}`) }}
        </div>

        <div v-if="modelValue.location" class="badge badge-neutral">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {{ modelValue.location }}
        </div>

        <div v-if="meetingDuration" class="badge badge-info">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ meetingDuration }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateActivityDto } from '@/types/activity.types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps<{
  modelValue: CreateActivityDto
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: CreateActivityDto]
}>()

// Computed
const meetingDuration = computed(() => {
  if (!props.modelValue.startTime || !props.modelValue.endTime) return null

  const start = new Date(props.modelValue.startTime)
  const end = new Date(props.modelValue.endTime)
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.round(diffMs / (1000 * 60))

  if (diffMins < 60) {
    return `${diffMins} ${t('meetings.minutes')}`
  } else {
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }
})

// Fonction utilitaire pour mettre à jour un champ
function updateField(field: string, value: unknown) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

// Placeholder dynamique selon le type de réunion
function getLocationPlaceholder() {
  switch (props.modelValue.meetingType) {
    case 'IN_PERSON':
      return t('meetings.locationPlaceholder.inPerson')
    case 'VIDEO_CALL':
      return t('meetings.locationPlaceholder.videoCall')
    case 'PHONE_CONFERENCE':
      return t('meetings.locationPlaceholder.phoneCall')
    default:
      return t('meetings.locationPlaceholder.default')
  }
}
</script>
