<template>
  <div
    class="badge badge-sm font-medium transition-all duration-300 hover:scale-110 animate-pulse"
    :class="badgeClass"
  >
    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        v-if="getStatusIcon() === 'check'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else-if="getStatusIcon() === 'clock'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else-if="getStatusIcon() === 'warning'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
      <path
        v-else-if="getStatusIcon() === 'x'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        v-else-if="getStatusIcon() === 'mail'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
      <path
        v-else-if="getStatusIcon() === 'eye'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
      <path
        v-else-if="getStatusIcon() === 'reply'"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    {{ statusText }}
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
}>()

// Computed
const statusText = computed(() => {
  switch (props.activity.type) {
    case 'CALL':
      return props.activity.callOutcome
        ? t(`calls.outcome.${props.activity.callOutcome.toLowerCase()}`)
        : t('calls.outcome.unknown')

    case 'EMAIL':
      return props.activity.emailStatus
        ? t(`emails.status.${props.activity.emailStatus.toLowerCase()}`)
        : t('emails.status.unknown')

    case 'MEETING':
      if (!props.activity.startTime) return t('meetings.status.planned')
      const now = new Date()
      const start = new Date(props.activity.startTime)
      const end = props.activity.endTime
        ? new Date(props.activity.endTime)
        : new Date(start.getTime() + 60 * 60 * 1000)

      if (now < start) return t('meetings.status.upcoming')
      if (now >= start && now <= end) return t('meetings.status.ongoing')
      return t('meetings.status.completed')

    case 'TASK':
      if (!props.activity.dueDate) return t('tasks.status.noDue')
      const dueDate = new Date(props.activity.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)

      if (dueDate < today) return t('tasks.status.overdue')
      if (dueDate.getTime() === today.getTime()) return t('tasks.status.dueToday')
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 3) return t('tasks.status.dueSoon')
      return t('tasks.status.upcoming')

    case 'NOTE':
      return t('notes.status.saved')

    default:
      return t('activities.status.unknown')
  }
})

const badgeClass = computed(() => {
  switch (props.activity.type) {
    case 'CALL':
      switch (props.activity.callOutcome) {
        case 'ANSWERED':
          return 'badge-success bg-success/20 text-success border-success/30'
        case 'NO_ANSWER':
        case 'BUSY':
        case 'VOICEMAIL':
          return 'badge-warning bg-warning/20 text-warning border-warning/30'
        case 'CALLBACK_REQUESTED':
          return 'badge-info bg-info/20 text-info border-info/30'
        default:
          return 'badge-neutral bg-neutral/20 text-neutral border-neutral/30'
      }

    case 'EMAIL':
      switch (props.activity.emailStatus) {
        case 'DRAFT':
          return 'badge-warning bg-warning/20 text-warning border-warning/30'
        case 'SENT':
          return 'badge-info bg-info/20 text-info border-info/30'
        case 'OPENED':
          return 'badge-primary bg-primary/20 text-primary border-primary/30'
        case 'CLICKED':
          return 'badge-success bg-success/20 text-success border-success/30'
        case 'BOUNCED':
          return 'badge-error bg-error/20 text-error border-error/30'
        default:
          return 'badge-neutral bg-neutral/20 text-neutral border-neutral/30'
      }

    case 'MEETING':
      if (!props.activity.startTime)
        return 'badge-neutral bg-neutral/20 text-neutral border-neutral/30'
      const now = new Date()
      const start = new Date(props.activity.startTime)
      const end = props.activity.endTime
        ? new Date(props.activity.endTime)
        : new Date(start.getTime() + 60 * 60 * 1000)

      if (now < start) return 'badge-info bg-info/20 text-info border-info/30'
      if (now >= start && now <= end)
        return 'badge-warning bg-warning/20 text-warning border-warning/30'
      return 'badge-success bg-success/20 text-success border-success/30'

    case 'TASK':
      if (!props.activity.dueDate)
        return 'badge-neutral bg-neutral/20 text-neutral border-neutral/30'
      const dueDate = new Date(props.activity.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)

      if (dueDate < today) return 'badge-error bg-error/20 text-error border-error/30'
      if (dueDate.getTime() === today.getTime())
        return 'badge-warning bg-warning/20 text-warning border-warning/30'
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 3) return 'badge-warning bg-warning/20 text-warning border-warning/30'
      return 'badge-success bg-success/20 text-success border-success/30'

    case 'NOTE':
      return 'badge-accent bg-accent/20 text-accent border-accent/30'

    default:
      return 'badge-neutral bg-neutral/20 text-neutral border-neutral/30'
  }
})

// Méthodes
function getStatusIcon(): string {
  switch (props.activity.type) {
    case 'CALL':
      switch (props.activity.callOutcome) {
        case 'ANSWERED':
          return 'check'
        case 'NO_ANSWER':
        case 'BUSY':
          return 'x'
        case 'VOICEMAIL':
          return 'mail'
        case 'CALLBACK_REQUESTED':
          return 'reply'
        default:
          return 'question'
      }

    case 'EMAIL':
      switch (props.activity.emailStatus) {
        case 'DRAFT':
          return 'warning'
        case 'SENT':
          return 'mail'
        case 'OPENED':
          return 'eye'
        case 'CLICKED':
          return 'check'
        case 'BOUNCED':
          return 'x'
        default:
          return 'question'
      }

    case 'MEETING':
      if (!props.activity.startTime) return 'clock'
      const now = new Date()
      const start = new Date(props.activity.startTime)
      const end = props.activity.endTime
        ? new Date(props.activity.endTime)
        : new Date(start.getTime() + 60 * 60 * 1000)

      if (now < start) return 'clock'
      if (now >= start && now <= end) return 'warning'
      return 'check'

    case 'TASK':
      if (!props.activity.dueDate) return 'question'
      const dueDate = new Date(props.activity.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      dueDate.setHours(0, 0, 0, 0)

      if (dueDate < today) return 'x'
      if (dueDate.getTime() === today.getTime()) return 'warning'
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 3) return 'warning'
      return 'check'

    case 'NOTE':
      return 'check'

    default:
      return 'question'
  }
}
</script>

<style scoped>
.badge {
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
