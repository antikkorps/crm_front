<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-sm btn-square hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
        />
      </svg>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-xl z-[1] w-56 p-2 shadow-2xl border border-base-200"
    >
      <!-- Actions principales -->
      <div class="px-2 py-1">
        <div class="text-xs font-medium text-base-content/50 uppercase tracking-wider">
          {{ t('common.actions') }}
        </div>
      </div>

      <li>
        <a
          @click="$emit('edit')"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
        >
          <div
            class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          >
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ t('common.edit') }}</div>
            <div class="text-xs text-base-content/60">{{ t('common.editDesc') }}</div>
          </div>
        </a>
      </li>

      <li>
        <a
          @click="$emit('duplicate')"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/10 transition-all duration-200 group"
        >
          <div
            class="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          >
            <svg
              class="w-4 h-4 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ t('common.duplicate') }}</div>
            <div class="text-xs text-base-content/60">{{ t('common.duplicateDesc') }}</div>
          </div>
        </a>
      </li>

      <!-- Actions spécifiques selon le type -->
      <template v-if="activity.type === 'CALL'">
        <div class="divider my-2"></div>
        <div class="px-2 py-1">
          <div class="text-xs font-medium text-base-content/50 uppercase tracking-wider">
            {{ t('calls.actions') }}
          </div>
        </div>

        <li v-if="activity.callOutcome && ['NO_ANSWER', 'BUSY'].includes(activity.callOutcome)">
          <a
            @click="$emit('callback')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('calls.callback') }}</div>
              <div class="text-xs text-base-content/60">{{ t('calls.callbackDesc') }}</div>
            </div>
          </a>
        </li>
        <li>
          <a
            @click="$emit('schedule-follow-up')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-info/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('calls.scheduleFollowUp') }}</div>
              <div class="text-xs text-base-content/60">{{ t('calls.scheduleFollowUpDesc') }}</div>
            </div>
          </a>
        </li>
      </template>

      <template v-if="activity.type === 'EMAIL'">
        <div class="divider my-2"></div>
        <div class="px-2 py-1">
          <div class="text-xs font-medium text-base-content/50 uppercase tracking-wider">
            {{ t('emails.actions') }}
          </div>
        </div>

        <li v-if="activity.emailStatus === 'DRAFT'">
          <a
            @click="$emit('send-email')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-success/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('emails.send') }}</div>
              <div class="text-xs text-base-content/60">{{ t('emails.sendDesc') }}</div>
            </div>
          </a>
        </li>
        <li v-if="activity.emailStatus && ['DELIVERED', 'OPENED'].includes(activity.emailStatus)">
          <a
            @click="$emit('reply')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-warning/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('emails.reply') }}</div>
              <div class="text-xs text-base-content/60">{{ t('emails.replyDesc') }}</div>
            </div>
          </a>
        </li>
        <li>
          <a
            @click="$emit('forward')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('emails.forward') }}</div>
              <div class="text-xs text-base-content/60">{{ t('emails.forwardDesc') }}</div>
            </div>
          </a>
        </li>
      </template>

      <template v-if="activity.type === 'MEETING'">
        <div class="divider my-2"></div>
        <div class="px-2 py-1">
          <div class="text-xs font-medium text-base-content/50 uppercase tracking-wider">
            {{ t('meetings.actions') }}
          </div>
        </div>

        <li v-if="isMeetingUpcoming">
          <a
            @click="$emit('reschedule')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-info/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('meetings.reschedule') }}</div>
              <div class="text-xs text-base-content/60">{{ t('meetings.rescheduleDesc') }}</div>
            </div>
          </a>
        </li>
        <li v-if="activity.meetingType === 'VIDEO_CALL' && activity.location">
          <a
            @click="openMeetingLink"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-success/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('meetings.joinMeeting') }}</div>
              <div class="text-xs text-base-content/60">{{ t('meetings.joinMeetingDesc') }}</div>
            </div>
          </a>
        </li>
        <li>
          <a
            @click="$emit('add-notes')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-warning/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('meetings.addNotes') }}</div>
              <div class="text-xs text-base-content/60">{{ t('meetings.addNotesDesc') }}</div>
            </div>
          </a>
        </li>
      </template>

      <template v-if="activity.type === 'TASK'">
        <div class="divider my-2"></div>
        <div class="px-2 py-1">
          <div class="text-xs font-medium text-base-content/50 uppercase tracking-wider">
            {{ t('tasks.actions') }}
          </div>
        </div>

        <li v-if="!isTaskCompleted">
          <a
            @click="$emit('mark-complete')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-success/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg
                class="w-4 h-4 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('tasks.markComplete') }}</div>
              <div class="text-xs text-base-content/60">{{ t('tasks.markCompleteDesc') }}</div>
            </div>
          </a>
        </li>
        <li>
          <a
            @click="$emit('change-due-date')"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-info/10 transition-all duration-200 group"
          >
            <div
              class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            >
              <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div class="font-medium">{{ t('tasks.changeDueDate') }}</div>
              <div class="text-xs text-base-content/60">{{ t('tasks.changeDueDateDesc') }}</div>
            </div>
          </a>
        </li>
      </template>

      <!-- Actions d'export/partage -->
      <div class="divider my-2"></div>
      <div class="px-2 py-1">
        <div class="text-xs font-medium text-base-content/50 uppercase tracking-wider">
          {{ t('common.share') }}
        </div>
      </div>

      <li>
        <a
          @click="$emit('export')"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-all duration-200 group"
        >
          <div
            class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          >
            <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ t('common.export') }}</div>
            <div class="text-xs text-base-content/60">{{ t('common.exportDesc') }}</div>
          </div>
        </a>
      </li>

      <li>
        <a
          @click="$emit('share')"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
        >
          <div
            class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          >
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ t('common.share') }}</div>
            <div class="text-xs text-base-content/60">{{ t('common.shareDesc') }}</div>
          </div>
        </a>
      </li>

      <!-- Action de suppression -->
      <div class="divider my-2"></div>
      <li>
        <a
          @click="$emit('delete')"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-error/10 transition-all duration-200 group"
        >
          <div
            class="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
          >
            <svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div>
            <div class="font-medium text-error">{{ t('common.delete') }}</div>
            <div class="text-xs text-base-content/60">{{ t('common.deleteDesc') }}</div>
          </div>
        </a>
      </li>
    </ul>
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

// Emits
defineEmits<{
  edit: []
  delete: []
  duplicate: []
  callback: []
  'schedule-follow-up': []
  'send-email': []
  reply: []
  forward: []
  reschedule: []
  'add-notes': []
  'mark-complete': []
  'change-due-date': []
  export: []
  share: []
}>()

// Computed
const isMeetingUpcoming = computed(() => {
  if (props.activity.type !== 'MEETING' || !props.activity.startTime) return false
  return new Date(props.activity.startTime) > new Date()
})

const isTaskCompleted = computed(() => {
  if (props.activity.type !== 'TASK') return false
  return props.activity.taskStatus === 'COMPLETED'
})

// Méthodes
function openMeetingLink() {
  if (props.activity.location) {
    window.open(props.activity.location, '_blank')
  }
}
</script>
