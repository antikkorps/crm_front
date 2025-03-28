<template>
  <v-app :theme="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup>
const theme = computed(() => {
  if (process.client) {
    return document.documentElement.classList.contains("dark") ? "dark" : "light"
  }
  return "light" // Default theme for SSR
})

// Detect theme changes and update Vuetify theme
if (process.client) {
  const observer = new MutationObserver(() => {
    // This will trigger the computed property to update when dark mode changes
    theme.value = document.documentElement.classList.contains("dark") ? "dark" : "light"
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  onUnmounted(() => {
    observer.disconnect()
  })
}
</script>
