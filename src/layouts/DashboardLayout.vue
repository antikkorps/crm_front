<template>
  <div>
    <Navbar />

    <main class="container h-100 mx-auto p-4 flex-grow bg-base-100">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import Navbar from '@/components/NavbarMain.vue'
</script>
