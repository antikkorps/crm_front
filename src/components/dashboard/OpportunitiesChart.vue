<template>
  <div class="h-full w-full">
    <div v-if="isLoading" class="flex justify-center items-center h-full">
      <span class="loading loading-spinner loading-md"></span>
    </div>
    <apexchart v-else type="bar" height="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { PipelineService } from '@/services/pipeline.service'
import { onMounted, ref } from 'vue'

const isLoading = ref(true)

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

// Récupérer les données réelles depuis l'API
const fetchChartData = async () => {
  try {
    isLoading.value = true
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
