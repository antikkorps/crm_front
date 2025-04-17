<template>
  <div class="h-full w-full">
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <span class="loading loading-spinner loading-md"></span>
    </div>
    <div v-else>
      <!-- Summary section at the top -->
      <div v-if="valueSummary" class="grid grid-cols-4 gap-4 mb-4">
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Valeur totale</div>
          <div class="stat-value">{{ formatCurrency(valueSummary.totalValue) }}</div>
          <div class="stat-desc">
            <span :class="valueSummary.percentChangeLastMonth > 0 ? 'text-success' : 'text-error'">
              {{ valueSummary.percentChangeLastMonth > 0 ? '↗' : '↘' }}
              {{ Math.abs(Math.round(valueSummary.percentChangeLastMonth * 100)) }}%
            </span>
            depuis le mois dernier
          </div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Valeur moyenne</div>
          <div class="stat-value">{{ formatCurrency(valueSummary.averageValue) }}</div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Valeur médiane</div>
          <div class="stat-value">{{ formatCurrency(valueSummary.medianValue) }}</div>
        </div>
        <div class="stat bg-base-200 rounded-lg p-4">
          <div class="stat-title">Taux de succès</div>
          <div class="stat-value">{{ Math.round(valueSummary.winRate * 100) }}%</div>
        </div>
      </div>

      <!-- Chart section -->
      <apexchart
        type="bar"
        height="calc(100% - 130px)"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OpportunitiesValueSummary } from '@/services/pipeline.service'
import { PipelineService } from '@/services/pipeline.service'
import { onMounted, ref } from 'vue'

const isLoading = ref(true)
const valueSummary = ref<OpportunitiesValueSummary | null>(null)

const series = ref([
  {
    name: 'Chargement...',
    data: [0, 0, 0, 0, 0, 0],
  },
])

// Options du graphique
const chartOptions = ref({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
      },
    },
    zoom: {
      enabled: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 5,
      columnWidth: '60%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
    colors: ['transparent'],
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  },
  yaxis: {
    title: {
      text: 'Valeur (€)',
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + ' €'
      },
    },
  },
  colors: ['#4fc3f7', '#7bdcb5', '#ffd54f', '#ff9800', '#4caf50'],
  legend: {
    position: 'bottom',
  },
})

// Formater les valeurs monétaires
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

// Récupérer les données réelles depuis l'API
const fetchChartData = async () => {
  try {
    isLoading.value = true

    // Récupérer les données des opportunités par mois
    const opportunitiesData = await PipelineService.getOpportunitiesByMonth()

    // Mettre à jour les séries de données
    series.value = opportunitiesData.series

    // Mettre à jour les catégories (mois)
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: opportunitiesData.categories,
      },
    }

    // Récupérer les couleurs des statuts si disponibles
    const statuses = await PipelineService.getStatusesByType('OPPORTUNITY')
    if (statuses.length > 0 && statuses.every((status) => status.color)) {
      chartOptions.value = {
        ...chartOptions.value,
        colors: statuses.map((status) => status.color || '#808080'),
      }
    }

    // Récupérer le résumé des valeurs d'opportunités
    valueSummary.value = await PipelineService.getOpportunitiesValueSummary()
  } catch (error) {
    console.error('Erreur lors du chargement des données du graphique:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchChartData()
})
</script>
