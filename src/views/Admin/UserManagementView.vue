<template>
  <div class="user-management-page container mx-auto p-4">
    <div class="page-header flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <BackToDashboard />
        <div>
          <h1 class="text-2xl font-bold">{{ t('admin.userManagement') }}</h1>
          <p class="text-gray-600">{{ t('admin.userManagementDescription') }}</p>
        </div>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <Iconify icon="mdi:plus" class="w-5 h-5 mr-1" />
        {{ t('users.add') }}
      </button>
    </div>

    <!-- Filtres et recherche -->
    <div class="mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('users.searchPlaceholder')"
            class="input input-bordered w-full"
            @input="handleSearch"
          />
        </div>
        <div class="flex gap-2">
          <select v-model="roleFilter" class="select select-bordered" @change="handleSearch">
            <option value="">{{ t('users.allRoles') }}</option>
            <option value="admin">{{ t('users.roleAdmin') }}</option>
            <option value="user">{{ t('users.roleUser') }}</option>
            <option value="manager">{{ t('users.roleManager') }}</option>
          </select>
          <select v-model="statusFilter" class="select select-bordered" @change="handleSearch">
            <option value="">{{ t('users.allStatuses') }}</option>
            <option value="active">{{ t('users.statusActive') }}</option>
            <option value="inactive">{{ t('users.statusInactive') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des utilisateurs -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error" class="alert alert-error mb-6">
      <Iconify icon="mdi:alert-circle" class="w-6 h-6" />
      <span>{{ error }}</span>
    </div>

    <div v-else-if="!users.length" class="text-center py-12">
      <Iconify icon="mdi:account-multiple" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl mb-2">{{ t('users.noUsers') }}</h3>
      <p class="text-gray-500 mb-4">{{ t('users.startAdding') }}</p>
      <button class="btn btn-primary" @click="openCreateModal">
        {{ t('users.add') }}
      </button>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>{{ t('common.name') }}</th>
            <th>{{ t('common.email') }}</th>
            <th>{{ t('users.role') }}</th>
            <th>{{ t('users.status') }}</th>
            <th>{{ t('common.createdAt') }}</th>
            <th>{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="hover:bg-base-200">
            <td>
              <div class="flex items-center gap-3">
                <UserAvatar :user="user" size="sm" ring ring-color="primary" :clickable="false" />
                <div>
                  <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
                </div>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge badge-outline">{{ user.role?.name || t('users.noRole') }}</span>
            </td>
            <td>
              <span
                :class="['badge', user.role?.name === 'Inactive' ? 'badge-error' : 'badge-success']"
              >
                {{
                  user.role?.name === 'Inactive'
                    ? t('users.statusInactive')
                    : t('users.statusActive')
                }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt || '') }}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-ghost" @click="editUser(user)">
                  <Iconify icon="mdi:pencil" class="w-4 h-4" />
                </button>
                <button
                  v-if="user.role?.name === 'Inactive'"
                  class="btn btn-sm btn-success"
                  @click="activateUser(user.id)"
                >
                  <Iconify icon="mdi:check" class="w-4 h-4" />
                </button>
                <button v-else class="btn btn-sm btn-warning" @click="deactivateUser(user.id)">
                  <Iconify icon="mdi:close" class="w-4 h-4" />
                </button>
                <button class="btn btn-sm btn-error" @click="confirmDelete(user)">
                  <Iconify icon="mdi:trash" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center mt-6">
      <div class="join">
        <button
          class="join-item btn"
          :disabled="pagination.currentPage === 1"
          @click="changePage(pagination.currentPage - 1)"
        >
          {{ t('common.previous') }}
        </button>
        <button
          v-for="page in getPageNumbers()"
          :key="page"
          class="join-item btn"
          :class="{ 'btn-active': page === pagination.currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="join-item btn"
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="changePage(pagination.currentPage + 1)"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackToDashboard from '@/components/common/BackToDashboard.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/auth.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const toastStore = useToastStore()

// État local
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// Computed
const users = computed(() => userStore.users)
const pagination = computed(() => userStore.pagination)

// Charger les utilisateurs au montage
onMounted(async () => {
  await loadUsers()
})

// Fonctions
async function loadUsers() {
  loading.value = true
  error.value = null

  try {
    await userStore.fetchUsers()
  } catch {
    error.value = t('users.loadError')
  } finally {
    loading.value = false
  }
}

async function handleSearch() {
  const params = {
    query: searchQuery.value,
    role: roleFilter.value,
    active:
      statusFilter.value === 'active'
        ? true
        : statusFilter.value === 'inactive'
          ? false
          : undefined,
    page: 1,
    limit: pagination.value.itemsPerPage,
  }

  await userStore.searchUsers(params)
}

async function changePage(page: number) {
  const params = {
    query: searchQuery.value,
    role: roleFilter.value,
    active:
      statusFilter.value === 'active'
        ? true
        : statusFilter.value === 'inactive'
          ? false
          : undefined,
    page,
    limit: pagination.value.itemsPerPage,
  }

  await userStore.searchUsers(params)
}

function getPageNumbers(): number[] {
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  const pages: number[] = []

  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }

  return pages
}

function openCreateModal() {
  // TODO: Implémenter l'ouverture du modal de création
  console.log('Ouvrir modal de création')
}

function editUser(user: User) {
  // TODO: Implémenter l'édition d'utilisateur
  console.log('Éditer utilisateur:', user)
}

async function activateUser(userId: string) {
  try {
    await userStore.activateUser(userId)
    toastStore.success(t('users.activateSuccess'))
    await loadUsers()
  } catch {
    toastStore.error(t('users.activateError'))
  }
}

async function deactivateUser(userId: string) {
  try {
    await userStore.deactivateUser(userId)
    toastStore.success(t('users.deactivateSuccess'))
    await loadUsers()
  } catch {
    toastStore.error(t('users.deactivateError'))
  }
}

function confirmDelete(user: User) {
  if (confirm(t('users.deleteConfirm', { name: `${user.firstName} ${user.lastName}` }))) {
    // TODO: Implémenter la suppression d'utilisateur
    toastStore.success(t('users.deleteSuccess'))
  }
}

function formatDate(date: string | Date | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.user-management-page {
  min-height: 100vh;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
</style>
