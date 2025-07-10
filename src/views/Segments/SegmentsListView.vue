<template>
  <div class="segments-page container mx-auto p-4">
    <PageHeader :title="t('segments.title')" :back-to="'/contacts'" />

    <!-- En-tête avec actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center flex-col-spaced-md mb-6">
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

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-col-spaced-md">
      <div
        v-for="segment in segments"
        :key="segment.id"
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="card-body">
          <div class="flex justify-between items-start mb-2">
            <h3 class="card-title text-lg">{{ segment.name }}</h3>
            <div class="dropdown dropdown-end">
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
                  <button @click="evaluateSegment(segment.id)">
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
                <li>
                  <button @click="exportSegment(segment.id)">
                    <Iconify icon="mdi:download" class="w-4 h-4" />
                    {{ t('common.export') }}
                  </button>
                </li>
                <li>
                  <button @click="deleteSegment(segment.id)" class="text-error">
                    <Iconify icon="mdi:delete" class="w-4 h-4" />
                    {{ t('common.delete') }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <p v-if="segment.description" class="text-sm text-gray-600 mb-3">
            {{ segment.description }}
          </p>

          <div class="flex items-center flex-col-spaced-sm mb-3">
            <span
              :class="['badge badge-sm', segment.isDynamic ? 'badge-primary' : 'badge-secondary']"
            >
              {{ segment.isDynamic ? t('segments.isDynamic') : t('segments.isManual') }}
            </span>
            <span class="badge badge-outline badge-sm">
              {{ segment.contactCount }} {{ t('common.contacts') }}
            </span>
          </div>

          <div class="text-xs text-gray-500 space-y-1">
            <div class="flex justify-between">
              <span>{{ t('segments.createdBy') }}:</span>
              <span>{{ segment.createdBy.firstName }} {{ segment.createdBy.lastName }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ t('segments.createdAt') }}:</span>
              <span>{{ formatDate(segment.createdAt) }}</span>
            </div>
            <div v-if="segment.lastEvaluatedAt" class="flex justify-between">
              <span>{{ t('segments.lastEvaluated') }}:</span>
              <span>{{ formatDate(segment.lastEvaluatedAt) }}</span>
            </div>
          </div>

          <div class="card-actions justify-end mt-4">
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
const segmentStore = useSegmentStore()

// État local
const searchQuery = ref('')
const filterType = ref('')
const searchTimeout = ref<NodeJS.Timeout | null>(null)

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

const exportSegment = async (id: string) => {
  try {
    // TODO: Implémenter l'export
    console.log('Export du segment:', id)
  } catch (error) {
    console.error("Erreur lors de l'export du segment:", error)
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
  const params: any = {
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
    const params: any = {
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

// Charger les segments au montage
onMounted(() => {
  loadSegments()
})
</script>

<style scoped>
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
}
</style>
