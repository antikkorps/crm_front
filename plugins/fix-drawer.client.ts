export default defineNuxtPlugin(() => {
  if (process.client) {
    // Injecter des styles directement dans le head
    const styleEl = document.createElement("style")
    styleEl.textContent = `
      html.dark .p-drawer,
      html.dark .p-drawer-content,
      html.dark .p-drawer-header {
        background-color: #1e1e1e !important;
        color: #f1f1f1 !important;
      }
      
      html.dark .p-button-icon,
      html.dark .p-drawer .pi {
        color: #f1f1f1 !important;
      }

      html.dark .p-drawer * {
        color-scheme: dark;
      }
    `
    document.head.appendChild(styleEl)

    // Observer DOM pour attraper les drawers dès leur création
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // ELEMENT_NODE
              // Vérifier les éléments du drawer nouvellement ajoutés
              const el = node as HTMLElement
              if (
                el.classList.contains("p-drawer") ||
                el.classList.contains("p-drawer-content")
              ) {
                if (document.documentElement.classList.contains("dark")) {
                  el.style.backgroundColor = "#1e1e1e"
                  el.style.color = "#f1f1f1"

                  // Appliquer également aux enfants
                  el.querySelectorAll(
                    ".p-drawer-header, .p-drawer-content, .p-drawer-footer"
                  ).forEach((child) => {
                    ;(child as HTMLElement).style.backgroundColor = "#1e1e1e"
                    ;(child as HTMLElement).style.color = "#f1f1f1"
                  })
                }
              }
            }
          })
        }
      }
    })

    // Observer le document entier pour les changements
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    // Observer les changements de classe sur html
    const themeObserver = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark")
      document
        .querySelectorAll(
          ".p-drawer, .p-drawer-content, .p-drawer-header, .p-drawer-footer"
        )
        .forEach((el) => {
          if (isDark) {
            ;(el as HTMLElement).style.backgroundColor = "#1e1e1e"
            ;(el as HTMLElement).style.color = "#f1f1f1"
          } else {
            ;(el as HTMLElement).style.backgroundColor = ""
            ;(el as HTMLElement).style.color = ""
          }
        })
    })

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
  }
})
