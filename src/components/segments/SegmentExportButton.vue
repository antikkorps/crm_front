<template>
  <div class="dropdown dropdown-end">
    <button 
      tabindex="0" 
      class="btn btn-outline btn-sm"
      :class="buttonClass"
      :disabled="exporting"
    >
      <span v-if="exporting" class="loading loading-spinner loading-xs"></span>
      <Iconify v-else-if="showIcon !== false" icon="mdi:download" class="w-4 h-4 mr-1" />
      {{ exportText || t('common.export') }}
    </button>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 z-[100]">
      <ExportOptions @export="exportSegment" :exporting="exporting" />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSegmentStore } from '@/stores/segment'
import ExportOptions from './ExportOptions.vue'

interface Props {
  segmentId: string
  segmentName: string
  buttonClass?: string
  exportText?: string
  showIcon?: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()
const segmentStore = useSegmentStore()

const exporting = computed(() => segmentStore.loading)

const exportSegment = async (format: 'csv' | 'xlsx' | 'json', includeAll: boolean = false) => {
  try {
    const blob = await segmentStore.exportSegment(props.segmentId, format, includeAll)
    
    // Générer le nom du fichier
    const filename = `segment-${props.segmentName.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.${format}`
    
    // Télécharger le fichier
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    // Fermer le dropdown
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur()
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    // L'erreur est déjà gérée par le store avec une notification
  }
}
</script>