<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

export default {
  computed: {
    layout() {
      // Récupère le layout depuis la route actuelle ou utilise le layout par défaut
      const layout = this.$route.meta.layout || 'default'
      return {
        default: DefaultLayout,
        auth: AuthLayout,
      }[layout]
    },
  },
}
</script>

<style scoped></style>
