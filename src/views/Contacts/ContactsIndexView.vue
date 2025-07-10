<template>
  <div class="contacts-page container mx-auto p-4">
    <PageHeader :title="t('contacts.title')" :back-to="'/dashboard'" />

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Contacts -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-primary">
          <Iconify icon="mdi:account-multiple" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('contacts.totalContacts') }}</div>
        <div class="stat-value text-primary">{{ contactStats?.overview?.totalContacts || 0 }}</div>
        <div class="stat-desc">{{ t('contacts.contactsInSystem') }}</div>
      </div>

      <!-- Contacts Principaux -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-secondary">
          <Iconify icon="mdi:account" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('contacts.mainContacts') }}</div>
        <div class="stat-value text-secondary">
          {{ contactStats?.overview?.contactsWithEmail || 0 }}
        </div>
        <div class="stat-desc">{{ t('contacts.contactsWithEmail') }}</div>
      </div>

      <!-- Contacts Assignés -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-accent">
          <Iconify icon="mdi:account-check" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('contacts.assignedContacts') }}</div>
        <div class="stat-value text-accent">
          {{ contactStats?.overview?.assignedContacts || 0 }}
        </div>
        <div class="stat-desc">{{ t('contacts.contactsAssignedToUser') }}</div>
      </div>

      <!-- Total Segments -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-info">
          <Iconify icon="mdi:filter-variant" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('segments.totalSegments') }}</div>
        <div class="stat-value text-info">{{ segmentStats?.overview?.totalSegments || 0 }}</div>
        <div class="stat-desc">{{ t('segments.activeSegments') }}</div>
      </div>
    </div>

    <!-- Indicateurs de performance -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Nouveaux Contacts -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-success">
          <Iconify icon="mdi:account-plus" class="w-6 h-6" />
        </div>
        <div class="stat-title">{{ t('contacts.newContacts') }}</div>
        <div class="stat-value text-success">
          {{ contactStats?.overview?.newContactsThisMonth || 0 }}
        </div>
        <div class="stat-desc">{{ t('contacts.createdThisMonth') }}</div>
      </div>

      <!-- Taux de Conversion -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-warning">
          <Iconify icon="mdi:trending-up" class="w-6 h-6" />
        </div>
        <div class="stat-title">{{ t('contacts.conversionRate') }}</div>
        <div class="stat-value text-warning">
          {{ formatPercentage(contactStats?.overview?.conversionRate) }}
        </div>
        <div class="stat-desc">{{ t('contacts.contactsWithWonOpportunities') }}</div>
      </div>

      <!-- Engagement -->
      <div class="stat bg-base-100 shadow-md">
        <div class="stat-figure text-error">
          <Iconify icon="mdi:chart-line" class="w-6 h-6" />
        </div>
        <div class="stat-title">{{ t('contacts.engagement') }}</div>
        <div class="stat-value text-error">
          {{ formatPercentage(contactStats?.overview?.engagementRate) }}
        </div>
        <div class="stat-desc">{{ t('contacts.contactsWithRecentActivity') }}</div>
      </div>
    </div>

    <!-- Graphiques et tableaux -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Répartition par Statut -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title">{{ t('contacts.statusDistribution') }}</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{{ t('contacts.status') }}</th>
                  <th>{{ t('common.count') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="status in contactStats?.byStatus" :key="status.statusId">
                  <td>
                    <div class="flex items-center">
                      <div
                        class="w-3 h-3 rounded-full mr-2"
                        :style="{ backgroundColor: status['Status.color'] }"
                      ></div>
                      {{ status['Status.name'] }}
                    </div>
                  </td>
                  <td>{{ status.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Top Utilisateurs -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title">{{ t('contacts.topUsers') }}</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{{ t('common.user') }}</th>
                  <th>{{ t('contacts.assignedContacts') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in contactStats?.topAssignedUsers?.slice(0, 5)"
                  :key="user.assignedToId"
                >
                  <td>
                    <div class="flex items-center">
                      <div class="avatar mr-3">
                        <div class="w-8 h-8 rounded-full">
                          <img
                            v-if="user['assignedTo.avatarUrl']"
                            :src="user['assignedTo.avatarUrl']"
                            :alt="
                              getUserFullName(
                                user['assignedTo.firstName'],
                                user['assignedTo.lastName'],
                              )
                            "
                            class="w-full h-full rounded-full object-cover"
                          />
                          <div
                            v-else
                            class="bg-primary text-primary-content rounded-full flex items-center justify-center text-sm w-full h-full"
                          >
                            {{
                              getUserInitials(
                                user['assignedTo.firstName'],
                                user['assignedTo.lastName'],
                              )
                            }}
                          </div>
                        </div>
                      </div>
                      {{
                        getUserFullName(user['assignedTo.firstName'], user['assignedTo.lastName'])
                      }}
                    </div>
                  </td>
                  <td>{{ user.contactCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Segments détaillés -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Segments Populaires -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title">{{ t('segments.popularSegments') }}</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{{ t('segments.name') }}</th>
                  <th>{{ t('common.contacts') }}</th>
                  <th>{{ t('common.type') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="segment in segmentStats?.topSegments?.slice(0, 5)" :key="segment.id">
                  <td>{{ segment.name }}</td>
                  <td>{{ segment.contactCount }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="segment.isDynamic ? 'badge-primary' : 'badge-secondary'"
                    >
                      {{ segment.isDynamic ? t('segments.dynamic') : t('segments.manual') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Contacts par Entreprise -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h3 class="card-title">{{ t('contacts.contactsByCompany') }}</h3>
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>{{ t('common.name') }}</th>
                  <th>{{ t('common.contacts') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="company in contactStats?.contactsByCompany?.slice(0, 5)"
                  :key="company.companyId"
                >
                  <td>{{ company['company.name'] }}</td>
                  <td>{{ company.contactCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <h3 class="card-title">{{ t('contacts.quickActions') }}</h3>
        <div class="flex flex-wrap gap-4">
          <button class="btn btn-primary" @click="navigateTo('contact-create')">
            <Iconify icon="mdi:account-plus" class="w-4 h-4 mr-2" />
            {{ t('contacts.addContact') }}
          </button>
          <button class="btn btn-secondary" @click="navigateTo('segment-create')">
            <Iconify icon="mdi:filter-plus" class="w-4 h-4 mr-2" />
            {{ t('segments.createSegment') }}
          </button>
          <button class="btn btn-outline" @click="navigateTo('contacts-list')">
            <Iconify icon="mdi:format-list-bulleted" class="w-4 h-4 mr-2" />
            {{ t('contacts.viewAllContacts') }}
          </button>
          <button class="btn btn-outline" @click="navigateTo('segments')">
            <Iconify icon="mdi:filter-variant" class="w-4 h-4 mr-2" />
            {{ t('segments.viewAllSegments') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/common/PageHeader.vue'
import { contactService } from '@/services/contact.service'
import { segmentService } from '@/services/segment.service'
import type { ContactStats } from '@/types/contact.types'
import type { SegmentStats } from '@/types/segment.types'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const contactStats = ref<ContactStats | null>(null)
const segmentStats = ref<SegmentStats | null>(null)

// Fonction pour naviguer vers les différentes sections
function navigateTo(section: string) {
  switch (section) {
    case 'contacts-list':
      router.push('/contacts/list')
      break
    case 'segments':
      router.push('/segments')
      break
    case 'contact-create':
      router.push('/contacts/create')
      break
    case 'segment-create':
      router.push('/segments/create')
      break
    default:
      console.warn(`La section ${section} n'est pas encore implémentée`)
  }
}

// Fonction pour formater les pourcentages
function formatPercentage(value?: number): string {
  if (value === undefined || value === null) return '0%'
  return `${(value * 100).toFixed(1)}%`
}

// Fonction pour obtenir les initiales d'un utilisateur
function getUserInitials(firstName: string | undefined, lastName: string | undefined): string {
  if (!firstName && !lastName) return '??'
  return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '').toUpperCase().slice(0, 2)
}

// Fonction pour obtenir le nom complet d'un utilisateur
function getUserFullName(firstName: string | undefined, lastName: string | undefined): string {
  if (!firstName && !lastName) return 'Utilisateur inconnu'
  return `${firstName || ''} ${lastName || ''}`.trim()
}

// Charger les statistiques au montage du composant
onMounted(async () => {
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
