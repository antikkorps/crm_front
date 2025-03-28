// Import the proper Vuetify types

// Define a proper interface for the Vuetify instance
interface VuetifyInstance {
  theme: {
    global: {
      name: {
        value: string
      }
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const init = () => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    // Use type assertion to properly type the Vuetify instance
    const vuetify = nuxtApp.$vuetify as unknown as VuetifyInstance

    // Initialize Vuetify theme on app load
    if (vuetify) {
      vuetify.theme.global.name.value = isDarkMode ? "dark" : "light"
    }
  }

  // Run after component mounted
  nuxtApp.hook("app:mounted", () => {
    setTimeout(init, 0)
  })

  // Provide a function to toggle theme
  return {
    provide: {
      toggleVuetifyTheme: (isDark: boolean) => {
        const vuetify = nuxtApp.$vuetify as unknown as VuetifyInstance
        if (vuetify) {
          vuetify.theme.global.name.value = isDark ? "dark" : "light"
        }
      },
    },
  }
})
