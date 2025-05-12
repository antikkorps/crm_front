<!-- components/common/SpecialityBadgeWithTooltip.vue -->
<template>
  <!-- Version desktop avec dropdown (masquée sur mobile) -->
  <div class="flex-wrap gap-1 items-center hidden md:flex">
    <!-- Afficher les premières spécialités (limitées) -->
    <span
      v-for="spec in displayedSpecialities"
      :key="spec.id"
      :class="[
        'px-2 py-1 rounded-full text-xs whitespace-nowrap overflow-hidden text-ellipsis speciality-badge cursor-pointer',
        props.badgeColor,
      ]"
      :title="spec.name"
      @click="handleSpecialityClick(spec)"
      role="button"
      tabindex="0"
      @keypress.enter="handleSpecialityClick(spec)"
    >
      {{ spec.name }}
    </span>

    <!-- Si plus de spécialités que la limite, afficher un badge avec dropdown -->
    <div v-if="hasMoreSpecialities" class="dropdown dropdown-end dropdown-bottom">
      <label
        tabindex="0"
        class="btn btn-sm btn-primary text-xs px-2 py-1 h-auto min-h-0 rounded-full"
        aria-haspopup="true"
        :aria-label="`${remainingCount} more specialities`"
      >
        +{{ remainingCount }}
      </label>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 animate-dropdown max-h-60 overflow-y-auto"
        role="menu"
        @keydown.esc="closeDropdown"
      >
        <li v-for="spec in remainingSpecialities" :key="spec.id" role="menuitem">
          <a
            @click="handleSpecialityClick(spec)"
            @keydown.enter="handleSpecialityClick(spec)"
            tabindex="0"
          >
            {{ spec.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- Version mobile avec toutes les spécialités affichées (visible uniquement sur mobile) -->
  <div class="flex flex-wrap gap-1 items-center md:hidden">
    <span
      v-for="spec in props.specialities"
      :key="spec.id"
      :class="[
        'px-2 py-1 rounded-full text-xs whitespace-nowrap overflow-hidden text-ellipsis mobile-speciality-badge',
        props.badgeColor,
      ]"
      :title="spec.name"
      @click="handleSpecialityClick(spec)"
      role="button"
      tabindex="0"
      @keypress.enter="handleSpecialityClick(spec)"
    >
      {{ spec.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Speciality } from '@/types/company.types'
import { computed } from 'vue'

const props = defineProps({
  specialities: {
    type: Array as () => Speciality[],
    required: true,
  },
  displayLimit: {
    type: Number,
    default: 1,
  },
  badgeColor: {
    type: String,
    default: 'bg-primary/10 text-primary',
  },
})

const emit = defineEmits(['specialityClick'])

const handleSpecialityClick = (speciality: Speciality) => {
  emit('specialityClick', speciality)
}

const displayedSpecialities = computed(() => {
  return props.specialities.slice(0, props.displayLimit)
})

const remainingSpecialities = computed(() => {
  if (props.specialities.length <= props.displayLimit) {
    return []
  }
  return props.specialities.slice(props.displayLimit)
})

const hasMoreSpecialities = computed(() => {
  return props.specialities.length > props.displayLimit
})

const remainingCount = computed(() => {
  return props.specialities.length - props.displayLimit
})

// Utilisation des classes DaisyUI directement dans le template

const closeDropdown = () => {}
</script>

<style scoped>
.animate-dropdown {
  animation: dropdown 0.2s ease-out;
  transform-origin: top;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* Classes responsives pour la largeur maximale des badges */
.speciality-badge {
  max-width: 150px; /* Valeur par défaut */
}

.mobile-speciality-badge {
  max-width: 100%; /* Sur mobile on donne plus d'espace car on affiche tout */
}

@media (max-width: 640px) {
  .mobile-speciality-badge {
    max-width: none; /* Largeur naturelle sur très petits écrans */
  }
}

@media (min-width: 641px) and (max-width: 767px) {
  .mobile-speciality-badge {
    max-width: 200px; /* Largeur confortable pour écrans medium */
  }
}

/* Desktop sizes */
@media (min-width: 768px) and (max-width: 1024px) {
  .speciality-badge {
    max-width: 150px;
  }
}

@media (min-width: 1025px) {
  .speciality-badge {
    max-width: 180px;
  }
}
</style>
