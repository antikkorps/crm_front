<template>
  <div class="space-y-2">
    <!-- Informations principales -->
    <div class="flex items-center gap-3 text-sm">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="activity.callDirection === 'INBOUND'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        <span class="font-medium">
          {{ t(`calls.direction.${activity.callDirection?.toLowerCase()}`) }}
        </span>
      </div>

      <div v-if="activity.duration" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ activity.duration }} {{ t('calls.minutes') }}</span>
      </div>

      <div v-if="activity.callOutcome" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="activity.callOutcome === 'ANSWERED'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            v-else-if="activity.callOutcome === 'NO_ANSWER'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
          />
          <path
            v-else-if="activity.callOutcome === 'VOICEMAIL'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span
          :class="{
            'text-success': activity.callOutcome === 'ANSWERED',
            'text-warning': ['NO_ANSWER', 'BUSY', 'VOICEMAIL'].includes(activity.callOutcome || ''),
            'text-info': activity.callOutcome === 'CALLBACK_REQUESTED',
          }"
        >
          {{ t(`calls.outcome.${activity.callOutcome.toLowerCase()}`) }}
        </span>
      </div>
    </div>

    <!-- Description de l'appel -->
    <div v-if="activity.content" class="text-sm text-base-content/80">
      <p class="line-clamp-2">{{ activity.content }}</p>
    </div>

    <!-- Métriques rapides -->
    <div v-if="showMetrics" class="flex gap-4 text-xs text-base-content/60">
      <span v-if="activity.duration">
        {{ formatDuration(activity.duration) }}
      </span>
      <span v-if="activity.createdAt">
        {{ formatTime(activity.createdAt) }}
      </span>
    </div>

    <!-- Actions rapides spécifiques aux appels -->
    <div class="flex gap-2 mt-2">
      <button
        v-if="activity.callOutcome === 'NO_ANSWER' || activity.callOutcome === 'BUSY'"
        class="btn btn-xs btn-outline btn-primary"
        @click="$emit('callback')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        {{ t('calls.callback') }}
      </button>

      <button
        v-if="activity.callDirection === 'INBOUND'"
        class="btn btn-xs btn-outline btn-secondary"
        @click="$emit('follow-up')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        {{ t('calls.followUp') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
defineProps<{
  activity: Activity
  showMetrics?: boolean
}>()

// Emits
defineEmits<{
  callback: []
  'follow-up': []
}>()

// Fonctions utilitaires
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
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
</style>
