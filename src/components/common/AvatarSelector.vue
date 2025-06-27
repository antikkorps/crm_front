<template>
  <div class="avatar-selector">
    <teleport to="body">
      <div v-if="isOpen" class="modal modal-open">
        <div
          class="modal-box w-11/12 max-w-5xl"
          style="max-height: 90vh; display: flex; flex-direction: column"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-6 border-b border-base-300 bg-base-100"
            style="flex-shrink: 0"
          >
            <h3 class="font-bold text-xl">{{ t('profile.selectAvatar') }}</h3>
            <button class="btn btn-sm btn-circle btn-ghost" @click="closeModal">
              <Iconify icon="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6" style="min-height: 0">
            <!-- Aperçu en haut -->
            <div class="flex items-center justify-center mb-6 bg-base-200 rounded-lg p-4">
              <div class="text-center">
                <img
                  v-if="selectedAvatarUrl"
                  :src="selectedAvatarUrl"
                  :alt="t('profile.avatarPreview')"
                  class="w-24 h-24 rounded-full object-cover ring-4 ring-primary ring-offset-2 ring-offset-base-100 shadow-lg"
                />
                <div
                  v-else
                  class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300"
                >
                  <span class="text-gray-500 text-xs">{{ t('profile.selectAvatarPreview') }}</span>
                </div>
                <p class="text-xs text-gray-600 mt-2 font-medium">
                  {{ t('profile.avatarPreview') }}
                </p>
              </div>
            </div>

            <!-- Grille des avatars -->
            <div class="space-y-6">
              <!-- Style Initiales -->
              <div class="avatar-section">
                <h4 class="text-base font-semibold mb-3 flex items-center gap-2">
                  <div class="w-3 h-3 bg-primary rounded-full"></div>
                  {{ t('profile.avatarStyle.initials') }}
                </h4>
                <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                  <div
                    v-for="i in 8"
                    :key="`initials-${i}`"
                    class="avatar-option"
                    :class="{ selected: selectedAvatarUrl === generateInitialsUrl(i) }"
                    @click="selectAvatar(generateInitialsUrl(i))"
                  >
                    <div
                      class="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative"
                    >
                      <img
                        :src="generateInitialsUrl(i)"
                        :alt="`Initiales ${i}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        @error="handleImageError"
                        @load="handleImageLoad"
                      />
                      <div
                        v-if="!imageLoaded[`initials-${i}`]"
                        class="absolute inset-0 flex items-center justify-center bg-gray-100"
                      >
                        <div class="loading loading-spinner loading-xs"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Style Bottts -->
              <div class="avatar-section">
                <h4 class="text-base font-semibold mb-3 flex items-center gap-2">
                  <div class="w-3 h-3 bg-secondary rounded-full"></div>
                  {{ t('profile.avatarStyle.bottts') }}
                </h4>
                <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                  <div
                    v-for="i in 8"
                    :key="`bottts-${i}`"
                    class="avatar-option"
                    :class="{ selected: selectedAvatarUrl === generateBotttsUrl(i) }"
                    @click="selectAvatar(generateBotttsUrl(i))"
                  >
                    <div
                      class="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative"
                    >
                      <img
                        :src="generateBotttsUrl(i)"
                        :alt="`Bottts ${i}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        @error="handleImageError"
                        @load="handleImageLoad"
                      />
                      <div
                        v-if="!imageLoaded[`bottts-${i}`]"
                        class="absolute inset-0 flex items-center justify-center bg-gray-100"
                      >
                        <div class="loading loading-spinner loading-xs"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Style Thumbs -->
              <div class="avatar-section">
                <h4 class="text-base font-semibold mb-3 flex items-center gap-2">
                  <div class="w-3 h-3 bg-accent rounded-full"></div>
                  {{ t('profile.avatarStyle.thumbs') }}
                </h4>
                <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                  <div
                    v-for="i in 8"
                    :key="`thumbs-${i}`"
                    class="avatar-option"
                    :class="{ selected: selectedAvatarUrl === generateThumbsUrl(i) }"
                    @click="selectAvatar(generateThumbsUrl(i))"
                  >
                    <div
                      class="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center relative"
                    >
                      <img
                        :src="generateThumbsUrl(i)"
                        :alt="`Thumbs ${i}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                        @error="handleImageError"
                        @load="handleImageLoad"
                      />
                      <div
                        v-if="!imageLoaded[`thumbs-${i}`]"
                        class="absolute inset-0 flex items-center justify-center bg-gray-100"
                      >
                        <div class="loading loading-spinner loading-xs"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-end gap-3 p-6 border-t border-base-300 bg-base-100"
            style="flex-shrink: 0"
          >
            <button class="btn btn-outline" @click="closeModal">
              {{ t('common.cancel') }}
            </button>
            <button
              class="btn btn-primary"
              :disabled="loading || !selectedAvatarUrl"
              @click="saveAvatar"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ t('common.update') }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
    <button v-if="showButton" class="btn btn-outline btn-sm" @click="openModal">
      <Iconify icon="mdi:camera" class="w-4 h-4 mr-1" />
      {{ t('profile.changeAvatar') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { AuthService } from '@/services/auth.service'
import { useToastStore } from '@/stores/toast'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  user?: {
    firstName?: string
    lastName?: string
    email?: string
    avatarUrl?: string
    avatarStyle?: string
    avatarSeed?: string
    avatarBackgroundColor?: string
    avatarScale?: number
    avatarRotation?: number
    phone?: string
    jobTitle?: string
    bio?: string
  } | null
  showButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showButton: true,
})

const emit = defineEmits<{
  update: [avatarUrl: string]
}>()

const { t } = useI18n()
const toastStore = useToastStore()

const isOpen = ref(false)
const selectedAvatarUrl = ref('')
const loading = ref(false)

// Cache pour les URLs d'avatars
const avatarCache = ref<Map<string, string>>(new Map())

// État de chargement des images
const imageLoaded = ref<Record<string, boolean>>({})

const user = computed(() => props.user)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

function openModal() {
  // Définir l'avatar sélectionné avec l'avatar actuel de l'utilisateur
  selectedAvatarUrl.value = user.value?.avatarUrl || ''
  isOpen.value = true
  document.body.style.overflow = 'hidden'

  // Vider le cache pour forcer le rechargement
  avatarCache.value.clear()

  // Initialiser l'état de chargement des images
  imageLoaded.value = {}

  // Pré-charger les avatars pour améliorer les performances
  setTimeout(() => {
    preloadAvatars()
  }, 100)
}

function preloadAvatars() {
  // Pré-charger les avatars en arrière-plan
  for (let i = 1; i <= 8; i++) {
    const initialsUrl = generateInitialsUrl(i)
    const botttsUrl = generateBotttsUrl(i)
    const thumbsUrl = generateThumbsUrl(i)

    // Créer des images temporaires pour pré-charger
    const preloadImage = (url: string, key: string) => {
      const img = new Image()
      img.onload = () => {
        imageLoaded.value[key] = true
        console.log(`Avatar chargé: ${key}`)
      }
      img.onerror = () => {
        console.error(`Erreur de chargement pour ${key}:`, url)
        imageLoaded.value[key] = true // Marquer comme chargé même en cas d'erreur
      }
      img.src = url
    }

    // Marquer comme en cours de chargement
    imageLoaded.value[`initials-${i}`] = false
    imageLoaded.value[`bottts-${i}`] = false
    imageLoaded.value[`thumbs-${i}`] = false

    preloadImage(initialsUrl, `initials-${i}`)
    preloadImage(botttsUrl, `bottts-${i}`)
    preloadImage(thumbsUrl, `thumbs-${i}`)
  }
}

function closeModal() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function selectAvatar(avatarUrl: string) {
  console.log('Avatar sélectionné:', avatarUrl)
  selectedAvatarUrl.value = avatarUrl
}

function generateInitialsUrl(i: number) {
  if (!user.value) {
    console.warn('User is not defined')
    return ''
  }

  const seed = user.value.email || `${user.value.firstName}${user.value.lastName}` || 'default'
  const cacheKey = `initials-${seed}-${i}`

  if (avatarCache.value.has(cacheKey)) {
    return avatarCache.value.get(cacheKey)!
  }

  const url = `https://api.dicebear.com/7.x/initials/png?seed=${seed}${i}&size=128`
  avatarCache.value.set(cacheKey, url)
  return url
}

function generateBotttsUrl(i: number) {
  if (!user.value) {
    console.warn('User is not defined')
    return ''
  }

  const seed = user.value.email || `${user.value.firstName}${user.value.lastName}` || 'default'
  const cacheKey = `bottts-${seed}-${i}`

  if (avatarCache.value.has(cacheKey)) {
    return avatarCache.value.get(cacheKey)!
  }

  const url = `https://api.dicebear.com/7.x/bottts/png?seed=${seed}${i}&size=128`
  avatarCache.value.set(cacheKey, url)
  return url
}

function generateThumbsUrl(i: number) {
  if (!user.value) return ''

  const seed = user.value.email || `${user.value.firstName}${user.value.lastName}` || 'default'
  const cacheKey = `thumbs-${seed}-${i}`

  if (avatarCache.value.has(cacheKey)) {
    return avatarCache.value.get(cacheKey)!
  }

  const url = `https://api.dicebear.com/7.x/thumbs/png?seed=${seed}${i}&size=128`
  avatarCache.value.set(cacheKey, url)
  return url
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  console.error("Erreur de chargement d'image:", img.src)

  // Essayer de recharger l'image avec un délai
  setTimeout(() => {
    if (img.src) {
      img.src = img.src + (img.src.includes('?') ? '&' : '?') + 'retry=' + Date.now()
    }
  }, 1000)

  // Fallback vers un avatar par défaut si le rechargement échoue
  setTimeout(() => {
    if (img.src && !img.complete) {
      img.src =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMTgiIHI9IjgiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTggNDJDMCAzNiAwIDI4IDAgMjBDMCAxMS4xNjM0IDEwLjc0NjIgMiAyNCAyQzM3LjI1MzggMiA0OCAxMS4xNjM0IDQ4IDIwQzQ4IDI4IDQ4IDM2IDQwIDQySDhWIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
    }
  }, 2000)
}

function handleImageLoad(event: Event) {
  const img = event.target as HTMLImageElement
  // Extraire le type et l'index de l'alt
  const alt = img.alt || ''
  if (alt.includes('Initiales')) {
    const match = alt.match(/Initiales (\d+)/)
    if (match) {
      imageLoaded.value[`initials-${match[1]}`] = true
    }
  } else if (alt.includes('Bottts')) {
    const match = alt.match(/Bottts (\d+)/)
    if (match) {
      imageLoaded.value[`bottts-${match[1]}`] = true
    }
  } else if (alt.includes('Thumbs')) {
    const match = alt.match(/Thumbs (\d+)/)
    if (match) {
      imageLoaded.value[`thumbs-${match[1]}`] = true
    }
  }
}

async function saveAvatar() {
  if (!user.value) return
  loading.value = true
  try {
    // Sauvegarder l'avatar en base de données avec la route dédiée
    await AuthService.updateAvatar(selectedAvatarUrl.value)

    // Émettre l'événement avec la nouvelle URL
    emit('update', selectedAvatarUrl.value)
    closeModal()
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error)
    toastStore.error(t('profile.avatarUpdateError'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.avatar-selector {
  display: inline-block;
}

/* Forcer le scroll à fonctionner */
.modal-box {
  max-height: 90vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

.modal-box > div:first-child {
  flex-shrink: 0 !important;
}

.modal-box > div:nth-child(2) {
  flex: 1 !important;
  overflow-y: auto !important;
  min-height: 0 !important;
}

.modal-box > div:last-child {
  flex-shrink: 0 !important;
}

.avatar-section {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  animation: fadeInUp 0.3s ease-out;
}

.avatar-option:hover {
  border-color: hsl(var(--p) / 0.5);
  background-color: hsl(var(--p) / 0.1);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-option.selected {
  border-color: hsl(var(--p));
  background-color: hsl(var(--p) / 0.15);
  box-shadow:
    0 0 0 2px hsl(var(--p) / 0.3),
    0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.avatar-option:active {
  transform: translateY(0);
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Animation d'entrée pour les avatars */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .avatar-section {
    padding: 0.75rem;
  }

  .avatar-option {
    padding: 0.25rem;
  }

  .grid {
    gap: 0.25rem;
  }
}
</style>
