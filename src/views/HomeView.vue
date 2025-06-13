<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <div class="hero min-h-[80vh] relative bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="text-5xl font-bold mb-8">MonCRM</h1>
          <div class="flex justify-center mb-6">
            <div class="badge badge-primary badge-lg">Internal Tool</div>
          </div>
          <!-- Message personnalisé selon l'état de connexion -->
          <h2 class="text-2xl font-semibold mb-8">
            <span v-if="!isAuthenticated">
              Centralisez, analysez et optimisez vos relations clients
            </span>
            <span v-else> Bon retour, {{ userStore.currentUser?.firstName }} ! </span>
          </h2>

          <p class="text-lg mb-10 opacity-80">
            <span v-if="!isAuthenticated">
              Accédez à notre plateforme CRM pour gérer efficacement vos contacts, opportunités et
              tâches depuis une interface unique et intuitive.
            </span>
            <span v-else>
              Votre espace de travail vous attend avec toutes vos données à jour.
            </span>
          </p>

          <!-- Bouton conditionnel -->
          <button v-if="!isAuthenticated" @click="handleLogin" class="btn btn-primary btn-lg">
            <Iconify icon="mdi:login" class="w-5 h-5 mr-2" />
            {{ t('auth.login') }}
          </button>

          <button v-else @click="handleGoToDashboard" class="btn btn-primary btn-lg">
            <Iconify icon="mdi:view-dashboard" class="w-5 h-5 mr-2" />
            {{ t('common.accessDashboard') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section - Masquer si connecté -->
    <div v-if="!isAuthenticated" class="py-16 bg-base-100">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Fonctionnalités clés</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="card-body">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-full bg-primary/10">
                  <Iconify :icon="feature.icon" class="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 class="card-title mb-2">{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section spéciale pour utilisateurs connectés -->
    <div v-else class="py-16 bg-base-100">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-12">Vos outils CRM</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            @click="router.push('/companies')"
          >
            <div class="card-body text-center">
              <Iconify icon="mdi:domain" class="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 class="card-title justify-center">Entreprises</h3>
              <p>Gérer vos clients et prospects</p>
            </div>
          </div>

          <div
            class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            @click="router.push('/contacts')"
          >
            <div class="card-body text-center">
              <Iconify icon="mdi:account-group" class="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 class="card-title justify-center">Contacts</h3>
              <p>Votre carnet d'adresses professionnel</p>
            </div>
          </div>

          <div
            class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            @click="router.push('/dashboard')"
          >
            <div class="card-body text-center">
              <Iconify icon="mdi:chart-line" class="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 class="card-title justify-center">Analyses</h3>
              <p>Vos statistiques et rapports</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section - Adapter selon l'état de connexion -->
    <div class="py-14 bg-base-200">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 v-if="!isAuthenticated" class="text-2xl font-bold mb-6">
            Prêt à améliorer votre gestion client ?
          </h2>
          <h2 v-else class="text-2xl font-bold mb-6">Besoin d'aide ou de support ?</h2>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button v-if="!isAuthenticated" @click="handleLogin" class="btn btn-primary">
              <Iconify icon="mdi:login" class="w-5 h-5 mr-2" />
              {{ t('auth.login') }}
            </button>

            <button v-else @click="handleGoToDashboard" class="btn btn-primary">
              <Iconify icon="mdi:view-dashboard" class="w-5 h-5 mr-2" />
              {{ t('common.accessDashboard') }}
            </button>

            <button @click="router.push('/contact-it')" class="btn btn-outline">
              <Iconify icon="mdi:headset" class="w-5 h-5 mr-2" />
              {{ t('button.contactSupport') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer footer-center p-10 bg-neutral text-neutral-content">
      <div>
        <p class="font-bold">MonCRM <br />Outil interne de gestion de la relation client</p>
        <p>© 2023 - {{ t('common.allRightsReserved') }}</p>
      </div>
      <div>
        <div class="grid grid-flow-col gap-4">
          <a class="link link-hover">{{ t('common.documentation') }}</a>
          <a class="link link-hover">{{ t('common.support') }}</a>
          <a class="link link-hover">{{ t('common.about') }}</a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { AuthService } from '@/services/auth.service'
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

// Computed pour vérifier l'état d'authentification
const isAuthenticated = computed(() => AuthService.isAuthenticated())

const features = ref([
  {
    title: 'Gestion des contacts',
    description:
      'Centralisez toutes les informations de vos contacts et suivez leurs interactions.',
    icon: 'mdi:account-group',
  },
  {
    title: "Suivi d'opportunités",
    description: 'Visualisez et gérez votre pipeline commercial en toute simplicité.',
    icon: 'mdi:chart-timeline-variant',
  },
  {
    title: 'Gestion de tâches',
    description: 'Planifiez, attribuez et suivez les tâches pour ne rien oublier.',
    icon: 'mdi:checkbox-marked-circle-outline',
  },
  {
    title: 'Tableaux de bord',
    description: 'Analysez vos performances avec des tableaux de bord interactifs.',
    icon: 'mdi:view-dashboard',
  },
])

// Charger les informations utilisateur si connecté
onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      const user = await AuthService.getCurrentUser()
      userStore.setCurrentUser(user)

      // Redirection automatique vers le dashboard après un petit délai
      // Sauf si l'utilisateur vient explicitement sur la page d'accueil
      const fromRoute = router.currentRoute.value.query.from
      if (!fromRoute) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error)
    }
  }
})

const handleLogin = () => {
  router.push('/login')
}

const handleGoToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.hero {
  background-image: url('@/assets/images/hero-pattern.svg');
  background-position: center;
  background-size: cover;
  background-blend-mode: soft-light;
}
</style>
