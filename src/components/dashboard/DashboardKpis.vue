<template>
  <div class="mb-8">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>

    <!-- Version desktop des KPIs (affiché uniquement sur écrans md et plus grands) -->
    <div class="hidden md:grid md:grid-cols-4 gap-2 lg:gap-4">
      <div
        v-for="(metric, idx) in metrics"
        :key="`desktop-${idx}`"
        class="stat bg-base-100 shadow-sm rounded-lg p-3 lg:p-4 overflow-hidden"
      >
        <div class="flex items-center gap-2 lg:gap-3">
          <div class="p-1.5 lg:p-2 rounded-full bg-primary/10 flex-shrink-0">
            <Iconify :icon="metric.icon" class="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
          </div>
          <div class="min-w-0">
            <div class="stat-title text-xs truncate">{{ metric.title }}</div>
            <div class="stat-value text-lg lg:text-2xl font-bold">{{ metric.value }}</div>
          </div>
        </div>
        <div
          class="stat-desc text-xs mt-1 lg:mt-2 truncate"
          :class="metric.trend > 0 ? 'text-success' : 'text-error'"
        >
          {{ metric.trend > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(metric.trend) }}% depuis le mois
          dernier
        </div>
      </div>
    </div>

    <!-- Version mobile des KPIs (affiché uniquement sur écrans plus petits que md) -->
    <div class="grid grid-cols-2 gap-3 md:hidden">
      <div
        v-for="(metric, idx) in metrics"
        :key="`mobile-${idx}`"
        class="bg-base-100 shadow-sm rounded-lg p-3 overflow-hidden"
      >
        <div class="flex items-center gap-2 mb-1">
          <div class="p-1 rounded-full bg-primary/10 flex-shrink-0">
            <Iconify :icon="metric.icon" class="w-4 h-4 text-primary" />
          </div>
          <div class="text-xs font-medium truncate">{{ metric.title }}</div>
        </div>
        <div class="text-lg font-bold">{{ metric.value }}</div>
        <div
          class="text-xs mt-1 truncate"
          :class="metric.trend > 0 ? 'text-success' : 'text-error'"
        >
          {{ metric.trend > 0 ? '↗︎' : '↘︎' }} {{ Math.abs(metric.trend) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface KpiMetric {
  title: string
  value: string
  trend: number
  icon: string
}

defineProps({
  title: {
    type: String,
    default: 'Indicateurs clés',
  },
  metrics: {
    type: Array as () => KpiMetric[],
    required: true,
  },
})
</script>
