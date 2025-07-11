<template>
  <div class="contacts-page container mx-auto p-4">
    <PageHeader :title="t('contacts.title')" :back-to="'/contacts'" />

    <!-- Actions rapides -->
    <QuickActions :loading="loading" />

    <!-- Statistiques -->
    <ContactStatsComponent
      :contact-stats="contactStats"
      :segment-stats="segmentStats"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import ContactStatsComponent from '@/components/contacts/ContactStats.vue'
import QuickActions from '@/components/contacts/QuickActions.vue'
import { contactService } from '@/services/contact.service'
import { segmentService } from '@/services/segment.service'
import type { ContactStats } from '@/types/contact.types'
import type { SegmentStats } from '@/types/segment.types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const contactStats = ref<ContactStats | null>(null)
const segmentStats = ref<SegmentStats | null>(null)
const loading = ref(false)

// Charger les statistiques au montage du composant
onMounted(async () => {
  loading.value = true
  try {
    console.log('🔍 [DEBUG] Chargement des statistiques...')

    const [contactStatsData, segmentStatsData] = await Promise.all([
      contactService.getContactStats(),
      segmentService.getSegmentStats(),
    ])

    console.log('🔍 [DEBUG] Contact stats reçues:', contactStatsData)
    console.log('🔍 [DEBUG] Segment stats reçues:', segmentStatsData)

    contactStats.value = contactStatsData
    segmentStats.value = segmentStatsData
  } catch (error) {
    console.error('❌ [ERROR] Erreur lors du chargement des statistiques:', error)

    // Afficher plus de détails sur l'erreur
    if (error instanceof Error) {
      console.error("❌ [ERROR] Message d'erreur:", error.message)
      console.error('❌ [ERROR] Stack trace:', error.stack)
    }

    // Essayer de charger les données une par une pour identifier le problème
    try {
      console.log('🔍 [DEBUG] Tentative de chargement des stats contacts uniquement...')
      const contactStatsData = await contactService.getContactStats()
      console.log('✅ [SUCCESS] Contact stats chargées:', contactStatsData)
      contactStats.value = contactStatsData
    } catch (contactError) {
      console.error('❌ [ERROR] Erreur contacts:', contactError)
    }

    try {
      console.log('🔍 [DEBUG] Tentative de chargement des stats segments uniquement...')
      const segmentStatsData = await segmentService.getSegmentStats()
      console.log('✅ [SUCCESS] Segment stats chargées:', segmentStatsData)
      segmentStats.value = segmentStatsData
    } catch (segmentError) {
      console.error('❌ [ERROR] Erreur segments:', segmentError)
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Styles spécifiques pour les appareils mobiles */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .stat {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
