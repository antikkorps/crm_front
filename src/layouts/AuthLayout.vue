<template>
  <div class="auth-layout">
    <div class="flex justify-center items-center min-h-screen bg-base-300">
      <!-- Slot pour le contenu d'authentification -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {})
</script>
