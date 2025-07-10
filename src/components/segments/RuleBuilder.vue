<template>
  <div class="rule-builder">
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">{{ t('segments.segmentRules') }}</h3>
      <p class="text-sm text-gray-600">{{ t('segments.rulesDescription') }}</p>
    </div>

    <!-- Règles existantes -->
    <div v-if="currentRule" class="space-y-3 mb-4">
      <div class="card bg-base-100 border border-base-300">
        <div class="card-body p-4">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center flex-col-spaced-sm mb-2">
                <span class="badge badge-sm" :class="getRuleTypeClass(currentRule)">
                  {{ getRuleTypeLabel(currentRule) }}
                </span>
                <span v-if="currentRule.operator" class="text-sm text-gray-500">
                  {{ getOperatorLabel(currentRule) }}
                </span>
              </div>

              <div v-if="isCondition(currentRule)" class="grid grid-cols-3 flex-col-spaced-sm">
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
                  @input="updateRule"
                />
              </div>

              <div v-else-if="isConditionGroup(currentRule)" class="flex flex-col flex-col-spaced">
                <div class="flex items-center flex-col-spaced-sm">
                  <select
                    v-model="currentRule.operator"
                    class="select select-bordered select-sm"
                    @change="updateRule"
                  >
                    <option value="AND">{{ t('segments.and') }}</option>
                    <option value="OR">{{ t('segments.or') }}</option>
                  </select>
                  <span class="text-sm text-gray-600">{{ t('segments.group') }}</span>
                </div>

                <div class="ml-4 flex flex-col">
                  <div
                    v-for="(condition, condIndex) in currentRule.conditions"
                    :key="condIndex"
                    class="flex items-center flex-col-spaced-sm"
                  >
                    <div
                      v-if="isCondition(condition)"
                      class="grid grid-cols-3 flex-col-spaced-sm flex-1"
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
                        @input="updateConditionGroup"
                      />
                    </div>

                    <button
                      @click="removeConditionFromGroup(condIndex)"
                      class="btn btn-ghost btn-sm text-error"
                    >
                      <Iconify icon="mdi:close" class="w-4 h-4" />
                    </button>
                  </div>

                  <button @click="addConditionToGroup" class="btn btn-outline btn-sm">
                    <Iconify icon="mdi:plus" class="w-4 h-4 mr-1" />
                    {{ t('segments.addCondition') }}
                  </button>
                </div>
              </div>
            </div>

            <button @click="removeRule" class="btn btn-ghost btn-sm text-error ml-2">
              <Iconify icon="mdi:delete" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message quand aucune règle -->
    <div v-else class="text-center py-8 text-gray-500">
      <Iconify icon="mdi:filter-variant" class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p class="text-lg font-medium mb-2">{{ t('segments.noRulesDefined') }}</p>
      <p class="text-sm">{{ t('segments.addFirstRule') }}</p>
    </div>

    <!-- Boutons d'ajout -->
    <div class="flex flex-wrap flex-col-spaced-sm mb-4">
      <button @click="addCondition" class="btn btn-outline btn-sm">
        <Iconify icon="mdi:plus" class="w-4 h-4 mr-1" />
        {{ t('segments.addCondition') }}
      </button>
      <button @click="addConditionGroup" class="btn btn-outline btn-sm">
        <Iconify icon="mdi:plus" class="w-4 h-4 mr-1" />
        {{ t('segments.addGroup') }}
      </button>
    </div>

    <!-- Prévisualisation -->
    <div v-if="preview" class="card bg-base-100 border border-base-300">
      <div class="card-body p-4">
        <h4 class="font-semibold mb-2">{{ t('segments.preview') }}</h4>
        <div class="flex items-center flex-col-spaced-sm mb-2">
          <span class="badge" :class="preview.isValid ? 'badge-success' : 'badge-error'">
            {{ preview.contactCount }} {{ t('common.contacts') }}
          </span>
          <span v-if="!preview.isValid" class="text-error text-sm">
            {{ t('segments.invalidRules') }}
          </span>
        </div>

        <div v-if="preview.sampleContacts.length > 0" class="space-y-1">
          <p class="text-sm text-gray-600">{{ t('segments.sampleContacts') }}:</p>
          <div class="text-sm space-y-1">
            <div
              v-for="contact in preview.sampleContacts.slice(0, 3)"
              :key="contact.id"
              class="flex items-center flex-col-spaced-sm"
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
import { computed, onMounted, ref, watch } from 'vue'
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
  }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SegmentRule | null]
  preview: [rules: SegmentRule[]]
}>()

const { t } = useI18n()

// État local
const currentRule = ref<SegmentRule | null>(props.modelValue || null)
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

const getOperatorLabel = (rule: SegmentRule) => {
  if (isConditionGroup(rule)) {
    return rule.operator === 'AND' ? t('segments.and') : t('segments.or')
  }
  return ''
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
  updateRule()
}

const addConditionGroup = () => {
  const newGroup: SegmentConditionGroup = {
    operator: 'AND',
    conditions: [],
  }
  currentRule.value = newGroup
  updateRule()
}

const addConditionToGroup = () => {
  if (currentRule.value && isConditionGroup(currentRule.value)) {
    const newCondition: SegmentCondition = {
      field: 'email',
      operator: 'contains',
      value: '',
    }
    currentRule.value.conditions.push(newCondition)
    updateRule()
  }
}

const removeRule = () => {
  currentRule.value = null
  updateRules()
}

const removeConditionFromGroup = (conditionIndex: number) => {
  if (currentRule.value && isConditionGroup(currentRule.value)) {
    currentRule.value.conditions.splice(conditionIndex, 1)
    updateRule()
  }
}

const updateRule = () => {
  updateRules()
}

const updateConditionGroup = () => {
  updateRules()
}

const updateRules = () => {
  emit('update:modelValue', currentRule.value)
  emit('preview', currentRule.value ? [currentRule.value] : [])
}

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
    currentRule.value = newValue || null
  },
  { deep: true },
)

// Charger les champs disponibles au montage
onMounted(() => {
  // TODO: Charger les champs disponibles depuis l'API
  updateRules()
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
