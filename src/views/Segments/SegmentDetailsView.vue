<template>
  <div class="segment-details-page container mx-auto p-4">
    <PageHeader :title="t('segments.segmentDetails')" :back-to="'/segments'" />

    <div v-if="loading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="!currentSegment" class="text-center py-8">
      <div class="max-w-md mx-auto">
        <Iconify icon="mdi:alert-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">{{ t('segments.segmentNotFound') }}</h3>
        <p class="text-gray-600 mb-4">{{ t('segments.segmentNotFoundMessage') }}</p>
        <button class="btn btn-primary" @click="router.push('/segments')">
          {{ t('common.backToList') }}
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col flex-col-spaced">
      <!-- En-tête du segment -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center flex-col-spaced-md"
          >
            <div>
              <h1 class="text-2xl font-bold">{{ currentSegment.name }}</h1>
              <p v-if="currentSegment.description" class="text-gray-600 mt-1">
                {{ currentSegment.description }}
              </p>
              <div class="flex items-center flex-col-spaced-sm mt-2">
                <span
                  :class="['badge', currentSegment.isDynamic ? 'badge-primary' : 'badge-secondary']"
                >
                  {{ currentSegment.isDynamic ? t('segments.isDynamic') : t('segments.isManual') }}
                </span>
                <span class="badge badge-outline">
                  {{ currentSegment.contactCount }} {{ t('common.contacts') }}
                </span>
              </div>
            </div>

            <div class="flex flex-col-spaced-sm">
              <button
                v-if="currentSegment.isDynamic"
                @click="evaluateSegment"
                class="btn btn-outline btn-sm"
                :disabled="evaluating"
              >
                <span v-if="evaluating" class="loading loading-spinner loading-sm"></span>
                <Iconify v-else icon="mdi:refresh" class="w-4 h-4 mr-1" />
                {{ t('segments.evaluateSegment') }}
              </button>
              <button @click="editSegment" class="btn btn-primary btn-sm">
                <Iconify icon="mdi:pencil" class="w-4 h-4 mr-1" />
                {{ t('common.edit') }}
              </button>
              <div class="dropdown dropdown-end">
                <button class="btn btn-ghost btn-sm">
                  <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
                </button>
                <ul class="dropdown-content menu z-[1] bg-base-100 shadow-lg rounded-box w-52">
                  <li>
                    <button @click="duplicateSegment">
                      <Iconify icon="mdi:content-copy" class="w-4 h-4" />
                      {{ t('common.duplicate') }}
                    </button>
                  </li>
                  <li>
                    <button @click="exportSegment">
                      <Iconify icon="mdi:download" class="w-4 h-4" />
                      {{ t('common.export') }}
                    </button>
                  </li>
                  <li>
                    <button @click="deleteSegment" class="text-error">
                      <Iconify icon="mdi:delete" class="w-4 h-4" />
                      {{ t('common.delete') }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations du segment -->
      <div class="grid grid-cols-1 md:grid-cols-2 flex-col-spaced-md">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title">{{ t('segments.segmentInfo') }}</h3>
            <div class="flex flex-col text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('segments.createdBy') }}:</span>
                <span
                  >{{ currentSegment.createdBy.firstName }}
                  {{ currentSegment.createdBy.lastName }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('segments.createdAt') }}:</span>
                <span>{{ formatDate(currentSegment.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('segments.updatedAt') }}:</span>
                <span>{{ formatDate(currentSegment.updatedAt) }}</span>
              </div>
              <div v-if="currentSegment.lastEvaluatedAt" class="flex justify-between">
                <span class="text-gray-600">{{ t('segments.lastEvaluated') }}:</span>
                <span>{{ formatDate(currentSegment.lastEvaluatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="currentSegment.isDynamic && currentSegment.rules && currentSegment.rules.length > 0"
          class="card bg-base-100 shadow-md"
        >
          <div class="card-body">
            <h3 class="card-title">{{ t('segments.segmentRules') }}</h3>
            <div class="text-sm">
              <div v-for="(rule, index) in currentSegment.rules" :key="index" class="mb-2">
                <div class="font-medium">{{ t('segments.rule') }} {{ index + 1 }}:</div>
                <div class="text-gray-600 ml-2">
                  {{ formatRule(rule) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des contacts -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center flex-col-spaced-md mb-4"
          >
            <h3 class="card-title">{{ t('segments.segmentContacts') }}</h3>
            <div class="flex flex-col-spaced-sm">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('contacts.searchContacts')"
                class="input input-bordered input-sm"
                @input="handleSearch"
              />
              <button
                v-if="!currentSegment.isDynamic"
                @click="addContacts"
                class="btn btn-primary btn-sm"
              >
                <Iconify icon="mdi:account-plus" class="w-4 h-4 mr-1" />
                {{ t('contacts.addContact') }}
              </button>
            </div>
          </div>

          <div v-if="segmentContactsLoading" class="flex justify-center items-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div v-else-if="segmentContacts.length === 0" class="text-center py-8">
            <div class="max-w-md mx-auto">
              <Iconify icon="mdi:account-multiple" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold mb-2">{{ t('segments.noContactsInSegment') }}</h3>
              <p class="text-gray-600 mb-4">{{ t('segments.noContactsInSegmentMessage') }}</p>
              <button v-if="!currentSegment.isDynamic" @click="addContacts" class="btn btn-primary">
                <Iconify icon="mdi:account-plus" class="w-4 h-4 mr-2" />
                {{ t('contacts.addContact') }}
              </button>
            </div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>{{ t('common.name') }}</th>
                  <th>{{ t('common.email') }}</th>
                  <th>{{ t('common.company') }}</th>
                  <th>{{ t('common.status') }}</th>
                  <th>{{ t('common.assignedTo') }}</th>
                  <th>{{ t('segments.addedType') }}</th>
                  <th>{{ t('common.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="contact in segmentContacts" :key="contact.id">
                  <td>
                    <div class="flex items-center flex-col-spaced-sm">
                      <div class="avatar placeholder">
                        <div class="bg-neutral text-neutral-content rounded-full w-8">
                          <span class="text-xs"
                            >{{ contact.firstName[0] }}{{ contact.lastName[0] }}</span
                          >
                        </div>
                      </div>
                      <div>
                        <div class="font-medium">
                          {{ contact.firstName }} {{ contact.lastName }}
                        </div>
                        <div v-if="contact.position" class="text-sm text-gray-500">
                          {{ contact.position }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span v-if="contact.email">{{ contact.email }}</span>
                    <span v-else class="text-gray-400">{{ t('common.notProvided') }}</span>
                  </td>
                  <td>
                    <span v-if="contact.company?.name">{{ contact.company.name }}</span>
                    <span v-else class="text-gray-400">{{ t('common.notAssigned') }}</span>
                  </td>
                  <td>
                    <span
                      v-if="contact.status"
                      class="badge badge-sm"
                      :style="{ backgroundColor: contact.status.color }"
                    >
                      {{ contact.status.name }}
                    </span>
                  </td>
                  <td>
                    <span v-if="contact.assignedTo">
                      {{ contact.assignedTo.firstName }} {{ contact.assignedTo.lastName }}
                    </span>
                    <span v-else class="text-gray-400">{{ t('common.notAssigned') }}</span>
                  </td>
                  <td>
                    <span
                      :class="[
                        'badge badge-sm',
                        contact.isManuallyAdded ? 'badge-secondary' : 'badge-primary',
                      ]"
                    >
                      {{ contact.isManuallyAdded ? t('segments.manual') : t('segments.automatic') }}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button @click="viewContact(contact.id)" class="btn btn-ghost btn-xs">
                        <Iconify icon="mdi:eye" class="w-3 h-3" />
                      </button>
                      <button
                        v-if="!currentSegment.isDynamic"
                        @click="removeContact(contact.id)"
                        class="btn btn-ghost btn-xs text-error"
                      >
                        <Iconify icon="mdi:close" class="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="flex justify-center mt-4">
            <div class="join">
              <button
                class="join-item btn btn-sm"
                :disabled="!pagination.hasPreviousPage"
                @click="changePage(pagination.currentPage - 1)"
              >
                {{ t('common.previous') }}
              </button>
              <button
                v-for="page in getPageNumbers()"
                :key="page"
                class="join-item btn btn-sm"
                :class="{ 'btn-active': page === pagination.currentPage }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
              <button
                class="join-item btn btn-sm"
                :disabled="!pagination.hasNextPage"
                @click="changePage(pagination.currentPage + 1)"
              >
                {{ t('common.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import { useSegmentStore } from '@/stores/segment'
import type { SegmentRule } from '@/types/segment.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const segmentStore = useSegmentStore()

// État local
const searchQuery = ref('')
const evaluating = ref(false)
const searchTimeout = ref<number | null>(null)

// Computed
const currentSegment = computed(() => segmentStore.currentSegment)
const loading = computed(() => segmentStore.loading)
const segmentContacts = computed(() => segmentStore.segmentContacts)
const segmentContactsLoading = computed(() => segmentStore.loading)
const pagination = computed(() => segmentStore.pagination)

// Méthodes
const evaluateSegment = async () => {
  if (!currentSegment.value) return

  evaluating.value = true
  try {
    await segmentStore.evaluateSegment(currentSegment.value.id)
  } catch (error) {
    console.error("Erreur lors de l'évaluation du segment:", error)
  } finally {
    evaluating.value = false
  }
}

const editSegment = () => {
  if (!currentSegment.value) return
  router.push(`/segments/${currentSegment.value.id}/edit`)
}

const duplicateSegment = async () => {
  if (!currentSegment.value) return

  try {
    const newName = `${currentSegment.value.name} (copie)`
    // TODO: Implémenter la duplication dans le store
    console.log('Duplication du segment:', currentSegment.value.id, 'avec le nom:', newName)
  } catch (error) {
    console.error('Erreur lors de la duplication du segment:', error)
  }
}

const exportSegment = async () => {
  if (!currentSegment.value) return

  try {
    // TODO: Implémenter l'export
    console.log('Export du segment:', currentSegment.value.id)
  } catch (error) {
    console.error("Erreur lors de l'export du segment:", error)
  }
}

const deleteSegment = async () => {
  if (!currentSegment.value) return

  if (confirm(t('common.thisActionCannotBeUndone'))) {
    try {
      await segmentStore.deleteSegment(currentSegment.value.id)
      router.push('/segments')
    } catch (error) {
      console.error('Erreur lors de la suppression du segment:', error)
    }
  }
}

const addContacts = () => {
  // TODO: Implémenter l'ajout de contacts
  console.log('Ajouter des contacts au segment')
}

const viewContact = (contactId: string) => {
  router.push(`/contacts/${contactId}`)
}

const removeContact = async (contactId: string) => {
  if (!currentSegment.value) return

  try {
    // TODO: Implémenter removeContactFromSegment dans le store
    console.log('Suppression du contact:', contactId, 'du segment:', currentSegment.value.id)
    loadSegmentContacts()
  } catch (error) {
    console.error('Erreur lors de la suppression du contact:', error)
  }
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    loadSegmentContacts()
  }, 300)
}

const loadSegmentContacts = () => {
  if (!currentSegment.value) return

  const params: {
    page: number
    itemsPerPage: number
    name?: string
  } = {
    page: pagination.value.currentPage,
    itemsPerPage: pagination.value.itemsPerPage,
  }

  if (searchQuery.value) {
    params.name = searchQuery.value
  }

  segmentStore.fetchSegmentContacts(currentSegment.value.id, params)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    const params: {
      page: number
      itemsPerPage: number
      name?: string
    } = {
      page,
      itemsPerPage: pagination.value.itemsPerPage,
    }

    if (searchQuery.value) {
      params.name = searchQuery.value
    }

    if (!currentSegment.value) return
    segmentStore.fetchSegmentContacts(currentSegment.value.id, params)
  }
}

const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages

  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }

  return pages
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRule = (rule: SegmentRule): string => {
  // Vérifier que rule est un objet valide
  if (!rule || typeof rule !== 'object') {
    return 'Règle invalide'
  }

  if ('field' in rule && 'operator' in rule && 'value' in rule) {
    const fieldLabel = getFieldLabel(rule.field)
    const operatorLabel = getOperatorLabel(rule.operator)
    const value = rule.value || ''

    return `${fieldLabel} ${operatorLabel} "${value}"`
  }

  if ('operator' in rule && 'conditions' in rule && Array.isArray(rule.conditions)) {
    const conditions = rule.conditions
      .map(formatRule)
      .join(` ${rule.operator === 'AND' ? 'ET' : 'OU'} `)
    return `(${conditions})`
  }

  return 'Règle invalide'
}

const getFieldLabel = (field: string): string => {
  const fieldMap: Record<string, string> = {
    email: 'Email',
    firstName: 'Prénom',
    lastName: 'Nom',
    phone: 'Téléphone',
    position: 'Poste',
    statusId: 'Statut',
    companyId: 'Entreprise',
    assignedToId: 'Assigné à',
  }

  return fieldMap[field] || field
}

const getOperatorLabel = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    equals: 'égal à',
    notEquals: 'différent de',
    contains: 'contient',
    notContains: 'ne contient pas',
    startsWith: 'commence par',
    endsWith: 'termine par',
    greaterThan: 'supérieur à',
    lessThan: 'inférieur à',
  }

  return operatorMap[operator] || operator
}

// Charger les données au montage
onMounted(async () => {
  const segmentId = route.params.id as string
  if (segmentId) {
    await segmentStore.fetchSegment(segmentId)
    loadSegmentContacts()
  }
})
</script>

<style scoped>
.segment-details-page {
  display: flex;
  flex-direction: column;
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.table {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
}
</style>
