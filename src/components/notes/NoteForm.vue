<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Section: Contenu de la note -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-6">
        <h3 class="card-title text-lg mb-4">
          <Iconify icon="mdi:note-text" class="w-5 h-5" />
          {{ t('notes.content') }}
        </h3>

        <!-- Contenu de la note -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">
              {{ t('notes.contentLabel') }} <span class="text-error">*</span>
            </span>
          </label>
          <textarea
            v-model="formData.content"
            class="textarea textarea-bordered w-full h-32"
            :class="{ 'textarea-error': errors.content }"
            :placeholder="t('notes.contentPlaceholder', 'Écrivez votre note ici...')"
            required
            @blur="validateField('content')"
          ></textarea>
          <label v-if="errors.content" class="label">
            <span class="label-text-alt text-error">{{ errors.content }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-3 pt-4 border-t border-base-300">
      <button
        type="button"
        class="btn btn-outline"
        @click="$emit('cancel')"
        :disabled="isSubmitting"
      >
        <Iconify icon="mdi:close" class="w-4 h-4 mr-1" />
        {{ t('common.cancel') }}
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isSubmitting || !isFormValid"
        :class="{ 'btn-disabled': !isFormValid }"
      >
        <span v-if="isSubmitting" class="loading loading-spinner loading-sm mr-1"></span>
        <Iconify v-else :icon="isEditMode ? 'mdi:content-save' : 'mdi:plus'" class="w-4 h-4 mr-1" />
        {{ isEditMode ? t('common.update') : t('notes.add') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CompanyNote, CompanyNoteCreateDto } from '@/types/company.types'
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  note?: CompanyNote | null
  companyId: string
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [data: CompanyNoteCreateDto | (CompanyNoteCreateDto & { id: string })]
  cancel: []
}>()

// Form data
const formData = reactive<CompanyNoteCreateDto>({
  content: '',
  companyId: props.companyId,
})

// Form validation errors
const errors = reactive({
  content: '',
})

// Initialize form data when editing
watch(
  () => props.note,
  (newNote) => {
    if (newNote && props.isEditMode) {
      formData.content = newNote.content
      formData.companyId = newNote.companyId
    }
  },
  { immediate: true },
)

// Form validation
const isFormValid = computed(() => {
  return formData.content.trim() !== '' && Object.values(errors).every((error) => error === '')
})

// Validate individual fields
function validateField(field: keyof typeof errors) {
  errors[field] = ''

  switch (field) {
    case 'content':
      if (!formData.content.trim()) {
        errors.content = t('validation.required', 'Ce champ est requis')
      } else if (formData.content.trim().length < 3) {
        errors.content = t('validation.minLength', { min: 3 }, 'Minimum 3 caractères requis')
      } else if (formData.content.trim().length > 5000) {
        errors.content = t(
          'validation.maxLength',
          { max: 5000 },
          'Maximum 5000 caractères autorisés',
        )
      }
      break
  }
}

// Validate all fields
function validateForm(): boolean {
  validateField('content')
  return Object.values(errors).every((error) => error === '')
}

// Handle form submission
function handleSubmit() {
  if (!validateForm() || props.isSubmitting) {
    return
  }

  if (props.isEditMode && props.note) {
    // Update mode
    const updateData: CompanyNoteCreateDto & { id: string } = {
      id: props.note.id,
      content: formData.content.trim(),
      companyId: props.companyId,
    }

    emit('submit', updateData)
  } else {
    // Create mode
    const createData: CompanyNoteCreateDto = {
      content: formData.content.trim(),
      companyId: props.companyId,
    }

    emit('submit', createData)
  }
}

// Reset form data
function resetForm() {
  formData.content = ''
  formData.companyId = props.companyId

  // Clear errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

// Watch for field changes to validate on blur
watch(
  () => formData.content,
  () => validateField('content'),
)

// Expose functions for parent component
defineExpose({
  resetForm,
  validateForm,
})
</script>

<style scoped></style>
