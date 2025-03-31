<template>
  <div class="default-layout">
    <header class="bg-primary text-white p-4">
      <nav>
        <Navbar />
        <router-link to="/">Accueil</router-link>
        <router-link to="/clients">Clients</router-link>
        <!-- Autres liens de navigation -->
      </nav>
    </header>

    <main class="container mx-auto p-4">
      <!-- Slot où le contenu de la page sera injecté -->
      <slot />
    </main>

    <footer class="bg-gray-200 p-4 text-center">© 2025 Mon CRM</footer>
  </div>
</template>
<script setup>
import Navbar from '@/components/Navbar.vue'
</script>
