<template>
  <div class="profile-page container mx-auto p-4">
    <PageHeader
      :title="t('profile.title')"
      :subtitle="t('profile.description')"
      :back-to="'/settings'"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informations personnelles -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Formulaire informations personnelles -->
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="badge badge-primary p-3">
                <Iconify icon="mdi:account" class="w-5 h-5" />
              </div>
              <h2 class="card-title text-xl">{{ t('profile.personalInfo') }}</h2>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Nom et Prénom -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{ t('profile.firstName') }} *</span>
                  </label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    class="input input-bordered w-full"
                    :placeholder="t('profile.firstNamePlaceholder')"
                    required
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{ t('profile.lastName') }} *</span>
                  </label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    class="input input-bordered w-full"
                    :placeholder="t('profile.lastNamePlaceholder')"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">{{ t('profile.email') }} *</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="input input-bordered w-full"
                  :placeholder="t('profile.emailPlaceholder')"
                  required
                />
              </div>

              <!-- Téléphone et Poste -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{ t('profile.phone') }}</span>
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="input input-bordered w-full"
                    :placeholder="t('profile.phonePlaceholder')"
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{ t('profile.jobTitle') }}</span>
                  </label>
                  <input
                    v-model="form.jobTitle"
                    type="text"
                    class="input input-bordered w-full"
                    :placeholder="t('profile.jobTitlePlaceholder')"
                  />
                </div>
              </div>

              <!-- Biographie -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">{{ t('profile.bio') }}</span>
                </label>
                <textarea
                  v-model="form.bio"
                  class="textarea textarea-bordered w-full h-24 resize-none"
                  :placeholder="t('profile.bioPlaceholder')"
                ></textarea>
              </div>

              <!-- Boutons d'action -->
              <div
                class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-base-300"
              >
                <button type="button" class="btn btn-outline" @click="resetForm">
                  {{ t('common.cancel') }}
                </button>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                  {{ t('common.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Changement de mot de passe -->
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-6">
              <div class="badge badge-secondary p-3">
                <Iconify icon="mdi:lock" class="w-5 h-5" />
              </div>
              <h2 class="card-title text-xl">{{ t('profile.changePassword') }}</h2>
            </div>

            <form @submit.prevent="changePassword" class="space-y-6">
              <!-- Mot de passe actuel -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">{{ t('profile.currentPassword') }} *</span>
                </label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="input input-bordered w-full"
                  :placeholder="t('profile.currentPasswordPlaceholder')"
                  autocomplete="current-password"
                  required
                />
              </div>

              <!-- Nouveau mot de passe et confirmation -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{ t('profile.newPassword') }} *</span>
                  </label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="input input-bordered w-full"
                    :placeholder="t('profile.newPasswordPlaceholder')"
                    autocomplete="new-password"
                    required
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">{{ t('profile.confirmPassword') }} *</span>
                  </label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="input input-bordered w-full"
                    :placeholder="t('profile.confirmPasswordPlaceholder')"
                    autocomplete="new-password"
                    required
                  />
                </div>
              </div>

              <!-- Boutons d'action -->
              <div
                class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-base-300"
              >
                <button type="button" class="btn btn-outline" @click="resetPasswordForm">
                  {{ t('common.cancel') }}
                </button>
                <button type="submit" class="btn btn-secondary" :disabled="passwordLoading">
                  <span v-if="passwordLoading" class="loading loading-spinner loading-sm"></span>
                  {{ t('profile.updatePassword') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar avec informations et actions -->
      <div class="space-y-6">
        <!-- Photo de profil -->
        <div class="card bg-base-100 shadow-md">
          <div class="card-body text-center">
            <div class="avatar mb-4 flex justify-center">
              <div
                class="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-2xl font-bold overflow-hidden"
              >
                <img
                  v-if="userStore.currentUser?.avatarUrl"
                  :src="userStore.currentUser.avatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else>
                  {{ userInitials }}
                </span>
              </div>
            </div>
            <h3 class="font-semibold text-lg">
              {{ userStore.currentUser?.firstName }} {{ userStore.currentUser?.lastName }}
            </h3>
            <p class="text-sm text-gray-600">{{ userStore.currentUser?.email }}</p>
            <div class="mt-4">
              <button class="btn btn-outline btn-sm">
                <Iconify icon="mdi:camera" class="w-4 h-4 mr-1" />
                {{ t('profile.changePhoto') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Informations du compte -->
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="badge badge-info p-2">
                <Iconify icon="mdi:information" class="w-4 h-4" />
              </div>
              <h3 class="font-semibold">{{ t('profile.accountInfo') }}</h3>
            </div>
            <div class="space-y-4 text-sm">
              <div class="flex justify-between items-center py-2 border-b border-base-200">
                <span class="text-gray-600">{{ t('profile.memberSince') }}</span>
                <span class="font-medium">{{ formatDate(userStore.currentUser?.createdAt) }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-200">
                <span class="text-gray-600">{{ t('profile.lastLogin') }}</span>
                <span class="font-medium">{{
                  formatDate(userStore.currentUser?.lastLoginAt)
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-200">
                <span class="text-gray-600">{{ t('profile.role') }}</span>
                <span class="badge badge-primary badge-sm">{{ getRoleName() }}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-200">
                <span class="text-gray-600">{{ t('profile.tenant') }}</span>
                <span class="font-medium">{{ getTenantName() }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600">{{ t('profile.status') }}</span>
                <span class="badge badge-sm" :class="getStatusBadgeClass()">
                  {{ getStatusText() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <div class="flex items-center gap-3 mb-4">
              <div class="badge badge-accent p-2">
                <Iconify icon="mdi:lightning-bolt" class="w-4 h-4" />
              </div>
              <h3 class="font-semibold">{{ t('profile.quickActions') }}</h3>
            </div>
            <div class="space-y-2">
              <button class="btn btn-outline btn-sm w-full justify-start">
                <Iconify icon="mdi:bell" class="w-4 h-4 mr-2" />
                {{ t('profile.notificationSettings') }}
              </button>
              <button class="btn btn-outline btn-sm w-full justify-start">
                <Iconify icon="mdi:shield" class="w-4 h-4 mr-2" />
                {{ t('profile.securitySettings') }}
              </button>
              <button class="btn btn-outline btn-sm w-full justify-start">
                <Iconify icon="mdi:download" class="w-4 h-4 mr-2" />
                {{ t('profile.exportData') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { AuthService } from '@/services/auth.service'
import PageHeader from '@/components/common/PageHeader.vue'

const { t } = useI18n()
const userStore = useUserStore()
const toastStore = useToastStore()

// États du formulaire
const loading = ref(false)
const passwordLoading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobTitle: '',
  bio: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Computed properties
const userInitials = computed(() => {
  const user = userStore.currentUser
  if (user?.firstName && user?.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }
  return user?.email?.charAt(0).toUpperCase() || 'U'
})

// Fonctions
const loadUserData = () => {
  const user = userStore.currentUser
  if (user) {
    form.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      jobTitle: user.jobTitle || '',
      bio: user.bio || '',
    }
  }
}

const updateProfile = async () => {
  loading.value = true
  try {
    const updatedUser = await AuthService.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
      jobTitle: form.value.jobTitle,
      bio: form.value.bio,
    })

    // Mettre à jour les données utilisateur dans le store en préservant les propriétés existantes
    userStore.updateCurrentUser(updatedUser)

    console.log('Profil mis à jour avec succès:', updatedUser)
    console.log('Utilisateur actuel après mise à jour:', userStore.currentUser)
    toastStore.success(t('profile.profileUpdatedSuccess'))
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    toastStore.error(t('profile.profileUpdateError'))
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toastStore.error(t('profile.passwordsDoNotMatch'))
    return
  }

  passwordLoading.value = true
  try {
    await AuthService.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })

    console.log('Mot de passe mis à jour avec succès')
    resetPasswordForm()
    toastStore.success(t('profile.passwordUpdatedSuccess'))
  } catch (error: unknown) {
    console.error('Erreur lors du changement de mot de passe:', error)

    // Gestion spécifique des erreurs de mot de passe
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      toastStore.error(t('profile.currentPasswordIncorrect'))
    } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
      toastStore.error(t('profile.passwordValidationError'))
    } else if (errorMessage.includes('405')) {
      toastStore.error(t('profile.passwordUpdateMethodError'))
    } else {
      toastStore.error(t('profile.passwordUpdateError'))
    }
  } finally {
    passwordLoading.value = false
  }
}

const resetForm = () => {
  loadUserData()
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const getRoleName = () => {
  const user = userStore.currentUser
  if (user?.Role?.name) {
    return user.Role.name
  } else if (user?.role?.name) {
    return user.role.name
  } else if (typeof user?.Role === 'string') {
    return user.Role
  } else if (typeof user?.role === 'string') {
    return user.role
  }
  return 'Utilisateur'
}

const getTenantName = () => {
  const user = userStore.currentUser
  if (user?.Tenant?.name) {
    // Extraire seulement le nom court (avant "Tenant" si présent)
    const name = user.Tenant.name
    return name.replace(/\s+Tenant$/, '')
  } else if (user?.tenant?.name) {
    const name = user.tenant.name
    return name.replace(/\s+Tenant$/, '')
  } else if (typeof user?.tenant === 'string') {
    return user.tenant.replace(/\s+Tenant$/, '')
  }
  return 'Aucun'
}

const getStatusBadgeClass = () => {
  const user = userStore.currentUser
  if (user?.isActive === true) {
    return 'badge-success'
  } else if (user?.isActive === false) {
    return 'badge-error'
  }
  return 'badge-neutral'
}

const getStatusText = () => {
  const user = userStore.currentUser
  if (user?.isActive === true) {
    return t('profile.statusActive')
  } else if (user?.isActive === false) {
    return t('profile.statusInactive')
  }
  return t('profile.statusUnknown')
}

// Charger les données au montage
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-1px);
}

/* Améliorations pour mobile */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .form-control {
    margin-bottom: 0.5rem;
  }

  .label-text {
    font-size: 0.875rem;
  }

  .input,
  .textarea {
    font-size: 0.875rem;
  }

  .btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}

/* Améliorations pour les formulaires */
.form-control {
  position: relative;
}

.input:focus,
.textarea:focus {
  border-color: hsl(var(--p));
  box-shadow: 0 0 0 2px hsl(var(--p) / 0.2);
}

/* Styles pour les badges dans les informations */
.badge {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Amélioration de l'espacement des sections */
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Styles pour les bordures des informations */
.border-b:last-child {
  border-bottom: none;
}
</style>
