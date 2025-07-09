import { AuthService } from '@/services/auth.service'
import { useUserStore } from '@/stores/user'
import { canAccessAdmin } from '@/utils/permissions'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

/**
 * Guard pour vérifier l'authentification
 */
export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !AuthService.isAuthenticated()) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  next()
}

/**
 * Guard pour vérifier les permissions d'administration
 */
export async function adminGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAdmin) {
    try {
      // Récupérer les informations de l'utilisateur courant
      const currentUser = await AuthService.getCurrentUser()

      if (!canAccessAdmin(currentUser)) {
        // Rediriger vers le dashboard si l'utilisateur n'a pas les droits d'administration
        next({ name: 'dashboard' })
        return
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des permissions d'administration:", error)
      // En cas d'erreur, rediriger vers le dashboard
      next({ name: 'dashboard' })
      return
    }
  }

  next()
}

/**
 * Guard principal qui combine tous les guards
 */
export async function mainGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> {
  // Vérifier d'abord l'authentification
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !AuthService.isAuthenticated()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Ensuite vérifier les permissions d'administration
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAdmin) {
    try {
      // Utiliser le store utilisateur pour éviter les appels répétés à l'API
      const userStore = useUserStore()
      let currentUser = userStore.currentUser

      // Si l'utilisateur n'est pas dans le store, le charger
      if (!currentUser) {
        try {
          currentUser = await userStore.loadCurrentUser()
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur:", error)
          next({ name: 'Login', query: { redirect: to.fullPath } })
          return
        }
      }

      if (!canAccessAdmin(currentUser)) {
        next({ name: 'dashboard' })
        return
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des permissions d'administration:", error)
      // Si l'erreur est liée à l'authentification, rediriger vers login
      if (
        (error as Error).message?.includes('Session') ||
        (error as Error).message?.includes('authentification')
      ) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
      // Sinon rediriger vers le dashboard
      next({ name: 'dashboard' })
      return
    }
  }

  next()
}
