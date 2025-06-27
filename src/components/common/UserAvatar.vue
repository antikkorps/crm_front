<template>
  <div
    class="multiword-avatar"
    :class="[`w-${size} h-${size}`, { 'cursor-pointer': clickable }, customClass]"
    @click="handleClick"
  >
    <div class="rounded-full overflow-hidden" :class="[`w-${size} h-${size}`, ringClass]">
      <!-- Avatar DiceBear -->
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <!-- Avatar généré par DiceBear -->
      <img
        v-else-if="dicebearUrl"
        :src="dicebearUrl"
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      <!-- Fallback avec initiales -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-white font-bold"
        :class="fallbackClass"
      >
        {{ initials }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  avataaars,
  bottts,
  initials as diceInitials,
  identicon,
  lorelei,
  micah,
  miniavs,
  personas,
  shapes,
  thumbs,
} from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'
import { computed, ref } from 'vue'

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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  ring?: boolean
  ringColor?: string
  clickable?: boolean
  customClass?: string
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  ring: false,
  ringColor: 'primary',
  clickable: false,
  customClass: '',
  alt: 'Avatar utilisateur',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// État pour gérer les erreurs d'image
const imageError = ref(false)

// Computed properties
const initials = computed(() => {
  if (!props.user) return 'U'

  const firstName = props.user.firstName || ''
  const lastName = props.user.lastName || ''
  const email = props.user.email || ''

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  } else if (firstName) {
    return firstName.charAt(0).toUpperCase()
  } else if (email) {
    return email.charAt(0).toUpperCase()
  }

  return 'U'
})

const avatarUrl = computed(() => {
  if (imageError.value) return null
  if (!props.user?.avatarUrl) return null

  // Cache-busting intelligent basé sur l'URL de l'avatar
  const separator = props.user.avatarUrl.includes('?') ? '&' : '?'
  const cacheBuster = props.user.avatarUrl.split('/').pop()?.split('?')[0] || 'avatar'
  return `${props.user.avatarUrl}${separator}v=${cacheBuster}`
})

const dicebearUrl = computed(() => {
  if (!props.user || imageError.value) return null

  const style = props.user.avatarStyle || 'initials'
  const seed =
    props.user.avatarSeed ||
    props.user.email ||
    `${props.user.firstName}${props.user.lastName}` ||
    'default'

  try {
    let avatar
    const size = getSizeInPixels()

    switch (style) {
      case 'initials':
        avatar = createAvatar(diceInitials, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          fontSize: Math.max(12, size * 0.4),
        })
        break
      case 'avataaars':
        avatar = createAvatar(avataaars, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'bottts':
        avatar = createAvatar(bottts, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'identicon':
        avatar = createAvatar(identicon, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'lorelei':
        avatar = createAvatar(lorelei, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'micah':
        avatar = createAvatar(micah, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'miniavs':
        avatar = createAvatar(miniavs, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'personas':
        avatar = createAvatar(personas, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'shapes':
        avatar = createAvatar(shapes, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      case 'thumbs':
        avatar = createAvatar(thumbs, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          radius: 50,
        })
        break
      default:
        avatar = createAvatar(diceInitials, {
          seed,
          size,
          backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc', 'd1d4f9'],
          fontSize: Math.max(12, size * 0.4),
        })
    }

    return avatar.toDataUri()
  } catch (error) {
    console.error("Erreur lors de la génération de l'avatar DiceBear:", error)
    return null
  }
})

const ringClass = computed(() => {
  if (!props.ring) return ''

  const sizeMap = {
    xs: 'ring-1',
    sm: 'ring-2',
    md: 'ring-2',
    lg: 'ring-3',
    xl: 'ring-4',
    '2xl': 'ring-4',
    '3xl': 'ring-4',
  }

  return `${sizeMap[props.size]} ring-${props.ringColor} ring-offset-2 ring-offset-base-100`
})

const fallbackClass = computed(() => {
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }

  return `bg-primary ${sizeMap[props.size]}`
})

// Fonctions utilitaires
function getSizeInPixels(): number {
  const sizeMap = {
    xs: 32,
    sm: 40,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 96,
    '3xl': 128,
  }

  return sizeMap[props.size]
}

function handleImageError() {
  imageError.value = true
}

function handleClick(event: MouseEvent) {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.multiword-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Tailles d'avatar */
.w-xs {
  width: 2rem;
  height: 2rem;
}
.w-sm {
  width: 2.5rem;
  height: 2.5rem;
}
.w-md {
  width: 3rem;
  height: 3rem;
}
.w-lg {
  width: 4rem;
  height: 4rem;
}
.w-xl {
  width: 5rem;
  height: 5rem;
}
.w-2xl {
  width: 6rem;
  height: 6rem;
}
.w-3xl {
  width: 8rem;
  height: 8rem;
}

/* Anneaux */
.ring-1 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-3 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-4 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-primary {
  --tw-ring-color: hsl(var(--p));
}
.ring-secondary {
  --tw-ring-color: hsl(var(--s));
}
.ring-accent {
  --tw-ring-color: hsl(var(--a));
}
.ring-neutral {
  --tw-ring-color: hsl(var(--n));
}
.ring-info {
  --tw-ring-color: hsl(var(--in));
}
.ring-success {
  --tw-ring-color: hsl(var(--su));
}
.ring-warning {
  --tw-ring-color: hsl(var(--wa));
}
.ring-error {
  --tw-ring-color: hsl(var(--er));
}

.ring-offset-base-100 {
  --tw-ring-offset-color: hsl(var(--b1));
}
</style>
