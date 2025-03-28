export default defineNuxtPlugin((nuxtApp) => {
  // Ce plugin s'exécute uniquement côté client
  if (process.client) {
    // Fonction pour appliquer les styles sombres
    const applyDarkStyles = () => {
      const isDark = document.documentElement.classList.contains("dark")

      // Sélectionner tous les éléments PrimeVue Drawer
      const drawerElements = document.querySelectorAll(".p-drawer, .p-drawer-content")

      drawerElements.forEach((el) => {
        if (isDark) {
          ;(el as HTMLElement).style.backgroundColor = "#1e1e1e"
          ;(el as HTMLElement).style.color = "#f1f1f1"
        } else {
          ;(el as HTMLElement).style.removeProperty("background-color")
          ;(el as HTMLElement).style.removeProperty("color")
        }
      })
    }

    // Observer pour détecter les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          applyDarkStyles()
        }
      })
    })

    // Observer les changements de classe sur l'élément html
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Appliquer les styles au chargement initial
    setTimeout(applyDarkStyles, 0)

    // Appliquer les styles lors du chargement complet
    window.addEventListener("load", applyDarkStyles)

    // Nettoyer l'observer lors du démontage
    // Correction: "app:unmount" -> "app:unmounted"
    // Ajout d'un commentaire TypeScript pour ignorer la ligne suivante
    // @ts-ignore
    nuxtApp.hook("app:unmounted", () => {
      observer.disconnect()
    })
  }
})
