<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- En-tête dynamique selon le type -->
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getHeaderStyle()">
        <ActivityIcon :type="activityType" size="md" />
      </div>
      <div>
        <h3 class="text-lg font-semibold">{{ getFormTitle() }}</h3>
        <p class="text-sm text-base-content/70">{{ getFormDescription() }}</p>
      </div>
    </div>

    <!-- Titre (commun à tous) -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ getTitleLabel() }} *</span>
      </label>
      <input
        v-model="formData.title"
        type="text"
        class="input input-bordered w-full"
        :placeholder="getTitlePlaceholder()"
        required
      />
    </div>

    <!-- Champs spécialisés -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Colonne gauche -->
      <div class="space-y-4">
        <!-- Champs pour CALL -->
        <template v-if="activityType === 'CALL'">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.call.contact') }}</span>
            </label>
            <input
              v-model="formData.callContact"
              type="text"
              class="input input-bordered w-full"
              :placeholder="t('activities.call.contactPlaceholder')"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.call.direction') }}</span>
            </label>
            <div class="flex gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.callDirection"
                  type="radio"
                  value="OUTBOUND"
                  class="radio radio-primary radio-sm"
                />
                <span class="text-sm">{{ t('activities.call.outbound') }}</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.callDirection"
                  type="radio"
                  value="INBOUND"
                  class="radio radio-primary radio-sm"
                />
                <span class="text-sm">{{ t('activities.call.inbound') }}</span>
              </label>
            </div>
          </div>
        </template>

        <!-- Champs pour MEETING -->
        <template v-if="activityType === 'MEETING'">
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

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium"
                >{{ t('activities.meeting.startDateTime') }} *</span
              >
            </label>
            <input
              v-model="formData.meetingStartDate"
              type="datetime-local"
              class="input input-bordered w-full"
              required
            />
          </div>
        </template>

        <!-- Champs pour EMAIL -->
        <template v-if="activityType === 'EMAIL'">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.email.direction') }}</span>
            </label>
            <div class="flex gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.emailDirection"
                  type="radio"
                  value="SENT"
                  class="radio radio-accent radio-sm"
                />
                <span class="text-sm">{{ t('activities.email.sent') }}</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.emailDirection"
                  type="radio"
                  value="RECEIVED"
                  class="radio radio-accent radio-sm"
                />
                <span class="text-sm">{{ t('activities.email.received') }}</span>
              </label>
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                {{
                  formData.emailDirection === 'SENT'
                    ? t('activities.email.to')
                    : t('activities.email.from')
                }}
              </span>
            </label>
            <input
              v-model="formData.emailRecipient"
              type="email"
              class="input input-bordered w-full"
              :placeholder="
                formData.emailDirection === 'SENT' ? 'contact@example.com' : 'sender@example.com'
              "
            />
          </div>
        </template>

        <!-- Champs pour TASK -->
        <template v-if="activityType === 'TASK'">
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

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.task.dueDate') }}</span>
            </label>
            <input v-model="formData.dueDate" type="date" class="input input-bordered w-full" />
          </div>
        </template>
      </div>

      <!-- Colonne droite -->
      <div class="space-y-4">
        <!-- Assignation (sauf pour NOTE) -->
        <div v-if="activityType !== 'NOTE'" class="form-control">
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

        <!-- Champs spécifiques à droite -->
        <template v-if="activityType === 'CALL'">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.call.outcome') }}</span>
            </label>
            <select v-model="formData.callOutcome" class="select select-bordered w-full">
              <option value="">{{ t('common.select') }}</option>
              <option value="ANSWERED">{{ t('activities.call.outcomes.answered') }}</option>
              <option value="NO_ANSWER">{{ t('activities.call.outcomes.noAnswer') }}</option>
              <option value="BUSY">{{ t('activities.call.outcomes.busy') }}</option>
              <option value="LEFT_MESSAGE">{{ t('activities.call.outcomes.leftMessage') }}</option>
            </select>
          </div>
        </template>

        <template v-if="activityType === 'MEETING'">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.meeting.endDateTime') }}</span>
            </label>
            <input
              v-model="formData.meetingEndDate"
              type="datetime-local"
              class="input input-bordered w-full"
            />
          </div>
        </template>

        <template v-if="activityType === 'EMAIL'">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('activities.email.status') }}</span>
            </label>
            <select v-model="formData.emailStatus" class="select select-bordered w-full">
              <option value="">{{ t('common.select') }}</option>
              <option value="DRAFT">{{ t('activities.email.statuses.draft') }}</option>
              <option value="SENT">{{ t('activities.email.statuses.sent') }}</option>
              <option value="DELIVERED">{{ t('activities.email.statuses.delivered') }}</option>
              <option value="READ">{{ t('activities.email.statuses.read') }}</option>
            </select>
          </div>
        </template>
      </div>
    </div>

    <!-- Contenu/Description -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ getContentLabel() }}</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-32"
        :placeholder="getContentPlaceholder()"
        :required="activityType === 'NOTE'"
      ></textarea>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-3 pt-6 border-t border-base-200">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn" :class="getButtonClass()" :disabled="!isFormValid">
        <ActivityIcon :type="activityType" size="sm" class="mr-2" />
        {{ isEditMode ? t('common.update') : t('common.create') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ActivityType } from '@/types/activity.types'
import type { User } from '@/types/auth.types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ActivityIcon from '../ActivityIcon.vue'

const { t } = useI18n()

const props = defineProps<{
  activityType: ActivityType
  activity?: Record<string, unknown>
  availableUsers?: User[]
  isEditMode?: boolean
}>()

const emit = defineEmits<{
  save: [data: Record<string, unknown>]
  cancel: []
}>()

// État du formulaire - structure flexible
const formData = ref({
  type: props.activityType,
  title: '',
  content: '',
  assignedToId: '',
  // Champs CALL
  callContact: '',
  callDirection: 'OUTBOUND',
  callOutcome: '',
  // Champs MEETING
  meetingType: '',
  meetingStartDate: '',
  meetingEndDate: '',
  // Champs EMAIL
  emailDirection: 'SENT',
  emailRecipient: '',
  emailStatus: '',
  // Champs TASK
  priority: 'MEDIUM',
  dueDate: '',
})

// Initialiser avec les données existantes si en édition
if (props.activity) {
  Object.assign(formData.value, props.activity)
}

// Validation
const isFormValid = computed(() => {
  const hasTitle = formData.value.title.trim().length > 0
  if (props.activityType === 'NOTE') {
    return hasTitle && formData.value.content.trim().length > 0
  }
  if (props.activityType === 'MEETING') {
    return hasTitle && formData.value.meetingStartDate
  }
  return hasTitle
})

// Méthodes d'aide pour l'interface
function getHeaderStyle() {
  const styles = {
    CALL: 'bg-primary/10',
    MEETING: 'bg-secondary/10',
    EMAIL: 'bg-accent/10',
    TASK: 'bg-info/10',
    NOTE: 'bg-warning/10',
  }
  return styles[props.activityType]
}

function getButtonClass() {
  const classes = {
    CALL: 'btn-primary',
    MEETING: 'btn-secondary',
    EMAIL: 'btn-accent',
    TASK: 'btn-info',
    NOTE: 'btn-warning',
  }
  return classes[props.activityType]
}

function getFormTitle() {
  const prefix = props.isEditMode ? 'edit' : 'new'
  return t(`activities.${prefix}.${props.activityType.toLowerCase()}`)
}

function getFormDescription() {
  return t(`activities.${props.activityType.toLowerCase()}Description`)
}

function getTitleLabel() {
  if (props.activityType === 'EMAIL') return t('activities.email.subject')
  return t('common.title')
}

function getTitlePlaceholder() {
  return t(`activities.${props.activityType.toLowerCase()}TitlePlaceholder`)
}

function getContentLabel() {
  const labels = {
    CALL: t('activities.call.notes'),
    MEETING: t('activities.meeting.agenda'),
    EMAIL: t('activities.email.content'),
    TASK: t('common.description'),
    NOTE: t('common.content'),
  }
  return labels[props.activityType]
}

function getContentPlaceholder() {
  return t(`activities.${props.activityType.toLowerCase()}ContentPlaceholder`)
}

// Soumission
function handleSubmit() {
  if (!isFormValid.value) return

  // Créer l'objet de données en ne gardant que les champs pertinents
  const data: Record<string, unknown> = {
    type: props.activityType,
    title: formData.value.title,
    content: formData.value.content || null,
  }

  // Ajouter les champs selon le type
  if (props.activityType !== 'NOTE' && formData.value.assignedToId) {
    data.assignedToId = formData.value.assignedToId
  }

  // Champs spécifiques par type
  switch (props.activityType) {
    case 'CALL':
      if (formData.value.callContact) data.callContact = formData.value.callContact
      if (formData.value.callDirection) data.callDirection = formData.value.callDirection
      if (formData.value.callOutcome) data.callOutcome = formData.value.callOutcome
      break
    case 'MEETING':
      if (formData.value.meetingType) data.meetingType = formData.value.meetingType
      if (formData.value.meetingStartDate) data.meetingStartDate = formData.value.meetingStartDate
      if (formData.value.meetingEndDate) data.meetingEndDate = formData.value.meetingEndDate
      if (formData.value.priority) data.priority = formData.value.priority
      break
    case 'EMAIL':
      if (formData.value.emailDirection) data.emailDirection = formData.value.emailDirection
      if (formData.value.emailRecipient) data.emailRecipient = formData.value.emailRecipient
      if (formData.value.emailStatus) data.emailStatus = formData.value.emailStatus
      break
    case 'TASK':
      if (formData.value.priority) data.priority = formData.value.priority
      if (formData.value.dueDate) data.dueDate = formData.value.dueDate
      break
  }

  emit('save', data)
}
</script>
