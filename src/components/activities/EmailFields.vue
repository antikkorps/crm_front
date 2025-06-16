<template>
  <div class="grid grid-cols-1 gap-4">
    <!-- Sujet de l'email -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('emails.subject') }} *</span>
      </label>
      <input
        :model-value="modelValue.emailSubject || ''"
        @input="updateField('emailSubject', ($event.target as HTMLInputElement)?.value)"
        type="text"
        class="input input-bordered w-full"
        :placeholder="t('emails.subjectPlaceholder')"
        required
      />
    </div>

    <!-- Direction de l'email -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('emails.direction') }}</span>
      </label>
      <select
        :model-value="modelValue.emailDirection"
        @update:model-value="updateField('emailDirection', $event)"
        class="select select-bordered w-full"
      >
        <option value="">{{ t('common.select') }}</option>
        <option value="INBOUND">{{ t('emails.direction.inbound') }}</option>
        <option value="OUTBOUND">{{ t('emails.direction.outbound') }}</option>
      </select>
    </div>

    <!-- Statut de l'email -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('emails.status') }} *</span>
      </label>
      <select
        :model-value="modelValue.emailStatus"
        @update:model-value="updateField('emailStatus', $event)"
        class="select select-bordered w-full"
        required
      >
        <option value="">{{ t('common.select') }}</option>
        <option value="DRAFT">{{ t('emails.status.draft') }}</option>
        <option value="SENT">{{ t('emails.status.sent') }}</option>
        <option value="OPENED">{{ t('emails.status.opened') }}</option>
        <option value="CLICKED">{{ t('emails.status.clicked') }}</option>
        <option value="BOUNCED">{{ t('emails.status.bounced') }}</option>
      </select>
    </div>

    <!-- Date d'envoi (si statut différent de DRAFT) -->
    <div v-if="modelValue.emailStatus && modelValue.emailStatus !== 'DRAFT'" class="form-control">
      <label class="label">
        <span class="label-text">{{ t('emails.sentDate') }}</span>
      </label>
      <input
        :model-value="modelValue.startTime || ''"
        @input="updateField('startTime', ($event.target as HTMLInputElement)?.value)"
        type="datetime-local"
        class="input input-bordered w-full"
      />
    </div>

    <!-- Indicateurs visuels -->
    <div class="flex flex-wrap gap-2">
      <div
        v-if="modelValue.emailStatus"
        class="badge"
        :class="getStatusBadgeClass(modelValue.emailStatus)"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="modelValue.emailStatus === 'DRAFT'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
          <path
            v-else-if="['SENT'].includes(modelValue.emailStatus)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
          <path
            v-else-if="modelValue.emailStatus === 'OPENED'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
          <path
            v-else-if="modelValue.emailStatus === 'CLICKED'"
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {{ t(`emails.status.${modelValue.emailStatus.toLowerCase()}`) }}
      </div>

      <div
        v-if="modelValue.emailDirection"
        class="badge"
        :class="{
          'badge-success': modelValue.emailDirection === 'INBOUND',
          'badge-info': modelValue.emailDirection === 'OUTBOUND',
        }"
      >
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="modelValue.emailDirection === 'INBOUND'"
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
        {{ t(`emails.direction.${modelValue.emailDirection.toLowerCase()}`) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreateActivityDto } from '@/types/activity.types'
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

// Computed - Aucun pour le moment

// Fonction utilitaire pour mettre à jour un champ
function updateField(field: string, value: unknown) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

// Classes CSS pour le badge de statut
function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'badge-warning'
    case 'SENT':
      return 'badge-info'
    case 'OPENED':
      return 'badge-primary'
    case 'CLICKED':
      return 'badge-success'
    case 'BOUNCED':
      return 'badge-error'
    default:
      return 'badge-neutral'
  }
}
</script>
