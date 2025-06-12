<template>
  <form @submit.prevent="submitForm">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- Nom de l'entreprise -->
      <div class="form-group">
        <label class="label">{{ t('companies.name') }}*</label>
        <input
          v-model="formData.name"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('companies.name')"
          required
        />
      </div>

      <!-- Numéro de client -->
      <div class="form-group">
        <label class="label">{{ t('companies.clientNumber') }}</label>
        <input
          v-model="formData.clientNumber"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('companies.clientNumber')"
        />
      </div>

      <!-- Groupe de clients -->
      <div class="form-group">
        <label class="label">{{ t('companies.clientGroup') }}</label>
        <input
          v-model="formData.clientGroup"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('companies.clientGroup')"
        />
      </div>

      <!-- Industrie -->
      <div class="form-group">
        <label class="label">{{ t('common.industry') }}</label>
        <input
          v-model="formData.industry"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('common.industry')"
        />
      </div>

      <!-- Taille -->
      <div class="form-group">
        <label class="label">{{ t('common.size') }}</label>
        <select v-model="formData.size" class="select select-bordered w-full">
          <option value="">{{ t('common.selectSize') }}</option>
          <option value="1-10">{{ t('common.size1to10') }}</option>
          <option value="11-50">{{ t('common.size11to50') }}</option>
          <option value="51-200">{{ t('common.size51to200') }}</option>
          <option value="201-500">{{ t('common.size201to500') }}</option>
          <option value="501-1000">{{ t('common.size501to1000') }}</option>
          <option value="+1000">{{ t('common.sizeMoreThan1000') }}</option>
        </select>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label class="label">{{ t('common.email') }}</label>
        <input
          v-model="formData.email"
          type="email"
          class="input input-bordered w-full"
          :placeholder="t('common.email')"
        />
      </div>

      <!-- Téléphone -->
      <div class="form-group">
        <label class="label">{{ t('common.phone') }}</label>
        <input
          v-model="formData.phone"
          type="tel"
          class="input input-bordered w-full"
          :placeholder="t('common.phone')"
        />
      </div>

      <!-- Site web -->
      <div class="form-group">
        <label class="label">{{ t('common.website') }}</label>
        <input
          v-model="formData.website"
          type="url"
          class="input input-bordered w-full"
          :placeholder="t('common.website')"
        />
      </div>

      <!-- Adresse -->
      <div class="form-group">
        <label class="label">{{ t('common.address') }}</label>
        <input
          v-model="formData.address"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('companies.address')"
        />
      </div>

      <!-- Complément d'adresse -->
      <div class="form-group">
        <label class="label">{{ t('companies.addressComplement') }}</label>
        <input
          v-model="formData.addressComplement"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('companies.addressComplement')"
        />
      </div>

      <!-- Code postal -->
      <div class="form-group">
        <label class="label">{{ t('common.zipCode') }}</label>
        <input
          v-model="formData.zipCode"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('common.zipCode')"
        />
      </div>

      <!-- Ville -->
      <div class="form-group">
        <label class="label">{{ t('common.city') }}</label>
        <input
          v-model="formData.city"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('common.city')"
        />
      </div>

      <!-- Pays -->
      <div class="form-group">
        <label class="label">{{ t('common.country') }}</label>
        <input
          v-model="formData.country"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('common.country')"
        />
      </div>

      <!-- Code régional -->
      <div class="form-group">
        <label class="label">{{ t('companies.codeRegional') }}</label>
        <input
          v-model="formData.codeRegional"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('companies.codeRegional')"
        />
      </div>

      <!-- Statut -->
      <div class="form-group">
        <label class="label">{{ t('common.status') }}</label>
        <select v-model="formData.statusId" class="select select-bordered w-full">
          <option value="">{{ t('common.selectStatus') }}</option>
          <option v-for="status in statuses" :key="status.id" :value="status.id">
            {{ t(`status.${status.name.toLowerCase()}`, status.name) }}
          </option>
        </select>
      </div>

      <!-- Salles d'opération -->
      <div class="form-group">
        <label class="label">{{ t('common.operatingRooms') }}</label>
        <input
          v-model="formData.operatingRooms"
          type="number"
          min="0"
          class="input input-bordered w-full"
          :placeholder="t('common.operatingRooms')"
        />
      </div>

      <!-- Chiffre d'affaires global -->
      <div class="form-group">
        <label class="label">{{ t('companies.globalRevenue') }}</label>
        <input
          v-model="formData.revenue"
          type="number"
          min="0"
          class="input input-bordered w-full"
          :placeholder="t('companies.globalRevenue')"
        />
      </div>

      <!-- Assigné à -->
      <div class="form-group" v-if="users.length">
        <label class="label">{{ t('common.assignedTo') }}</label>
        <select v-model="formData.assignedToId" class="select select-bordered w-full">
          <option value="">{{ t('common.selectUser') }}</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>
    </div>

    <!-- Spécialités -->
    <div class="form-group mb-4">
      <label class="label">{{ t('common.specialities') }}</label>
      <select v-model="formData.specialities" class="select select-bordered w-full" multiple>
        <option v-for="speciality in specialities" :key="speciality.id" :value="speciality.id">
          {{ speciality.name }}
        </option>
      </select>
      <div class="label">
        <span class="label-text-alt">{{ t('common.holdCtrlForMultiple') }}</span>
      </div>
    </div>

    <!-- Description -->
    <div class="form-group mb-4">
      <label class="label">{{ t('common.description') }}</label>
      <textarea
        v-model="formData.description"
        class="textarea textarea-bordered w-full"
        :placeholder="t('common.description')"
        rows="3"
      ></textarea>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-3 mt-6">
      <button type="button" class="btn" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </button>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
        {{ isEditMode ? t('common.update') : t('common.create') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  Company,
  CompanyCreateDto,
  CompanyUpdateDto,
  Speciality,
  Status,
} from '@/types/company.types'
import type { User } from '@/types/auth.types'
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props
const props = defineProps<{
  company?: Company | null
  isEditMode?: boolean
  statuses: Status[]
  specialities: Speciality[]
  users: User[]
  isSubmitting?: boolean
}>()

// Emits
const emit = defineEmits<{
  submit: [data: CompanyCreateDto | CompanyUpdateDto]
  cancel: []
}>()

// Form data
const formData = reactive<CompanyCreateDto & { id?: string; assignedToId?: string }>({
  name: '',
  industry: '',
  size: '',
  address: '',
  addressComplement: '',
  city: '',
  zipCode: '',
  country: '',
  codeRegional: '',
  clientGroup: '',
  clientNumber: '',
  statusId: '',
  website: '',
  email: '',
  phone: '',
  description: '',
  operatingRooms: null,
  revenue: undefined,
  specialities: [] as string[],
  assignedToId: '',
})

// Watch for company changes to populate form
watch(
  () => props.company,
  (company) => {
    if (company) {
      Object.assign(formData, {
        id: company.id,
        name: company.name || '',
        industry: company.industry || '',
        size: company.size || '',
        address: company.address || '',
        addressComplement: company.addressComplement || '',
        city: company.city || '',
        zipCode: company.zipCode || '',
        country: company.country || '',
        codeRegional: company.codeRegional || '',
        clientGroup: company.clientGroup || '',
        clientNumber: company.clientNumber || '',
        statusId: company.status?.id || '',
        website: company.website || '',
        email: company.email || '',
        phone: company.phone || '',
        description: company.description || '',
        operatingRooms: company.operatingRooms || null,
        revenue: company.globalRevenue || undefined,
        specialities: company.Specialities?.map((s) => s.id) || [],
        assignedToId: company.assignedTo?.id || '',
      })
    } else {
      // Reset form for create mode
      Object.assign(formData, {
        name: '',
        industry: '',
        size: '',
        address: '',
        addressComplement: '',
        city: '',
        zipCode: '',
        country: '',
        codeRegional: '',
        clientGroup: '',
        clientNumber: '',
        statusId: '',
        website: '',
        email: '',
        phone: '',
        description: '',
        operatingRooms: null,
        revenue: undefined,
        specialities: [] as string[],
        assignedToId: '',
      })
    }
  },
  { immediate: true },
)

// Submit form
function submitForm() {
  const submitData = { ...formData }

  // Remove undefined values and empty arrays
  Object.keys(submitData).forEach((key) => {
    const value = submitData[key as keyof typeof submitData]
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete submitData[key as keyof typeof submitData]
    }
  })

  // Remove id and assignedToId for create mode
  if (!props.isEditMode) {
    delete submitData.id
  }

  emit('submit', submitData)
}
</script>
