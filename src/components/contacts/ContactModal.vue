<template>
  <dialog :open="isOpen" class="modal">
    <div class="modal-box w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">
        {{ isEditMode ? t('contacts.editContact') : t('contacts.add') }}
      </h2>

      <ContactForm
        :contact="contact"
        :company-id="companyId"
        :companies="companies"
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
import type { Contact, ContactCreateDto, ContactUpdateDto } from '@/types/contact.types'
import type { Company } from '@/types/company.types'
import { useI18n } from 'vue-i18n'
import ContactForm from './ContactForm.vue'

const { t } = useI18n()

defineProps<{
  isOpen: boolean
  contact?: Contact | null
  companyId: string
  companies: Company[]
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [data: any]
}>()

function handleSubmit(data: any) {
  emit('submit', data)
}

function closeModal() {
  emit('close')
}
</script>
