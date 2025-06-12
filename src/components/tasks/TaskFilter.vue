<template>
  <div class="flex justify-center mb-4">
    <!-- Filtres des tâches -->
    <div class="w-full sm:w-auto">
      <!-- Version mobile - Dropdown -->
      <div class="dropdown dropdown-end sm:hidden w-full">
        <div tabindex="0" role="button" class="btn btn-outline w-full">
          <Iconify :icon="getCurrentFilterIcon()" class="w-4 h-4" />
          {{ getCurrentFilterLabel() }}
          <span
            v-if="getCurrentFilterCount() !== undefined"
            class="badge badge-primary badge-sm ml-2"
          >
            {{ getCurrentFilterCount() }}
          </span>
          <Iconify icon="mdi:chevron-down" class="w-4 h-4 ml-auto" />
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-lg border"
        >
          <li>
            <a
              @click="setFilter('mine')"
              class="flex items-center justify-between"
              :class="modelValue === 'mine' ? 'bg-primary text-primary-content' : ''"
            >
              <div class="flex items-center">
                <Iconify icon="mdi:account-check" class="w-4 h-4 mr-2" />
                {{ t('tasks.filters.myTasks') }}
              </div>
              <span v-if="taskCounts?.mine !== undefined" class="badge badge-xs sm:badge-sm">
                {{ taskCounts.mine }}
              </span>
            </a>
          </li>
          <li>
            <a
              @click="setFilter('all')"
              class="flex items-center justify-between"
              :class="modelValue === 'all' ? 'bg-primary text-primary-content' : ''"
            >
              <div class="flex items-center">
                <Iconify icon="mdi:format-list-checks" class="w-4 h-4 mr-2" />
                {{ t('tasks.filters.allTasks') }}
              </div>
              <span v-if="taskCounts?.all !== undefined" class="badge badge-xs sm:badge-sm">
                {{ taskCounts.all }}
              </span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Version desktop - Boutons groupés avec join -->
      <div class="join hidden sm:flex">
        <button
          class="btn btn-sm join-item"
          :class="modelValue === 'mine' ? 'btn-primary' : 'btn-outline'"
          @click="setFilter('mine')"
        >
          <Iconify icon="mdi:account-check" class="w-4 h-4" />
          <span class="ml-1">{{ t('tasks.filters.myTasks') }}</span>
          <span v-if="taskCounts?.mine !== undefined" class="badge badge-sm ml-2">
            {{ taskCounts.mine }}
          </span>
        </button>
        <button
          class="btn btn-sm join-item"
          :class="modelValue === 'all' ? 'btn-primary' : 'btn-outline'"
          @click="setFilter('all')"
        >
          <Iconify icon="mdi:format-list-checks" class="w-4 h-4" />
          <span class="ml-1">{{ t('tasks.filters.allTasks') }}</span>
          <span v-if="taskCounts?.all !== undefined" class="badge badge-sm ml-2">
            {{ taskCounts.all }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export type TaskFilterType = 'mine' | 'all'

interface TaskCounts {
  mine?: number
  all?: number
}

// Props
const props = defineProps<{
  modelValue: TaskFilterType
  taskCounts?: TaskCounts
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: TaskFilterType]
}>()

// Méthodes
function setFilter(filter: TaskFilterType) {
  emit('update:modelValue', filter)
}

function getCurrentFilterLabel(): string {
  switch (props.modelValue) {
    case 'mine':
      return t('tasks.filters.myTasks')
    case 'all':
      return t('tasks.filters.allTasks')
    default:
      return t('tasks.filters.allTasks')
  }
}

function getCurrentFilterIcon(): string {
  switch (props.modelValue) {
    case 'mine':
      return 'mdi:account-check'
    case 'all':
      return 'mdi:format-list-checks'
    default:
      return 'mdi:format-list-checks'
  }
}

function getCurrentFilterCount(): number | undefined {
  switch (props.modelValue) {
    case 'mine':
      return props.taskCounts?.mine
    case 'all':
      return props.taskCounts?.all
    default:
      return props.taskCounts?.all
  }
}
</script>
