<template>
  <dialog :open="isOpen" class="modal">
    <div class="modal-box w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">
        {{ isEditMode ? t('contacts.editContact') : t('contacts.add') }}
      </h2>

      <ContactForm
        :contact="contact"
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
import type { CompanyContact, ContactCreateDto, ContactUpdateDto } from '@/types/company.types'
import { useI18n } from 'vue-i18n'
import ContactForm from './ContactForm.vue'

const { t } = useI18n()

defineProps<{
  isOpen: boolean
  contact?: CompanyContact | null
  companyId: string
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: ContactCreateDto | (ContactUpdateDto & { id: string })]
}>()

function handleSubmit(data: ContactCreateDto | (ContactUpdateDto & { id: string })) {
  emit('submit', data)
}

function closeModal() {
  emit('close')
}
</script>
