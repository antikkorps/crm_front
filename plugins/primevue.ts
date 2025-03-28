// Define TypeScript interface for PrimeVue instance
interface PrimeVueInstance {
  config?: {
    darkMode: boolean
  }
  changeTheme?: (theme: "light" | "dark") => void
}

export default defineNuxtPlugin((nuxtApp) => {
  // Accédez à PrimeVue pour configurer des options globales
  const primevue = nuxtApp.$primevue as PrimeVueInstance

  if (primevue) {
    // Définir une fonction pour changer le thème
    primevue.changeTheme = (theme: "light" | "dark") => {
      if (primevue.config) {
        primevue.config.darkMode = theme === "dark"
      }
    }

    // Initialiser selon le thème actuel
    if (import.meta.client && primevue.config) {
      const isDark = document.documentElement.classList.contains("dark")
      primevue.config.darkMode = isDark
    }
  }
})
