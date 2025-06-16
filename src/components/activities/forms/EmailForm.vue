<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- En-tête avec icône -->
    <div class="flex items-center gap-3 pb-4 border-b border-base-200">
      <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
        <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-semibold">
          {{ isEditMode ? t('activities.edit.email') : t('activities.new.email') }}
        </h3>
        <p class="text-sm text-base-content/70">{{ t('activities.emailDescription') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Colonne gauche - Informations principales -->
      <div class="space-y-4">
        <!-- Objet -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.email.subject') }} *</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            class="input input-bordered w-full"
            :placeholder="t('activities.email.subjectPlaceholder')"
            required
          />
        </div>

        <!-- Direction de l'email -->
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

        <!-- Destinataire/Expéditeur -->
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
            :placeholder="getRecipientPlaceholder()"
          />
        </div>

        <!-- CC -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.email.cc') }}</span>
          </label>
          <input
            v-model="formData.emailCc"
            type="text"
            class="input input-bordered w-full"
            :placeholder="t('activities.email.ccPlaceholder')"
          />
        </div>
      </div>

      <!-- Colonne droite - Métadonnées -->
      <div class="space-y-4">
        <!-- Statut de l'email -->
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
            <option value="REPLIED">{{ t('activities.email.statuses.replied') }}</option>
            <option value="BOUNCED">{{ t('activities.email.statuses.bounced') }}</option>
          </select>
        </div>

        <!-- Date et heure -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.email.dateTime') }}</span>
          </label>
          <input
            v-model="formData.emailSentDate"
            type="datetime-local"
            class="input input-bordered w-full"
          />
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

        <!-- Pièces jointes -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('activities.email.attachments') }}</span>
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="attachmentCount"
              type="number"
              min="0"
              class="input input-bordered w-20"
              placeholder="0"
            />
            <span class="text-sm text-base-content/70">{{
              t('activities.email.attachmentCount')
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu de l'email -->
    <div class="form-control">
      <label class="label">
        <span class="label-text font-medium">{{ t('activities.email.content') }}</span>
      </label>
      <textarea
        v-model="formData.content"
        class="textarea textarea-bordered h-40"
        :placeholder="t('activities.email.contentPlaceholder')"
      ></textarea>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end gap-3 pt-6 border-t border-base-200">
      <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-accent" :disabled="!isFormValid">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
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
  type: 'EMAIL' as const,
  title: '',
  content: '',
  assignedToId: '',
  emailDirection: 'SENT' as 'SENT' | 'RECEIVED',
  emailRecipient: '',
  emailCc: '',
  emailStatus: '',
  emailSentDate: '',
  emailAttachments: 0,
})

// Nombre de pièces jointes (pour faciliter la saisie)
const attachmentCount = ref(0)

// Initialiser le formulaire si on édite
if (props.activity) {
  Object.assign(formData.value, props.activity)
  attachmentCount.value = props.activity.emailAttachments || 0
}

// Mettre à jour le nombre de pièces jointes
watch(attachmentCount, () => {
  formData.value.emailAttachments = attachmentCount.value
})

// Validation du formulaire
const isFormValid = computed(() => {
  return formData.value.title.trim().length > 0
})

// Placeholder dynamique pour le destinataire
function getRecipientPlaceholder() {
  return formData.value.emailDirection === 'SENT'
    ? t('activities.email.toPlaceholder')
    : t('activities.email.fromPlaceholder')
}

// Soumission du formulaire
function handleSubmit() {
  if (!isFormValid.value) return

  const data = { ...formData.value } as Record<string, unknown>

  // Nettoyer les champs vides
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || data[key] === 0) {
      delete data[key]
    }
  })

  emit('save', data as CreateActivityDto | UpdateActivityDto)
}
</script>
