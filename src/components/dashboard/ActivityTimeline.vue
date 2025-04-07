<template>
  <div class="card bg-base-100 shadow-sm h-full">
    <div class="card-body">
      <h2 class="card-title flex justify-between items-center">
        <span>{{ title }}</span>
        <button
          class="btn btn-sm btn-ghost"
          @click="onRefresh"
          :class="{ loading: isRefreshing }"
          :disabled="isRefreshing"
        >
          <Iconify v-if="!isRefreshing" icon="mdi:refresh" class="w-4 h-4" />
        </button>
      </h2>
      <div class="overflow-y-auto max-h-80 relative">
        <!-- Overlay de chargement -->
        <div
          v-if="isRefreshing"
          class="absolute inset-0 bg-base-100/70 flex items-center justify-center z-10"
        >
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <!-- Liste des activités -->
        <ul
          class="timeline timeline-compact timeline-snap-icon max-md:timeline-compact timeline-vertical"
        >
          <li v-for="(activity, index) in activities" :key="index">
            <div class="timeline-middle">
              <Iconify :icon="activity.icon" class="w-5 h-5 text-primary" />
            </div>
            <div class="timeline-end mb-4">
              <div class="text-sm font-bold">{{ activity.title }}</div>
              <div class="text-xs text-gray-500">{{ activity.time }}</div>
              <div class="text-sm">{{ activity.description }}</div>
            </div>
            <hr />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

export interface Activity {
  title: string
  description: string
  time: string
  icon: string
}

defineProps({
  title: {
    type: String,
    default: 'Activités récentes',
  },
  activities: {
    type: Array as () => Activity[],
    required: true,
  },
  isRefreshing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['refresh'])

const onRefresh = () => {
  emit('refresh')
}
</script>
