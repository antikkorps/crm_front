<template>
  <div class="form-group">
    <label class="label">{{ label }}</label>

    <!-- Input avec dropdown -->
    <div class="relative">
      <div
        class="input input-bordered w-full min-h-[3rem] p-2 flex flex-wrap gap-2 items-center cursor-text"
        @click="focusInput"
      >
        <!-- Tags sélectionnés -->
        <div
          v-for="selectedItem in selectedItems"
          :key="selectedItem.id"
          class="badge badge-primary gap-2"
        >
          {{ selectedItem.name }}
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle hover:bg-primary-focus"
            @click.stop="removeItem(selectedItem.id)"
          >
            ✕
          </button>
        </div>

        <!-- Input de recherche -->
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="flex-1 min-w-[100px] bg-transparent border-none outline-none"
          :placeholder="selectedItems.length === 0 ? placeholder : ''"
          @focus="showDropdown = true"
          @keydown="handleKeydown"
        />

        <!-- Icône dropdown -->
        <div class="flex-shrink-0">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Dropdown avec options -->
      <div
        v-if="showDropdown && filteredOptions.length > 0"
        class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-box shadow-lg max-h-60 overflow-y-auto"
      >
        <div
          v-for="(option, index) in filteredOptions"
          :key="option.id"
          class="px-4 py-2 hover:bg-base-200 cursor-pointer flex items-center justify-between"
          :class="{ 'bg-base-200': index === highlightedIndex }"
          @click="selectItem(option)"
          @mouseenter="highlightedIndex = index"
        >
          <span>{{ option.name }}</span>
          <div v-if="isSelected(option.id)" class="text-primary">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Message d'aide -->
    <div class="label" v-if="helpText">
      <span class="label-text-alt">{{ helpText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Option {
  id: string
  name: string
}

const props = defineProps<{
  modelValue: string[]
  options: Option[]
  label: string
  placeholder?: string
  helpText?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const searchQuery = ref('')
const showDropdown = ref(false)
const searchInput = ref<HTMLInputElement>()
const highlightedIndex = ref(-1)

// Computed
const selectedItems = computed(() => {
  return props.options.filter((option) => props.modelValue.includes(option.id))
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }
  return props.options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Methods
function focusInput() {
  searchInput.value?.focus()
}

function selectItem(option: Option) {
  if (isSelected(option.id)) {
    removeItem(option.id)
  } else {
    const newValue = [...props.modelValue, option.id]
    emit('update:modelValue', newValue)
  }
  searchQuery.value = ''
  highlightedIndex.value = -1
}

function removeItem(optionId: string) {
  const newValue = props.modelValue.filter((id) => id !== optionId)
  emit('update:modelValue', newValue)
}

function isSelected(optionId: string): boolean {
  return props.modelValue.includes(optionId)
}

function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value) {
    showDropdown.value = true
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1,
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        selectItem(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      showDropdown.value = false
      highlightedIndex.value = -1
      searchQuery.value = ''
      break
    case 'Backspace':
      if (searchQuery.value === '' && selectedItems.value.length > 0) {
        removeItem(selectedItems.value[selectedItems.value.length - 1].id)
      }
      break
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
    highlightedIndex.value = -1
  }
}

// Watchers
watch(
  () => filteredOptions.value,
  () => {
    highlightedIndex.value = -1
  },
)

watch(searchQuery, () => {
  if (searchQuery.value) {
    showDropdown.value = true
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
