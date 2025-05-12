<!-- components/common/SearchBar.vue -->
<template>
  <div class="bg-base-200 rounded-box p-4 mb-6">
    <!-- Barre de recherche principale avec design amélioré -->
    <div class="form-control">
      <div class="relative flex w-full">
        <input
          v-model="searchQuery"
          type="text"
          class="input input-bordered w-full pr-12"
          :placeholder="placeholder"
          @input="() => handleSearch()"
        />
        <button class="btn btn-primary absolute right-0 rounded-l-none">
          <Iconify icon="heroicons:magnifying-glass" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Boutons pour afficher/masquer les filtres et réinitialiser les filtres -->
    <div v-if="filters.length > 0" class="flex justify-end mt-2 gap-2">
      <button v-if="hasActiveFilters" class="btn btn-sm btn-outline" @click="resetFilters">
        <Iconify icon="mdi:filter-variant-remove" class="w-4 h-4 mr-1" />
        {{ t('common.reset') }}
      </button>
      <button class="btn btn-sm btn-ghost" @click="filtersVisible = !filtersVisible">
        <Iconify
          :icon="filtersVisible ? 'heroicons:chevron-up' : 'heroicons:adjustments-horizontal'"
          class="w-4 h-4 mr-1"
        />
        {{ filtersVisible ? t('filters.hideFilters') : t('filters.showFilters') }}
      </button>
    </div>

    <!-- Filtres contextuels -->
    <div v-if="filtersVisible && showFilters" class="mt-4">
      <div class="collapse collapse-arrow bg-base-100 shadow-sm">
        <input type="checkbox" checked />
        <div class="collapse-title font-medium">Filtres avancés</div>
        <div class="collapse-content">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Boucle sur les filtres dynamiques -->
            <div v-for="filter in availableFilters" :key="filter.key" class="form-control">
              <label class="label">
                <span class="label-text">{{ filter.label }}</span>
              </label>

              <!-- Sélecteur pour les filtres avec options -->
              <select
                v-if="filter.type === 'select'"
                v-model="selectedFilters[filter.key]"
                class="select select-bordered w-full"
                @change="() => handleSearch()"
              >
                <option value="">{{ filter.placeholder || 'Tous' }}</option>
                <option v-for="option in filter.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>

              <!-- DatePicker pour les filtres de date -->
              <input
                v-else-if="filter.type === 'date'"
                v-model="selectedFilters[filter.key]"
                type="date"
                class="input input-bordered w-full"
                @change="() => handleSearch()"
              />

              <!-- Range pour les filtres numériques -->
              <div v-else-if="filter.type === 'range'" class="flex space-x-2">
                <div class="form-control flex-1">
                  <input
                    v-model="selectedFilters[filter.minKey || `min${filter.key}`]"
                    type="number"
                    class="input input-bordered w-full"
                    :placeholder="`Min ${filter.label}`"
                    @input="() => handleSearch()"
                  />
                </div>
                <div class="form-control flex-1">
                  <input
                    v-model="selectedFilters[filter.maxKey || `max${filter.key}`]"
                    type="number"
                    class="input input-bordered w-full"
                    :placeholder="`Max ${filter.label}`"
                    @input="() => handleSearch()"
                  />
                </div>
              </div>

              <!-- Input texte pour les autres types de filtres -->
              <input
                v-else
                v-model="selectedFilters[filter.key]"
                type="text"
                class="input input-bordered w-full"
                :placeholder="filter.placeholder"
                @input="() => handleSearch()"
              />
            </div>
          </div>

          <!-- Boutons pour réinitialiser ou appliquer les filtres -->
          <div class="flex justify-end mt-4 space-x-2">
            <button
              v-if="showResetButton"
              type="button"
              class="btn btn-sm btn-ghost"
              @click="resetFilters"
            >
              <Iconify icon="heroicons:trash" class="w-4 h-4 mr-1" />
              {{ t('common.reset') }}
            </button>
            <button
              v-if="deferredSearch"
              type="button"
              class="btn btn-sm btn-primary"
              @click="handleSearch(true)"
            >
              <Iconify icon="heroicons:funnel" class="w-4 h-4 mr-1" />
              {{ t('common.apply') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Types pour les filtres
export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'number' | 'range'
  placeholder?: string
  options?: FilterOption[]
  minKey?: string // Pour les filtres de type range
  maxKey?: string // Pour les filtres de type range
}

// Props du composant
const props = defineProps({
  // Configuration de base
  placeholder: {
    type: String,
    default: 'Rechercher...',
  },
  // Filtres disponibles pour ce contexte
  filters: {
    type: Array as () => FilterConfig[],
    default: () => [],
  },
  // Valeurs initiales des filtres
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
  // Délai avant de lancer la recherche automatiquement (en ms)
  debounceTime: {
    type: Number,
    default: 300,
  },
  // Afficher les filtres
  showFilters: {
    type: Boolean,
    default: true,
  },
  // Si true, la recherche n'est effectuée qu'en cliquant sur "Appliquer"
  deferredSearch: {
    type: Boolean,
    default: false,
  },
})

// Événements émis
const emit = defineEmits(['search', 'reset'])

// Données locales
const searchQuery = ref('')
const selectedFilters = ref<Record<string, unknown>>({})
const debounceTimeout = ref<number | null>(null)
const filtersVisible = ref(false)

// Filtres disponibles pour ce contexte
const availableFilters = computed(() => props.filters)

// Bouton de réinitialisation visible si des filtres sont actifs
const showResetButton = computed(() => {
  return (
    searchQuery.value !== '' || Object.values(selectedFilters.value).some((value) => value !== '')
  )
})

// Vérifie si des filtres sont actifs (pour afficher le bouton de réinitialisation)
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' || Object.values(selectedFilters.value).some((value) => value !== '')
  )
})

// Initialiser les filtres avec les valeurs par défaut
onMounted(() => {
  // Initialiser les filtres avec des valeurs vides
  props.filters.forEach((filter) => {
    if (filter.type === 'range') {
      selectedFilters.value[filter.minKey || `min${filter.key}`] = ''
      selectedFilters.value[filter.maxKey || `max${filter.key}`] = ''
    } else {
      selectedFilters.value[filter.key] = ''
    }
  })

  // Appliquer les filtres initiaux s'ils existent
  if (props.initialFilters) {
    Object.keys(props.initialFilters).forEach((key) => {
      if (key in selectedFilters.value) {
        selectedFilters.value[key] = props.initialFilters[key]
      }
    })
  }
})

// Fonction pour réinitialiser les filtres
function resetFilters() {
  searchQuery.value = ''

  // Réinitialiser chaque filtre à une valeur vide
  Object.keys(selectedFilters.value).forEach((key) => {
    selectedFilters.value[key] = ''
  })

  // Émettre l'événement reset
  emit('reset')

  // Déclencher une nouvelle recherche avec les filtres réinitialisés
  handleSearch(true)
}

// Fonction pour gérer la recherche avec debounce
function handleSearch(forceSearch = false) {
  // Annuler tout timeout précédent
  if (debounceTimeout.value !== null) {
    clearTimeout(debounceTimeout.value)
  }

  // Si recherche différée et pas forcée, ne rien faire
  if (props.deferredSearch && !forceSearch) {
    return
  }

  // Appliquer le debounce
  debounceTimeout.value = setTimeout(() => {
    const searchParams = {
      query: searchQuery.value,
      filters: { ...selectedFilters.value },
    }

    // Émettre l'événement de recherche avec les paramètres
    emit('search', searchParams)

    debounceTimeout.value = null
  }, props.debounceTime) as unknown as number
}

// Exposer certaines méthodes pour un usage externe
defineExpose({
  resetFilters,
  setSearchQuery: (query: string) => {
    searchQuery.value = query
    handleSearch(true)
  },
  setFilter: (key: string, value: unknown) => {
    if (key in selectedFilters.value) {
      selectedFilters.value[key] = value
      handleSearch(true)
    }
  },
})
</script>

<style scoped>
/* Styles pour améliorer l'apparence sur mobile */
@media (max-width: 640px) {
  .form-control {
    margin-bottom: 0.5rem;
  }

  .collapse-content .grid {
    gap: 0.75rem;
  }

  .btn {
    height: 2.5rem;
    min-height: 2.5rem;
  }

  .input {
    height: 2.5rem;
    min-height: 2.5rem;
  }
}
</style>
