// plugins/toast.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("toast", {
    success(message: string, duration = 3000) {
      // Implémenter ici
    },
    error(message: string, duration = 5000) {
      // Implémenter ici
    },
    info(message: string, duration = 3000) {
      // Implémenter ici
    },
  })
})
