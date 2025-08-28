<template>
  <div class="segment-rule-display">
    <div v-if="isCondition(rule)" class="condition-display">
      <div class="flex items-center space-x-2 text-sm">
        <span class="badge badge-primary badge-sm">{{ getFieldLabel(rule.field) }}</span>
        <span class="text-gray-500">{{ getOperatorLabel(rule.operator) }}</span>
        <span class="font-mono bg-base-200 px-2 py-1 rounded text-primary">{{ rule.value }}</span>
      </div>
    </div>
    
    <div v-else-if="isConditionGroup(rule)" class="condition-group-display">
      <div class="flex items-center space-x-2 mb-2">
        <span class="badge badge-secondary badge-sm">{{ t('segments.group') }}</span>
        <span class="font-semibold">{{ rule.operator }}</span>
      </div>
      
      <div class="ml-4 border-l-2 border-base-300 pl-4 space-y-2">
        <SegmentRuleDisplay 
          v-for="(condition, index) in rule.conditions" 
          :key="index"
          :rule="condition"
        />
      </div>
    </div>
    
    <div v-else class="text-gray-500 italic">
      {{ t('segments.invalidRule') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SegmentCondition, SegmentConditionGroup, SegmentRule } from '@/types/segment.types'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  rule: SegmentRule
}>()

const { t } = useI18n()

// Type guards
const isCondition = (rule: SegmentRule): rule is SegmentCondition => {
  return 'field' in rule && 'operator' in rule && 'value' in rule
}

const isConditionGroup = (rule: SegmentRule): rule is SegmentConditionGroup => {
  return 'operator' in rule && 'conditions' in rule && Array.isArray(rule.conditions)
}

// Helpers
const getFieldLabel = (field: string) => {
  const fieldMap: Record<string, string> = {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    position: 'Poste',
    statusId: 'Statut',
    companyId: 'Entreprise',
    assignedToId: 'Assigné à',
  }
  return fieldMap[field] || field
}

const getOperatorLabel = (operator: string) => {
  const operatorMap: Record<string, string> = {
    equals: 'égal à',
    notEquals: 'différent de',
    contains: 'contient',
    notContains: 'ne contient pas',
    startsWith: 'commence par',
    endsWith: 'termine par',
    greaterThan: 'supérieur à',
    lessThan: 'inférieur à',
  }
  return operatorMap[operator] || operator
}
</script>

<style scoped>
.condition-display {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background: hsl(var(--base-100));
  border: 1px solid hsl(var(--base-300));
}

.condition-group-display {
  padding: 0.75rem;
  border-radius: 0.375rem;
  background: hsl(var(--base-50));
  border: 1px solid hsl(var(--base-300));
}
</style>