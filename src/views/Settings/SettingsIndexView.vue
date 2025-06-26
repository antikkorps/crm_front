<template>
  <div class="params-page container mx-auto p-4">
    <PageHeader :title="t('settings.title')" :back-to="'/dashboard'" />

    <!-- Grille de cartes de paramètres -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <!-- Carte profil utilisateur -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('settings.userProfile') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:account" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('settings.userProfileDescription') }}
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click="navigateTo('profile')">
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte segments -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('settings.segments') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:filter-variant" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('settings.segmentsDescription') }}
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click="navigateTo('segments')">
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte notifications -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('settings.notifications') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:bell" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('settings.notificationsDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte préférences d'affichage -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('settings.displayPreferences') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:palette" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('settings.displayPreferencesDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte sécurité -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('settings.security') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:shield" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('settings.securityDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte export de données -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('settings.dataExport') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:download" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('settings.dataExportDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/common/PageHeader.vue'

const router = useRouter()
const { t } = useI18n()

// Fonction pour naviguer vers les différentes sections de paramètres
function navigateTo(section: string) {
  switch (section) {
    case 'profile':
      router.push('/profile')
      break
    case 'segments':
      // Cette fonctionnalité n'est pas encore implémentée
      router.push('/settings/segments')
      break
    default:
      console.warn(`La section ${section} n'est pas encore implémentée`)
  }
}
</script>

<style scoped>
/* Styles spécifiques pour les appareils mobiles */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .badge {
    padding: 0.5rem;
  }
}
</style>
