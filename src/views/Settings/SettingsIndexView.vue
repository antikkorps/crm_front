<template>
  <div class="params-page container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Paramètres</h1>

    <!-- Grille de cartes de paramètres -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <!-- Carte profil utilisateur -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">Profil utilisateur</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:account" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            Gérez vos informations personnelles, mot de passe et préférences de compte.
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click="navigateTo('profile')">
              Gérer
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte statuts d'entreprise -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">Statuts d'entreprise</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:tag-multiple" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            Personnalisez les statuts pour le suivi de vos entreprises et prospects.
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click="navigateTo('statuses')">
              Gérer
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte segments -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">Segments</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:filter-variant" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            Créez des segments pour cibler des groupes spécifiques de clients.
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click="navigateTo('segments')">
              Gérer
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte plugins -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">Extensions</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:puzzle" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            Gérez vos extensions et découvrez de nouvelles fonctionnalités.
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">Bientôt disponible</span>
            <button class="btn btn-primary btn-sm" disabled>
              Gérer
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte intégrations -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">Intégrations</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:connection" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">Connectez votre CRM à d'autres outils et services.</p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">Bientôt disponible</span>
            <button class="btn btn-primary btn-sm" disabled>
              Gérer
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte notifications -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">Notifications</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:bell" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            Personnalisez vos préférences de notification par email et dans l'application.
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">Bientôt disponible</span>
            <button class="btn btn-primary btn-sm" disabled>
              Gérer
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

const router = useRouter()

// Fonction pour naviguer vers les différentes sections de paramètres
function navigateTo(section: string) {
  switch (section) {
    case 'profile':
      router.push('/profile')
      break
    case 'statuses':
      router.push('/settings/status')
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
