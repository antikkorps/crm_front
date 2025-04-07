<template>
  <component :is="layout">
    <Toast />
    <router-view />
  </component>
</template>

<script setup lang="ts">
import Toast from '@/components/ToastNotification.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => {
  // Récupère le layout depuis la route actuelle ou utilise le layout par défaut
  const layoutName = (route.meta.layout as string) || 'default'
  return {
    default: DefaultLayout,
    auth: AuthLayout,
    dashboard: DashboardLayout,
  }[layoutName]
})
</script>
