<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <Navbar v-model="sidebarVisible" />
    </header>
    <Sidebar :visible="sidebarVisible" @update:visible="sidebarVisible = $event" />
    <main class="flex-1 sm:mx-3">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
<script setup>
import Sidebar from "@/components/Sidebar.vue"
import { onClickOutside } from "@vueuse/core"

const config = useRuntimeConfig()
const appName = config.public.appName || "CRM"
const { user, isAuthenticated, logout } = useAuth()
const showUserMenu = ref(false)
const userMenuRef = ref(null)
const sidebarVisible = ref(false)

const userInitials = computed(() => {
  if (!user.value) return ""
  return `${user.value.firstName?.[0] || ""}${
    user.value.lastName?.[0] || ""
  }`.toUpperCase()
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = () => {
  logout()
}

// Fermer le menu lorsqu'on clique ailleurs
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})
</script>
