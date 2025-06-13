<template>
  <dialog :open="isOpen" class="modal">
    <div class="modal-box w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">
        {{ isEditMode ? t('notes.editNote') : t('notes.add') }}
      </h2>

      <NoteForm
        :note="note"
        :company-id="companyId"
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
import type { CompanyNote, CompanyNoteCreateDto } from '@/types/company.types'
import { useI18n } from 'vue-i18n'
import NoteForm from './NoteForm.vue'

const { t } = useI18n()

defineProps<{
  isOpen: boolean
  note?: CompanyNote | null
  companyId: string
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [data: CompanyNoteCreateDto | (CompanyNoteCreateDto & { id: string })]
  close: []
}>()

function handleSubmit(data: CompanyNoteCreateDto | (CompanyNoteCreateDto & { id: string })) {
  emit('submit', data)
}

function closeModal() {
  emit('close')
}
</script>
