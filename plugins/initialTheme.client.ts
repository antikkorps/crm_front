export default defineNuxtPlugin(() => {
  const setInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme")

    if (!storedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      if (prefersDark) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("theme", "light")
      }
    } else if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  setInitialTheme()

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  })
})
