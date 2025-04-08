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
      <!-- Navbar avec apparence conditionnelle - rendue fixe -->
      <div class="navbar bg-base-100 shadow-sm w-full fixed top-0 z-30">
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
        <div v-if="isAuthenticated" class="flex items-center gap-2">
          <!-- ThemeToggle-->
          <ThemeToggle />

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
                <router-link to="/profile" class="flex items-center gap-2">
                  <Iconify icon="mdi:account" class="w-4 h-4" />
                  <span>Profile</span>
                </router-link>
              </li>
              <li>
                <router-link to="/settings" class="flex items-center gap-2">
                  <Iconify icon="mdi:cog" class="w-4 h-4" />
                  <span>Settings</span>
                </router-link>
              </li>
              <li>
                <a @click="handleLogout" class="flex items-center gap-2">
                  <Iconify icon="mdi:logout" class="w-4 h-4" />
                  <span>Logout</span>
                </a>
              </li>
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
        <div v-else class="flex items-center gap-2">
          <ThemeToggle />
          <button class="btn btn-primary" @click="handleLogin">Login</button>
        </div>
      </div>

      <!-- Contenu principal avec padding-top pour compenser la navbar fixe -->
      <main class="container mx-auto p-4 mt-16">
        <slot />
      </main>
    </div>

    <!-- Sidebar - seulement si connecté -->
    <div v-if="isAuthenticated" class="drawer-side z-[999] h-full">
      <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"> </label>

      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
        <!-- En-tête du menu avec bouton de fermeture à droite -->
        <div class="flex justify-between items-center mb-4 pb-2 border-b border-base-300">
          <span class="font-bold text-lg">Menu principal</span>
          <label for="my-drawer-3" class="cursor-pointer">
            <Iconify icon="mdi:close" class="w-6 h-6 btn btn-sm btn-circle btn-primary" />
          </label>
        </div>

        <li v-for="item in NavigationItems" :key="item.label">
          <details open>
            <summary>{{ item.label }}</summary>
            <ul v-if="item.items" class="menu">
              <li v-for="subItem in item.items" :key="subItem.label">
                <router-link :to="subItem.command || '/'">
                  <Iconify :icon="subItem.iconName" class="w-4 h-4" />
                  {{ subItem.label }}
                </router-link>
              </li>
            </ul>
          </details>
        </li>

        <li class="menu-title mt-4">Paramètres</li>
        <li><router-link to="/settings">Configuration</router-link></li>
        <li><router-link to="/profile">Profil</router-link></li>

        <!-- Carte utilisateur en bas du drawer -->
        <div class="mt-auto pt-4 border-t border-base-300">
          <div class="bg-base-100 rounded-box p-4 shadow-sm flex items-center gap-4">
            <div class="avatar">
              <div
                class="w-10 h-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
              >
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div class="flex-1">
              <p class="font-medium">
                {{ currentUser?.firstName || 'Utilisateur' }} {{ currentUser?.lastName || '' }}
              </p>
              <p class="text-xs opacity-70">
                {{ currentUser?.email || 'utilisateur@exemple.com' }}
              </p>
            </div>
            <button @click="handleLogout" class="btn btn-sm btn-error btn-outline hover:text-white">
              <Iconify icon="mdi:logout" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </ul>
    </div>

    <!-- Bouton de retour en haut (optionnel) -->
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="btn btn-circle btn-primary fixed bottom-4 right-4 shadow-lg z-20"
      aria-label="Retour en haut"
    >
      <Iconify icon="mdi:chevron-up" class="w-6 h-6" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { AuthService } from '@/services/auth.service'
import type { User } from '@/types/auth.types'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const sidebarOpen = ref(false)
const currentUser = ref<User | null>(null)

// Fonction pour vérifier l'état d'authentification
const checkAuth = async () => {
  isAuthenticated.value = AuthService.isAuthenticated()
  console.log("État d'authentification:", isAuthenticated.value)

  // Si l'utilisateur est authentifié, récupérer ses informations
  if (isAuthenticated.value) {
    try {
      currentUser.value = await AuthService.getCurrentUser()
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
    }
  }
}

// Vérifier l'authentification au chargement
onMounted(() => {
  checkAuth()
  window.addEventListener('scroll', handleScroll)
})

// Surveiller les changements de route pour mettre à jour l'état d'authentification
watch(
  () => router.currentRoute.value.path,
  () => {
    checkAuth()
  },
)

// Retirer l'écouteur d'événement avant de démonter le composant
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Gérer la connexion
const handleLogin = () => {
  router.push('/login')
}

// Gérer la déconnexion
const handleLogout = () => {
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
    label: 'Accès rapide',
    iconName: 'mdi:home',
    command: '',
    items: [
      {
        label: 'Accueil',
        iconName: 'mdi:home',
        shortcut: '⌘+D',
        command: '/',
      },
      {
        label: 'Dashboard',
        iconName: 'mdi:view-dashboard-outline',
        shortcut: '⌘+D',
        command: '/dashboard',
      },
      {
        label: 'Paramètres',
        iconName: 'mdi:cog',
        shortcut: '⌘+S',
        command: '/settings',
      },
    ],
  },
  {
    label: 'Gestion Commerciale',
    icon: 'pi pi-search',
    badge: 3,
    command: '',
    items: [
      {
        label: 'Contacts',
        iconName: 'mdi:account-multiple',
        shortcut: '⌘+S',
        command: '/contacts',
      },
      {
        label: 'Entreprises',
        iconName: 'mdi:office-building',
        shortcut: '⌘+B',
        command: '/companies',
      },
      {
        label: 'Notes',
        iconName: 'mdi:note-text',
        shortcut: '⌘+U',
        command: '/notes',
      },
    ],
  },
  {
    label: "Besoin d'aide ?",
    iconName: 'mdi:information',
    command: '/about',
    items: [
      {
        label: 'Documentation',
        iconName: 'mdi:book-open',
        shortcut: '⌘+D',
        command: '/documentation',
      },
      {
        label: 'Support',
        iconName: 'mdi:headset-mic',
        shortcut: '⌘+S',
        command: '/support',
      },
    ],
  },
])

// Gestion du bouton de retour en haut
const showScrollTop = ref(false)

// Fonction pour détecter le défilement
const handleScroll = () => {
  if (window.scrollY > 300) {
    showScrollTop.value = true
  } else {
    showScrollTop.value = false
  }
}

// Fonction pour remonter en haut de la page
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
/* Transition pour l'apparition du bouton de retour en haut */
button {
  transition: opacity 0.3s ease;
}
</style>
