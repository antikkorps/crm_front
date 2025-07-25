<template>
  <div class="data-table card bg-base-100 shadow-md">
    <div class="card-body">
      <h3 class="card-title mb-4">
        {{ title }}
        <div v-if="loading" class="loading loading-spinner loading-sm ml-2"></div>
      </h3>

      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 3" :key="`loading-${i}`">
                <td v-for="column in columns" :key="`${i}-${column.key}`">
                  <div class="skeleton h-4 w-full"></div>
                </td>
              </tr>
            </template>
            <template v-else-if="data.length === 0">
              <tr>
                <td :colspan="columns.length" class="text-center py-8 text-base-content/60">
                  {{ emptyMessage }}
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(item, index) in data" :key="index">
                <td v-for="column in columns" :key="column.key">
                  <span>{{ getCellValue(item, column) }}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Footer avec actions -->
      <div v-if="showFooter" class="card-actions justify-end mt-4 pt-4 border-t border-base-200">
        <slot name="footer">
          <button v-if="viewAllAction" class="btn btn-ghost btn-sm" @click="$emit('viewAll')">
            {{ t('common.viewAll') }}
            <Iconify icon="mdi:arrow-right" class="w-4 h-4 ml-1" />
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Column {
  key: string
  label: string
  render?: (item: Record<string, unknown>) => string | { template: string }
}

interface Props {
  title: string
  data: Record<string, unknown>[]
  columns: Column[]
  loading?: boolean
  emptyMessage?: string
  showFooter?: boolean
  viewAllAction?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: 'Aucune donnée disponible',
  showFooter: false,
  viewAllAction: false,
})

const { t } = useI18n()

// Fonction pour obtenir la valeur d'une cellule
function getCellValue(item: Record<string, unknown>, column: Column): string {
  if (column.render && typeof column.render === 'function') {
    const result = column.render(item)
    if (typeof result === 'string') {
      return result
    }
    if (typeof result === 'object' && result && 'template' in result) {
      return result.template
    }
  }
  return String(item[column.key] || '')
}

defineEmits<{
  viewAll: []
}>()
</script>

<style scoped>
.data-table {
  @apply transition-all duration-300;
}

.data-table:hover {
  @apply shadow-lg;
}

.skeleton {
  @apply bg-base-300 animate-pulse rounded;
}

/* Animation d'apparition des lignes */
tbody tr {
  animation: fadeInRow 0.3s ease-out;
}

tbody tr:nth-child(1) {
  animation-delay: 0.1s;
}
tbody tr:nth-child(2) {
  animation-delay: 0.2s;
}
tbody tr:nth-child(3) {
  animation-delay: 0.3s;
}
tbody tr:nth-child(4) {
  animation-delay: 0.4s;
}
tbody tr:nth-child(5) {
  animation-delay: 0.5s;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .card-body {
    @apply p-4;
  }

  .card-title {
    @apply text-lg;
  }

  .table {
    @apply text-sm;
  }
}
</style>
