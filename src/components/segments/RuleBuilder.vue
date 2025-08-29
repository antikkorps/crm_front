<template>
  <div class="rule-builder">
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">{{ t('segments.segmentRules') }}</h3>
      <p class="text-sm text-gray-600">{{ t('segments.rulesDescription') }}</p>
    </div>

    <!-- Règles existantes -->
    <div v-if="currentRule" class="space-y-3 mb-4">
      <div class="card bg-base-100 border border-base-300 shadow-sm">
        <div class="card-body p-4">
          <div class="flex flex-col sm:flex-row justify-between gap-4">
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <div class="flex items-center gap-2">
                  <span class="badge badge-sm" :class="getRuleTypeClass(currentRule)">
                    <Iconify
                      :icon="isCondition(currentRule) ? 'mdi:filter' : 'mdi:group'"
                      class="w-3 h-3 mr-1"
                    />
                    {{ getRuleTypeLabel(currentRule) }}
                  </span>
                  <span v-if="isConditionGroup(currentRule)" class="text-sm text-gray-500">
                    ({{ currentRule.conditions.length }} condition{{
                      currentRule.conditions.length > 1 ? 's' : ''
                    }})
                  </span>
                </div>
              </div>

              <div
                v-if="isCondition(currentRule)"
                class="flex flex-col sm:grid sm:grid-cols-3 flex-col-spaced-sm gap-2 sm:gap-4"
              >
                <select
                  v-model="currentRule.field"
                  class="select select-bordered select-sm"
                  @change="updateRule"
                >
                  <option v-for="field in availableFields" :key="field.value" :value="field.value">
                    {{ field.label }}
                  </option>
                </select>

                <select
                  v-model="currentRule.operator"
                  class="select select-bordered select-sm"
                  @change="updateRule"
                >
                  <option
                    v-for="op in getOperatorsForField(currentRule.field)"
                    :key="op.value"
                    :value="op.value"
                  >
                    {{ op.label }}
                  </option>
                </select>

                <input
                  v-model="currentRule.value"
                  type="text"
                  class="input input-bordered input-sm"
                  :placeholder="getValuePlaceholder(currentRule.field)"
                  @input="debouncedUpdateRule"
                />
              </div>

              <div v-else-if="isConditionGroup(currentRule)" class="flex flex-col flex-col-spaced">
                <div class="bg-gradient-to-r from-base-200 to-base-300 rounded-lg p-4 mb-4">
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                      <Iconify icon="mdi:link-variant" class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-medium text-gray-700"
                        >Opérateur logique pour ce groupe :</span
                      >
                    </div>
                    <select
                      v-model="currentRule.operator"
                      class="select select-bordered select-sm w-full sm:w-auto"
                      @change="updateRule"
                    >
                      <option value="AND">ET - Toutes les conditions doivent être vraies</option>
                      <option value="OR">OU - Au moins une condition doit être vraie</option>
                    </select>
                    <p class="text-xs text-gray-600 italic">
                      ℹ️
                      {{
                        currentRule.operator === 'AND'
                          ? 'Seuls les contacts qui remplissent TOUTES ces conditions seront inclus'
                          : 'Les contacts qui remplissent AU MOINS UNE de ces conditions seront inclus'
                      }}
                    </p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(condition, condIndex) in currentRule.conditions"
                    :key="condIndex"
                    class="bg-white border border-base-300 rounded-lg p-3"
                  >
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div
                        v-if="isCondition(condition)"
                        class="flex flex-col sm:grid sm:grid-cols-3 flex-col-spaced-sm flex-1 gap-2 sm:gap-4"
                      >
                        <select
                          v-model="condition.field"
                          class="select select-bordered select-sm"
                          @change="updateConditionGroup"
                        >
                          <option
                            v-for="field in availableFields"
                            :key="field.value"
                            :value="field.value"
                          >
                            {{ field.label }}
                          </option>
                        </select>

                        <select
                          v-model="condition.operator"
                          class="select select-bordered select-sm"
                          @change="updateConditionGroup"
                        >
                          <option
                            v-for="op in getOperatorsForField(condition.field)"
                            :key="op.value"
                            :value="op.value"
                          >
                            {{ op.label }}
                          </option>
                        </select>

                        <input
                          v-model="condition.value"
                          type="text"
                          class="input input-bordered input-sm"
                          :placeholder="getValuePlaceholder(condition.field)"
                          @input="debouncedUpdateConditionGroup"
                        />
                      </div>

                      <button
                        @click="removeConditionFromGroup(condIndex)"
                        class="btn btn-ghost btn-sm text-error mt-2 sm:mt-0"
                        :title="'Supprimer cette condition'"
                      >
                        <Iconify icon="mdi:close" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    @click="addConditionToGroup"
                    class="btn btn-outline btn-sm w-full sm:w-auto"
                  >
                    <Iconify icon="mdi:plus" class="w-4 h-4 mr-2" />
                    Ajouter une condition à ce groupe
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <button
                @click="removeRule"
                class="btn btn-ghost btn-sm text-error"
                :title="'Supprimer cette ' + (isCondition(currentRule) ? 'condition' : 'groupe')"
              >
                <Iconify icon="mdi:delete" class="w-4 h-4" />
                <span class="hidden sm:inline ml-1">Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message quand aucune règle -->
    <div v-else class="bg-base-200 rounded-lg p-6 text-center text-gray-500">
      <Iconify icon="mdi:filter-variant" class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p class="text-lg font-medium mb-2">{{ t('segments.noRulesDefined') }}</p>
      <p class="text-sm mb-4">{{ t('segments.addFirstRule') }}</p>
      <div class="flex flex-col sm:flex-row gap-2 justify-center">
        <button @click="addCondition" class="btn btn-primary btn-sm">
          <Iconify icon="mdi:filter-plus" class="w-4 h-4 mr-1" />
          Condition simple
        </button>
        <button @click="addConditionGroup" class="btn btn-secondary btn-sm">
          <Iconify icon="mdi:group" class="w-4 h-4 mr-1" />
          Groupe de conditions
        </button>
      </div>
    </div>

    <!-- Boutons d'actions -->
    <div class="space-y-2 mb-4">
      <div class="flex flex-col sm:flex-row gap-2">
        <button
          v-if="currentRule"
          @click="triggerPreview"
          class="btn btn-primary btn-sm flex-1 sm:flex-initial"
          :disabled="isPreviewLoading"
        >
          <span v-if="isPreviewLoading" class="loading loading-spinner loading-sm"></span>
          <Iconify v-else icon="mdi:eye" class="w-4 h-4 mr-1" />
          {{ t('segments.previewRules') }}
        </button>
        <button
          v-if="currentRule"
          @click="resetToInitialChoice"
          class="btn btn-outline btn-sm flex-1 sm:flex-initial"
        >
          <Iconify icon="mdi:refresh" class="w-4 h-4 mr-1" />
          Recommencer
        </button>
      </div>
    </div>

    <!-- Prévisualisation -->
    <div v-if="preview" class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <h4 class="font-semibold mb-2">{{ t('segments.preview') }}</h4>
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <span
            class="badge text-base px-3 py-2"
            :class="preview.isValid ? 'badge-success' : 'badge-error'"
          >
            {{ preview.contactCount }} {{ t('common.contacts') }}
          </span>
          <span v-if="!preview.isValid" class="text-error text-sm font-medium">
            {{ t('segments.invalidRules') }}
          </span>
        </div>

        <div v-if="preview.sampleContacts.length > 0" class="space-y-1">
          <p class="text-sm text-gray-600">{{ t('segments.sampleContacts') }}:</p>
          <div class="text-sm space-y-1">
            <div
              v-for="contact in preview.sampleContacts.slice(0, 3)"
              :key="contact.id"
              class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
            >
              <span>{{ contact.firstName }} {{ contact.lastName }}</span>
              <span v-if="contact.email" class="text-gray-500">({{ contact.email }})</span>
              <span v-if="contact.company?.name" class="text-gray-500"
                >- {{ contact.company.name }}</span
              >
            </div>
            <div v-if="preview.sampleContacts.length > 3" class="text-gray-500">
              {{ t('segments.andMore', { count: preview.sampleContacts.length - 3 }) }}
            </div>
          </div>
        </div>

        <div v-if="preview.errors && preview.errors.length > 0" class="mt-2">
          <p class="text-error text-sm font-semibold">{{ t('segments.errors') }}:</p>
          <ul class="text-error text-sm list-disc list-inside">
            <li v-for="error in preview.errors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SegmentCondition, SegmentConditionGroup, SegmentRule } from '@/types/segment.types'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: SegmentRule | null
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
  'update:modelValue': [value: SegmentRule | null]
  preview: [rules: SegmentRule[]]
}>()

const { t } = useI18n()

// État local
const currentRule = ref<SegmentRule | null>(props.modelValue || null)
const isPreviewLoading = ref(false)
const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
const availableFields = ref([
  { value: 'firstName', label: 'Prénom' },
  { value: 'lastName', label: 'Nom' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Téléphone' },
  { value: 'position', label: 'Poste' },
  { value: 'statusId', label: 'Statut' },
  { value: 'companyId', label: 'Entreprise' },
  { value: 'assignedToId', label: 'Assigné à' },
])

const operators = ref([
  { value: 'equals', label: 'égal à' },
  { value: 'notEquals', label: 'différent de' },
  { value: 'contains', label: 'contient' },
  { value: 'notContains', label: 'ne contient pas' },
  { value: 'startsWith', label: 'commence par' },
  { value: 'endsWith', label: 'termine par' },
  { value: 'greaterThan', label: 'supérieur à' },
  { value: 'lessThan', label: 'inférieur à' },
])

// Computed
const preview = computed(() => props.preview)

// Méthodes
const isCondition = (rule: SegmentRule): rule is SegmentCondition => {
  return 'field' in rule && 'operator' in rule && 'value' in rule
}

const isConditionGroup = (rule: SegmentRule): rule is SegmentConditionGroup => {
  return 'operator' in rule && 'conditions' in rule && Array.isArray(rule.conditions)
}

const getRuleTypeClass = (rule: SegmentRule) => {
  if (isCondition(rule)) return 'badge-primary'
  if (isConditionGroup(rule)) return 'badge-secondary'
  return 'badge-neutral'
}

const getRuleTypeLabel = (rule: SegmentRule) => {
  if (isCondition(rule)) return t('segments.condition')
  if (isConditionGroup(rule)) return t('segments.group')
  return t('segments.rule')
}

const getOperatorsForField = (field: string) => {
  // Tous les champs supportent les opérateurs de base
  if (
    field === 'firstName' ||
    field === 'lastName' ||
    field === 'email' ||
    field === 'phone' ||
    field === 'position'
  ) {
    return operators.value.filter((op) =>
      ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith'].includes(
        op.value,
      ),
    )
  }

  // Les champs ID supportent seulement equals et notEquals
  if (field === 'statusId' || field === 'companyId' || field === 'assignedToId') {
    return operators.value.filter((op) => ['equals', 'notEquals'].includes(op.value))
  }

  return operators.value
}

const getValuePlaceholder = (field: string) => {
  if (field === 'email') return 'exemple@email.com'
  if (field === 'firstName') return 'Prénom'
  if (field === 'lastName') return 'Nom'
  if (field === 'phone') return '+33 6 12 34 56 78'
  if (field === 'position') return 'Poste'
  if (field === 'statusId') return 'ID du statut'
  if (field === 'companyId') return "ID de l'entreprise"
  if (field === 'assignedToId') return "ID de l'utilisateur"
  return 'Valeur'
}

const addCondition = () => {
  const newCondition: SegmentCondition = {
    field: 'email',
    operator: 'contains',
    value: '',
  }
  currentRule.value = newCondition
  updateRulesOnly()
}

const addConditionGroup = () => {
  const newGroup: SegmentConditionGroup = {
    operator: 'AND',
    conditions: [
      // Ajouter automatiquement une première condition vide
      {
        field: 'email',
        operator: 'contains',
        value: '',
      },
    ],
  }
  currentRule.value = newGroup
  updateRulesOnly()
}

const addConditionToGroup = () => {
  if (currentRule.value && isConditionGroup(currentRule.value)) {
    const newCondition: SegmentCondition = {
      field: 'email',
      operator: 'contains',
      value: '',
    }
    currentRule.value.conditions.push(newCondition)
    updateRulesOnly()
  }
}

const removeRule = () => {
  currentRule.value = null
  updateRulesOnly()
}

const resetToInitialChoice = () => {
  currentRule.value = null
  updateRulesOnly()
}

const removeConditionFromGroup = (conditionIndex: number) => {
  if (currentRule.value && isConditionGroup(currentRule.value)) {
    currentRule.value.conditions.splice(conditionIndex, 1)

    // Si le groupe n'a plus de conditions, le supprimer complètement
    if (currentRule.value.conditions.length === 0) {
      currentRule.value = null
    }

    updateRulesOnly()
  }
}

const updateRule = () => {
  updateRulesOnly()
}

const updateConditionGroup = () => {
  updateRulesOnly()
}

// Fonction pour mettre à jour seulement le model sans déclencher la prévisualisation
const updateRulesOnly = () => {
  emit('update:modelValue', currentRule.value)
}

// Fonction pour déclencher manuellement la prévisualisation
const triggerPreview = () => {
  if (currentRule.value && isValidRule(currentRule.value)) {
    isPreviewLoading.value = true
    emit('preview', [currentRule.value])
    // Réinitialiser le loading après un délai plus long ou quand le parent répond
    setTimeout(() => {
      isPreviewLoading.value = false
    }, 3000) // Timeout de sécurité plus long
  }
}

// Fonction debouncée pour les changements de valeur
const debouncedUpdateRule = () => {
  updateRulesOnly()

  // Annuler le timeout précédent s'il existe
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  // Programmer une prévisualisation automatique seulement si la règle est complète et valide
  debounceTimeout.value = setTimeout(() => {
    if (currentRule.value && isValidRule(currentRule.value)) {
      triggerPreview()
    }
  }, 1200) // Délai plus long pour éviter les requêtes pendant la saisie
}

const debouncedUpdateConditionGroup = () => {
  updateRulesOnly()

  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  debounceTimeout.value = setTimeout(() => {
    if (currentRule.value && isValidRule(currentRule.value)) {
      triggerPreview()
    }
  }, 1200)
}

// Validation des règles
const isValidRule = (rule: SegmentRule): boolean => {
  if (isCondition(rule)) {
    // Une condition est valide si elle a tous les champs requis ET une valeur non vide
    const hasAllFields = !!(rule.field && rule.operator && rule.value)
    const hasNonEmptyValue = !!(rule.value && rule.value.trim().length > 0)

    return hasAllFields && hasNonEmptyValue
  }

  if (isConditionGroup(rule)) {
    // Un groupe est valide s'il a au moins une condition ET que toutes ses conditions sont valides
    const hasConditions = rule.conditions && rule.conditions.length > 0
    const allConditionsValid =
      hasConditions && rule.conditions.every((condition) => isValidRule(condition))

    return hasConditions && allConditionsValid
  }

  return false
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    currentRule.value = newValue || null
  },
  { deep: true },
)

// Watcher pour réinitialiser le loading quand le preview arrive
watch(
  () => props.preview,
  (newPreview) => {
    if (newPreview && isPreviewLoading.value) {
      isPreviewLoading.value = false
    }
  },
  { deep: true },
)

// Nettoyer les timeouts lors de la destruction du composant
onUnmounted(() => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
})

// Charger les champs disponibles au montage
onMounted(() => {
  // TODO: Charger les champs disponibles depuis l'API
  // Pas de prévisualisation automatique au montage
})
</script>

<style scoped>
.rule-builder {
  display: flex;
  flex-direction: column;
}

.card {
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.select,
.input {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
}
</style>
