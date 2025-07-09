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
import { AuthService } from '@/services/auth.service'
import { useUserStore } from '@/stores/user'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()

const layout = computed(() => {
  // Récupère le layout depuis la route actuelle ou utilise le layout par défaut
  const layoutName = (route.meta.layout as string) || 'default'
  return {
    default: DefaultLayout,
    auth: AuthLayout,
    dashboard: DashboardLayout,
  }[layoutName]
})

// Initialiser l'utilisateur courant au démarrage de l'application
onMounted(async () => {
  if (AuthService.isAuthenticated() && !userStore.currentUser) {
    try {
      await userStore.loadCurrentUser()
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'utilisateur:", error)
      // En cas d'erreur, déconnecter l'utilisateur
      AuthService.logout()
    }
  }
})
</script>
