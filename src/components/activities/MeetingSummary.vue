<template>
  <div class="space-y-2">
    <!-- Informations principales -->
    <div class="flex items-center gap-3 text-sm">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="activity.meetingType === 'IN_PERSON'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            v-else-if="activity.meetingType === 'VIDEO_CALL'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
          <path
            v-else-if="activity.meetingType === 'PHONE_CONFERENCE'"
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
        <span class="font-medium">
          {{ t(`meetings.type.${activity.meetingType?.toLowerCase()}`) }}
        </span>
      </div>

      <div v-if="activity.location" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <span class="truncate max-w-32">{{ activity.location }}</span>
      </div>

      <div v-if="meetingDuration" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ meetingDuration }}</span>
      </div>
    </div>

    <!-- Dates et horaires -->
    <div v-if="activity.startTime" class="text-sm">
      <div class="flex items-center gap-2 text-base-content/70">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>
          {{ formatMeetingDate(activity.startTime) }}
          <span v-if="activity.endTime" class="text-base-content/50">
            → {{ formatTime(activity.endTime) }}
          </span>
        </span>
      </div>
    </div>

    <!-- Description de la réunion -->
    <div v-if="activity.content" class="text-sm text-base-content/80">
      <p class="line-clamp-2">{{ activity.content }}</p>
    </div>

    <!-- Statut de la réunion -->
    <div v-if="meetingStatus" class="flex items-center gap-2">
      <div class="badge badge-sm" :class="meetingStatusClass">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="meetingStatus === 'upcoming'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            v-else-if="meetingStatus === 'ongoing'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-10-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ t(`meetings.status.${meetingStatus}`) }}
      </div>
    </div>

    <!-- Actions rapides spécifiques aux réunions -->
    <div class="flex gap-2 mt-2">
      <button
        v-if="
          meetingStatus === 'upcoming' && activity.meetingType === 'VIDEO_CALL' && activity.location
        "
        class="btn btn-xs btn-outline btn-primary"
        @click="openMeetingLink"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {{ t('meetings.joinMeeting') }}
      </button>

      <button
        v-if="meetingStatus === 'completed'"
        class="btn btn-xs btn-outline btn-secondary"
        @click="$emit('add-notes')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        {{ t('meetings.addNotes') }}
      </button>

      <button
        v-if="meetingStatus === 'upcoming'"
        class="btn btn-xs btn-outline btn-accent"
        @click="$emit('reschedule')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {{ t('meetings.reschedule') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps<{
  activity: Activity
  showMetrics?: boolean
}>()

// Emits
defineEmits<{
  'add-notes': []
  reschedule: []
}>()

// Computed
const meetingDuration = computed(() => {
  if (!props.activity.startTime || !props.activity.endTime) return null

  const start = new Date(props.activity.startTime)
  const end = new Date(props.activity.endTime)
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

const meetingStatus = computed(() => {
  if (!props.activity.startTime) return null

  const now = new Date()
  const start = new Date(props.activity.startTime)
  const end = props.activity.endTime
    ? new Date(props.activity.endTime)
    : new Date(start.getTime() + 60 * 60 * 1000) // 1h par défaut

  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'ongoing'
  return 'completed'
})

const meetingStatusClass = computed(() => {
  switch (meetingStatus.value) {
    case 'upcoming':
      return 'badge-info'
    case 'ongoing':
      return 'badge-warning'
    case 'completed':
      return 'badge-success'
    default:
      return 'badge-neutral'
  }
})

// Fonctions utilitaires
function formatMeetingDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function openMeetingLink() {
  if (props.activity.location) {
    window.open(props.activity.location, '_blank')
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
