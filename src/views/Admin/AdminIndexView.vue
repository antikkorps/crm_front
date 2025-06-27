<template>
  <div class="admin-page container mx-auto p-4">
    <PageHeader
      :title="t('admin.title')"
      :subtitle="isSuperAdminUser ? t('admin.superAdminDescription') : t('admin.adminDescription')"
      :back-to="'/dashboard'"
    />

    <!-- Grille de cartes d'administration -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <!-- Carte gestion des utilisateurs -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.userManagement') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:account-multiple" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.userManagementDescription') }}
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm" @click="navigateTo('users')">
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte gestion des rôles -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.roleManagement') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:shield-account" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.roleManagementDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte gestion des permissions -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.permissionManagement') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:lock" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.permissionManagementDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte gestion des tenants (Super Admin uniquement) -->
      <div
        v-if="isSuperAdminUser"
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
      >
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.tenantManagement') }}</h2>
            <div class="badge badge-secondary p-3">
              <Iconify icon="mdi:domain" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.tenantManagementDescription') }}
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-secondary btn-sm" @click="navigateTo('tenants')">
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte extensions -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.extensions') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:puzzle" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.extensionsDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte intégrations -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.integrations') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:connection" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.integrationsDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte import de données -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.dataImport') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:upload" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.dataImportDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte audit et logs -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.auditLogs') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:clipboard-list" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.auditLogsDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte sauvegarde et restauration -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.backupRestore') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:database" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.backupRestoreDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Carte statistiques système -->
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
        <div class="card-body">
          <div class="flex justify-between items-center mb-2">
            <h2 class="card-title">{{ t('admin.systemStats') }}</h2>
            <div class="badge badge-primary p-3">
              <Iconify icon="mdi:chart-line" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-sm mb-4">
            {{ t('admin.systemStatsDescription') }}
          </p>
          <div class="flex justify-between items-center">
            <span class="badge badge-outline badge-sm">{{ t('common.comingSoon') }}</span>
            <button class="btn btn-primary btn-sm" disabled>
              {{ t('common.manage') }}
              <Iconify icon="mdi:chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-primary">
          <Iconify icon="mdi:account-multiple" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.totalUsers') }}</div>
        <div class="stat-value text-primary">{{ totalUsers }}</div>
        <div class="stat-desc">{{ t('admin.activeUsers') }}: {{ activeUsers }}</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-secondary">
          <Iconify icon="mdi:office-building" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.totalCompanies') }}</div>
        <div class="stat-value text-secondary">{{ totalCompanies }}</div>
        <div class="stat-desc">{{ t('admin.lastMonth') }}</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-accent">
          <Iconify icon="mdi:account" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.totalContacts') }}</div>
        <div class="stat-value text-accent">{{ totalContacts }}</div>
        <div class="stat-desc">{{ t('admin.lastMonth') }}</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-info">
          <Iconify icon="mdi:note-text" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.totalActivities') }}</div>
        <div class="stat-value text-info">{{ totalActivities }}</div>
        <div class="stat-desc">{{ t('admin.lastMonth') }}</div>
      </div>
    </div>

    <!-- Statistiques supplémentaires pour Super Admin -->
    <div v-if="isSuperAdminUser" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-secondary">
          <Iconify icon="mdi:domain" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.totalTenants') }}</div>
        <div class="stat-value text-secondary">{{ totalTenants }}</div>
        <div class="stat-desc">{{ t('admin.activeTenants') }}: {{ activeTenants }}</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-warning">
          <Iconify icon="mdi:server" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.systemResources') }}</div>
        <div class="stat-value text-warning">{{ systemResources }}%</div>
        <div class="stat-desc">{{ t('admin.cpuUsage') }}</div>
      </div>

      <div class="stat bg-base-100 shadow-md rounded-lg">
        <div class="stat-figure text-success">
          <Iconify icon="mdi:database" class="w-8 h-8" />
        </div>
        <div class="stat-title">{{ t('admin.databaseSize') }}</div>
        <div class="stat-value text-success">{{ databaseSize }}</div>
        <div class="stat-desc">{{ t('admin.storageUsed') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { isSuperAdmin } from '@/utils/permissions'
import PageHeader from '@/components/common/PageHeader.vue'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

// Computed pour vérifier si l'utilisateur est super admin
const isSuperAdminUser = computed(() => isSuperAdmin(userStore.currentUser))

// Statistiques (à connecter avec les vrais services plus tard)
const totalUsers = ref(0)
const activeUsers = ref(0)
const totalCompanies = ref(0)
const totalContacts = ref(0)
const totalActivities = ref(0)
const totalTenants = ref(0)
const activeTenants = ref(0)
const systemResources = ref(0)
const databaseSize = ref('')

// Fonction pour naviguer vers les différentes sections d'administration
const navigateTo = (section: string) => {
  switch (section) {
    case 'users':
      router.push('/admin/users')
      break
    case 'tenants':
      router.push('/admin/tenants')
      break
    case 'roles':
      router.push('/admin/roles')
      break
    case 'permissions':
      router.push('/admin/permissions')
      break
    case 'audit':
      router.push('/admin/audit')
      break
    case 'backup':
      router.push('/admin/backup')
      break
    case 'stats':
      router.push('/admin/stats')
      break
    default:
      console.warn(`Section d'administration non reconnue: ${section}`)
  }
}

// Charger les statistiques au montage du composant
onMounted(() => {
  // TODO: Connecter avec les vrais services
  totalUsers.value = 25
  activeUsers.value = 23
  totalCompanies.value = 156
  totalContacts.value = 342
  totalActivities.value = 1289
  totalTenants.value = 5
  activeTenants.value = 4
  systemResources.value = 65
  databaseSize.value = '2.3 GB'
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.stat {
  transition: all 0.3s ease;
}

.stat:hover {
  transform: translateY(-1px);
}
</style>
