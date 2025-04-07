<template>
  <div class="h-full w-full">
    <apexchart type="bar" height="100%" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Données du graphique (à remplacer par des données réelles de votre API)
const series = ref([
  {
    name: 'Prospection',
    data: [44, 55, 57, 56, 61, 58],
  },
  {
    name: 'Qualification',
    data: [76, 85, 101, 98, 87, 105],
  },
  {
    name: 'Proposition',
    data: [35, 41, 36, 26, 45, 48],
  },
  {
    name: 'Négociation',
    data: [35, 41, 36, 26, 45, 48],
  },
  {
    name: 'Gagné',
    data: [25, 31, 26, 36, 25, 28],
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

// Remplacer par un appel API pour obtenir des données réelles
const fetchChartData = async () => {
  try {
    // const response = await apiRequest('/v1/analytics/opportunities-pipeline')
    // series.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des données du graphique:', error)
  }
}

onMounted(() => {
  fetchChartData()
})
</script>
