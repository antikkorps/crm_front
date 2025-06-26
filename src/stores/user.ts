import { UserService } from '@/services/user.service'
import type { User } from '@/types/auth.types'
import type { UserSearchParams } from '@/types/user.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useToastStore } from './toast'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const toastStore = useToastStore()
  const pagination = ref({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
  })

  // Getters
  const getUserById = computed(() => (id: string) => {
    return users.value.find((user) => user.id === id) || null
  })

  const activeUsers = computed(() => {
    return users.value.filter((user) => user.role && user.role.name !== 'Inactive')
  })

  const usersByRole = computed(() => {
    return (roleName: string) =>
      users.value.filter((user) => user.role && user.role.name === roleName)
  })

  // Actions
  async function fetchUsers() {
    loading.value = true
    error.value = null

    try {
      users.value = await UserService.getAllUsers()
      console.log('Users fetched:', users.value)
      return users.value
    } catch (err) {
      error.value = 'Failed to fetch users'
      console.error(err)
      toastStore.error('Erreur lors du chargement des utilisateurs')
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchUserById(id: string) {
    loading.value = true
    error.value = null

    try {
      const user = await UserService.getUserById(id)
      // Mettre à jour l'utilisateur dans la liste si déjà présent
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = user
      } else {
        users.value.push(user)
      }
      return user
    } catch (err) {
      error.value = 'Failed to fetch user details'
      console.error(err)
      toastStore.error('Erreur lors du chargement des détails utilisateur')
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: string, userData: Partial<User>) {
    loading.value = true
    error.value = null

    try {
      const updatedUser = await UserService.updateUser(id, userData)

      // Mettre à jour dans la liste des utilisateurs
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }

      toastStore.success('Utilisateur mis à jour avec succès')
      return updatedUser
    } catch (err) {
      error.value = 'Failed to update user'
      console.error(err)
      toastStore.error("Échec de la mise à jour de l'utilisateur")
      return null
    } finally {
      loading.value = false
    }
  }

  async function searchUsers(params: UserSearchParams) {
    loading.value = true
    error.value = null

    try {
      const response = await UserService.searchUsers(params)
      users.value = response.users

      // Mettre à jour la pagination
      if (response.pagination) {
        pagination.value = response.pagination
      }

      return response
    } catch (err) {
      error.value = 'Failed to search users'
      console.error(err)
      toastStore.error("Erreur lors de la recherche d'utilisateurs")
      return { users: [], pagination: pagination.value }
    } finally {
      loading.value = false
    }
  }

  async function activateUser(id: string) {
    loading.value = true
    error.value = null

    try {
      await UserService.activateUser(id)

      // Mettre à jour le statut de l'utilisateur dans la liste
      const user = users.value.find((u) => u.id === id)
      if (user && user.role) {
        await fetchUserById(id) // Recharger les données mises à jour
      }

      toastStore.success('Utilisateur activé avec succès')
      return true
    } catch (err) {
      error.value = 'Failed to activate user'
      console.error(err)
      toastStore.error("Échec de l'activation de l'utilisateur")
      return false
    } finally {
      loading.value = false
    }
  }

  async function deactivateUser(id: string) {
    loading.value = true
    error.value = null

    try {
      await UserService.deactivateUser(id)

      // Mettre à jour le statut de l'utilisateur dans la liste
      const user = users.value.find((u) => u.id === id)
      if (user && user.role) {
        await fetchUserById(id) // Recharger les données mises à jour
      }

      toastStore.success('Utilisateur désactivé avec succès')
      return true
    } catch (err) {
      error.value = 'Failed to deactivate user'
      console.error(err)
      toastStore.error("Échec de la désactivation de l'utilisateur")
      return false
    } finally {
      loading.value = false
    }
  }

  async function changePassword(userId: string, currentPassword: string, newPassword: string) {
    loading.value = true
    error.value = null

    try {
      await UserService.changePassword(userId, currentPassword, newPassword)
      toastStore.success('Mot de passe modifié avec succès')
      return true
    } catch (err) {
      error.value = 'Failed to change password'
      console.error(err)
      toastStore.error('Échec de la modification du mot de passe')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateAvatar(userId: string, avatarFile: File) {
    loading.value = true
    error.value = null

    try {
      const result = await UserService.updateAvatar(userId, avatarFile)

      // Mettre à jour l'avatar de l'utilisateur dans le store
      const userIndex = users.value.findIndex((u) => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          avatarUrl: result.avatarUrl,
        }
      }

      // Si c'est l'utilisateur actuel, mettre à jour son avatar aussi
      if (currentUser.value && currentUser.value.id === userId) {
        currentUser.value = {
          ...currentUser.value,
          avatarUrl: result.avatarUrl,
        }
      }

      toastStore.success('Avatar mis à jour avec succès')
      return result.avatarUrl
    } catch (err) {
      error.value = 'Failed to update avatar'
      console.error(err)
      toastStore.error("Échec de la mise à jour de l'avatar")
      return null
    } finally {
      loading.value = false
    }
  }

  async function getUserSettings(userId: string) {
    loading.value = true
    error.value = null

    try {
      const settings = await UserService.getUserSettings(userId)
      return settings
    } catch (err) {
      error.value = 'Failed to get user settings'
      console.error(err)
      toastStore.error('Échec du chargement des paramètres utilisateur')
      return {}
    } finally {
      loading.value = false
    }
  }

  async function updateUserSettings(userId: string, settings: Record<string, unknown>) {
    loading.value = true
    error.value = null

    try {
      const updatedSettings = await UserService.updateUserSettings(userId, settings)
      toastStore.success('Paramètres mis à jour avec succès')
      return updatedSettings
    } catch (err) {
      error.value = 'Failed to update user settings'
      console.error(err)
      toastStore.error('Échec de la mise à jour des paramètres')
      return null
    } finally {
      loading.value = false
    }
  }

  // Définir l'utilisateur courant
  function setCurrentUser(user: User | null) {
    currentUser.value = user
  }

  // Mettre à jour l'utilisateur courant en fusionnant les données
  function updateCurrentUser(updatedUser: Partial<User>) {
    if (currentUser.value) {
      // Préserver les propriétés importantes qui pourraient ne pas être retournées par l'API
      const preservedProperties = {
        avatarUrl: currentUser.value.avatarUrl,
        isActive: currentUser.value.isActive,
        isSuperAdmin: currentUser.value.isSuperAdmin,
        role: currentUser.value.role,
        Role: currentUser.value.Role,
        tenant: currentUser.value.tenant,
        Tenant: currentUser.value.Tenant,
        createdAt: currentUser.value.createdAt,
        updatedAt: currentUser.value.updatedAt,
      }

      currentUser.value = {
        ...currentUser.value,
        ...updatedUser,
        ...preservedProperties, // Réappliquer les propriétés préservées
      }
    }
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    pagination,

    // Getters
    getUserById,
    activeUsers,
    usersByRole,

    // Actions
    fetchUsers,
    fetchUserById,
    updateUser,
    searchUsers,
    activateUser,
    deactivateUser,
    changePassword,
    updateAvatar,
    getUserSettings,
    updateUserSettings,
    setCurrentUser,
    updateCurrentUser,
  }
})
