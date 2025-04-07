<template>
  <div class="flex items-center">
    <label class="swap swap-rotate btn btn-ghost btn-circle">
      <!-- Checkbox caché pour contrôler l'état -->
      <input
        type="checkbox"
        :checked="isDarkTheme"
        @change="toggleTheme"
        class="theme-controller"
        v-if="mounted"
      />

      <!-- Icône du soleil pour mode clair -->
      <Iconify icon="mdi:white-balance-sunny" class="swap-on w-5 h-5 text-amber-500" />

      <!-- Icône de la lune pour mode sombre -->
      <Iconify icon="mdi:moon-and-stars" class="swap-off w-5 h-5 text-gray-600" />
    </label>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Référence pour savoir si le composant est monté
const mounted = ref(false)
const isDarkTheme = ref(false)

// Fonction pour obtenir le thème actuel
const getTheme = (): 'night' | 'bumblebee' => {
  if (mounted.value) {
    // Vérifier le thème enregistré
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'night' || savedTheme === 'bumblebee') {
      return savedTheme
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Vérifier la préférence du système
      return 'night'
    }
  }

  return 'bumblebee'
}

// Fonction pour appliquer le thème
const applyTheme = (theme: 'night' | 'bumblebee') => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
  isDarkTheme.value = theme === 'night'
}

// Fonction pour basculer entre les thèmes
const toggleTheme = () => {
  const newTheme = isDarkTheme.value ? 'bumblebee' : 'night'
  applyTheme(newTheme)
}

// Initialiser le thème au montage du composant
onMounted(() => {
  mounted.value = true
  const currentTheme = getTheme()
  applyTheme(currentTheme)

  // Écouter les changements de préférence système
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        // Ne changer automatiquement que si l'utilisateur n'a pas explicitement choisi un thème
        applyTheme(e.matches ? 'night' : 'bumblebee')
      }
    })
  }
})
</script>
