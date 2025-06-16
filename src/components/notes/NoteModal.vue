<template>
  <dialog :open="isOpen" class="modal">
    <div class="modal-box w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">
        {{ isEditMode ? t('notes.editNote') : t('notes.add') }}
      </h2>

      <NoteForm
        :note="note"
        :company-id="companyId"
        :contact-id="contactId"
        :is-edit-mode="isEditMode"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">{{ t('common.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { NoteCreateDto, NoteUpdateDto } from '@/services/note.service'
import type { Activity } from '@/types/activity.types'
import { useI18n } from 'vue-i18n'
import NoteForm from './NoteForm.vue'

const { t } = useI18n()

defineProps<{
  isOpen: boolean
  note?: Activity | null
  companyId?: string
  contactId?: string
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [data: NoteCreateDto | (NoteUpdateDto & { id: string })]
  close: []
}>()

function handleSubmit(data: NoteCreateDto | (NoteUpdateDto & { id: string })) {
  emit('submit', data)
}

function closeModal() {
  emit('close')
}
</script>
