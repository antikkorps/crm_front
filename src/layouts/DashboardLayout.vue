<template>
  <div class="default-layout">
    <nav>
      <Navbar />
    </nav>

    <main class="container h-100 mx-auto p-4">
      <div>This is the dashboard layout</div>
      <slot />
    </main>
  </div>
</template>
<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
