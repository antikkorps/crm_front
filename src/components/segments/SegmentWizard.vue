<template>
  <div class="segment-wizard max-w-4xl mx-auto">
    <!-- Indicateur d'étapes -->
    <div class="steps w-full mb-8">
      <div :class="['step', currentStep >= 1 ? 'step-primary' : '']">
        {{ t('segments.wizard.stepBasicInfo') }}
      </div>
      <div :class="['step', currentStep >= 2 ? 'step-primary' : '']">
        {{ t('segments.wizard.stepRules') }}
      </div>
      <div :class="['step', currentStep >= 3 ? 'step-primary' : '']">
        {{ t('segments.wizard.stepReview') }}
      </div>
    </div>

    <!-- Étape 1: Informations de base -->
    <div v-if="currentStep === 1" class="card bg-base-100 shadow-lg">
      <div class="card-body p-4 sm:p-6">
        <h2 class="card-title text-2xl mb-4">{{ t('segments.wizard.basicInformation') }}</h2>

        <div class="space-y-6">
          <!-- Nom du segment -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-medium">
                {{ t('segments.segmentName') }} *
              </span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              class="input input-bordered input-lg w-full"
              :placeholder="t('segments.segmentNamePlaceholder')"
              :class="{ 'input-error': errors.name }"
            />
            <label v-if="errors.name" class="label">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Description -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-medium">
                {{ t('segments.segmentDescription') }}
              </span>
            </label>
            <textarea
              v-model="formData.description"
              class="textarea textarea-bordered h-24 w-full"
              :placeholder="t('segments.segmentDescriptionPlaceholder')"
            ></textarea>
          </div>

          <!-- Type de segment -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-medium">
                {{ t('segments.segmentType') }} *
              </span>
            </label>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
              <!-- Segment dynamique -->
              <label class="cursor-pointer">
                <div
                  :class="[
                    'card border-2 transition-all duration-200 hover:shadow-md',
                    formData.isDynamic
                      ? 'border-primary bg-primary/5'
                      : 'border-base-300 hover:border-primary/50',
                  ]"
                >
                  <div class="card-body p-4">
                    <div class="flex items-start space-x-3">
                      <div class="relative mt-1">
                        <input
                          v-model="formData.isDynamic"
                          type="radio"
                          :value="true"
                          class="radio radio-primary"
                        />
                        <div
                          v-if="formData.isDynamic"
                          class="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div class="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-primary text-sm sm:text-base">
                          <Iconify
                            icon="mdi:cog-refresh"
                            class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1"
                          />
                          {{ t('segments.dynamicSegment') }}
                        </h3>
                      </div>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mt-2">
                      {{ t('segments.dynamicSegmentDescription') }}
                    </p>
                    <ul class="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• {{ t('segments.dynamicFeature1') }}</li>
                      <li>• {{ t('segments.dynamicFeature2') }}</li>
                    </ul>
                  </div>
                </div>
              </label>

              <!-- Segment manuel -->
              <label class="cursor-pointer">
                <div
                  :class="[
                    'card border-2 transition-all duration-200 hover:shadow-md',
                    !formData.isDynamic
                      ? 'border-secondary bg-secondary/5'
                      : 'border-base-300 hover:border-secondary/50',
                  ]"
                >
                  <div class="card-body p-4">
                    <div class="flex items-start space-x-3">
                      <div class="relative mt-1">
                        <input
                          v-model="formData.isDynamic"
                          type="radio"
                          :value="false"
                          class="radio radio-secondary"
                        />
                        <div
                          v-if="!formData.isDynamic"
                          class="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <div class="w-2 h-2 bg-secondary rounded-full"></div>
                        </div>
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-secondary text-sm sm:text-base">
                          <Iconify
                            icon="mdi:account-multiple"
                            class="w-4 h-4 sm:w-5 sm:h-5 inline mr-1"
                          />
                          {{ t('segments.manualSegment') }}
                        </h3>
                      </div>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mt-2">
                      {{ t('segments.manualSegmentDescription') }}
                    </p>
                    <ul class="text-xs text-gray-500 mt-2 space-y-1">
                      <li>• {{ t('segments.manualFeature1') }}</li>
                      <li>• {{ t('segments.manualFeature2') }}</li>
                    </ul>
                  </div>
                </div>
              </label>
            </div>
            <label v-if="errors.isDynamic" class="label">
              <span class="label-text-alt text-error">{{ errors.isDynamic }}</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8">
          <button
            class="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
            @click="$emit('cancel')"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            class="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
            @click="nextStep"
            :disabled="!canProceedFromStep1"
          >
            {{ t('common.next') }}
            <Iconify icon="mdi:chevron-right" class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- Étape 2: Configuration des règles -->
    <div v-if="currentStep === 2" class="card bg-base-100 shadow-lg">
      <div class="card-body p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title text-2xl">{{ t('segments.wizard.rulesConfiguration') }}</h2>
          <div class="badge badge-primary">
            {{ formData.isDynamic ? t('segments.dynamic') : t('segments.manual') }}
          </div>
        </div>

        <div v-if="formData.isDynamic">
          <div class="alert alert-info mb-6">
            <Iconify icon="mdi:information" class="w-5 h-5" />
            <div>
              <h4 class="font-semibold">{{ t('segments.wizard.rulesExplanation') }}</h4>
              <p class="text-sm">{{ t('segments.wizard.rulesExplanationDetail') }}</p>
            </div>
          </div>

          <RuleBuilder v-model="currentRule" :preview="preview" @preview="handlePreview" />
        </div>

        <div v-else class="text-center py-12">
          <Iconify icon="mdi:account-multiple-plus" class="w-16 h-16 mx-auto mb-4 text-secondary" />
          <h3 class="text-xl font-semibold mb-2">{{ t('segments.wizard.manualSegmentReady') }}</h3>
          <p class="text-gray-600">{{ t('segments.wizard.manualSegmentExplanation') }}</p>
        </div>

        <!-- Actions -->
        <div class="card-actions flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8">
          <button class="btn btn-outline w-full sm:w-auto order-2 sm:order-1" @click="previousStep">
            <Iconify icon="mdi:chevron-left" class="w-4 h-4 mr-1" />
            {{ t('common.previous') }}
          </button>
          <button
            class="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
            @click="nextStep"
            :disabled="!canProceedFromStep2"
          >
            {{ t('common.next') }}
            <Iconify icon="mdi:chevron-right" class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- Étape 3: Révision et création -->
    <div v-if="currentStep === 3" class="card bg-base-100 shadow-lg">
      <div class="card-body p-4 sm:p-6">
        <h2 class="card-title text-2xl mb-4">{{ t('segments.wizard.reviewAndCreate') }}</h2>

        <div class="space-y-6">
          <!-- Résumé du segment -->
          <div class="card bg-base-200 border-l-4 border-l-primary">
            <div class="card-body">
              <h3 class="card-title text-xl text-primary">{{ formData.name }}</h3>
              <p v-if="formData.description" class="text-gray-600 mt-1">
                {{ formData.description }}
              </p>

              <div class="flex items-center space-x-2 mt-3">
                <span :class="['badge', formData.isDynamic ? 'badge-primary' : 'badge-secondary']">
                  <Iconify
                    :icon="formData.isDynamic ? 'mdi:cog-refresh' : 'mdi:account-multiple'"
                    class="w-3 h-3 mr-1"
                  />
                  {{
                    formData.isDynamic ? t('segments.dynamicSegment') : t('segments.manualSegment')
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- Règles configurées -->
          <div v-if="formData.isDynamic && currentRule" class="card bg-base-200">
            <div class="card-body">
              <h4 class="font-semibold mb-2">{{ t('segments.rulesConfigured') }}</h4>
              <div class="bg-base-100 rounded p-3">
                <SegmentRuleDisplay :rule="currentRule" />
              </div>
            </div>
          </div>

          <!-- Prévisualisation des résultats -->
          <div v-if="preview && formData.isDynamic" class="card bg-base-200">
            <div class="card-body">
              <h4 class="font-semibold mb-2">{{ t('segments.preview') }}</h4>
              <div class="stat">
                <div class="stat-value text-primary">{{ preview.contactCount }}</div>
                <div class="stat-desc">
                  {{ t('common.contacts') }} {{ t('segments.willBeIncluded') }}
                </div>
              </div>

              <div v-if="preview.sampleContacts.length > 0" class="mt-4">
                <p class="text-sm text-gray-600 mb-2">{{ t('segments.sampleContacts') }}:</p>
                <div class="space-y-1">
                  <div
                    v-for="contact in preview.sampleContacts.slice(0, 3)"
                    :key="contact.id"
                    class="text-sm"
                  >
                    {{ contact.firstName }} {{ contact.lastName }}
                    <span v-if="contact.email" class="text-gray-500">({{ contact.email }})</span>
                  </div>
                  <div v-if="preview.sampleContacts.length > 3" class="text-sm text-gray-500">
                    {{ t('segments.andMore', { count: preview.sampleContacts.length - 3 }) }}
                  </div>
                </div>
              </div>

              <div
                v-if="preview.errors && preview.errors.length > 0"
                class="alert alert-error mt-4"
              >
                <Iconify icon="mdi:alert" class="w-5 h-5" />
                <div>
                  <p class="font-semibold">{{ t('segments.errors') }}:</p>
                  <ul class="list-disc list-inside text-sm">
                    <li v-for="error in preview.errors" :key="error">{{ error }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions finales -->
        <div class="card-actions flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8">
          <button class="btn btn-outline w-full sm:w-auto order-2 sm:order-1" @click="previousStep">
            <Iconify icon="mdi:chevron-left" class="w-4 h-4 mr-1" />
            {{ t('common.previous') }}
          </button>
          <button
            class="btn btn-primary btn-lg w-full sm:w-auto order-1 sm:order-2"
            @click="createSegment"
            :disabled="isCreating || !canCreate"
            :class="{ loading: isCreating }"
          >
            <Iconify v-if="!isCreating" icon="mdi:plus" class="w-5 h-5 mr-2" />
            {{ t('segments.createSegment') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SegmentCreateDto, SegmentRule } from '@/types/segment.types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RuleBuilder from './RuleBuilder.vue'
import SegmentRuleDisplay from './SegmentRuleDisplay.vue'

const props = defineProps<{
  preview?: {
    contactCount: number
    sampleContacts: Array<{
      id: string
      firstName: string
      lastName: string
      email?: string
      company?: { name: string }
    }>
    isValid: boolean
    errors?: string[]
  } | null
}>()

const emit = defineEmits<{
  preview: [rules: SegmentRule[]]
  create: [data: SegmentCreateDto]
  cancel: []
}>()

const { t } = useI18n()

// État du wizard
const currentStep = ref(1)
const isCreating = ref(false)

// Données du formulaire
const formData = ref({
  name: '',
  description: '',
  isDynamic: true,
})

// Règle actuelle (pour segments dynamiques)
const currentRule = ref<SegmentRule | null>(null)

// Erreurs de validation
const errors = ref({
  name: '',
  isDynamic: '',
})

// Computed
const canProceedFromStep1 = computed(() => {
  return formData.value.name.trim().length > 0 && formData.value.isDynamic !== undefined
})

const canProceedFromStep2 = computed(() => {
  if (!formData.value.isDynamic) {
    return true // Segments manuels n'ont pas besoin de règles
  }
  return currentRule.value !== null // Segments dynamiques ont besoin d'une règle
})

const canCreate = computed(() => {
  if (formData.value.isDynamic) {
    return props.preview?.isValid && props.preview.contactCount >= 0
  }
  return true // Segments manuels peuvent toujours être créés
})

const preview = computed(() => props.preview)

// Méthodes
const validateStep1 = () => {
  errors.value = { name: '', isDynamic: '' }

  if (!formData.value.name.trim()) {
    errors.value.name = t('segments.errors.nameRequired')
    return false
  }

  if (formData.value.isDynamic === undefined) {
    errors.value.isDynamic = t('segments.errors.typeRequired')
    return false
  }

  return true
}

const nextStep = () => {
  if (currentStep.value === 1 && validateStep1()) {
    currentStep.value = 2
  } else if (currentStep.value === 2) {
    currentStep.value = 3
    // Déclencher la prévisualisation si segment dynamique
    if (formData.value.isDynamic && currentRule.value) {
      handlePreview([currentRule.value])
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handlePreview = (rules: SegmentRule[]) => {
  emit('preview', rules)
}

const createSegment = async () => {
  isCreating.value = true

  try {
    const segmentData: SegmentCreateDto = {
      name: formData.value.name,
      description: formData.value.description,
      isDynamic: formData.value.isDynamic,
      rules: formData.value.isDynamic && currentRule.value ? [currentRule.value] : [],
    }

    emit('create', segmentData)
  } finally {
    isCreating.value = false
  }
}
</script>

<style scoped>
.steps .step {
  color: hsl(var(--bc) / 0.4);
}

.steps .step-primary {
  color: hsl(var(--primary));
}

.steps .step-primary:before {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-content));
}

.card {
  transition: all 0.2s ease-in-out;
}

.radio:checked {
  background-color: currentColor;
}
</style>
