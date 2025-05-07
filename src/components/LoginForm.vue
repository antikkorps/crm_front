<template>
  <div class="login-page">
    <div class="card bg-base-100 shadow-lg border border-base-300">
      <div class="card-body">
        <h1 class="text-2xl text-center font-bold text-primary py-5">Mon CRM</h1>

        <h2 class="card-title text-center text-2xl font-bold mb-6 text-primary">
          {{ t('auth.login') }}
        </h2>

        <!-- Affichage des erreurs -->
        <div v-if="errorMessage" class="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-control mb-4 flex flex-col">
            <label class="label">
              <span class="label-text font-medium text-base-content">{{ t('common.email') }}</span>
            </label>
            <input
              type="email"
              v-model="email"
              placeholder="exemple@email.com"
              class="input input-bordered bg-base-200 focus:border-primary w-full"
              required
            />
          </div>

          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text font-medium text-base-content">{{ t('auth.password') }}</span>
            </label>
            <input
              type="password"
              v-model="password"
              placeholder="********"
              class="input input-bordered bg-base-200 focus:border-primary w-full"
              required
            />
            <label class="label">
              <a href="#" class="label-text-alt link link-hover text-primary">{{
                t('auth.forgotPassword')
              }}</a>
            </label>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full text-primary-content hover:bg-primary-focus"
              :class="{ loading: isLoading }"
              :disabled="isLoading"
            >
              {{ isLoading ? t('auth.connexionPending') : t('auth.login') }}
            </button>
          </div>

          <div class="divider mt-6 before:bg-base-300 after:bg-base-300">OU</div>

          <div class="form-control flex justify-center">
            <button
              type="button"
              class="btn btn-outline border-base-300 hover:bg-base-200 hover:border-base-400 mb-2"
              disabled
            >
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
              <span class="text-base-content">Continuer avec Google</span>
            </button>
          </div>

          <div class="text-center mt-6">
            <p class="text-base-content/80">
              Pas encore de compte ?
              <router-link to="/register" class="link link-primary font-medium">{{
                t('auth.register')
              }}</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthService } from '@/services/auth.service'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

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
    errorMessage.value = (error as Error).message || 'Échec de la connexion. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.card {
  width: 100%;
  max-width: 450px;
}

/* Amélioration du contraste en mode light */
:root[data-theme='light'] .input-bordered {
  border-color: hsl(var(--b3));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:root[data-theme='light'] .btn-primary {
  font-weight: 500;
}

:root[data-theme='light'] .form-control .label-text {
  color: hsl(var(--bc));
}
</style>
