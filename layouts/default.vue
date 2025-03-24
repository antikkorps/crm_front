<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow">
      <div class="container flex items-center justify-between px-4 py-4 mx-auto">
        <div class="flex items-center space-x-2">
          <NuxtLink to="/" class="text-xl font-bold">
            {{ appName }}
          </NuxtLink>
        </div>
        <nav class="flex items-center space-x-6">
          <NuxtLink to="/contacts" class="text-gray-700 hover:text-blue-600">
            Contacts
          </NuxtLink>
          <NuxtLink to="/companies" class="text-gray-700 hover:text-blue-600">
            Entreprises
          </NuxtLink>
          <NuxtLink to="/activities" class="text-gray-700 hover:text-blue-600">
            Activités
          </NuxtLink>
          <div class="relative" v-if="isAuthenticated">
            <button @click="toggleUserMenu" class="flex items-center space-x-2">
              <span>{{ user?.firstName }} {{ user?.lastName }}</span>
              <span
                class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
              >
                {{ userInitials }}
              </span>
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
            >
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Mon profil
              </NuxtLink>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <main class="flex-grow container mx-auto px-4 py-8">
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
const appName = config.public.appName || "CRM Client Portal"
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
