<template>
  <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    <div class="text-center">
      <h1 class="text-2xl font-bold dark:text-gray-700 ">Connexion</h1>
      <p class="text-gray-600">Accédez à votre espace client</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div class="space-y-1">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="space-y-1">
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Mot de passe</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div v-if="error" class="p-3 text-sm text-red-600 bg-red-100 rounded">
        {{ error }}
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disabled="loading"
      >
        {{ loading ? "Connexion en cours..." : "Se connecter" }}
      </button>
    </form>
  </div>
</template>

<script setup>
// Définir que cette page utilise le layout auth
definePageMeta({
  layout: "auth",
})

const { login } = useAuth()
const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

const handleLogin = async () => {
  error.value = ""
  loading.value = true

  try {
    await login(email.value, password.value)
    router.push("/")
  } catch (e) {
    error.value = "Email ou mot de passe incorrect"
  } finally {
    loading.value = false
  }
}

// Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
const { isAuthenticated } = useAuth()
if (isAuthenticated.value) {
  router.push("/")
}
</script>
