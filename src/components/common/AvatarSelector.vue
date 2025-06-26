<template>
  <div class="avatar-selector">
    <teleport to="body">
      <div v-if="isOpen" class="modal modal-open">
        <div class="modal-box w-11/12 max-w-4xl">
          <div class="modal-content">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-base-300">
              <h3 class="font-bold text-lg">{{ t('profile.selectAvatar') }}</h3>
              <button class="btn btn-sm btn-circle btn-ghost" @click="closeModal">
                <Iconify icon="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <!-- Content -->
            <div class="p-6">
              <!-- Style Initiales -->
              <div class="mb-8">
                <h4 class="text-lg font-semibold mb-4">{{ t('profile.avatarStyle.initials') }}</h4>
                <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                  <div
                    v-for="i in 20"
                    :key="`initials-${i}`"
                    class="avatar-option"
                    :class="{ selected: selectedAvatarUrl === generateInitialsUrl(i) }"
                    @click="selectAvatar(generateInitialsUrl(i))"
                  >
                    <div
                      class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      <img
                        :src="generateInitialsUrl(i)"
                        :alt="`Initiales ${i}`"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Style Bottts -->
              <div class="mb-8">
                <h4 class="text-lg font-semibold mb-4">{{ t('profile.avatarStyle.bottts') }}</h4>
                <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                  <div
                    v-for="i in 20"
                    :key="`bottts-${i}`"
                    class="avatar-option"
                    :class="{ selected: selectedAvatarUrl === generateBotttsUrl(i) }"
                    @click="selectAvatar(generateBotttsUrl(i))"
                  >
                    <div
                      class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      <img
                        :src="generateBotttsUrl(i)"
                        :alt="`Bottts ${i}`"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Style Thumbs -->
              <div class="mb-8">
                <h4 class="text-lg font-semibold mb-4">{{ t('profile.avatarStyle.thumbs') }}</h4>
                <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                  <div
                    v-for="i in 20"
                    :key="`thumbs-${i}`"
                    class="avatar-option"
                    :class="{ selected: selectedAvatarUrl === generateThumbsUrl(i) }"
                    @click="selectAvatar(generateThumbsUrl(i))"
                  >
                    <div
                      class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      <img
                        :src="generateThumbsUrl(i)"
                        :alt="`Thumbs ${i}`"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Aperçu -->
              <div class="flex items-center justify-center mb-6">
                <div class="text-center">
                  <img
                    v-if="selectedAvatarUrl"
                    :src="selectedAvatarUrl"
                    :alt="t('profile.avatarPreview')"
                    class="w-32 h-32 rounded-full object-cover ring-4 ring-primary ring-offset-2 ring-offset-base-100"
                  />
                  <div
                    v-else
                    class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <span class="text-gray-500">{{ t('profile.selectAvatarPreview') }}</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-2">
                    {{ t('profile.avatarPreview') }}
                  </p>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="flex justify-end gap-3 p-6 border-t border-base-300">
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
  selectedAvatarUrl.value = user.value?.avatarUrl || ''
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function selectAvatar(avatarUrl: string) {
  selectedAvatarUrl.value = avatarUrl
}

function generateInitialsUrl(i: number) {
  if (!user.value) {
    console.warn('User is not defined')
    return ''
  }

  const seed = user.value.email || `${user.value.firstName}${user.value.lastName}` || 'default'
  const url = `https://api.dicebear.com/7.x/initials/png?seed=${seed}${i}&size=48`
  return url
}

function generateBotttsUrl(i: number) {
  if (!user.value) {
    console.warn('User is not defined')
    return ''
  }

  const seed = user.value.email || `${user.value.firstName}${user.value.lastName}` || 'default'
  const url = `https://api.dicebear.com/7.x/bottts/png?seed=${seed}${i}&size=48`
  return url
}

function generateThumbsUrl(i: number) {
  if (!user.value) return ''

  const seed = user.value.email || `${user.value.firstName}${user.value.lastName}` || 'default'
  const url = `https://api.dicebear.com/7.x/thumbs/png?seed=${seed}${i}&size=48`
  return url
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  console.error("Erreur de chargement d'image:", img.src)
  // Fallback vers un avatar par défaut
  img.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMTgiIHI9IjgiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTggNDJDMCAzNiAwIDI4IDAgMjBDMCAxMS4xNjM0IDEwLjc0NjIgMiAyNCAyQzM3LjI1MzggMiA0OCAxMS4xNjM0IDQ4IDIwQzQ4IDI4IDQ4IDM2IDQwIDQySDhWIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
}

async function saveAvatar() {
  if (!user.value) return
  loading.value = true
  try {
    await AuthService.updateProfile({
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      avatarUrl: selectedAvatarUrl.value,
    })
    emit('update', selectedAvatarUrl.value)
    toastStore.success(t('profile.avatarUpdatedSuccess'))
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
.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.avatar-option:hover {
  border-color: hsl(var(--p) / 0.3);
  background-color: hsl(var(--p) / 0.05);
}
.avatar-option.selected {
  border-color: hsl(var(--p));
  background-color: hsl(var(--p) / 0.1);
}
</style>
