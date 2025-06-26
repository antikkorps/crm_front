<template>
  <div class="avatar-demo p-6">
    <h2 class="text-2xl font-bold mb-6">Démonstration des Avatars DiceBear</h2>

    <!-- Test avec différents utilisateurs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div v-for="(testUser, index) in testUsers" :key="index" class="card bg-base-100 shadow-md">
        <div class="card-body text-center">
          <UserAvatar :user="testUser" size="2xl" ring ring-color="primary" :clickable="false" />
          <h3 class="font-semibold mt-4">{{ testUser.firstName }} {{ testUser.lastName }}</h3>
          <p class="text-sm text-gray-600">{{ testUser.email }}</p>
          <p class="text-xs text-gray-500 mt-2">Style: {{ testUser.avatarStyle || 'initials' }}</p>
        </div>
      </div>
    </div>

    <!-- Test avec différents styles -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Test des différents styles</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
        <div v-for="style in availableStyles" :key="style.key" class="text-center">
          <UserAvatar
            :user="{
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              avatarStyle: style.key,
            }"
            size="lg"
            :clickable="false"
          />
          <p class="text-xs mt-2">{{ style.name }}</p>
        </div>
      </div>
    </div>

    <!-- Test du sélecteur d'avatar -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="text-xl font-semibold mb-4">Test du sélecteur d'avatar</h3>
        <div class="flex items-center gap-4 mb-4">
          <UserAvatar :user="currentUser" size="xl" ring ring-color="primary" :clickable="false" />
          <div>
            <h4 class="font-medium">{{ currentUser.firstName }} {{ currentUser.lastName }}</h4>
            <p class="text-sm text-gray-600">{{ currentUser.email }}</p>
            <p class="text-xs text-gray-500">Style: {{ currentUser.avatarStyle || 'initials' }}</p>
          </div>
        </div>
        <AvatarSelector :user="currentUser" @update="handleAvatarUpdate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AvatarSelector from '@/components/common/AvatarSelector.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { ref } from 'vue'

// Utilisateurs de test
const testUsers = ref([
  {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    avatarStyle: 'avataaars',
  },
  {
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@example.com',
    avatarStyle: 'lorelei',
  },
  {
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@example.com',
    avatarStyle: 'bottts',
  },
  {
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@example.com',
    avatarStyle: 'micah',
  },
  {
    firstName: 'Paul',
    lastName: 'Moreau',
    email: 'paul.moreau@example.com',
    avatarStyle: 'personas',
  },
  {
    firstName: 'Julie',
    lastName: 'Simon',
    email: 'julie.simon@example.com',
    avatarStyle: 'miniavs',
  },
])

// Utilisateur courant pour le test du sélecteur
const currentUser = ref({
  firstName: 'Test',
  lastName: 'Utilisateur',
  email: 'test.utilisateur@example.com',
  avatarStyle: 'initials',
  avatarUrl: '',
})

// Styles disponibles
const availableStyles = [
  { key: 'initials', name: 'Initiales' },
  { key: 'avataaars', name: 'Avataaars' },
  { key: 'bottts', name: 'Bottts' },
  { key: 'identicon', name: 'Identicon' },
  { key: 'lorelei', name: 'Lorelei' },
  { key: 'micah', name: 'Micah' },
  { key: 'miniavs', name: 'Miniavs' },
  { key: 'personas', name: 'Personas' },
  { key: 'shapes', name: 'Formes' },
  { key: 'thumbs', name: 'Pouces' },
]

// Gestion de la mise à jour de l'avatar
function handleAvatarUpdate(avatarUrl: string) {
  currentUser.value.avatarUrl = avatarUrl
  console.log('Avatar mis à jour:', avatarUrl)
}
</script>

<style scoped>
.avatar-demo {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
