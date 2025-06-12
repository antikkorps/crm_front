<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Section: Informations personnelles -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-6">
        <h3 class="card-title text-lg mb-4">
          <Iconify icon="mdi:account" class="w-5 h-5" />
          {{ t('contacts.personalInfo', 'Informations personnelles') }}
        </h3>

        <!-- Nom et Prénom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                {{ t('common.firstName') }} <span class="text-error">*</span>
              </span>
            </label>
            <input
              v-model="formData.firstName"
              type="text"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.firstName }"
              :placeholder="t('common.firstNamePlaceholder', 'Prénom du contact')"
              required
              @blur="validateField('firstName')"
            />
            <label v-if="errors.firstName" class="label">
              <span class="label-text-alt text-error">{{ errors.firstName }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                {{ t('common.lastName') }} <span class="text-error">*</span>
              </span>
            </label>
            <input
              v-model="formData.lastName"
              type="text"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.lastName }"
              :placeholder="t('common.lastNamePlaceholder', 'Nom de famille du contact')"
              required
              @blur="validateField('lastName')"
            />
            <label v-if="errors.lastName" class="label">
              <span class="label-text-alt text-error">{{ errors.lastName }}</span>
            </label>
          </div>
        </div>

        <!-- Position -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">{{ t('common.position') }}</span>
          </label>
          <input
            v-model="formData.position"
            type="text"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.position }"
            :placeholder="
              t('contacts.positionPlaceholder', 'Ex: Directeur, Manager, Chef de service...')
            "
            @blur="validateField('position')"
          />
          <label v-if="errors.position" class="label">
            <span class="label-text-alt text-error">{{ errors.position }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Section: Informations de contact -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-6">
        <h3 class="card-title text-lg mb-4">
          <Iconify icon="mdi:phone-message" class="w-5 h-5" />
          {{ t('contacts.contactInfo', 'Informations de contact') }}
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Email -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                <Iconify icon="mdi:email" class="w-4 h-4 inline mr-1" />
                {{ t('common.email') }}
              </span>
            </label>
            <input
              v-model="formData.email"
              type="email"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.email }"
              placeholder="contact@entreprise.com"
              @blur="validateField('email')"
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <!-- Téléphone -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">
                <Iconify icon="mdi:phone" class="w-4 h-4 inline mr-1" />
                {{ t('common.phone') }}
              </span>
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.phone }"
              :placeholder="t('common.phonePlaceholder', '+33 1 23 45 67 89')"
              @blur="validateField('phone')"
            />
            <label v-if="errors.phone" class="label">
              <span class="label-text-alt text-error">{{ errors.phone }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Paramètres -->
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body p-6">
        <h3 class="card-title text-lg mb-4">
          <Iconify icon="mdi:cog" class="w-5 h-5" />
          {{ t('contacts.settings', 'Paramètres') }}
        </h3>

        <!-- Contact principal -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              v-model="formData.isMainContact"
              type="checkbox"
              class="checkbox checkbox-primary"
            />
            <div class="flex flex-col">
              <span class="label-text font-medium">{{
                t('contacts.main', 'Contact principal')
              }}</span>
              <span class="label-text-alt text-gray-500">
                {{ t('contacts.defineAsMain', "Définir comme contact principal de l'entreprise") }}
              </span>
            </div>
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
        {{ isEditMode ? t('common.update') : t('contacts.add') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CompanyContact, ContactCreateDto, ContactUpdateDto } from '@/types/company.types'
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  contact?: CompanyContact | null
  companyId: string
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [data: ContactCreateDto | (ContactUpdateDto & { id: string })]
  cancel: []
}>()

// Form data
const formData = reactive<ContactCreateDto>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  isMainContact: false,
  companyId: props.companyId,
})

// Form validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
})

// Initialize form data when editing
watch(
  () => props.contact,
  (newContact) => {
    if (newContact && props.isEditMode) {
      formData.firstName = newContact.firstName
      formData.lastName = newContact.lastName
      formData.email = newContact.email || ''
      formData.phone = newContact.phone || ''
      formData.position = newContact.position || ''
      formData.isMainContact = newContact.isMainContact
      formData.companyId = newContact.companyId
    }
  },
  { immediate: true },
)

// Form validation
const isFormValid = computed(() => {
  return (
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    Object.values(errors).every((error) => error === '')
  )
})

// Validate individual fields
function validateField(field: keyof typeof errors) {
  errors[field] = ''

  switch (field) {
    case 'firstName':
      if (!formData.firstName.trim()) {
        errors.firstName = t('validation.required', 'Ce champ est requis')
      } else if (formData.firstName.trim().length < 2) {
        errors.firstName = t('validation.minLength', { min: 2 }, 'Minimum 2 caractères requis')
      } else if (formData.firstName.trim().length > 50) {
        errors.firstName = t('validation.maxLength', { max: 50 }, 'Maximum 50 caractères autorisés')
      } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.firstName.trim())) {
        errors.firstName = t(
          'validation.invalidName',
          'Seules les lettres, espaces, apostrophes et tirets sont autorisés',
        )
      }
      break

    case 'lastName':
      if (!formData.lastName.trim()) {
        errors.lastName = t('validation.required', 'Ce champ est requis')
      } else if (formData.lastName.trim().length < 2) {
        errors.lastName = t('validation.minLength', { min: 2 }, 'Minimum 2 caractères requis')
      } else if (formData.lastName.trim().length > 50) {
        errors.lastName = t('validation.maxLength', { max: 50 }, 'Maximum 50 caractères autorisés')
      } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.lastName.trim())) {
        errors.lastName = t(
          'validation.invalidName',
          'Seules les lettres, espaces, apostrophes et tirets sont autorisés',
        )
      }
      break

    case 'email':
      if (formData.email && formData.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email.trim())) {
          errors.email = t('validation.invalidEmail', 'Adresse email invalide')
        } else if (formData.email.trim().length > 255) {
          errors.email = t('validation.maxLength', { max: 255 }, 'Maximum 255 caractères autorisés')
        }
      }
      break

    case 'phone':
      if (formData.phone && formData.phone.trim() !== '') {
        // Phone validation - allows international formats
        const phoneRegex = /^[\d\s\-\+\(\)\.]+$/
        if (!phoneRegex.test(formData.phone.trim())) {
          errors.phone = t('validation.invalidPhone', 'Format de numéro de téléphone invalide')
        } else if (formData.phone.trim().length < 8) {
          errors.phone = t(
            'validation.phoneMinLength',
            'Le numéro doit contenir au moins 8 chiffres',
          )
        } else if (formData.phone.trim().length > 20) {
          errors.phone = t('validation.phoneMaxLength', 'Le numéro ne peut dépasser 20 caractères')
        }
      }
      break

    case 'position':
      if (formData.position && formData.position.trim() !== '') {
        if (formData.position.trim().length > 100) {
          errors.position = t(
            'validation.maxLength',
            { max: 100 },
            'Maximum 100 caractères autorisés',
          )
        }
      }
      break
  }
}

// Validate all fields
function validateForm(): boolean {
  validateField('firstName')
  validateField('lastName')
  validateField('email')
  validateField('phone')

  return Object.values(errors).every((error) => error === '')
}

// Handle form submission
function handleSubmit() {
  if (!validateForm() || props.isSubmitting) {
    return
  }

  if (props.isEditMode && props.contact) {
    // Update mode
    const updateData: ContactUpdateDto & { id: string } = {
      id: props.contact.id,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      isMainContact: formData.isMainContact,
    }

    // Add optional fields only if they have values
    if (formData.email?.trim()) {
      updateData.email = formData.email.trim()
    }
    if (formData.phone?.trim()) {
      updateData.phone = formData.phone.trim()
    }
    if (formData.position?.trim()) {
      updateData.position = formData.position.trim()
    }

    emit('submit', updateData)
  } else {
    // Create mode
    const createData: ContactCreateDto = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      isMainContact: formData.isMainContact,
      companyId: props.companyId,
    }

    // Add optional fields only if they have values
    if (formData.email?.trim()) {
      createData.email = formData.email.trim()
    }
    if (formData.phone?.trim()) {
      createData.phone = formData.phone.trim()
    }
    if (formData.position?.trim()) {
      createData.position = formData.position.trim()
    }

    emit('submit', createData)
  }
}

// Reset form data
function resetForm() {
  formData.firstName = ''
  formData.lastName = ''
  formData.email = ''
  formData.phone = ''
  formData.position = ''
  formData.isMainContact = false
  formData.companyId = props.companyId

  // Clear errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

// Watch for field changes to validate on blur
watch(
  () => formData.firstName,
  () => validateField('firstName'),
)
watch(
  () => formData.lastName,
  () => validateField('lastName'),
)
watch(
  () => formData.email,
  () => validateField('email'),
)
watch(
  () => formData.phone,
  () => validateField('phone'),
)

// Expose functions for parent component
defineExpose({
  resetForm,
  validateForm,
})
</script>

<style scoped></style>
