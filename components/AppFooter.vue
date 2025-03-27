<template>
  <footer class="surface-section border-top-1 surface-border">
    <div class="container mx-auto">
      <div class="grid">
        <!-- Logo et description -->
        <div class="col-12 md:col-4 mb-4 md:mb-0">
          <div class="flex align-items-center">
            <svg
              width="35"
              height="40"
              viewBox="0 0 35 40"
              class="h-8 mr-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05Z"
                fill="var(--p-primary-color)"
              />
              <!-- Plus de chemins SVG si nécessaire -->
            </svg>
            <span class="font-medium text-xl text-900">{{ appName }}</span>
          </div>
        </div>
      </div>

      <!-- Séparateur -->
      <Divider />

      <!-- Copyright et liens sociaux -->
      <div class="flex flex-column md:flex-row justify-content-between items-center">
        <div class="text-sm text-600 pb-4">
          &copy; {{ currentYear }} {{ appName }} - Tous droits réservés.
        </div>
        <div class="flex items-center md:ml-auto pb-4">
          <Button
            v-for="social in socialLinks"
            :key="social.name"
            class="mx-1 p-button-rounded p-button-text text-600 flex items-center justify-center"
          >
            <template #icon>
              <Icon :name="social.icon" class="w-5 h-5" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref } from "vue"

const config = useRuntimeConfig()
const appName = config.public.appName || "CRM"
const currentYear = computed(() => new Date().getFullYear())

// Liens vers les réseaux sociaux
const socialLinks = ref([
  {
    name: "Twitter",
    icon: "mdi:twitter",
    url: "#",
  },
  {
    name: "Facebook",
    icon: "mdi:facebook",
    url: "#",
  },
  {
    name: "LinkedIn",
    icon: "mdi:linkedin",
    url: "#",
  },
  {
    name: "Instagram",
    icon: "mdi:instagram",
    url: "#",
  },
])

// Props pour des options de personnalisation additionnelles si nécessaire
defineProps({
  simplified: {
    type: Boolean,
    default: false,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
})
</script>
