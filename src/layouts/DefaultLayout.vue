<template>
  <div class="default-layout">
    <nav>
      <Navbar />
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import Navbar from '@/components/NavbarMain.vue'
</script>
