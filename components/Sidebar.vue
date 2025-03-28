<template>
  <v-navigation-drawer v-model="isVisible" temporary :width="280" class="elevation-4">
    <v-list-item class="pa-4">
      <template v-slot:prepend>
        <svg
          width="35"
          height="40"
          viewBox="0 0 35 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style="height: 35px"
        >
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            fill="var(--p-primary-color)"
          />
          <path
            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
            fill="var(--p-text-color)"
          />
        </svg>
      </template>

      <v-list-item-title class="font-weight-bold text-xl">
        {{ appName }}
      </v-list-item-title>

      <template v-slot:append>
        <v-btn icon @click="closeSidebar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list>
      <v-list-subheader class="text-uppercase text-caption">Navigation</v-list-subheader>

      <template v-for="(item, i) in navigationItems" :key="i">
        <!-- Elements with children -->
        <v-list-group v-if="item.children" :value="isItemActive(item)">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="getIcon(item.icon)"
              :title="item.label"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            :to="child.to"
            :prepend-icon="getIcon(child.icon)"
            :title="child.label"
          >
            <template v-slot:append v-if="child.badge">
              <v-chip size="x-small" color="primary">{{ child.badge }}</v-chip>
            </template>
          </v-list-item>
        </v-list-group>

        <!-- Simple menu items -->
        <v-list-item
          v-else
          :to="item.to"
          :prepend-icon="getIcon(item.icon)"
          :title="item.label"
        >
          <template v-slot:append v-if="item.badge">
            <v-chip size="x-small" color="primary">{{ item.badge }}</v-chip>
          </template>
        </v-list-item>
      </template>

      <v-divider class="my-2"></v-divider>

      <v-list-subheader class="text-uppercase text-caption"
        >Administration</v-list-subheader
      >

      <template v-for="(item, i) in adminItems" :key="i">
        <!-- Elements with children -->
        <v-list-group v-if="item.children" :value="isItemActive(item)">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="getIcon(item.icon)"
              :title="item.label"
            ></v-list-item>
          </template>

          <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            :to="child.to"
            :prepend-icon="getIcon(child.icon)"
            :title="child.label"
          ></v-list-item>
        </v-list-group>

        <!-- Simple menu items -->
        <v-list-item
          v-else
          :to="item.to"
          :prepend-icon="getIcon(item.icon)"
          :title="item.label"
        ></v-list-item>
      </template>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list-item nav class="pt-2">
        <template v-slot:prepend>
          <v-avatar size="36">
            <v-img
              src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            ></v-img>
          </v-avatar>
        </template>

        <v-list-item-title>{{ userName }}</v-list-item-title>
        <v-list-item-subtitle>Administrator</v-list-item-subtitle>

        <template v-slot:append>
          <ThemeToggle />
        </template>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from "vue"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  appName: {
    type: String,
    default: () => useRuntimeConfig().public.appName || "CRM",
  },
})

const emit = defineEmits(["update:visible"])
const { user } = useAuth()
const route = useRoute()

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
})

// User name to display in the sidebar footer
const userName = computed(() => {
  if (user.value) {
    return `${user.value.firstName} ${user.value.lastName}`
  }
  return "Guest User"
})

// Close sidebar function
const closeSidebar = () => {
  emit("update:visible", false)
}

// Vérifier si un item est actif (pour les groupes avec enfants)
const isItemActive = (item) => {
  if (!item.children) return false
  return item.children.some((child) => route.path === child.to)
}

// Convertir les icônes Heroicon en icônes Material Design
const getIcon = (iconName) => {
  if (!iconName) return ""

  // Conversion simplifiée des icônes (à adapter selon vos besoins)
  const iconMap = {
    "heroicons:home": "mdi-home",
    "heroicons:users": "mdi-account-group",
    "heroicons:building-office-2": "mdi-domain",
    "heroicons:calendar": "mdi-calendar",
    "heroicons:clock": "mdi-clock-outline",
    "heroicons:check-circle": "mdi-check-circle",
    "heroicons:chart-bar": "mdi-chart-bar",
    "heroicons:chat-bubble-left-ellipsis": "mdi-message-text",
    "heroicons:document-text": "mdi-file-document",
    "heroicons:cog-6-tooth": "mdi-cog",
    "heroicons:user-group": "mdi-account-multiple",
    "heroicons:presentation-chart-line": "mdi-chart-timeline",
    "heroicons:banknotes": "mdi-cash-multiple",
    "heroicons:chart-bar-square": "mdi-chart-box",
  }

  return iconMap[iconName] || "mdi-circle"
}

// Le reste du code avec navigationItems et adminItems reste identique
const navigationItems = ref([
  {
    label: "Dashboard",
    icon: "heroicons:home",
    to: "/",
  },
  {
    label: "Contacts",
    icon: "heroicons:users",
    to: "/contacts",
  },
  {
    label: "Companies",
    icon: "heroicons:building-office-2",
    to: "/companies",
  },
  {
    label: "Activities",
    icon: "heroicons:calendar",
    children: [
      {
        label: "Upcoming",
        icon: "heroicons:clock",
        to: "/activities/upcoming",
      },
      {
        label: "Completed",
        icon: "heroicons:check-circle",
        to: "/activities/completed",
      },
      {
        label: "Reports",
        icon: "heroicons:chart-bar",
        to: "/activities/reports",
      },
    ],
  },
  {
    label: "Messages",
    icon: "heroicons:chat-bubble-left-ellipsis",
    to: "/messages",
    badge: "3",
  },
  {
    label: "Documents",
    icon: "heroicons:document-text",
    to: "/documents",
  },
])

const adminItems = ref([
  {
    label: "Settings",
    icon: "heroicons:cog-6-tooth",
    to: "/settings",
  },
  {
    label: "User Management",
    icon: "heroicons:user-group",
    to: "/users",
  },
  {
    label: "Analytics",
    icon: "heroicons:presentation-chart-line",
    children: [
      {
        label: "Sales",
        icon: "heroicons:banknotes",
        to: "/analytics/sales",
      },
      {
        label: "Performance",
        icon: "heroicons:chart-bar-square",
        to: "/analytics/performance",
      },
    ],
  },
])
</script>
