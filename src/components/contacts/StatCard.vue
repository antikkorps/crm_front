<template>
  <div class="stat-card card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300">
    <div class="card-body p-6">
      <!-- En-tête avec icône -->
      <div class="flex items-center justify-between mb-4">
        <div class="stat-icon" :class="`text-${color}`">
          <Iconify :icon="icon" :class="iconSizeClass" />
        </div>
        <div v-if="loading" class="loading loading-spinner loading-sm"></div>
      </div>

      <!-- Contenu principal -->
      <div class="stat-content">
        <h3 class="stat-title text-base font-medium text-base-content/70 mb-2">
          {{ title }}
        </h3>
        <div class="stat-value text-3xl font-bold mb-2" :class="`text-${color}`">
          {{ loading ? '...' : value }}
        </div>
        <p class="stat-description text-sm text-base-content/60">
          {{ description }}
        </p>
      </div>

      <!-- Indicateur de tendance (optionnel) -->
      <div v-if="trend" class="stat-trend mt-4 pt-4 border-t border-base-200">
        <div class="flex items-center text-sm">
          <Iconify
            :icon="trend > 0 ? 'mdi:trending-up' : 'mdi:trending-down'"
            class="w-4 h-4 mr-1"
            :class="trend > 0 ? 'text-success' : 'text-error'"
          />
          <span :class="trend > 0 ? 'text-success' : 'text-error'"> {{ Math.abs(trend) }}% </span>
          <span class="text-base-content/60 ml-1">
            {{ t('common.vsLastMonth') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  icon: string
  title: string
  value: string | number
  description: string
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  trend?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  size: 'large',
  loading: false,
})

const { t } = useI18n()

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-5 h-5'
    case 'medium':
      return 'w-6 h-6'
    case 'large':
      return 'w-8 h-8'
    default:
      return 'w-8 h-8'
  }
})
</script>

<style scoped>
.stat-card {
  @apply relative overflow-hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--fallback-p, oklch(var(--p))),
    var(--fallback-pc, oklch(var(--pc)))
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  @apply flex items-center justify-center;
}

.stat-content {
  @apply flex-1;
}

.stat-value {
  @apply transition-all duration-300;
}

.stat-trend {
  @apply flex items-center;
}

/* Animation de chargement */
.stat-card.loading .stat-value {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .stat-title {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}
</style>
