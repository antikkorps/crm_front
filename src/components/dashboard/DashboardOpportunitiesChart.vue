<template>
  <div class="h-full w-full flex flex-col">
    <!-- Loader -->
    <div v-if="pipelineStore.isLoading" class="flex justify-center items-center h-full w-full">
      <span class="loading loading-spinner loading-md"></span>
    </div>

    <template v-else-if="mountCharts">
      <!-- Summary cards component -->
      <OpportunitySummaryCards :data="pipelineStore.pipelineData" />

      <!-- Chart type selection -->
      <div class="mb-4">
        <div class="tabs tabs-boxed justify-center">
          <a
            @click="pipelineStore.setChartType('monthly')"
            :class="['tab', pipelineStore.activeChartType === 'monthly' ? 'tab-active' : '']"
          >
            Par mois
          </a>
          <a
            @click="pipelineStore.setChartType('status')"
            :class="['tab', pipelineStore.activeChartType === 'status' ? 'tab-active' : '']"
          >
            Par statut
          </a>
        </div>
      </div>

      <!-- Chart visualization options -->
      <div class="mb-4 flex justify-end">
        <div class="btn-group">
          <button
            @click="switchToValueMetric"
            :class="['btn btn-sm', pipelineStore.chartMetric === 'value' ? 'btn-active' : '']"
          >
            Valeur (€)
          </button>
          <button
            @click="switchToCountMetric"
            :class="['btn btn-sm', pipelineStore.chartMetric === 'count' ? 'btn-active' : '']"
          >
            Nombre
          </button>
        </div>
      </div>

      <!-- Chart section with fixed height -->
      <div style="height: 450px" class="w-full">
        <!-- Monthly chart - histogramme -->
        <div v-if="pipelineStore.activeChartType === 'monthly'" class="h-full">
          <apexchart
            ref="monthlyChartRef"
            :key="`monthly-${pipelineStore.chartMetric}`"
            type="bar"
            height="100%"
            :options="monthlyChartOptions"
            :series="pipelineStore.monthlyChartSeries"
          ></apexchart>
        </div>

        <!-- Status chart - horizontal bar -->
        <div v-else class="h-full">
          <apexchart
            ref="statusChartRef"
            :key="`status-${pipelineStore.chartMetric}`"
            type="bar"
            height="100%"
            :options="statusChartOptions"
            :series="
              pipelineStore.chartMetric === 'value'
                ? pipelineStore.statusValueData
                : pipelineStore.statusCountData
            "
          ></apexchart>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { usePipelineStore } from '@/stores/pipeline'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { DashboardOpportunitySummaryCards as OpportunitySummaryCards } from './index'

// Enregistrer le composant ApexChart
const apexchart = VueApexCharts

// Define the chart type
interface ChartInstance {
  chart: {
    destroy: () => void
  }
}

const pipelineStore = usePipelineStore()
const monthlyChartRef = ref<ChartInstance | null>(null)
const statusChartRef = ref<ChartInstance | null>(null)
const mountCharts = ref(false)

// Fonction pour forcer la mise à jour du graphique lors du changement de métrique
const switchToValueMetric = async () => {
  if (pipelineStore.chartMetric === 'value') return
  pipelineStore.setChartMetric('value')
}

const switchToCountMetric = async () => {
  if (pipelineStore.chartMetric === 'count') return
  pipelineStore.setChartMetric('count')
}

// Configuration pour le graphique par statut
const statusChartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    colors: pipelineStore.statusColors,
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 6,
        distributed: true,
        dataLabels: {
          position: 'right',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        if (pipelineStore.chartMetric === 'value') {
          return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            notation: 'compact',
            maximumFractionDigits: 0,
          }).format(val)
        }
        return val.toString()
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#ffffff'],
      },
      offsetX: -20,
      align: 'right',
      textAnchor: 'end',
      position: 'inside',
      padding: 5,
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: pipelineStore.statusLabels,
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
        },
      },
    },
    yaxis: {
      title: {
        text:
          pipelineStore.chartMetric === 'value'
            ? "Statut de l'opportunité"
            : "Statut de l'opportunité",
      },
      labels: {
        formatter: function (val: number) {
          if (pipelineStore.chartMetric === 'value') {
            if (isNaN(val)) return ''

            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              notation: 'compact',
              maximumFractionDigits: 0,
            }).format(val)
          }
          return val.toString()
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          if (pipelineStore.chartMetric === 'value') {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(val)
          }
          return val + ' opportunités'
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#f1f1f1',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: false,
    },
  }
})

// Configuration pour le graphique mensuel (histogramme)
const monthlyChartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      stacked: true,
      height: '100%',
      fontFamily: 'inherit',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
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
      categories: pipelineStore.monthlyCategories,
      labels: {
        rotate: 0,
        style: {
          fontSize: '13px',
        },
      },
    },
    yaxis: {
      title: {
        text: pipelineStore.chartMetric === 'value' ? 'Valeur (€)' : "Nombre d'opportunités",
      },
      labels: {
        formatter: function (val: number) {
          if (pipelineStore.chartMetric === 'value') {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
              notation: 'compact',
              maximumFractionDigits: 0,
            }).format(val)
          }
          return val.toString()
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          if (pipelineStore.chartMetric === 'value') {
            return new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(val)
          }
          return val + ' opportunités'
        },
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      horizontalAlign: 'center',
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  }
})

onMounted(() => {
  // Charger les données au montage du composant
  pipelineStore.fetchPipelineData()
  mountCharts.value = true
})

onBeforeUnmount(() => {
  mountCharts.value = false
  if (monthlyChartRef.value && monthlyChartRef.value.chart) {
    monthlyChartRef.value.chart.destroy()
  }
  if (statusChartRef.value && statusChartRef.value.chart) {
    statusChartRef.value.chart.destroy()
  }
})
</script>
