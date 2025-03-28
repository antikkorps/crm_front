export default defineNuxtPlugin(() => {
  // Cette fonction sera exécutée uniquement côté client
  if (process.client) {
    // Importation dynamique des icônes MDI
    import("@mdi/font/css/materialdesignicons.min.css").catch((err) => {
      console.error("Erreur lors du chargement des icônes MDI:", err)
    })
  }
})
