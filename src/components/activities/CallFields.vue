<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Direction de l'appel -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('calls.direction') }} *</span>
      </label>
      <select
        :model-value="modelValue.callDirection"
        @update:model-value="updateField('callDirection', $event)"
        class="select select-bordered w-full"
        required
      >
        <option value="">{{ t('common.select') }}</option>
        <option value="INBOUND">{{ t('calls.direction.incoming') }}</option>
        <option value="OUTBOUND">{{ t('calls.direction.outgoing') }}</option>
      </select>
    </div>

    <!-- Durée de l'appel -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{ t('calls.duration') }}</span>
      </label>
      <div class="input-group">
        <input
          :model-value="modelValue.duration || ''"
          @input="
            updateField(
              'duration',
              ($event.target as HTMLInputElement)?.value
                ? parseInt(($event.target as HTMLInputElement).value)
                : null,
            )
          "
          type="number"
          min="0"
          class="input input-bordered flex-1"
          :placeholder="t('calls.durationPlaceholder')"
        />
        <span class="input-group-text">{{ t('calls.minutes') }}</span>
      </div>
    </div>

    <!-- Résultat de l'appel -->
    <div class="form-control md:col-span-2">
      <label class="label">
        <span class="label-text">{{ t('calls.outcome') }}</span>
      </label>
      <select
        :model-value="modelValue.callOutcome"
        @update:model-value="updateField('callOutcome', $event)"
        class="select select-bordered w-full"
      >
        <option value="">{{ t('common.select') }}</option>
        <option value="ANSWERED">{{ t('calls.outcome.answered') }}</option>
        <option value="NO_ANSWER">{{ t('calls.outcome.noAnswer') }}</option>
        <option value="BUSY">{{ t('calls.outcome.busy') }}</option>
        <option value="VOICEMAIL">{{ t('calls.outcome.voicemail') }}</option>
        <option value="CALLBACK_REQUESTED">{{ t('calls.outcome.callbackRequested') }}</option>
      </select>
    </div>

    <!-- Indicateurs visuels -->
    <div class="md:col-span-2">
      <div class="flex flex-wrap gap-2">
        <div
          v-if="modelValue.callDirection"
          class="badge"
          :class="{
            'badge-success': modelValue.callDirection === 'INBOUND',
            'badge-info': modelValue.callDirection === 'OUTBOUND',
          }"
        >
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="modelValue.callDirection === 'INBOUND'"
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
          {{ t(`calls.direction.${modelValue.callDirection.toLowerCase()}`) }}
        </div>

        <div v-if="modelValue.duration" class="badge badge-neutral">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ modelValue.duration }} {{ t('calls.minutes') }}
        </div>

        <div
          v-if="modelValue.callOutcome"
          class="badge"
          :class="{
            'badge-success': modelValue.callOutcome === 'ANSWERED',
            'badge-warning': ['NO_ANSWER', 'BUSY', 'VOICEMAIL'].includes(
              modelValue.callOutcome || '',
            ),
            'badge-info': modelValue.callOutcome === 'CALLBACK_REQUESTED',
          }"
        >
          {{ t(`calls.outcome.${modelValue.callOutcome.toLowerCase()}`) }}
        </div>
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

// Fonction utilitaire pour mettre à jour un champ
function updateField(field: string, value: unknown) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}
</script>
