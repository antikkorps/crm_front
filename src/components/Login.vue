<template>
  <div class="login-page">
    <div class="card-body">
      <h2 class="card-title text-center text-2xl font-bold mb-6">Connexion</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            type="email"
            v-model="email"
            placeholder="exemple@email.com"
            class="input input-bordered"
            required
          />
        </div>

        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text">Mot de passe</span>
          </label>
          <input
            type="password"
            v-model="password"
            placeholder="********"
            class="input input-bordered"
            required
          />
          <label class="label">
            <a href="#" class="label-text-alt link link-hover">Mot de passe oublié ?</a>
          </label>
        </div>

        <div class="form-control mt-6">
          <button
            type="submit"
            class="btn btn-primary w-full"
            :class="{ loading: isLoading }"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </div>

        <div class="divider mt-6">OU</div>

        <div class="form-control flex justify-center">
          <button type="button" class="btn btn-outline mb-2" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuer avec Google
          </button>
        </div>

        <div class="text-center mt-6">
          <p>
            Pas encore de compte ?
            <router-link to="/register" class="link link-primary">S'inscrire</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { AuthService } from '@/services/auth.service'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const response = await AuthService.login({
      email: email.value,
      password: password.value,
    })

    console.log('Login successful:', response.user)

    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    errorMessage.value = error.message || 'Échec de la connexion. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>
