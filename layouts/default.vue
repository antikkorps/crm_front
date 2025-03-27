<template>
  <div class="min-h-screen flex flex-col">
    <header>
      <Navbar />
    </header>
    <main class="flex-grow container mx-auto px-4 py-8">
      <Sidebar />
      <slot />
    </main>
    <footer class="bg-gray-100 py-6">
      <div class="container mx-auto px-4 text-center text-gray-600">
        &copy; {{ new Date().getFullYear() }} {{ appName }}
      </div>
    </footer>
  </div>
</template>
<script setup>
import { onClickOutside } from "@vueuse/core"

const config = useRuntimeConfig()
const appName = config.public.appName || "CRM"
const { user, isAuthenticated, logout } = useAuth()
const showUserMenu = ref(false)
const userMenuRef = ref(null)

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
