export const useDarkMode = () => {
  // Use localStorage to persist theme preference, defaulting to user's system preference
  const isDark = useState<boolean>("dark-mode", () => {
    // Check for stored preference
    if (process.client) {
      const stored = localStorage.getItem("theme")
      if (stored) {
        return stored === "dark"
      }
      // Default to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  // Apply theme on client side
  const applyTheme = () => {
    if (process.client) {
      const htmlEl = document.documentElement
      if (isDark.value) {
        htmlEl.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        htmlEl.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    }
  }

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  // Initialize theme
  const initDarkMode = () => {
    applyTheme()

    // Listen for system preference changes
    if (process.client) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          if (localStorage.getItem("theme") === null) {
            isDark.value = e.matches
            applyTheme()
          }
        })
    }
  }

  return {
    isDark,
    toggleDarkMode,
    initDarkMode,
  }
}
