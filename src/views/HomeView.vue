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
          <h2 class="text-2xl font-semibold mb-8">
            Centralisez, analysez et optimisez vos relations clients
          </h2>
          <p class="text-lg mb-10 opacity-80">
            Accédez à notre plateforme CRM pour gérer efficacement vos contacts, opportunités et
            tâches depuis une interface unique et intuitive.
          </p>
          <button @click="handleLogin" class="btn btn-primary btn-lg">
            <Iconify icon="mdi:login" class="w-5 h-5 mr-2" />
            Se connecter
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-base-100">
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

    <!-- CTA Section -->
    <div class="py-14 bg-base-200">
      <div class="container mx-auto px-4 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">Prêt à améliorer votre gestion client ?</h2>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button @click="handleLogin" class="btn btn-primary">
              <Iconify icon="mdi:login" class="w-5 h-5 mr-2" />
              Se connecter
            </button>
            <button @click="router.push('/contact-it')" class="btn btn-outline">
              <Iconify icon="mdi:headset" class="w-5 h-5 mr-2" />
              Contacter le support IT
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer footer-center p-10 bg-neutral text-neutral-content">
      <div>
        <p class="font-bold">MonCRM <br />Outil interne de gestion de la relation client</p>
        <p>© 2023 - Tous droits réservés</p>
      </div>
      <div>
        <div class="grid grid-flow-col gap-4">
          <a class="link link-hover">Documentation</a>
          <a class="link link-hover">Support</a>
          <a class="link link-hover">À propos</a>
        </div>
      </div>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const handleLogin = () => {
  router.push('/login')
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
