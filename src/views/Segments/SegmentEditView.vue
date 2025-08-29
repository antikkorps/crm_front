<template>
  <div class="segment-edit-page container mx-auto p-4">
    <PageHeader
      :title="t('segments.editSegment')"
      :back-to="`/segments/${route.params.id}`"
    />

    <div v-if="loading && !segment" class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="segment" class="max-w-4xl mx-auto">
      <!-- Informations du segment -->
      <div class="card bg-base-100 shadow-md mb-6">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h2 class="card-title text-xl">{{ t('segments.editSegment') }}</h2>
            <div class="flex items-center space-x-2">
              <span 
                :class="[
                  'badge',
                  segment.isDynamic ? 'badge-primary' : 'badge-secondary'
                ]"
              >
                <Iconify 
                  :icon="segment.isDynamic ? 'mdi:cog-refresh' : 'mdi:account-multiple'" 
                  class="w-3 h-3 mr-1" 
                />
                {{ segment.isDynamic ? t('segments.dynamicSegment') : t('segments.manualSegment') }}
              </span>
              <span class="badge badge-outline">
                {{ segment.contactCount }} {{ t('common.contacts') }}
              </span>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Informations de base -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">{{ t('segments.segmentName') }} *</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  class="input input-bordered"
                  :placeholder="t('segments.segmentNamePlaceholder')"
                  required
                />
              </div>

              <!-- Statut du segment -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">{{ t('segments.segmentStatus') }}</span>
                </label>
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <div class="badge badge-success badge-sm"></div>
                    <span class="text-sm">{{ t('segments.active') }}</span>
                  </div>
                  <div v-if="segment.lastEvaluatedAt" class="text-xs text-gray-500">
                    {{ t('segments.lastUpdated') }}: {{ formatDate(segment.lastEvaluatedAt) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">{{ t('segments.segmentDescription') }}</span>
              </label>
              <textarea
                v-model="form.description"
                class="textarea textarea-bordered"
                :placeholder="t('segments.segmentDescriptionPlaceholder')"
                rows="3"
              ></textarea>
            </div>

            <!-- Actions principales -->
            <div class="flex justify-end space-x-4">
              <button type="button" class="btn btn-outline" @click="router.back()">
                {{ t('common.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
                {{ t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Configuration des règles (segments dynamiques uniquement) -->
      <div v-if="segment.isDynamic" class="card bg-base-100 shadow-md mb-6">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">{{ t('segments.rulesConfiguration') }}</h3>
            <button 
              v-if="currentRule"
              @click="evaluateSegment" 
              class="btn btn-outline btn-sm"
              :disabled="isEvaluating"
            >
              <span v-if="isEvaluating" class="loading loading-spinner loading-xs"></span>
              <Iconify v-else icon="mdi:refresh" class="w-4 h-4 mr-1" />
              {{ t('segments.refreshResults') }}
            </button>
          </div>

          <RuleBuilder 
            v-model="currentRule" 
            :preview="preview" 
            @preview="handlePreview" 
          />
          
          <!-- Bouton pour sauvegarder les règles -->
          <div v-if="hasRuleChanges" class="mt-4 p-4 bg-warning/10 border border-warning rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Iconify icon="mdi:alert" class="w-5 h-5 text-warning" />
                <span class="text-warning font-medium">{{ t('segments.rulesModified') }}</span>
              </div>
              <button 
                @click="saveRules" 
                class="btn btn-warning btn-sm"
                :disabled="isSavingRules"
              >
                <span v-if="isSavingRules" class="loading loading-spinner loading-xs"></span>
                {{ t('segments.saveRules') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions avancées -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="text-lg font-semibold mb-4">{{ t('segments.advancedActions') }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Dupliquer le segment -->
            <div class="card bg-base-200 border">
              <div class="card-body p-4">
                <div class="flex items-center space-x-3">
                  <Iconify icon="mdi:content-copy" class="w-8 h-8 text-primary" />
                  <div>
                    <h4 class="font-semibold">{{ t('segments.duplicate') }}</h4>
                    <p class="text-xs text-gray-600">{{ t('segments.duplicateDescription') }}</p>
                  </div>
                </div>
                <button @click="duplicateSegment" class="btn btn-outline btn-sm mt-3 w-full">
                  {{ t('segments.duplicate') }}
                </button>
              </div>
            </div>

            <!-- Exporter les contacts -->
            <div class="card bg-base-200 border">
              <div class="card-body p-4">
                <div class="flex items-center space-x-3 mb-3">
                  <Iconify icon="mdi:download" class="w-8 h-8 text-secondary" />
                  <div class="flex-1">
                    <h4 class="font-semibold">{{ t('common.export') }}</h4>
                    <p class="text-xs text-gray-600">{{ t('segments.exportDescription') }}</p>
                  </div>
                  <SegmentExportButton 
                    v-if="segment"
                    :segment-id="segment.id"
                    :segment-name="segment.name"
                    button-class="btn-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Supprimer le segment -->
            <div class="card bg-error/10 border border-error/20">
              <div class="card-body p-4">
                <div class="flex items-center space-x-3">
                  <Iconify icon="mdi:delete" class="w-8 h-8 text-error" />
                  <div>
                    <h4 class="font-semibold text-error">{{ t('common.delete') }}</h4>
                    <p class="text-xs text-gray-600">{{ t('segments.deleteDescription') }}</p>
                  </div>
                </div>
                <button @click="confirmDelete" class="btn btn-error btn-outline btn-sm mt-3 w-full">
                  {{ t('common.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <Iconify icon="mdi:alert" class="w-16 h-16 mx-auto mb-4 text-error" />
      <h3 class="text-xl font-semibold mb-2">{{ t('segments.segmentNotFound') }}</h3>
      <p class="text-gray-600 mb-4">{{ t('segments.segmentNotFoundDescription') }}</p>
      <button class="btn btn-primary" @click="router.push('/segments')">
        {{ t('segments.backToSegments') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import RuleBuilder from '@/components/segments/RuleBuilder.vue'
import SegmentExportButton from '@/components/segments/SegmentExportButton.vue'
import { useSegmentStore } from '@/stores/segment'
import type { SegmentRule, SegmentUpdateDto } from '@/types/segment.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const segmentStore = useSegmentStore()

// État local
const loading = ref(true)
const isSubmitting = ref(false)
const isEvaluating = ref(false)
const isSavingRules = ref(false)
const originalRules = ref<SegmentRule | null>(null)

const form = ref({
  name: '',
  description: '',
})

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

// Computed
const segment = computed(() => segmentStore.currentSegment)

const currentRule = computed({
  get: () => {
    if (!segment.value?.rules || segment.value.rules.length === 0) return null
    return segment.value.rules[0]
  },
  set: (newRule) => {
    if (segment.value) {
      segment.value.rules = newRule ? [newRule] : []
    }
  }
})

const hasRuleChanges = computed(() => {
  return JSON.stringify(currentRule.value) !== JSON.stringify(originalRules.value)
})

// Méthodes
const loadSegment = async () => {
  try {
    loading.value = true
    await segmentStore.fetchSegment(route.params.id as string)
    
    if (segment.value) {
      form.value = {
        name: segment.value.name,
        description: segment.value.description || '',
      }
      
      originalRules.value = currentRule.value ? JSON.parse(JSON.stringify(currentRule.value)) : null
      
      // Prévisualiser les règles existantes
      if (currentRule.value && segment.value.isDynamic) {
        await handlePreview([currentRule.value])
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du segment:', error)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!segment.value) return
  
  try {
    isSubmitting.value = true
    
    const updateData: SegmentUpdateDto = {
      name: form.value.name,
      description: form.value.description,
      // Les règles sont sauvegardées séparément
    }
    
    await segmentStore.updateSegment(segment.value.id, updateData)
    router.push(`/segments/${segment.value.id}`)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du segment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const saveRules = async () => {
  if (!segment.value) return
  
  try {
    isSavingRules.value = true
    
    const updateData: SegmentUpdateDto = {
      rules: currentRule.value ? [currentRule.value] : [],
    }
    
    await segmentStore.updateSegment(segment.value.id, updateData)
    originalRules.value = currentRule.value ? JSON.parse(JSON.stringify(currentRule.value)) : null
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des règles:', error)
  } finally {
    isSavingRules.value = false
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

const evaluateSegment = async () => {
  if (!segment.value) return
  
  try {
    isEvaluating.value = true
    await segmentStore.evaluateSegment(segment.value.id)
    
    // Recharger les données du segment
    await loadSegment()
  } catch (error) {
    console.error("Erreur lors de l'évaluation du segment:", error)
  } finally {
    isEvaluating.value = false
  }
}

const duplicateSegment = async () => {
  if (!segment.value) return
  
  const newName = prompt(t('segments.enterNewName'), `${segment.value.name} (copie)`)
  if (newName && newName.trim()) {
    try {
      await segmentStore.duplicateSegment(segment.value.id, newName.trim())
    } catch (error) {
      console.error('Erreur lors de la duplication:', error)
    }
  }
}


const confirmDelete = () => {
  if (!segment.value) return
  
  if (confirm(t('segments.confirmDeleteSegment', { name: segment.value.name }))) {
    deleteSegment()
  }
}

const deleteSegment = async () => {
  if (!segment.value) return
  
  try {
    await segmentStore.deleteSegment(segment.value.id)
    router.push('/segments')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Lifecycle
onMounted(() => {
  loadSegment()
})
</script>

<style scoped>
.segment-edit-page {
  min-height: 100vh;
}

.card {
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>