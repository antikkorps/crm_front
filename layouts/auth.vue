<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow flex items-center justify-center">
      <slot />
    </main>
    <footer class="bg-gray-100 py-4">
      <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
        &copy; {{ new Date().getFullYear() }} {{ appName }}
      </div>
    </footer>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const appName = config.public.appName || "CRM Client Portal"
</script>
