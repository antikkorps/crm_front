<template>
  <div class="segment-form-page container mx-auto p-4">
    <PageHeader
      :title="isEditing ? t('segments.editSegment') : t('segments.createSegment')"
      :back-to="'/segments'"
    />

    <div class="max-w-4xl mx-auto">
      <!-- Formulaire -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="flex flex-col flex-col-spaced">
            <!-- Informations de base -->
            <div class="grid grid-cols-1 md:grid-cols-2 flex-col-spaced-md">
              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ t('segments.segmentName') }} *</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  class="input input-bordered"
                  :placeholder="t('segments.segmentNamePlaceholder')"
                  required
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">{{ t('segments.segmentType') }}</span>
                </label>
                <div class="flex flex-col-spaced-md">
                  <label class="label cursor-pointer">
                    <input
                      v-model="form.isDynamic"
                      type="radio"
                      :value="true"
                      class="radio radio-primary"
                    />
                    <span class="label-text ml-2">{{ t('segments.dynamicSegment') }}</span>
                  </label>
                  <label class="label cursor-pointer">
                    <input
                      v-model="form.isDynamic"
                      type="radio"
                      :value="false"
                      class="radio radio-secondary"
                    />
                    <span class="label-text ml-2">{{ t('segments.manualSegment') }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ t('segments.segmentDescription') }}</span>
              </label>
              <textarea
                v-model="form.description"
                class="textarea textarea-bordered"
                :placeholder="t('segments.segmentDescriptionPlaceholder')"
                rows="3"
              ></textarea>
            </div>

            <!-- Règles (seulement pour les segments dynamiques) -->
            <div v-if="form.isDynamic">
              <RuleBuilder v-model="form.rules" :preview="preview" @preview="handlePreview" />
            </div>

            <!-- Actions -->
            <div class="flex justify-end flex-col-spaced-sm">
              <button type="button" class="btn btn-outline" @click="router.back()">
                {{ t('common.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                {{ isEditing ? t('common.update') : t('common.create') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Informations sur les types de segments -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 flex-col-spaced-md">
        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title text-primary">
              <Iconify icon="mdi:refresh" class="w-5 h-5" />
              {{ t('segments.dynamicSegments') }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ t('segments.dynamicSegmentsDescription') }}
            </p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• {{ t('segments.dynamicFeature1') }}</li>
              <li>• {{ t('segments.dynamicFeature2') }}</li>
              <li>• {{ t('segments.dynamicFeature3') }}</li>
            </ul>
          </div>
        </div>

        <div class="card bg-base-100 shadow-md">
          <div class="card-body">
            <h3 class="card-title text-secondary">
              <Iconify icon="mdi:account-multiple" class="w-5 h-5" />
              {{ t('segments.manualSegments') }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ t('segments.manualSegmentsDescription') }}
            </p>
            <ul class="text-sm text-gray-600 mt-2 space-y-1">
              <li>• {{ t('segments.manualFeature1') }}</li>
              <li>• {{ t('segments.manualFeature2') }}</li>
              <li>• {{ t('segments.manualFeature3') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import RuleBuilder from '@/components/segments/RuleBuilder.vue'
import { useSegmentStore } from '@/stores/segment'
import type { SegmentCreateDto, SegmentRule, SegmentUpdateDto } from '@/types/segment.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const segmentStore = useSegmentStore()

// État local
const loading = ref(false)
const preview = ref<{
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
} | null>(null)

const form = ref<{
  name: string
  description: string
  isDynamic: boolean
  rules: SegmentRule[]
}>({
  name: '',
  description: '',
  isDynamic: true,
  rules: [],
})

// Computed
const isEditing = computed(() => !!route.params.id)

// Méthodes
const handleSubmit = async () => {
  loading.value = true

  try {
    if (isEditing.value) {
      const updateData: SegmentUpdateDto = {
        name: form.value.name,
        description: form.value.description,
        isDynamic: form.value.isDynamic,
        rules: form.value.isDynamic ? form.value.rules : undefined,
      }

      await segmentStore.updateSegment(route.params.id as string, updateData)
      router.push(`/segments/${route.params.id}`)
    } else {
      const createData: SegmentCreateDto = {
        name: form.value.name,
        description: form.value.description,
        isDynamic: form.value.isDynamic,
        rules: form.value.isDynamic ? form.value.rules : [],
      }

      const newSegment = await segmentStore.createSegment(createData)
      router.push(`/segments/${newSegment.id}`)
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du segment:', error)
  } finally {
    loading.value = false
  }
}

const handlePreview = async (rules: SegmentRule[]) => {
  if (rules.length === 0) {
    preview.value = null
    return
  }

  try {
    const previewData = await segmentStore.previewSegmentRules(rules)
    preview.value = previewData
  } catch (error) {
    console.error('Erreur lors de la prévisualisation:', error)
    preview.value = {
      contactCount: 0,
      sampleContacts: [],
      isValid: false,
      errors: ['Erreur lors de la prévisualisation'],
    }
  }
}

const loadSegment = async (id: string) => {
  try {
    await segmentStore.fetchSegment(id)
    const segment = segmentStore.currentSegment

    if (segment) {
      form.value = {
        name: segment.name,
        description: segment.description || '',
        isDynamic: segment.isDynamic,
        rules: segment.rules || [],
      }

      // Prévisualiser les règles si elles existent
      if (segment.rules && segment.rules.length > 0) {
        await handlePreview(segment.rules)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du segment:', error)
  }
}

// Charger les données au montage
onMounted(() => {
  if (isEditing.value) {
    loadSegment(route.params.id as string)
  }
})
</script>

<style scoped>
.segment-form-page {
  display: flex;
  flex-direction: column;
}

/* Utilise maintenant flex-col-spaced */

.form-control {
  display: flex;
  flex-direction: column;
}

/* Utilise maintenant flex-col-spaced-sm */

.label-text {
  font-weight: 500;
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
