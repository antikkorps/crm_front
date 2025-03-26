<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow overflow-hidden">
    <!-- Card Header -->
    <div v-if="$slots.header" class="p-6 border-b border-gray-200 dark:border-gray-700">
      <slot name="header"></slot>
    </div>
    
    <!-- Card Title -->
    <div v-if="title" class="p-6" :class="{ 'pb-0': !$slots.header }">
      <h3 class="font-semibold text-lg">{{ title }}</h3>
      <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ description }}
      </p>
    </div>
    
    <!-- Card Content -->
    <div class="p-6" :class="{ 'pt-0': title && !$slots.header }">
      <slot></slot>
    </div>
    
    <!-- Card Footer -->
    <div v-if="$slots.footer" class="p-6 pt-0 border-t border-gray-200 dark:border-gray-700">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
});
</script>
