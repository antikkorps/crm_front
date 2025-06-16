<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- En-tête avec icône -->
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold">
          {{ isEditMode ? t('activities.edit.call') : t('activities.new.call') }}
        </h3>
        <p class="text-sm text-base-content/70">{{ t('activities.callDescription') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Colonne gauche - Informations principales -->
      <div class="space-y-4">
        <!-- Titre -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('common.title') }} *</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="input input-bordered w-full"
            :placeholder="t('activities.callTitlePlaceholder')"
            required
          />
        </div>

        <!-- Contact appelé -->
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

        <!-- Numéro de téléphone -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.call.phoneNumber') }}</span>
          </label>
          <input
            v-model="formData.callPhoneNumber"
            type="tel"
            class="input input-bordered w-full"
            :placeholder="t('activities.call.phoneNumberPlaceholder')"
          />
        </div>

        <!-- Type d'appel -->
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
      </div>

      <!-- Colonne droite - Résultat et assignation -->
      <div class="space-y-4">
        <!-- Résultat de l'appel -->
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
            <option value="WRONG_NUMBER">{{ t('activities.call.outcomes.wrongNumber') }}</option>
          </select>
        </div>

        <!-- Durée -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.call.duration') }}</span>
          </label>
          <div class="flex gap-2">
            <input
              v-model.number="callDurationMinutes"
              type="number"
              min="0"
              max="59"
              class="input input-bordered w-20"
              placeholder="0"
            />
            <span class="flex items-center text-sm text-base-content/70">min</span>
            <input
              v-model.number="callDurationSeconds"
              type="number"
              min="0"
              max="59"
              class="input input-bordered w-20"
              placeholder="0"
            />
            <span class="flex items-center text-sm text-base-content/70">sec</span>
          </div>
        </div>

        <!-- Assigné à -->
        <div class="form-control">
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

        <!-- Date et heure -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.call.dateTime') }}</span>
          </label>
          <input
            v-model="formData.startTime"
            type="datetime-local"
            class="input input-bordered w-full"
          />
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('activities.call.notes') }}</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-32"
        :placeholder="t('activities.call.notesPlaceholder')"
      ></textarea>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-3 pt-6 border-t border-base-200">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ isEditMode ? t('common.update') : t('common.create') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Activity, CreateActivityDto, UpdateActivityDto } from '@/types/activity.types'
import type { User } from '@/types/auth.types'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  activity?: Activity | null
  availableUsers?: User[]
  isEditMode?: boolean
}>()

const emit = defineEmits<{
  save: [data: CreateActivityDto | UpdateActivityDto]
  cancel: []
}>()

// État du formulaire
const formData = ref({
  type: 'CALL' as const,
  title: '',
  content: '',
  assignedToId: '',
  callContact: '',
  callPhoneNumber: '',
  callDirection: 'OUTBOUND' as 'INBOUND' | 'OUTBOUND',
  callOutcome: '',
  duration: 0,
  startTime: '',
})

// Gestion de la durée
const callDurationMinutes = ref(0)
const callDurationSeconds = ref(0)

// Initialiser le formulaire si on édite
if (props.activity) {
  // Mapping des champs de l'activité vers le formulaire
  formData.value = {
    ...formData.value,
    title: props.activity.title || '',
    content: props.activity.content || '',
    assignedToId: props.activity.assignedToId || '',
    callContact: props.activity.callContact || '',
    callPhoneNumber: props.activity.callPhoneNumber || '',
    callDirection: (props.activity.callDirection as 'INBOUND' | 'OUTBOUND') || 'OUTBOUND',
    callOutcome: props.activity.callOutcome || '',
    startTime: props.activity.startTime || '',
    duration: props.activity.duration || 0,
  }

  // Convertir la durée
  if (props.activity.duration) {
    const totalSeconds = props.activity.duration
    callDurationMinutes.value = Math.floor(totalSeconds / 60)
    callDurationSeconds.value = totalSeconds % 60
  }
}

// Mettre à jour la durée totale quand les minutes/secondes changent
watch([callDurationMinutes, callDurationSeconds], () => {
  formData.value.duration = callDurationMinutes.value * 60 + callDurationSeconds.value
})

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.title.trim().length > 0
})

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  const data = { ...formData.value } as Record<string, unknown>

  // Nettoyer les champs vides
  const fieldsToClean = [
    'assignedToId',
    'callContact',
    'callPhoneNumber',
    'callOutcome',
    'startTime',
  ]
  fieldsToClean.forEach((field) => {
    if (data[field] === '') {
      delete data[field]
    }
  })

  emit('save', data as CreateActivityDto | UpdateActivityDto)
}
</script>
