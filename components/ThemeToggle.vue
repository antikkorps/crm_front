<template>
  <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle dark mode">
    <transition name="theme-switch" mode="out-in">
      <!-- Sun icon for light mode -->
      <svg
        v-if="!isDark"
        key="sun"
        class="theme-toggle-icon moon-to-sun"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <!-- Moon icon for dark mode -->
      <svg
        v-else
        key="moon"
        class="theme-toggle-icon sun-to-moon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </transition>
  </button>
</template>

<script setup>
import { onMounted, ref } from "vue"

const isDark = ref(false)
const nuxtApp = useNuxtApp()

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

  // Mettre à jour le thème PrimeVue
  if (nuxtApp.$primevue?.changeTheme) {
    nuxtApp.$primevue.changeTheme(isDark.value ? "dark" : "light")
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

  // Mettre à jour le thème PrimeVue
  if (nuxtApp.$primevue?.changeTheme) {
    nuxtApp.$primevue.changeTheme(isDark.value ? "dark" : "light")
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
