<template>
  <form @submit.prevent="submitForm">
    <!-- Section: Informations générales -->
    <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
      <input type="checkbox" class="collapse-toggle" checked />
      <div class="collapse-title text-lg font-medium">
        {{ t('companies.generalInfo') }}
      </div>
      <div class="collapse-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
        </div>
      </div>
    </div>

    <!-- Section: Informations client -->
    <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
      <input type="checkbox" class="collapse-toggle" />
      <div class="collapse-title text-lg font-medium">
        {{ t('companies.clientInfo') }}
      </div>
      <div class="collapse-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
        </div>
      </div>
    </div>

    <!-- Section: Contact -->
    <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
      <input type="checkbox" class="collapse-toggle" />
      <div class="collapse-title text-lg font-medium">
        {{ t('companies.contactInfo') }}
      </div>
      <div class="collapse-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
          <div class="form-group md:col-span-2">
            <label class="label">{{ t('common.website') }}</label>
            <input
              v-model="formData.website"
              type="url"
              class="input input-bordered w-full"
              placeholder="https://"
              pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
              :title="t('common.urlMustBeValid')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Adresse -->
    <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
      <input type="checkbox" class="collapse-toggle" />
      <div class="collapse-title text-lg font-medium">
        {{ t('companies.addressInfo') }}
      </div>
      <div class="collapse-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <!-- Adresse -->
          <div class="form-group md:col-span-2">
            <label class="label">{{ t('common.address') }}</label>
            <input
              v-model="formData.address"
              type="text"
              class="input input-bordered w-full"
              :placeholder="t('companies.address')"
            />
          </div>

          <!-- Complément d'adresse -->
          <div class="form-group md:col-span-2">
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
          <div class="form-group md:col-span-2">
            <label class="label">{{ t('common.country') }}</label>
            <input
              v-model="formData.country"
              type="text"
              class="input input-bordered w-full"
              :placeholder="t('common.country')"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Spécialités et Description -->
    <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
      <input type="checkbox" class="collapse-toggle" />
      <div class="collapse-title text-lg font-medium">
        {{ t('companies.additionalInfo') }}
      </div>
      <div class="collapse-content">
        <div class="pt-2">
          <!-- Spécialités -->
          <MultiSelectTags
            v-model="formData.specialities"
            :options="specialitiesOptions"
            :label="t('common.specialities')"
            :placeholder="t('common.selectSpecialities')"
            :help-text="t('common.selectMultipleSpecialities')"
            class="mb-4"
          />

          <!-- Description -->
          <div class="form-group">
            <label class="label">{{ t('common.description') }}</label>
            <textarea
              v-model="formData.description"
              class="textarea textarea-bordered w-full"
              :placeholder="t('common.description')"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
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
import { MultiSelectTags } from '@/components/common'
import type { User } from '@/types/auth.types'
import type {
  Company,
  CompanyCreateDto,
  CompanyUpdateDto,
  Speciality,
  Status,
} from '@/types/company.types'
import { computed, reactive, watch } from 'vue'
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

// Computed
const specialitiesOptions = computed(() =>
  props.specialities.map((speciality) => ({
    id: speciality.id,
    name: speciality.name,
  })),
)

// Form data
const formData = reactive<
  CompanyCreateDto & {
    id?: string
    assignedToId?: string
    specialities: string[]
  }
>({
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

  // Remove undefined values and empty strings, but keep empty arrays for specialities
  Object.keys(submitData).forEach((key) => {
    const value = submitData[key as keyof typeof submitData]
    if (value === undefined || value === '') {
      delete submitData[key as keyof typeof submitData]
    }
    // Don't delete empty arrays for specialities - they represent "no specialities selected"
    if (Array.isArray(value) && value.length === 0 && key !== 'specialities') {
      delete submitData[key as keyof typeof submitData]
    }
  })

  // Transform data for API: rename specialities to specialitiesIds
  const apiData = { ...submitData }
  if (apiData.specialities) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(apiData as any).specialitiesIds = apiData.specialities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (apiData as any).specialities
  }

  // Remove id and assignedToId for create mode
  if (!props.isEditMode) {
    delete apiData.id
  }

  emit('submit', apiData)
}
</script>
