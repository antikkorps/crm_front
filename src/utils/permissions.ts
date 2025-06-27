import type { User } from '@/types/auth.types'

/**
 * Vérifie si l'utilisateur est super administrateur
 */
export function isSuperAdmin(user: User | null): boolean {
  if (!user) {
    return false
  }

  return user.isSuperAdmin === true
}

/**
 * Vérifie si l'utilisateur a le rôle administrateur (admin simple ou super admin)
 */
export function isAdmin(user: User | null): boolean {
  if (!user) {
    return false
  }

  // Vérifier si l'utilisateur est super admin
  if (isSuperAdmin(user)) {
    return true
  }

  // Vérifier le rôle (peut être 'role' ou 'Role' selon l'API)
  const userRole = user.role || user.Role
  if (!userRole) {
    return false
  }

  // Vérifier si le rôle est "admin" ou "administrator"
  const roleName = userRole.name.toLowerCase()
  return roleName === 'admin' || roleName === 'administrator'
}

/**
 * Vérifie si l'utilisateur a une permission spécifique
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) {
    return false
  }

  // Si l'utilisateur est super admin, il a toutes les permissions
  if (isSuperAdmin(user)) {
    return true
  }

  // Vérifier le rôle (peut être 'role' ou 'Role' selon l'API)
  const userRole = user.role || user.Role
  if (!userRole) {
    return false
  }

  // Vérifier les permissions spécifiques
  if (userRole.permissions) {
    if (Array.isArray(userRole.permissions)) {
      return userRole.permissions.includes(permission)
    } else if (typeof userRole.permissions === 'object') {
      return userRole.permissions[permission] === true
    }
  }

  return false
}

/**
 * Vérifie si l'utilisateur a au moins une des permissions spécifiées
 */
export function hasAnyPermission(user: User | null, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission))
}

/**
 * Vérifie si l'utilisateur a toutes les permissions spécifiées
 */
export function hasAllPermissions(user: User | null, permissions: string[]): boolean {
  return permissions.every((permission) => hasPermission(user, permission))
}

/**
 * Permissions communes pour l'administration
 */
export const ADMIN_PERMISSIONS = {
  USER_MANAGEMENT: 'user:manage',
  ROLE_MANAGEMENT: 'role:manage',
  PERMISSION_MANAGEMENT: 'permission:manage',
  SYSTEM_SETTINGS: 'system:settings',
  AUDIT_LOGS: 'audit:view',
  BACKUP_RESTORE: 'backup:manage',
  SYSTEM_STATS: 'stats:view',
} as const

/**
 * Permissions spécifiques aux super administrateurs
 */
export const SUPER_ADMIN_PERMISSIONS = {
  TENANT_MANAGEMENT: 'tenant:manage',
  TENANT_CREATE: 'tenant:create',
  TENANT_DELETE: 'tenant:delete',
  TENANT_UPDATE: 'tenant:update',
  TENANT_READ: 'tenant:read',
  SYSTEM_WIDE_SETTINGS: 'system:wide:settings',
  ALL_TENANTS_ACCESS: 'all:tenants:access',
} as const

/**
 * Vérifie si l'utilisateur peut accéder à l'administration
 */
export function canAccessAdmin(user: User | null): boolean {
  return isAdmin(user) || hasAnyPermission(user, Object.values(ADMIN_PERMISSIONS))
}

/**
 * Vérifie si l'utilisateur peut gérer les tenants (super admin uniquement)
 */
export function canManageTenants(user: User | null): boolean {
  return isSuperAdmin(user) || hasAnyPermission(user, Object.values(SUPER_ADMIN_PERMISSIONS))
}

/**
 * Vérifie si l'utilisateur peut voir les fonctionnalités super admin
 */
export function canSeeSuperAdminFeatures(user: User | null): boolean {
  return isSuperAdmin(user)
}
