<template>
  <v-app-bar :elevation="1">
    <v-app-bar-nav-icon @click="openSidebar"></v-app-bar-nav-icon>

    <v-app-bar-title>
      <NuxtLink to="/" class="text-decoration-none d-flex align-center">
        <svg
          width="35"
          height="40"
          viewBox="0 0 35 40"
          fill="none"
          class="mr-2"
          style="height: 30px"
        >
          <!-- SVG paths from original logo -->
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            :fill="$vuetify.theme.current.dark ? '#2196F3' : '#1867C0'"
          />
          <path
            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
            :fill="$vuetify.theme.current.dark ? '#90CAF9' : '#5CBBF6'"
          />
        </svg>
        <span class="font-weight-medium text-lg">{{ appName }}</span>
      </NuxtLink>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Desktop search field -->
    <v-text-field
      variant="solo"
      density="compact"
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="Rechercher..."
      class="d-none d-sm-flex mx-4"
      style="max-width: 300px"
    ></v-text-field>

    <!-- Theme toggle button -->
    <v-btn icon class="mr-2" @click="toggleTheme">
      <v-icon>{{ isDark ? "mdi-weather-sunny" : "mdi-weather-night" }}</v-icon>
    </v-btn>

    <!-- Notifications -->
    <v-badge content="3" color="error" overlap class="mr-3">
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-badge>

    <!-- User menu -->
    <v-menu location="bottom end" transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="text-none" variant="text">
          <v-avatar size="36" class="mr-2">
            <v-img
              src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            ></v-img>
          </v-avatar>
          <span class="d-none d-sm-inline-block">{{ userName }}</span>
          <v-icon class="ml-2">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          prepend-icon="mdi-account"
          title="Mon profil"
          @click="navigateTo('/profile')"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cog"
          title="Paramètres"
          @click="navigateTo('/settings')"
        ></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Se déconnecter"
          @click="handleLogout"
        ></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:modelValue"])
const { user, logout } = useAuth()
const config = useRuntimeConfig()

const appName = computed(() => config.public.appName || "CRM")
const userName = computed(() => {
  if (user.value) {
    return `${user.value.firstName} ${user.value.lastName}`
  }
  return "Utilisateur"
})

const isDark = ref(false)
const nuxtApp = useNuxtApp()

// Vérifier et initialiser le thème
onMounted(() => {
  isDark.value = document.documentElement.classList.contains("dark")
})

const toggleTheme = () => {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme", "dark")
    nuxtApp.$vuetify.theme.global.name = "dark"
  } else {
    document.documentElement.classList.remove("dark")
    localStorage.setItem("theme", "light")
    nuxtApp.$vuetify.theme.global.name = "light"
  }
}

const openSidebar = () => {
  emit("update:modelValue", true)
}

const handleLogout = () => {
  logout()
  navigateTo("/login")
}
</script>
