import { useDarkMode } from "~/composables/useDarkMode"
export default defineNuxtPlugin(() => {
  const { initDarkMode } = useDarkMode()

  // Initialize dark mode on client-side
  initDarkMode()
})
