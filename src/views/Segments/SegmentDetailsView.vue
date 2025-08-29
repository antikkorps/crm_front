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

    <div v-else class="space-y-6">
      <!-- En-tête du segment -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div class="flex-1">
              <h1 class="text-2xl font-bold mb-2">{{ currentSegment.name }}</h1>
              <p v-if="currentSegment.description" class="text-gray-600 mb-3">
                {{ currentSegment.description }}
              </p>
              <div class="flex flex-wrap gap-2">
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

            <div class="flex flex-col sm:flex-row gap-2 lg:flex-col lg:items-end">
              <div class="flex flex-col sm:flex-row gap-2 lg:flex-row lg:items-end">
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
              </div>
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
                    <SegmentExportButton 
                      v-if="currentSegment"
                      :segment-id="currentSegment.id"
                      :segment-name="currentSegment.name"
                      button-class="btn-ghost btn-sm w-full justify-start"
                      export-text="Exporter"
                    />
                  </li>
                  <li class="divider"></li>
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title mb-4">{{ t('segments.segmentInfo') }}</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-start">
                <span class="text-gray-600 font-medium">{{ t('segments.createdBy') }}:</span>
                <span class="text-right">
                  {{ currentSegment.createdBy.firstName }}
                  {{ currentSegment.createdBy.lastName }}
                </span>
              </div>
              <div class="flex justify-between items-start">
                <span class="text-gray-600 font-medium">{{ t('segments.createdAt') }}:</span>
                <span class="text-right">{{ formatDate(currentSegment.createdAt) }}</span>
              </div>
              <div class="flex justify-between items-start">
                <span class="text-gray-600 font-medium">{{ t('segments.updatedAt') }}:</span>
                <span class="text-right">{{ formatDate(currentSegment.updatedAt) }}</span>
              </div>
              <div v-if="currentSegment.lastEvaluatedAt" class="flex justify-between items-start">
                <span class="text-gray-600 font-medium">{{ t('segments.lastEvaluated') }}:</span>
                <span class="text-right">{{ formatDate(currentSegment.lastEvaluatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="currentSegment.isDynamic && currentSegment.rules && currentSegment.rules.length > 0"
          class="card bg-base-100 shadow-md"
        >
          <div class="card-body">
            <h3 class="card-title mb-4">{{ t('segments.segmentRules') }}</h3>
            <div class="space-y-3 text-sm">
              <div
                v-for="(rule, index) in currentSegment.rules"
                :key="index"
                class="p-3 bg-base-200 rounded-lg"
              >
                <div class="font-medium text-primary mb-1">
                  {{ t('segments.rule') }} {{ index + 1 }}:
                </div>
                <div class="text-gray-600">
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
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div class="flex-1">
              <h3 class="card-title mb-3">{{ t('segments.segmentContacts') }}</h3>
              <div class="relative max-w-md">
                <Iconify icon="mdi:filter" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="'Filtrer les contacts du segment...'"
                  class="input input-bordered input-sm w-full pl-10"
                  @input="handleSearch"
                  @keydown.enter.prevent="handleSearch"
                />
              </div>
            </div>
            <div v-if="!currentSegment.isDynamic" class="dropdown dropdown-end flex-shrink-0">
              <button tabindex="0" class="btn btn-primary btn-sm whitespace-nowrap">
                <Iconify icon="mdi:account-plus" class="w-4 h-4 mr-1" />
                {{ t('contacts.addContact') }}
              </button>
              <div tabindex="0" class="dropdown-content card card-compact w-80 p-4 shadow bg-base-100 z-[1]">
                <div class="card-body">
                  <h3 class="card-title text-sm">{{ t('segments.addContactsToSegment') }}</h3>
                  <div class="form-control">
                    <input
                      v-model="contactSearchQuery"
                      type="text"
                      placeholder="Rechercher des contacts..."
                      class="input input-bordered input-sm w-full mb-2"
                      @input="handleContactSearch"
                    />
                  </div>
                  <div v-if="searchingContacts" class="flex justify-center py-2">
                    <span class="loading loading-spinner loading-sm"></span>
                  </div>
                  <div v-else-if="availableContacts.length === 0" class="text-center py-2 text-gray-500">
                    {{ contactSearchQuery ? 'Aucun contact trouvé' : 'Tapez pour rechercher...' }}
                  </div>
                  <div v-else class="max-h-40 overflow-y-auto space-y-1">
                    <label
                      v-for="contact in availableContacts"
                      :key="contact.id"
                      class="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        class="checkbox checkbox-sm"
                        :checked="selectedContactIds.includes(contact.id)"
                        @change="toggleContactSelection(contact.id)"
                      />
                      <div class="flex-1 text-sm">
                        <div class="font-medium">{{ contact.firstName }} {{ contact.lastName }}</div>
                        <div class="text-gray-500 text-xs">{{ contact.email }}</div>
                      </div>
                    </label>
                  </div>
                  <div v-if="selectedContactIds.length > 0" class="flex gap-2 mt-3">
                    <button
                      @click="addSelectedContactsToSegment"
                      class="btn btn-primary btn-sm flex-1"
                      :disabled="addingContacts"
                    >
                      <span v-if="addingContacts" class="loading loading-spinner loading-xs"></span>
                      <Iconify v-else icon="mdi:plus" class="w-3 h-3" />
                      Ajouter {{ selectedContactIds.length }}
                    </button>
                    <button
                      @click="clearSelection"
                      class="btn btn-ghost btn-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="segmentContactsLoading" class="flex justify-center items-center py-8">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div v-else-if="segmentContacts.length === 0" class="text-center py-8">
            <div class="max-w-md mx-auto">
              <Iconify icon="mdi:account-multiple" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold mb-2">{{ t('segments.noContactsInSegment') }}</h3>
              <p class="text-gray-600 mb-4">
                {{ currentSegment.isDynamic 
                    ? t('segments.noContactsInSegmentMessage') 
                    : 'Après avoir validé, vous pouvez ajouter des contacts manuellement à ce segment en vous rendant dans le détail du segment' }}
              </p>
            </div>
          </div>

          <div v-else>
            <!-- Vue desktop (tableau) -->
            <div class="hidden lg:block overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>{{ t('common.name') }}</th>
                    <th>{{ t('common.email') }}</th>
                    <th>{{ t('common.company') }}</th>
                    <th>{{ t('common.assignedTo') }}</th>
                    <th>{{ t('segments.addedType') }}</th>
                    <th>{{ t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="contact in segmentContacts" :key="contact.id">
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar placeholder">
                          <div class="bg-neutral text-neutral-content rounded-full w-10 h-10">
                            <span class="text-xs font-medium">
                              {{ contact.firstName[0] }}{{ contact.lastName[0] }}
                            </span>
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
                      <span v-if="contact.email" class="break-all">{{ contact.email }}</span>
                      <span v-else class="text-gray-400">{{ t('common.notProvided') }}</span>
                    </td>
                    <td>
                      <span v-if="contact.company?.name">{{ contact.company.name }}</span>
                      <span v-else class="text-gray-400">{{ t('common.notAssigned') }}</span>
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

            <!-- Vue mobile (cartes) -->
            <div class="lg:hidden space-y-3">
              <div 
                v-for="contact in segmentContacts" 
                :key="contact.id" 
                class="card bg-base-100 border border-base-300 p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3 flex-1">
                    <div class="avatar placeholder">
                      <div class="bg-neutral text-neutral-content rounded-full w-12 h-12">
                        <span class="text-sm font-medium">
                          {{ contact.firstName[0] }}{{ contact.lastName[0] }}
                        </span>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-sm">
                        {{ contact.firstName }} {{ contact.lastName }}
                      </div>
                      <div v-if="contact.email" class="text-xs text-gray-500 truncate">
                        {{ contact.email }}
                      </div>
                      <div v-if="contact.position" class="text-xs text-gray-500">
                        {{ contact.position }}
                      </div>
                    </div>
                  </div>
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
                </div>
                
                <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span class="text-gray-500">{{ t('common.company') }}:</span>
                    <div class="font-medium">
                      {{ contact.company?.name || t('common.notAssigned') }}
                    </div>
                  </div>
                  <div>
                    <span class="text-gray-500">{{ t('common.assignedTo') }}:</span>
                    <div class="font-medium">
                      {{ contact.assignedTo ? 
                        `${contact.assignedTo.firstName} ${contact.assignedTo.lastName}` : 
                        t('common.notAssigned') 
                      }}
                    </div>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-500">{{ t('segments.addedType') }}:</span>
                    <div class="mt-1">
                      <span
                        :class="[
                          'badge badge-xs',
                          contact.isManuallyAdded ? 'badge-secondary' : 'badge-primary',
                        ]"
                      >
                        {{ contact.isManuallyAdded ? t('segments.manual') : t('segments.automatic') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6">
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
import { useContactStore } from '@/stores/contact'
import { useSegmentStore } from '@/stores/segment'
import type { Contact } from '@/types/contact.types'
import type { SegmentRule } from '@/types/segment.types'
import SegmentExportButton from '@/components/segments/SegmentExportButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const segmentStore = useSegmentStore()
const contactStore = useContactStore()

// État local
const searchQuery = ref('')
const evaluating = ref(false)
const searchTimeout = ref<number | null>(null)

// Pour l'ajout de contacts
const contactSearchQuery = ref('')
const availableContacts = ref<Contact[]>([])
const selectedContactIds = ref<string[]>([])
const searchingContacts = ref(false)
const addingContacts = ref(false)
const contactSearchTimeout = ref<number | null>(null)

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

const viewContact = (contactId: string) => {
  router.push(`/contacts/${contactId}`)
}

const handleContactSearch = async () => {
  if (contactSearchTimeout.value) {
    clearTimeout(contactSearchTimeout.value)
  }

  contactSearchTimeout.value = setTimeout(async () => {
    if (!contactSearchQuery.value || contactSearchQuery.value.length < 2) {
      availableContacts.value = []
      return
    }

    searchingContacts.value = true
    try {
      const results = await contactStore.searchContacts(
        contactSearchQuery.value, 
        10, 
        currentSegment.value?.id
      )
      availableContacts.value = results
    } catch (error) {
      console.error('Erreur lors de la recherche de contacts:', error)
      availableContacts.value = []
    } finally {
      searchingContacts.value = false
    }
  }, 300)
}

const toggleContactSelection = (contactId: string) => {
  const index = selectedContactIds.value.indexOf(contactId)
  if (index === -1) {
    selectedContactIds.value.push(contactId)
  } else {
    selectedContactIds.value.splice(index, 1)
  }
}

const clearSelection = () => {
  selectedContactIds.value = []
  contactSearchQuery.value = ''
  availableContacts.value = []
}

const addSelectedContactsToSegment = async () => {
  if (!currentSegment.value || selectedContactIds.value.length === 0) return

  addingContacts.value = true
  try {
    await segmentStore.addContactsToSegment(currentSegment.value.id, selectedContactIds.value)
    
    // Recharger la liste des contacts du segment
    loadSegmentContacts()
    
    // Nettoyer la sélection
    clearSelection()
    
    // Fermer le dropdown
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur()
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'ajout des contacts:', error)
  } finally {
    addingContacts.value = false
  }
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

const handleSearch = (event?: Event) => {
  // Empêcher le comportement par défaut si c'est un événement de form
  if (event) {
    event.preventDefault()
  }
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(async () => {
    console.log('🔍 Filtrage des contacts avec query:', searchQuery.value)
    
    // Reset à la page 1 lors d'une nouvelle recherche
    if (!currentSegment.value) return
    
    const params: {
      page: number
      itemsPerPage: number
      name?: string
    } = {
      page: 1,
      itemsPerPage: pagination.value.itemsPerPage,
    }

    if (searchQuery.value && searchQuery.value.trim()) {
      params.name = searchQuery.value.trim()
    }

    console.log('🔍 Paramètres de recherche:', params)
    
    try {
      await segmentStore.fetchSegmentContacts(currentSegment.value.id, params)
      console.log('✅ Filtrage terminé')
    } catch (error) {
      console.error('❌ Erreur lors du filtrage:', error)
    }
  }, 800)
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
