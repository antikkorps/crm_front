<template>
  <div class="flex justify-center">
    <div class="tooltip" :data-tip="tooltipText">
      <div class="btn btn-primary btn-sm" @click="goBack">
        <Iconify icon="uil:arrow-left" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

interface Props {
  to?: string | { name: string } | { path: string }
  tooltip?: string
  fallbackTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  tooltip: undefined,
  fallbackTo: '/dashboard',
})

const { t } = useI18n()
const router = useRouter()

const tooltipText = computed(() => {
  if (props.tooltip) return props.tooltip

  // Déterminer le texte du tooltip basé sur la destination
  if (typeof props.to === 'string') {
    if (props.to === '/settings') return t('common.backToSettings')
    if (props.to === '/dashboard') return t('common.backToDashboard')
    if (props.to === '/admin') return t('common.backToAdmin')
  } else if (props.to && typeof props.to === 'object' && 'name' in props.to) {
    if (props.to.name === 'settings') return t('common.backToSettings')
    if (props.to.name === 'dashboard') return t('common.backToDashboard')
    if (props.to.name === 'admin') return t('common.backToAdmin')
  }

  return t('common.back')
})

const goBack = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    // Navigation par défaut : retour en arrière ou fallback
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(props.fallbackTo)
    }
  }
}
</script>
