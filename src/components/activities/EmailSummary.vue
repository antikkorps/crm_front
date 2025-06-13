<template>
  <div class="space-y-2">
    <!-- Informations principales -->
    <div class="flex items-center gap-3 text-sm">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="activity.emailStatus === 'DRAFT'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
          <path
            v-else-if="['SENT', 'OPENED'].includes(activity.emailStatus || '')"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
          <path
            v-else-if="activity.emailStatus === 'CLICKED'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span class="font-medium" :class="getStatusTextClass(activity.emailStatus || '')">
          {{
            activity.emailStatus
              ? t(`emails.status.${activity.emailStatus.toLowerCase()}`)
              : t('emails.status.unknown')
          }}
        </span>
      </div>

      <div v-if="activity.emailDirection" class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="activity.emailDirection === 'INBOUND'"
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
        <span>{{ t(`emails.direction.${activity.emailDirection.toLowerCase()}`) }}</span>
      </div>
    </div>

    <!-- Sujet de l'email -->
    <div v-if="activity.emailSubject" class="text-sm">
      <div class="flex items-start gap-2">
        <span class="text-xs text-base-content/60 uppercase">{{ t('emails.subject') }}:</span>
        <span class="font-medium">{{ activity.emailSubject }}</span>
      </div>
    </div>

    <!-- Contenu de l'email -->
    <div v-if="activity.content" class="text-sm text-base-content/80">
      <p class="line-clamp-3">{{ activity.content }}</p>
    </div>

    <!-- Métriques rapides -->
    <div v-if="showMetrics" class="flex gap-4 text-xs text-base-content/60">
      <span v-if="activity.createdAt">
        {{ formatTime(activity.createdAt) }}
      </span>
    </div>

    <!-- Actions rapides spécifiques aux emails -->
    <div class="flex gap-2 mt-2">
      <button
        v-if="activity.emailStatus === 'DRAFT'"
        class="btn btn-xs btn-outline btn-primary"
        @click="$emit('send')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        {{ t('emails.send') }}
      </button>

      <button
        v-if="['SENT', 'OPENED'].includes(activity.emailStatus || '')"
        class="btn btn-xs btn-outline btn-secondary"
        @click="$emit('reply')"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        {{ t('emails.reply') }}
      </button>

      <button class="btn btn-xs btn-outline btn-info" @click="$emit('forward')">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        {{ t('emails.forward') }}
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
  send: []
  reply: []
  forward: []
}>()

// Fonctions utilitaires
function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Classes CSS pour le badge de statut
function getStatusTextClass(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'text-warning'
    case 'SENT':
      return 'text-info'
    case 'OPENED':
      return 'text-primary'
    case 'CLICKED':
      return 'text-success'
    case 'BOUNCED':
      return 'text-error'
    default:
      return 'text-base-content'
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
