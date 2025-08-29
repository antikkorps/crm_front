<template>
  <div class="segments-page container mx-auto p-4">
    <PageHeader :title="t('segments.title')" :back-to="'/contacts'" />

    <!-- En-tête avec actions -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center flex-col-spaced-md mb-6"
    >
      <div>
        <h1 class="text-2xl font-bold">{{ t('segments.title') }}</h1>
        <p class="text-gray-600">{{ t('segments.description') }}</p>
      </div>
      <div class="flex flex-col-spaced-sm">
        <button class="btn btn-primary" @click="navigateToCreate">
          <Iconify icon="mdi:plus" class="w-4 h-4 mr-2" />
          {{ t('segments.createSegment') }}
        </button>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="card bg-base-100 shadow-md mb-6">
      <div class="card-body">
        <div class="flex flex-col md:flex-row flex-col-spaced-md">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.search')"
              class="input input-bordered w-full"
              @input="handleSearch"
            />
          </div>
          <div class="flex flex-col-spaced-sm">
            <select v-model="filterType" class="select select-bordered" @change="handleFilter">
              <option value="">{{ t('common.all') }}</option>
              <option value="dynamic">{{ t('segments.dynamicSegments') }}</option>
              <option value="manual">{{ t('segments.manualSegments') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des segments -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="segments.length === 0" class="text-center py-8">
      <div class="max-w-md mx-auto">
        <Iconify icon="mdi:filter-variant" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">{{ t('segments.noSegments') }}</h3>
        <p class="text-gray-600 mb-4">{{ t('segments.startAddingSegments') }}</p>
        <button class="btn btn-primary" @click="navigateToCreate">
          <Iconify icon="mdi:plus" class="w-4 h-4 mr-2" />
          {{ t('segments.createSegment') }}
        </button>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-6"
    >
      <div
        v-for="segment in segments"
        :key="segment.id"
        class="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        @click="viewSegment(segment.id)"
      >
        <div class="card-body relative">
          <!-- Indicateur de statut -->
          <div class="absolute top-2 right-2">
            <div class="dropdown dropdown-end" @click.stop>
              <button class="btn btn-ghost btn-sm">
                <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
              </button>
              <ul class="dropdown-content menu z-[1] bg-base-100 shadow-lg rounded-box w-52">
                <li>
                  <button @click="viewSegment(segment.id)">
                    <Iconify icon="mdi:eye" class="w-4 h-4" />
                    {{ t('common.view') }}
                  </button>
                </li>
                <li>
                  <button @click="editSegment(segment.id)">
                    <Iconify icon="mdi:pencil" class="w-4 h-4" />
                    {{ t('common.edit') }}
                  </button>
                </li>
                <li v-if="segment.isDynamic">
                  <button @click="evaluateSegment(segment.id)" :disabled="loading">
                    <Iconify icon="mdi:refresh" class="w-4 h-4" />
                    {{ t('segments.evaluateSegment') }}
                  </button>
                </li>
                <li>
                  <button @click="duplicateSegment(segment.id)">
                    <Iconify icon="mdi:content-copy" class="w-4 h-4" />
                    {{ t('common.duplicate') }}
                  </button>
                </li>
                <li class="divider"></li>
                <li>
                  <button
                    @click="deleteSegment(segment.id)"
                    class="text-error hover:bg-error hover:text-error-content"
                  >
                    <Iconify icon="mdi:delete" class="w-4 h-4" />
                    {{ t('common.delete') }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- En-tête avec type et statut -->
          <div class="mb-3">
            <div class="flex items-center flex-col-spaced-sm mb-2">
              <div class="flex items-center flex-col-spaced-xs">
                <Iconify
                  :icon="segment.isDynamic ? 'mdi:cog-refresh' : 'mdi:account-multiple'"
                  :class="['w-5 h-5', segment.isDynamic ? 'text-primary' : 'text-secondary']"
                />
                <span
                  :class="[
                    'badge badge-sm',
                    segment.isDynamic ? 'badge-primary' : 'badge-secondary',
                  ]"
                  class="mx-1"
                >
                  {{ segment.isDynamic ? t('segments.dynamic') : t('segments.manual') }}
                </span>
              </div>

              <!-- Badge de statut d'évaluation -->
              <div v-if="segment.isDynamic" class="flex items-center flex-col-spaced-xs">
                <div
                  :class="[
                    'badge badge-xs',
                    getEvaluationStatus(segment) === 'recent'
                      ? 'badge-success'
                      : getEvaluationStatus(segment) === 'old'
                        ? 'badge-warning'
                        : 'badge-error',
                  ]"
                >
                  {{ getEvaluationStatusLabel(segment) }}
                </div>
              </div>
            </div>

            <h3 class="card-title text-lg leading-tight">{{ segment.name }}</h3>
          </div>

          <p v-if="segment.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
            {{ segment.description }}
          </p>

          <!-- Métrique principale -->
          <div class="bg-base-200 rounded-lg p-3 mb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center flex-col-spaced-sm">
                <Iconify icon="mdi:account-group" class="w-4 h-4 text-primary" />
                <span class="text-sm font-medium">{{ t('common.contacts') }}</span>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-primary">
                  {{ formatNumber(segment.contactCount) }}
                </div>
                <div
                  v-if="segment.isDynamic && segment.lastEvaluatedAt"
                  class="text-xs text-gray-500"
                >
                  {{ t('segments.updated') }} {{ formatRelativeTime(segment.lastEvaluatedAt) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Règles preview pour segments dynamiques -->
          <div v-if="segment.isDynamic && segment.rules && segment.rules.length > 0" class="mb-3">
            <div class="text-xs text-gray-600 mb-1">{{ t('segments.rules') }}:</div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="(rule, index) in segment.rules.slice(0, 2)"
                :key="index"
                class="badge badge-outline badge-xs"
              >
                {{ formatRule(rule) }}
              </span>
              <span v-if="segment.rules.length > 2" class="badge badge-ghost badge-xs">
                +{{ segment.rules.length - 2 }}
              </span>
            </div>
          </div>

          <div class="text-xs text-gray-500 space-y-1">
            <div class="flex justify-between">
              <span>{{ t('segments.createdBy') }}:</span>
              <span class="font-medium"
                >{{ segment.createdBy.firstName }} {{ segment.createdBy.lastName }}</span
              >
            </div>
            <div class="flex justify-between">
              <span>{{ t('segments.createdAt') }}:</span>
              <span>{{ formatDate(segment.createdAt) }}</span>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="card-actions justify-between mt-4" @click.stop>
            <div class="flex flex-wrap gap-1">
              <button
                v-if="segment.isDynamic"
                @click="evaluateSegment(segment.id)"
                class="btn btn-outline btn-xs"
                :disabled="loading"
                :class="{ loading: loading }"
              >
                <Iconify v-if="!loading" icon="mdi:refresh" class="w-3 h-3" />
                {{ t('segments.refresh') }}
              </button>
              <button @click="editSegment(segment.id)" class="btn btn-ghost btn-xs">
                <Iconify icon="mdi:pencil" class="w-3 h-3" />
                {{ t('common.edit') }}
              </button>
              <SegmentExportButton 
                :segment-id="segment.id"
                :segment-name="segment.name"
                button-class="btn-xs"
                :show-icon="false"
              />
            </div>

            <button class="btn btn-primary btn-sm" @click="viewSegment(segment.id)">
              {{ t('common.view') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center mt-8">
      <div class="join">
        <button
          class="join-item btn"
          :disabled="!pagination.hasPreviousPage"
          @click="changePage(pagination.currentPage - 1)"
        >
          {{ t('common.previous') }}
        </button>
        <button
          v-for="page in getPageNumbers()"
          :key="page"
          class="join-item btn"
          :class="{ 'btn-active': page === pagination.currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="join-item btn"
          :disabled="!pagination.hasNextPage"
          @click="changePage(pagination.currentPage + 1)"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import { useSegmentStore } from '@/stores/segment'
import type { Segment, SegmentRule } from '@/types/segment.types'
import SegmentExportButton from '@/components/segments/SegmentExportButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// Interface pour les paramètres de recherche
interface SearchParams {
  page: number
  itemsPerPage: number
  name?: string
  isDynamic?: boolean
}

const router = useRouter()
const { t } = useI18n()
const segmentStore = useSegmentStore()

// État local
const searchQuery = ref('')
const filterType = ref('')
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// Computed
const segments = computed(() => segmentStore.segments)
const loading = computed(() => segmentStore.loading)
const pagination = computed(() => segmentStore.pagination)

// Méthodes
const navigateToCreate = () => {
  router.push('/segments/create')
}

const viewSegment = (id: string) => {
  router.push(`/segments/${id}`)
}

const editSegment = (id: string) => {
  router.push(`/segments/${id}/edit`)
}

const evaluateSegment = async (id: string) => {
  try {
    await segmentStore.evaluateSegment(id)
  } catch (error) {
    console.error("Erreur lors de l'évaluation du segment:", error)
  }
}

const duplicateSegment = async (id: string) => {
  try {
    const segment = segments.value.find((s) => s.id === id)
    if (segment) {
      const newName = `${segment.name} (copie)`
      await segmentStore.duplicateSegment(id, newName)
    }
  } catch (error) {
    console.error('Erreur lors de la duplication du segment:', error)
  }
}


const deleteSegment = async (id: string) => {
  if (confirm(t('common.thisActionCannotBeUndone'))) {
    try {
      await segmentStore.deleteSegment(id)
    } catch (error) {
      console.error('Erreur lors de la suppression du segment:', error)
    }
  }
}

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    loadSegments()
  }, 300)
}

const handleFilter = () => {
  loadSegments()
}

const loadSegments = () => {
  const params: SearchParams = {
    page: pagination.value.currentPage,
    itemsPerPage: pagination.value.itemsPerPage,
  }

  if (searchQuery.value) {
    params.name = searchQuery.value
  }

  if (filterType.value) {
    params.isDynamic = filterType.value === 'dynamic'
  }

  segmentStore.fetchSegments(params)
}

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    const params: SearchParams = {
      page,
      itemsPerPage: pagination.value.itemsPerPage,
    }

    if (searchQuery.value) {
      params.name = searchQuery.value
    }

    if (filterType.value) {
      params.isDynamic = filterType.value === 'dynamic'
    }

    segmentStore.fetchSegments(params)
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
  })
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'il y a quelques secondes'
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)}min`
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 2592000) return `il y a ${Math.floor(diffInSeconds / 86400)}j`

  return formatDate(dateString)
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'k'
  }
  return num.toString()
}

const getEvaluationStatus = (segment: Segment) => {
  if (!segment.lastEvaluatedAt) return 'never'

  const lastEvaluated = new Date(segment.lastEvaluatedAt)
  const now = new Date()
  const diffInHours = (now.getTime() - lastEvaluated.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) return 'recent'
  if (diffInHours < 168) return 'old' // 7 days
  return 'outdated'
}

const getEvaluationStatusLabel = (segment: Segment) => {
  const status = getEvaluationStatus(segment)
  switch (status) {
    case 'recent':
      return t('segments.statusRecent')
    case 'old':
      return t('segments.statusOld')
    case 'never':
      return t('segments.statusNever')
    default:
      return t('segments.statusOutdated')
  }
}

const formatRule = (rule: SegmentRule) => {
  // Condition simple
  if ('field' in rule && 'operator' in rule && 'value' in rule) {
    const fieldLabel = availableFields.find((f) => f.value === rule.field)?.label || rule.field
    const operatorLabel =
      rule.operator === 'equals'
        ? '='
        : rule.operator === 'contains'
          ? '⊃'
          : rule.operator === 'greaterThan'
            ? '>'
            : rule.operator
    return `${fieldLabel} ${operatorLabel} ${rule.value.length > 10 ? rule.value.substring(0, 10) + '...' : rule.value}`
  }
  // Groupe de conditions (AND/OR)
  if ('operator' in rule && (rule.operator === 'AND' || rule.operator === 'OR')) {
    return `${rule.operator} (${rule.conditions?.length || 0})`
  }
  return 'Règle'
}

// Champs disponibles pour formatage des règles
const availableFields = [
  { value: 'firstName', label: 'Prénom' },
  { value: 'lastName', label: 'Nom' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Téléphone' },
  { value: 'position', label: 'Poste' },
  { value: 'statusId', label: 'Statut' },
  { value: 'companyId', label: 'Entreprise' },
  { value: 'assignedToId', label: 'Assigné à' },
]

// Charger les segments au montage
onMounted(() => {
  loadSegments()
})
</script>

<style scoped>
/* Styles spécifiques pour les cartes de segments */
.card {
  border: 1px solid hsl(var(--border-color, var(--fallback-b2)));
  transition: all 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-body {
  position: relative;
  padding: 1.5rem;
}

/* Limitation du texte pour description */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Styles pour les badges de statut */
.badge-success {
  background-color: hsl(var(--success));
  color: hsl(var(--success-content));
}

.badge-warning {
  background-color: hsl(var(--warning));
  color: hsl(var(--warning-content));
}

.badge-error {
  background-color: hsl(var(--error));
  color: hsl(var(--error-content));
}

/* Amélioration de la métrique principale */
.bg-base-200 {
  background: linear-gradient(135deg, hsl(var(--base-200)) 0%, hsl(var(--base-300)) 100%);
}

/* Styles pour les actions rapides */
.card-actions {
  border-top: 1px solid hsl(var(--border-color, var(--fallback-b2)));
  padding-top: 1rem;
  margin-top: 1rem;
}

/* Animation pour les boutons de refresh */
.btn.loading::after {
  border-color: currentColor transparent;
}

/* Styles spécifiques pour les appareils mobiles */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .dropdown-content {
    width: 200px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

/* Styles pour tablettes */
@media (min-width: 768px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Animation d'entrée pour les cartes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.4s ease-out;
}

/* Décaler l'animation pour chaque carte */
.card:nth-child(1) {
  animation-delay: 0.1s;
}
.card:nth-child(2) {
  animation-delay: 0.2s;
}
.card:nth-child(3) {
  animation-delay: 0.3s;
}
.card:nth-child(4) {
  animation-delay: 0.4s;
}
.card:nth-child(5) {
  animation-delay: 0.5s;
}
.card:nth-child(6) {
  animation-delay: 0.6s;
}
</style>
