<template>
  <div class="form-control">
    <label v-if="label" class="label">
      <span class="label-text font-medium">
        {{ label }}
        <span v-if="required" class="text-error">*</span>
      </span>
    </label>

    <div class="relative">
      <!-- Input de recherche -->
      <div class="relative">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="input input-bordered w-full pr-24"
          :class="{ 'input-error': hasError }"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeyDown"
          autocomplete="off"
        />

        <!-- Boutons à droite -->
        <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <!-- Bouton clear (si sélection active) -->
          <button
            v-if="selectedCompany || searchQuery"
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            @click="clearSelection"
            :title="t('common.clear')"
          >
            <Iconify icon="mdi:close" class="w-3 h-3" />
          </button>

          <!-- Bouton "Toutes les entreprises" (si allowAll et pas de sélection) -->
          <button
            v-if="allowAll && !selectedCompany && !searchQuery"
            type="button"
            class="btn btn-ghost btn-xs text-xs px-2"
            @click="selectAllCompanies"
            :title="t('companies.allCompanies', 'Toutes les entreprises')"
          >
            {{ t('companies.all', 'Toutes') }}
          </button>

          <!-- Bouton dropdown -->
          <button type="button" class="btn btn-ghost btn-xs btn-square" @click="toggleDropdown">
            <Iconify icon="mdi:chevron-down" class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Dropdown avec résultats -->
      <div
        v-if="showDropdown && (filteredCompanies.length > 0 || loading)"
        class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
      >
        <!-- Loading state -->
        <div v-if="loading" class="p-3 flex items-center justify-center">
          <span class="loading loading-spinner loading-sm mr-2"></span>
          <span class="text-sm">{{ t('common.loading') }}</span>
        </div>

        <!-- Résultats -->
        <template v-else>
          <div v-if="filteredCompanies.length === 0" class="p-3 text-center text-base-content/70">
            {{ t('companies.noResults', 'Aucune entreprise trouvée') }}
          </div>

          <button
            v-for="(company, index) in filteredCompanies"
            :key="company.id"
            type="button"
            class="w-full px-3 py-2 text-left hover:bg-base-200 flex items-center space-x-3 border-b border-base-200 last:border-b-0"
            :class="{ 'bg-base-200': index === selectedIndex }"
            @click="selectCompany(company)"
          >
            <div class="flex-shrink-0">
              <Iconify icon="mdi:office-building" class="w-4 h-4 text-base-content/70" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate">{{ company.name }}</div>
              <div v-if="company.industry" class="text-xs text-base-content/70 truncate">
                {{ company.industry }}
              </div>
            </div>
          </button>
        </template>
      </div>

      <!-- Entreprise sélectionnée (mode lecture seule) -->
      <div
        v-if="!showDropdown && selectedCompany && !searchQuery"
        class="absolute inset-0 bg-base-100 border border-base-300 rounded-lg px-3 py-2 flex items-center space-x-3 pointer-events-none"
      >
        <Iconify icon="mdi:office-building" class="w-4 h-4 text-base-content/70" />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm truncate">{{ selectedCompany.name }}</div>
          <div v-if="selectedCompany.industry" class="text-xs text-base-content/70 truncate">
            {{ selectedCompany.industry }}
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <label v-if="errorMessage" class="label">
      <span class="label-text-alt text-error">{{ errorMessage }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useCompanyStore } from '@/stores/company'
import type { Company } from '@/types/company.types'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  errorMessage?: string
  allowAll?: boolean // Pour permettre "Toutes les entreprises" dans les filtres
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher une entreprise...',
  required: false,
  allowAll: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'company-selected': [company: Company | null]
  clear: []
}>()

const { t } = useI18n()
const companyStore = useCompanyStore()

// État local
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedIndex = ref(-1)
const selectedCompany = ref<Company | null>(null)

// Computed
const loading = computed(() => companyStore.loading)
const companies = computed(() => companyStore.companies)

const hasError = computed(() => !!props.errorMessage)

const filteredCompanies = computed(() => {
  if (!searchQuery.value.trim()) {
    return companies.value.slice(0, 10) // Limite à 10 résultats par défaut
  }

  const query = searchQuery.value.toLowerCase().trim()
  return companies.value
    .filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.industry?.toLowerCase().includes(query),
    )
    .slice(0, 20) // Limite à 20 résultats de recherche
})

// Recherche avec debounce
const debouncedSearch = (() => {
  let timeout: number | null = null
  return (query: string) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        companyStore.searchCompanies({ name: query })
      }
    }, 300)
  }
})()

// Gestionnaires d'événements
function onInput() {
  selectedCompany.value = null
  emit('update:modelValue', '')
  emit('company-selected', null)

  if (searchQuery.value.trim()) {
    showDropdown.value = true
    debouncedSearch(searchQuery.value)
  } else {
    showDropdown.value = false
  }

  selectedIndex.value = -1
}

function onFocus() {
  if (!props.disabled) {
    showDropdown.value = true
    if (!searchQuery.value.trim()) {
      // Charger les entreprises par défaut
      loadDefaultCompanies()
    }
  }
}

function onBlur() {
  // Petit délai pour permettre le clic sur un élément du dropdown
  setTimeout(() => {
    showDropdown.value = false
    selectedIndex.value = -1
  }, 150)
}

function onKeyDown(event: KeyboardEvent) {
  if (!showDropdown.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredCompanies.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && filteredCompanies.value[selectedIndex.value]) {
        selectCompany(filteredCompanies.value[selectedIndex.value])
      }
      break
    case 'Escape':
      showDropdown.value = false
      selectedIndex.value = -1
      searchInput.value?.blur()
      break
  }
}

function toggleDropdown() {
  if (props.disabled) return

  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    if (!searchQuery.value.trim()) {
      loadDefaultCompanies()
    }
  }
}

function selectCompany(company: Company) {
  selectedCompany.value = company
  searchQuery.value = company.name
  showDropdown.value = false
  selectedIndex.value = -1

  emit('update:modelValue', company.id)
  emit('company-selected', company)
}

function clearSelection() {
  selectedCompany.value = null
  searchQuery.value = ''
  showDropdown.value = false
  selectedIndex.value = -1

  emit('update:modelValue', '')
  emit('company-selected', null)
  emit('clear')
}

function selectAllCompanies() {
  emit('update:modelValue', '')
  emit('company-selected', null)
  emit('clear')
}

async function loadDefaultCompanies() {
  if (companies.value.length === 0) {
    await companyStore.fetchCompanies()
  }
}

// Initialisation et watchers
onMounted(async () => {
  await loadDefaultCompanies()

  // Si on a une valeur initiale, trouvons l'entreprise correspondante
  if (props.modelValue) {
    const company = companies.value.find((c) => c.id === props.modelValue)
    if (company) {
      selectedCompany.value = company
      searchQuery.value = company.name
    }
  }
})

// Watcher pour les changements externes du modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      selectedCompany.value = null
      searchQuery.value = ''
    } else if (newValue !== selectedCompany.value?.id) {
      const company = companies.value.find((c) => c.id === newValue)
      if (company) {
        selectedCompany.value = company
        searchQuery.value = company.name
      }
    }
  },
)
</script>

<style scoped>
/* Assurer que le dropdown apparaît au-dessus des autres éléments */
.relative {
  position: relative;
}

/* Styles pour le survol au clavier */
.hover\:bg-base-200:hover,
.bg-base-200 {
  background-color: hsl(var(--b2));
}
</style>
