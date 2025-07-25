<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Layout en grille compacte -->
    <div class="bg-base-100 rounded-lg border border-base-300 p-4">
      <!-- Entreprise (en haut, pleine largeur) -->
      <div class="mb-4">
        <!-- Mode édition : affichage lecture seule -->
        <div v-if="isEditMode" class="form-control">
          <label class="label label-text font-medium mb-1">
            <Iconify icon="mdi:office-building" class="w-4 h-4 mr-2" />
            {{ t('common.company') }}
          </label>
          <div class="input input-sm input-bordered bg-base-200 flex items-center">
            <span>{{ contact?.company?.name || t('common.noCompany', 'Aucune entreprise') }}</span>
          </div>
          <div class="text-xs text-base-content/70 mt-1">
            {{ t('contacts.companyEditNote', 'L\'entreprise ne peut pas être modifiée après création') }}
          </div>
        </div>

        <!-- Mode création : sélection de l'entreprise -->
        <div v-else>
          <CompanySearch
            v-model="formData.companyId"
            :label="t('common.company')"
            :placeholder="t('contacts.selectCompanyPlaceholder', 'Rechercher et sélectionner une entreprise...')"
            :error-message="errors.companyId"
            required
            @company-selected="onCompanySelected"
          />
        </div>
      </div>

      <!-- Grille des champs principaux -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Prénom -->
        <div class="form-control">
          <label class="label label-text font-medium mb-1">
            {{ t('common.firstName') }} <span class="text-error">*</span>
          </label>
          <input
            v-model="formData.firstName"
            type="text"
            class="input input-sm input-bordered w-full"
            :class="{ 'input-error': errors.firstName }"
            :placeholder="t('common.firstNamePlaceholder', 'Prénom')"
            required
            @blur="validateField('firstName')"
          />
          <div v-if="errors.firstName" class="text-xs text-error mt-1">
            {{ errors.firstName }}
          </div>
        </div>

        <!-- Nom -->
        <div class="form-control">
          <label class="label label-text font-medium mb-1">
            {{ t('common.lastName') }} <span class="text-error">*</span>
          </label>
          <input
            v-model="formData.lastName"
            type="text"
            class="input input-sm input-bordered w-full"
            :class="{ 'input-error': errors.lastName }"
            :placeholder="t('common.lastNamePlaceholder', 'Nom')"
            required
            @blur="validateField('lastName')"
          />
          <div v-if="errors.lastName" class="text-xs text-error mt-1">
            {{ errors.lastName }}
          </div>
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label label-text font-medium mb-1">
            <Iconify icon="mdi:email" class="w-4 h-4 mr-1" />
            {{ t('common.email') }}
          </label>
          <input
            v-model="formData.email"
            type="email"
            class="input input-sm input-bordered w-full"
            :class="{ 'input-error': errors.email }"
            placeholder="contact@entreprise.com"
            @blur="validateField('email')"
          />
          <div v-if="errors.email" class="text-xs text-error mt-1">
            {{ errors.email }}
          </div>
        </div>

        <!-- Téléphone -->
        <div class="form-control">
          <label class="label label-text font-medium mb-1">
            <Iconify icon="mdi:phone" class="w-4 h-4 mr-1" />
            {{ t('common.phone') }}
          </label>
          <input
            v-model="formData.phone"
            type="tel"
            class="input input-sm input-bordered w-full"
            :class="{ 'input-error': errors.phone }"
            :placeholder="t('common.phonePlaceholder', '+33 1 23 45 67 89')"
            @blur="validateField('phone')"
          />
          <div v-if="errors.phone" class="text-xs text-error mt-1">
            {{ errors.phone }}
          </div>
        </div>
      </div>

      <!-- Position (pleine largeur en bas) -->
      <div class="form-control mt-4">
        <label class="label label-text font-medium mb-1">
          <Iconify icon="mdi:briefcase" class="w-4 h-4 mr-1" />
          {{ t('common.position') }}
        </label>
        <input
          v-model="formData.position"
          type="text"
          class="input input-sm input-bordered w-full"
          :class="{ 'input-error': errors.position }"
          :placeholder="t('contacts.positionPlaceholder', 'Ex: Directeur, Manager...')"
          @blur="validateField('position')"
        />
        <div v-if="errors.position" class="text-xs text-error mt-1">
          {{ errors.position }}
        </div>
      </div>
    </div>

    <!-- Actions compactes -->
    <div class="flex justify-end space-x-2 pt-3">
      <button
        type="button"
        class="btn btn-outline btn-sm"
        @click="$emit('cancel')"
        :disabled="isSubmitting"
      >
        <Iconify icon="mdi:close" class="w-4 h-4" />
        <span class="hidden sm:inline ml-1">{{ t('common.cancel') }}</span>
      </button>
      <button
        type="submit"
        class="btn btn-primary btn-sm"
        :disabled="isSubmitting || !isFormValid"
        :class="{ 'btn-disabled': !isFormValid }"
      >
        <span v-if="isSubmitting" class="loading loading-spinner loading-xs mr-1"></span>
        <Iconify v-else :icon="isEditMode ? 'mdi:content-save' : 'mdi:plus'" class="w-4 h-4" />
        <span class="hidden sm:inline ml-1">{{ isEditMode ? t('common.update') : t('contacts.add') }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import CompanySearch from '@/components/common/CompanySearch.vue'
import type { Contact, ContactCreateDto, ContactUpdateDto } from '@/types/contact.types'
import type { Company } from '@/types/company.types'
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  contact?: Contact | null
  companyId: string
  companies: Company[]
  isEditMode?: boolean
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
}>()

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  companyId: props.companyId,
})

// Form validation errors
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  companyId: '',
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
      formData.companyId = newContact.company?.id || props.companyId
    }
  },
  { immediate: true },
)

// Form validation
const isFormValid = computed(() => {
  return (
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    (props.isEditMode || formData.companyId.trim() !== '') &&
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

    case 'companyId':
      if (!props.isEditMode && !formData.companyId) {
        errors.companyId = t('validation.required', 'Ce champ est requis')
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
  validateField('position')
  validateField('companyId')

  return Object.values(errors).every((error) => error === '')
}

// Handle form submission
function handleSubmit() {
  if (!validateForm() || props.isSubmitting) {
    return
  }

  if (props.isEditMode && props.contact) {
    // Update mode
    const updateData: any = {
      id: props.contact.id,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
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
    const createData: any = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
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
watch(
  () => formData.companyId,
  () => validateField('companyId'),
)

// Gestionnaire pour la sélection de compagnie
function onCompanySelected() {
  validateField('companyId')
}

// Expose functions for parent component
defineExpose({
  resetForm,
  validateForm,
})
</script>

<style scoped></style>
