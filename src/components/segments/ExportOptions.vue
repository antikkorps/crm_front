<template>
  <li>
    <a @click="handleExport('csv', false)" class="flex items-center gap-2">
      <Iconify icon="mdi:file-delimited" class="w-4 h-4" />
      <div class="flex-1">
        <div class="font-medium">CSV</div>
        <div class="text-xs text-gray-500">{{ t('segments.csvDescription') }}</div>
      </div>
    </a>
  </li>
  <li>
    <a @click="handleExport('xlsx', false)" class="flex items-center gap-2">
      <Iconify icon="mdi:file-excel" class="w-4 h-4" />
      <div class="flex-1">
        <div class="font-medium">Excel (XLSX)</div>
        <div class="text-xs text-gray-500">{{ t('segments.xlsxDescription') }}</div>
      </div>
    </a>
  </li>
  <li>
    <a @click="handleExport('json', false)" class="flex items-center gap-2">
      <Iconify icon="mdi:code-json" class="w-4 h-4" />
      <div class="flex-1">
        <div class="font-medium">JSON</div>
        <div class="text-xs text-gray-500">{{ t('segments.jsonDescription') }}</div>
      </div>
    </a>
  </li>
  <li class="divider"></li>
  <li class="menu-title">
    <span>{{ t('segments.exportOptions') }}</span>
  </li>
  <li>
    <a @click="handleExport('xlsx', true)" class="flex items-center gap-2">
      <Iconify icon="mdi:file-excel-outline" class="w-4 h-4" />
      <div class="flex-1">
        <div class="font-medium">{{ t('segments.completeExport') }}</div>
        <div class="text-xs text-gray-500">{{ t('segments.completeExportDescription') }}</div>
      </div>
    </a>
  </li>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  exporting: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  export: [format: 'csv' | 'xlsx' | 'json', includeAll: boolean]
}>()

const { t } = useI18n()

const handleExport = (format: 'csv' | 'xlsx' | 'json', includeAll: boolean) => {
  emit('export', format, includeAll)
}
</script>