<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-square">
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
      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow border border-base-200"
    >
      <!-- Actions générales -->
      <li>
        <a @click="$emit('edit')" class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {{ t('common.edit') }}
        </a>
      </li>

      <li>
        <a @click="$emit('duplicate')" class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {{ t('common.duplicate') }}
        </a>
      </li>

      <!-- Actions spécifiques selon le type -->
      <template v-if="activity.type === 'CALL'">
        <li v-if="activity.callOutcome && ['NO_ANSWER', 'BUSY'].includes(activity.callOutcome)">
          <a @click="$emit('callback')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {{ t('calls.callback') }}
          </a>
        </li>
        <li>
          <a @click="$emit('schedule-follow-up')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ t('calls.scheduleFollowUp') }}
          </a>
        </li>
      </template>

      <template v-if="activity.type === 'EMAIL'">
        <li v-if="activity.emailStatus === 'DRAFT'">
          <a @click="$emit('send-email')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            {{ t('emails.send') }}
          </a>
        </li>
        <li v-if="activity.emailStatus && ['DELIVERED', 'OPENED'].includes(activity.emailStatus)">
          <a @click="$emit('reply')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            {{ t('emails.reply') }}
          </a>
        </li>
        <li>
          <a @click="$emit('forward')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            {{ t('emails.forward') }}
          </a>
        </li>
      </template>

      <template v-if="activity.type === 'MEETING'">
        <li v-if="isMeetingUpcoming">
          <a @click="$emit('reschedule')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ t('meetings.reschedule') }}
          </a>
        </li>
        <li v-if="activity.meetingType === 'VIDEO_CALL' && activity.location">
          <a @click="openMeetingLink" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {{ t('meetings.joinMeeting') }}
          </a>
        </li>
        <li>
          <a @click="$emit('add-notes')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {{ t('meetings.addNotes') }}
          </a>
        </li>
      </template>

      <template v-if="activity.type === 'TASK'">
        <li v-if="!isTaskCompleted">
          <a @click="$emit('mark-complete')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ t('tasks.markComplete') }}
          </a>
        </li>
        <li>
          <a @click="$emit('change-due-date')" class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ t('tasks.changeDueDate') }}
          </a>
        </li>
      </template>

      <!-- Séparateur -->
      <div class="divider my-1"></div>

      <!-- Actions d'export/partage -->
      <li>
        <a @click="$emit('export')" class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {{ t('common.export') }}
        </a>
      </li>

      <li>
        <a @click="$emit('share')" class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          {{ t('common.share') }}
        </a>
      </li>

      <!-- Séparateur -->
      <div class="divider my-1"></div>

      <!-- Action de suppression -->
      <li>
        <a @click="$emit('delete')" class="flex items-center gap-2 text-error">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {{ t('common.delete') }}
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
