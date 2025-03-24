export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, checkAuth } = useAuth()

  // Si on n'a pas vérifié l'auth mais qu'on a un token, on vérifie
  await checkAuth()

  // Après la vérification, si on n'est toujours pas authentifié, on redirige
  if (!isAuthenticated.value) {
    return navigateTo("/login")
  }
})
