<template>
  <div
    class="group relative bg-base-100 rounded-lg lg:rounded-xl border border-base-200/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] overflow-hidden"
  >
    <!-- Gradient de fond au hover - plus subtil -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    ></div>

    <div class="relative z-10 p-4 lg:p-6">
      <!-- En-tête avec icône et actions -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3 lg:gap-4">
          <!-- Avatar avec icône et couleur selon le type -->
          <div class="relative">
            <div
              class="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110"
              :class="{
                'bg-primary/20 text-primary': activity.type === 'CALL',
                'bg-secondary/20 text-secondary': activity.type === 'MEETING',
                'bg-accent/20 text-accent': activity.type === 'EMAIL',
                'bg-info/20 text-info': activity.type === 'TASK',
                'bg-warning/20 text-warning': activity.type === 'NOTE',
              }"
            >
              <ActivityIcon :type="activity.type as any" size="lg" />
            </div>
            <!-- Badge de statut en overlay -->
            <div class="absolute -top-1 -right-1">
              <ActivityStatusBadge :activity="activity" />
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h3
              class="font-bold text-base lg:text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200"
            >
              {{ activity.title }}
            </h3>
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 text-sm text-base-content/70 mt-2"
            >
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(activity.createdAt) }}
              </span>
              <span v-if="activity.assignedTo" class="flex items-center gap-1">
                <div
                  class="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold"
                >
                  {{ activity.assignedTo.firstName.charAt(0)
                  }}{{ activity.assignedTo.lastName.charAt(0) }}
                </div>
                <span class="hidden sm:inline"
                  >{{ activity.assignedTo.firstName }} {{ activity.assignedTo.lastName }}</span
                >
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions modernisées -->
        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ActivityQuickActions
            :activity="activity"
            @edit="$emit('edit', activity)"
            @delete="$emit('delete', activity)"
            @duplicate="$emit('duplicate', activity)"
          />
        </div>
      </div>

      <!-- Contenu spécialisé selon le type -->
      <div class="mb-4">
        <CallSummary v-if="activity.type === 'CALL'" :activity="activity" />
        <MeetingSummary
          v-else-if="activity.type === 'MEETING'"
          :activity="activity"
          @reschedule="$emit('edit', activity)"
        />
        <EmailSummary v-else-if="activity.type === 'EMAIL'" :activity="activity" />
        <div v-else>
          <p
            v-if="activity.content"
            class="text-sm text-base-content/80 line-clamp-3 leading-relaxed"
          >
            {{ activity.content }}
          </p>
          <p v-else class="text-sm text-base-content/50 italic flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t('activities.noDescription') }}
          </p>
        </div>
      </div>

      <!-- Tags et métadonnées modernisés -->
      <div class="flex flex-wrap gap-2 mb-4">
        <!-- Badge de priorité -->
        <div
          v-if="activity.priority && ['TASK', 'MEETING'].includes(activity.type)"
          class="badge badge-sm font-medium transition-all duration-200 hover:scale-105"
          :class="{
            'badge-error badge-outline': activity.priority === 'HIGH',
            'badge-warning badge-outline': activity.priority === 'MEDIUM',
            'badge-success badge-outline': activity.priority === 'LOW',
          }"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {{ t(`activities.priority.${activity.priority.toLowerCase()}`) }}
        </div>

        <!-- Badge de date d'échéance -->
        <div
          v-if="activity.dueDate && activity.type === 'TASK'"
          class="badge badge-sm font-medium transition-all duration-200 hover:scale-105"
          :class="{
            'badge-error badge-outline': isOverdue(activity.dueDate),
            'badge-warning badge-outline': isDueSoon(activity.dueDate),
            'badge-neutral badge-outline':
              !isOverdue(activity.dueDate) && !isDueSoon(activity.dueDate),
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

        <!-- Badge de progression pour les tâches -->
        <div
          v-if="activity.type === 'TASK' && activity.progress !== undefined"
          class="badge badge-sm font-medium badge-outline"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          {{ activity.progress }}%
        </div>
      </div>

      <!-- Liens vers entreprise/contact modernisés et responsive -->
      <div class="flex flex-col sm:flex-row gap-2 lg:gap-3 text-sm">
        <router-link
          v-if="activity.Company"
          :to="`/companies/${activity.Company.id}`"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200/50 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 group/link"
        >
          <div
            class="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center group-hover/link:scale-110 transition-transform duration-200"
          >
            <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <span class="font-medium truncate">{{ activity.Company.name }}</span>
        </router-link>

        <router-link
          v-if="activity.Contact"
          :to="`/contacts/${activity.Contact.id}`"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200/50 hover:bg-secondary/10 hover:text-secondary transition-all duration-200 hover:scale-105 group/link"
        >
          <div
            class="w-6 h-6 rounded-lg bg-secondary/20 flex items-center justify-center group-hover/link:scale-110 transition-transform duration-200"
          >
            <svg
              class="w-3 h-3 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <span class="font-medium truncate"
            >{{ activity.Contact.firstName }} {{ activity.Contact.lastName }}</span
          >
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
