<template>
  <v-app>
    <Navbar v-model="sidebarVisible" />
    <Sidebar :visible="sidebarVisible" @update:visible="sidebarVisible = $event" />

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer app>
      <v-container>
        <div class="text-center text-body-2 text-grey">
          &copy; {{ new Date().getFullYear() }} {{ appName }}
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import Sidebar from "@/components/Sidebar.vue"

const config = useRuntimeConfig()
const appName = config.public.appName || "CRM"
const { user, isAuthenticated } = useAuth()
const sidebarVisible = ref(false)
</script>
