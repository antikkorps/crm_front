import { AuthService } from '@/services/auth.service'
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
      const currentUser = await AuthService.getCurrentUser()

      if (!canAccessAdmin(currentUser)) {
        next({ name: 'dashboard' })
        return
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des permissions d'administration:", error)
      next({ name: 'dashboard' })
      return
    }
  }

  next()
}
