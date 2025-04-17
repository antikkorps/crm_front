<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
    <div class="stat bg-base-200 rounded-lg p-4">
      <div class="stat-title">Valeur totale</div>
      <div class="stat-value text-2xl md:text-3xl">{{ formatCompactCurrency(totalValue) }}</div>
      <div class="stat-desc">
        <span v-if="totalCount > 0" class="text-info"> {{ totalCount }} opportunités </span>
      </div>
    </div>
    <div class="stat bg-base-200 rounded-lg p-4">
      <div class="stat-title">Valeur moyenne</div>
      <div class="stat-value text-2xl md:text-3xl">{{ formatCompactCurrency(averageValue) }}</div>
    </div>
    <div class="stat bg-base-200 rounded-lg p-4">
      <div class="stat-title">Opportunités gagnées</div>
      <div class="stat-value text-2xl md:text-3xl">{{ formatCompactCurrency(wonValue) }}</div>
      <div class="stat-desc">{{ wonCount }} opportunités</div>
    </div>
    <div class="stat bg-base-200 rounded-lg p-4">
      <div class="stat-title">Taux de conversion</div>
      <div class="stat-value text-2xl md:text-3xl">{{ winRate }}%</div>
      <div class="stat-desc">Opportunités gagnées</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OpportunityStatusDistribution } from '@/services/pipeline.service'
import { computed } from 'vue'

// Props
const props = defineProps<{
  data: OpportunityStatusDistribution[]
}>()

// Calcul des indicateurs clés
const totalValue = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0)
})

const totalCount = computed(() => {
  return props.data.reduce((sum, item) => sum + item.count, 0)
})

const averageValue = computed(() => {
  if (totalCount.value === 0) return 0
  return totalValue.value / totalCount.value
})

const wonStatus = computed(() => {
  return props.data.find(
    (item) => item.name.toLowerCase().includes('won') || item.name.toLowerCase().includes('gagné'),
  )
})

const wonValue = computed(() => {
  return wonStatus.value ? wonStatus.value.value : 0
})

const wonCount = computed(() => {
  return wonStatus.value ? wonStatus.value.count : 0
})

const winRate = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((wonCount.value / totalCount.value) * 100)
})

// Formater les valeurs monétaires en format compact pour les affichages sur mobile
const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
</script>
