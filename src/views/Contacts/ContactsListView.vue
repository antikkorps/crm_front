<template>
  <div class="contacts-list-page container mx-auto p-4">
    <PageHeader :title="t('contacts.allContacts')" :back-to="'/contacts'" />

    <div class="text-center py-8">
      <div class="max-w-md mx-auto">
        <Iconify icon="mdi:account-multiple" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold mb-2">{{ t('contacts.comingSoon') }}</h3>
        <p class="text-gray-600 mb-4">{{ t('contacts.comingSoonDescription') }}</p>
        <button class="btn btn-primary" @click="router.push('/segments')">
          <Iconify icon="mdi:filter-variant" class="w-4 h-4 mr-2" />
          {{ t('segments.title') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
</script>

<style scoped>
.contacts-list-page {
  display: flex;
  flex-direction: column;
}
</style>
