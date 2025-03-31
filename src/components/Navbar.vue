<template>
  <div class="navbar bg-base-100 shadow-sm">
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
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">daisyUI</a>
    </div>
    <div v-if="isConnected" class="flex-none gap-2">
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
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </div>
    <div v-else class="flex-none gap-2">
      <button class="btn btn-primary" @click="router.push('/login')">Login</button>
    </div>
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
</template>

<script setup>
import { AuthService } from '@/services/auth.service'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isConnected = ref(false)

onMounted(() => {
  isConnected.value = AuthService.isAuthenticated()
  console.log('isAuthenticated() a retourné:', isConnected.value)
})

watch(
  () => router.path,
  () => {
    checkAuth()
  },
)

const logout = () => {
  console.log('Déconnexion')
  AuthService.logout()
  isConnected.value = false
  router.push('/')
}

const items = ref([
  {
    label: 'Home',
    iconName: 'mdi:home',
    command: () => router.push('/'),
  },
  {
    label: 'Projects',
    icon: 'pi pi-search',
    badge: 3,
    items: [
      {
        label: 'Core',
        iconName: 'mdi:lightning-bolt',
        shortcut: '⌘+S',
      },
      {
        label: 'Blocks',
        iconName: 'mdi:server',
        shortcut: '⌘+B',
      },
      {
        separator: true,
      },
      {
        label: 'UI Kit',
        iconName: 'mdi:pencil',
        shortcut: '⌘+U',
      },
    ],
  },
  {
    label: 'A propos',
    iconName: 'mdi:information',
    command: () => router.push('/about'),
  },
])
</script>
