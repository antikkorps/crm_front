<template>
  <!-- Structure principale adaptative -->
  <div :class="{ drawer: isAuthenticated }">
    <!-- Drawer toggle - seulement affiché pour les utilisateurs connectés -->
    <input
      v-if="isAuthenticated"
      id="my-drawer-3"
      type="checkbox"
      class="drawer-toggle"
      :checked="sidebarOpen"
      @change="toggleSidebar"
    />

    <!-- Contenu principal -->
    <div :class="{ 'drawer-content': isAuthenticated, 'flex flex-col': true }">
      <!-- Navbar avec apparence conditionnelle -->
      <div class="navbar bg-base-100 shadow-sm w-full">
        <!-- Bouton sidebar - seulement pour les utilisateurs connectés -->
        <div v-if="isAuthenticated" class="flex-none">
          <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>

        <!-- Titre - toujours affiché -->
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">MonCRM</a>
        </div>

        <!-- Section utilisateur - conditionnelle -->
        <div v-if="isAuthenticated" class="flex gap-2">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle">
              <div class="avatar">
                <div class="ring-primary ring-offset-base-100 w-8 rounded-full ring ring-offset-2">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
            </label>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a class="justify-between">Profile <span class="badge">New</span></a>
              </li>
              <li><a>Settings</a></li>
              <li><a @click="handleLogout">Logout</a></li>
            </ul>
          </div>

          <!-- Menu options (trois points) - seulement si connecté -->
          <div class="flex-none">
            <button class="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-5 w-5 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bouton login - seulement si non connecté -->
        <div v-else class="flex-none">
          <button class="btn btn-primary" @click="handleLogin">Login</button>
        </div>
      </div>

      <!-- Contenu principal -->
      <main class="container mx-auto p-4">
        <slot />
      </main>
    </div>

    <!-- Sidebar - seulement si connecté -->
    <div v-if="isAuthenticated" class="drawer-side z-[999] h-full">
      <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"> </label>

      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li class="menu-title">Navigation</li>
        <li v-for="item in NavigationItems" :key="item.label">
          <router-link :to="item.command">{{ item.label }}</router-link>
          <span v-if="item.badge" class="badge badge-primary">{{ item.badge }}</span>
          <ul v-if="item.items" class="submenu">
            <li v-for="subItem in item.items" :key="subItem.label">
              <router-link :to="subItem.command || ''">{{ subItem.label }}</router-link>
              <span v-if="subItem.shortcut" class="badge badge-secondary">{{
                subItem.shortcut
              }}</span>
            </li>
          </ul>
        </li>

        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/contacts">Contacts</router-link></li>
        <li><router-link to="/companies">Entreprises</router-link></li>
        <li><router-link to="/opportunities">Opportunités</router-link></li>

        <li class="menu-title mt-4">Paramètres</li>
        <li><router-link to="/settings">Configuration</router-link></li>
        <li><router-link to="/profile">Profil</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AuthService } from '@/services/auth.service'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)
const sidebarOpen = ref(false)

// Fonction pour vérifier l'état d'authentification
const checkAuth = () => {
  isAuthenticated.value = AuthService.isAuthenticated()
  console.log("État d'authentification:", isAuthenticated.value)
}

// Vérifier l'authentification au chargement
onMounted(() => {
  checkAuth()
})

// Surveiller les changements de route pour mettre à jour l'état d'authentification
watch(
  () => router.currentRoute.value.path, // Correction: router.path → router.currentRoute.value.path
  () => {
    checkAuth()
  },
)

// Gérer la connexion
const handleLogin = () => {
  router.push('/login')
}

// Gérer la déconnexion
const handleLogout = () => {
  // Renommé de logout à handleLogout pour correspondre au template
  console.log('Déconnexion')
  AuthService.logout()
  isAuthenticated.value = false
  router.push('/')
}

// Gérer l'état de la sidebar
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const NavigationItems = ref([
  {
    label: 'Home',
    iconName: 'mdi:home',
    command: '/',
  },
  {
    label: 'Projects',
    icon: 'pi pi-search',
    badge: 3,
    command: '/projects',
    items: [
      {
        label: 'Core',
        iconName: 'mdi:lightning-bolt',
        shortcut: '⌘+S',
        command: '/projects/core',
      },
      {
        label: 'Blocks',
        iconName: 'mdi:server',
        shortcut: '⌘+B',
        command: '/projects/blocks',
      },
      {
        separator: true,
      },
      {
        label: 'UI Kit',
        iconName: 'mdi:pencil',
        shortcut: '⌘+U',
        command: '/projects/ui-kit',
      },
    ],
  },
  {
    label: 'A propos',
    iconName: 'mdi:information',
    command: '/about',
  },
])
</script>
