<!-- components/DashboardCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-gray-500 font-medium">{{ title }}</h3>
      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <Icon :name="icon" class="w-5 h-5 text-blue-600" />
      </div>
    </div>
    <div class="text-3xl font-bold">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  icon: {
    type: String,
    default: "carbon:chart-line",
  },
})
</script>
