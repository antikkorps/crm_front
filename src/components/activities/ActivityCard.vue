<template>
  <div class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
    <div class="card-body p-4">
      <!-- En-tête avec icône et actions -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <ActivityIcon :type="activity.type as any" size="md" />
          <div class="flex-1">
            <h3 class="font-semibold text-base line-clamp-1">{{ activity.title }}</h3>
            <div class="flex items-center gap-2 text-sm text-base-content/70 mt-1">
              <span>{{ formatDate(activity.createdAt) }}</span>
              <span v-if="activity.assignedTo" class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {{ activity.assignedTo.firstName }} {{ activity.assignedTo.lastName }}
              </span>
            </div>
          </div>
        </div>

        <ActivityQuickActions
          :activity="activity"
          @edit="$emit('edit', activity)"
          @delete="$emit('delete', activity)"
          @duplicate="$emit('duplicate', activity)"
        />
      </div>

      <!-- Contenu spécialisé selon le type -->
      <div class="mb-3">
        <CallSummary v-if="activity.type === 'CALL'" :activity="activity" />
        <MeetingSummary v-else-if="activity.type === 'MEETING'" :activity="activity" />
        <EmailSummary v-else-if="activity.type === 'EMAIL'" :activity="activity" />
        <div v-else>
          <p v-if="activity.content" class="text-sm text-base-content/80 line-clamp-3">
            {{ activity.content }}
          </p>
          <p v-else class="text-sm text-base-content/50 italic">
            {{ t('activities.noDescription') }}
          </p>
        </div>
      </div>

      <!-- Tags et métadonnées -->
      <div class="flex flex-wrap gap-2 mb-3">
        <ActivityStatusBadge :activity="activity" />

        <div
          v-if="activity.priority && ['TASK', 'MEETING'].includes(activity.type)"
          class="badge"
          :class="{
            'badge-error': activity.priority === 'HIGH',
            'badge-warning': activity.priority === 'MEDIUM',
            'badge-success': activity.priority === 'LOW',
          }"
        >
          {{ t(`activities.priority.${activity.priority.toLowerCase()}`) }}
        </div>

        <div
          v-if="activity.dueDate && activity.type === 'TASK'"
          class="badge"
          :class="{
            'badge-error': isOverdue(activity.dueDate),
            'badge-warning': isDueSoon(activity.dueDate),
            'badge-neutral': !isOverdue(activity.dueDate) && !isDueSoon(activity.dueDate),
          }"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {{ formatDate(activity.dueDate) }}
        </div>
      </div>

      <!-- Liens vers entreprise/contact -->
      <div class="flex flex-wrap gap-2 text-xs">
        <router-link
          v-if="activity.Company"
          :to="`/companies/${activity.Company.id}`"
          class="link link-primary hover:link-accent"
        >
          <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          {{ activity.Company.name }}
        </router-link>

        <router-link
          v-if="activity.Contact"
          :to="`/contacts/${activity.Contact.id}`"
          class="link link-secondary hover:link-accent"
        >
          <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {{ activity.Contact.firstName }} {{ activity.Contact.lastName }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { formatDate } from '@/utils/date'
import { useI18n } from 'vue-i18n'
import ActivityIcon from './ActivityIcon.vue'
import ActivityQuickActions from './ActivityQuickActions.vue'
import ActivityStatusBadge from './ActivityStatusBadge.vue'
import CallSummary from './CallSummary.vue'
import EmailSummary from './EmailSummary.vue'
import MeetingSummary from './MeetingSummary.vue'

const { t } = useI18n()

// Props
defineProps<{
  activity: Activity
}>()

// Emits
defineEmits<{
  edit: [activity: Activity]
  delete: [activity: Activity]
  duplicate: [activity: Activity]
}>()

// Fonctions utilitaires pour les dates
function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

function isDueSoon(dueDate: string): boolean {
  const due = new Date(dueDate)
  const now = new Date()
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays >= 0
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
