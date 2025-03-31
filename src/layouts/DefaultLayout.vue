<template>
  <div class="default-layout">
    <nav>
      <Navbar />
    </nav>

    <main class="container h-100 mx-auto p-4">
      <slot />
    </main>

    <footer class="bg-gray-400 p-4 text-center">© 2025 Mon CRM</footer>
  </div>
</template>
<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
