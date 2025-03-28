<template>
  <v-btn icon @click="toggleTheme">
    <v-icon v-if="isDark">mdi-weather-sunny</v-icon>
    <v-icon v-else>mdi-weather-night</v-icon>
  </v-btn>
</template>

<script setup>
import { onMounted, ref } from "vue"

const isDark = ref(false)
const nuxtApp = useNuxtApp()
const { $toggleVuetifyTheme } = useNuxtApp()

// Vérifier le thème actuel au chargement
onMounted(() => {
  isDark.value = document.documentElement.classList.contains("dark")
})

const toggleTheme = () => {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add("dark")
    localStorage.setItem("theme", "dark")
  } else {
    document.documentElement.classList.remove("dark")
    localStorage.setItem("theme", "light")
  }

  // Utiliser la fonction fournie par le plugin
  if ($toggleVuetifyTheme) {
    $toggleVuetifyTheme(isDark.value)
  }
}

onMounted(() => {
  const storedTheme = localStorage.getItem("theme")

  if (storedTheme) {
    isDark.value = storedTheme === "dark"
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  // Appliquer le thème
  if (isDark.value) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }

  // Appliquer le thème à Vuetify
  if ($toggleVuetifyTheme) {
    $toggleVuetifyTheme(isDark.value)
  }
})
</script>

<style scoped>
.theme-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
}

.theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

html.dark .theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Transition animation */
.theme-switch-enter-active,
.theme-switch-leave-active {
  transition: opacity 0.3s, transform 0.5s;
}

.theme-switch-enter-from,
.theme-switch-leave-to {
  opacity: 0;
  transform: scale(0.7) rotate(30deg);
}
</style>
