<template>
  <div class="page-header flex items-start gap-4 mb-6">
    <BackButton :to="backTo" :tooltip="backTooltip" />
    <div class="flex-1">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <p v-if="subtitle" class="text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackButton from './BackButton.vue'

interface Props {
  title: string
  subtitle?: string
  backTo?: string | { name: string } | { path: string }
  backTooltip?: string
}

defineProps<Props>()
</script>

<style scoped>
.page-header {
  min-height: 60px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
