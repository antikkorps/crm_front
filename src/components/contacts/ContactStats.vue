<template>
  <div class="contact-stats">
    <!-- Statistiques principales -->
    <section class="stats-section mb-8">
      <h2 class="section-title mb-6">
        <Iconify icon="mdi:chart-box" class="w-5 h-5 mr-2" />
        {{ t('contacts.mainStatistics') }}
      </h2>
      <div class="stats-grid stats-grid-main">
        <StatCard
          :icon="'mdi:account-multiple'"
          :title="t('contacts.totalContacts')"
          :value="contactStats?.overview?.totalContacts || 0"
          :description="t('contacts.contactsInSystem')"
          color="primary"
          :loading="loading"
        />
        <StatCard
          :icon="'mdi:account'"
          :title="t('contacts.mainContacts')"
          :value="contactStats?.overview?.contactsWithEmail || 0"
          :description="t('contacts.contactsWithEmail')"
          color="secondary"
          :loading="loading"
        />
        <StatCard
          :icon="'mdi:account-check'"
          :title="t('contacts.assignedContacts')"
          :value="contactStats?.overview?.assignedContacts || 0"
          :description="t('contacts.contactsAssignedToUser')"
          color="accent"
          :loading="loading"
        />
        <StatCard
          :icon="'mdi:filter-variant'"
          :title="t('segments.totalSegments')"
          :value="segmentStats?.overview?.totalSegments || 0"
          :description="t('segments.activeSegments')"
          color="info"
          :loading="loading"
        />
      </div>
    </section>

    <!-- Indicateurs de performance -->
    <section class="stats-section mb-8">
      <h2 class="section-title mb-6">
        <Iconify icon="mdi:trending-up" class="w-5 h-5 mr-2" />
        {{ t('contacts.performanceIndicators') }}
      </h2>
      <div class="stats-grid stats-grid-kpis">
        <StatCard
          :icon="'mdi:account-plus'"
          :title="t('contacts.newContacts')"
          :value="contactStats?.overview?.newContactsThisMonth || 0"
          :description="t('contacts.createdThisMonth')"
          color="success"
          :loading="loading"
          size="medium"
        />
        <StatCard
          :icon="'mdi:trending-up'"
          :title="t('contacts.conversionRate')"
          :value="formatPercentage(contactStats?.overview?.conversionRate)"
          :description="t('contacts.contactsWithWonOpportunities')"
          color="warning"
          :loading="loading"
          size="medium"
        />
        <StatCard
          :icon="'mdi:chart-line'"
          :title="t('contacts.engagement')"
          :value="formatPercentage(contactStats?.overview?.engagementRate)"
          :description="t('contacts.contactsWithRecentActivity')"
          color="error"
          :loading="loading"
          size="medium"
        />
      </div>
    </section>

    <!-- Graphiques et tableaux -->
    <section class="stats-section mb-8">
      <h2 class="section-title mb-6">
        <Iconify icon="mdi:table" class="w-5 h-5 mr-2" />
        {{ t('contacts.detailedAnalytics') }}
      </h2>
      <div class="stats-grid stats-grid-tables">
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
    </section>

    <!-- Segments détaillés -->
    <section class="stats-section mb-8">
      <h2 class="section-title mb-6">
        <Iconify icon="mdi:filter-variant" class="w-5 h-5 mr-2" />
        {{ t('segments.segmentAnalytics') }}
      </h2>
      <div class="stats-grid stats-grid-tables">
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
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ContactStats } from '@/types/contact.types'
import type { SegmentStats } from '@/types/segment.types'
import { useI18n } from 'vue-i18n'
import StatCard from './StatCard.vue'

interface Props {
  contactStats: ContactStats | null
  segmentStats: SegmentStats | null
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const { t } = useI18n()

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
</script>

<style scoped>
.contact-stats {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: hsl(var(--bc));
  display: flex;
  align-items: center;
}

.stats-grid {
  display: grid;
  gap: 1.5rem;
}

.stats-grid-main {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .stats-grid-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .stats-grid-main {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.stats-grid-kpis {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .stats-grid-kpis {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.stats-grid-tables {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .stats-grid-tables {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Animations d'apparition */
.stats-section {
  animation: fadeInUp 0.6s ease-out;
}

.stats-section:nth-child(2) {
  animation-delay: 0.1s;
}

.stats-section:nth-child(3) {
  animation-delay: 0.2s;
}

.stats-section:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .section-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .stats-grid {
    gap: 1rem;
  }
}
</style>
