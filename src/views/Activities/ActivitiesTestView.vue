<template>
  <div class="container mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">{{ t('activities.title') }}</h1>
      <p class="text-base-content/70 mt-2">Page de test du système d'activités CRM</p>
    </div>

    <!-- Test avec companyId -->
    <div class="bg-base-100 p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4">Test avec Company ID</h2>
      <ActivitiesSection company-id="test-company-123" />
    </div>

    <!-- Test sans contraintes -->
    <div class="bg-base-100 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Test global (toutes activités)</h2>
      <ActivitiesSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ActivitiesSection } from '@/components/activities'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
