<template>
  <div class="contacts-list-page container mx-auto p-4">
    <PageHeader :title="t('contacts.allContacts')" :back-to="'/contacts'" />

    <!-- Barre d'actions et filtres compacte -->
    <div class="bg-base-100 rounded-lg border border-base-300 p-4 mb-4">
      <!-- Layout desktop : ligne unique -->
      <div class="hidden lg:flex items-center gap-3">
        <!-- Recherche -->
        <div class="flex-1 min-w-0">
          <div class="search-input-container">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('contacts.searchPlaceholder', 'Rechercher par nom, email...')"
              class="input input-bordered input-sm w-full"
              @input="debouncedSearch"
            />
            <button class="search-btn btn btn-ghost btn-xs btn-square" @click="loadContacts">
              <Iconify icon="mdi:magnify" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Séparateur visuel -->
        <div class="divider divider-horizontal mx-0"></div>

        <!-- Filtre par entreprise -->
        <div class="min-w-[220px]">
          <CompanySearch
            v-model="selectedCompanyFilter"
            :placeholder="t('contacts.filterByCompany', 'Filtrer par entreprise...')"
            allow-all
            @company-selected="onCompanyFilterChanged"
            @clear="clearCompanyFilter"
          />
        </div>

        <!-- Séparateur visuel -->
        <div class="divider divider-horizontal mx-0"></div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Statistiques rapides -->
          <div class="text-sm text-base-content/70 hidden xl:block">
            {{ pagination.totalItems }} {{ t('contacts.contactsCount', 'contacts') }}
          </div>

          <!-- Bouton d'ajout -->
          <button class="btn btn-primary btn-sm" @click="openContactModal()">
            <Iconify icon="mdi:plus" class="w-4 h-4" />
            <span class="hidden xl:inline ml-1">{{ t('contacts.addContact') }}</span>
          </button>
        </div>
      </div>

      <!-- Layout tablet/mobile : empilé -->
      <div class="lg:hidden space-y-3">
        <!-- Ligne 1 : Recherche + Bouton ajout -->
        <div class="flex gap-3">
          <div class="flex-1">
            <div class="search-input-container">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('contacts.searchPlaceholder', 'Rechercher...')"
                class="input input-bordered input-sm w-full"
                @input="debouncedSearch"
              />
              <button class="search-btn btn btn-ghost btn-xs btn-square" @click="loadContacts">
                <Iconify icon="mdi:magnify" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" @click="openContactModal()">
            <Iconify icon="mdi:plus" class="w-4 h-4" />
            <span class="hidden sm:inline ml-1">{{ t('contacts.add', 'Ajouter') }}</span>
          </button>
        </div>

        <!-- Ligne 2 : Filtre par entreprise + Stats -->
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <CompanySearch
              v-model="selectedCompanyFilter"
              :placeholder="t('contacts.filterByCompany', 'Filtrer par entreprise...')"
              allow-all
              @company-selected="onCompanyFilterChanged"
              @clear="clearCompanyFilter"
            />
          </div>
          <div class="text-sm text-base-content/70 whitespace-nowrap">
            {{ pagination.totalItems }} {{ t('contacts.results', 'résultats') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des contacts -->
    <div class="card bg-base-100 shadow-md">
      <div class="card-body">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Affichage contacts : tableau desktop + cartes mobile -->
        <div v-else-if="contacts && contacts.length > 0">
          <!-- Affichage desktop : tableau -->
          <div class="hidden md:block overflow-x-auto overflow-visible relative">
            <table class="table table-zebra w-full table-fixed relative">
              <colgroup>
                <col class="w-[20%]" />
                <!-- Nom -->
                <col class="w-[22%]" />
                <!-- Email -->
                <col class="w-[14%]" />
                <!-- Téléphone -->
                <col class="w-[20%]" />
                <!-- Entreprise -->
                <col class="w-[14%]" />
                <!-- Position -->
                <col class="w-[10%]" />
                <!-- Actions -->
              </colgroup>
              <thead>
                <tr>
                  <th class="text-left">{{ t('common.name') }}</th>
                  <th class="text-left">{{ t('common.email') }}</th>
                  <th class="text-left">{{ t('common.phone') }}</th>
                  <th class="text-left">{{ t('common.company') }}</th>
                  <th class="text-left">{{ t('common.position') }}</th>
                  <th class="text-center">{{ t('common.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="contact in contacts" :key="contact.id">
                  <td class="py-3">
                    <div class="flex items-center space-x-3">
                      <div class="avatar placeholder">
                        <div
                          class="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          <span class="text-xs font-bold leading-none">{{
                            getInitials(contact)
                          }}</span>
                        </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="font-semibold text-sm truncate">
                          {{ contact.firstName }} {{ contact.lastName }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="tooltip tooltip-top table-tooltip text-sm w-full" :data-tip="contact.email || '-'">
                      <div class="truncate w-full">
                        <a
                          v-if="contact.email"
                          :href="`mailto:${contact.email}`"
                          class="text-primary hover:underline"
                        >
                          {{ contact.email }}
                        </a>
                        <span v-else class="text-base-content/50">-</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="tooltip tooltip-top table-tooltip text-sm" :data-tip="contact.phone || '-'">
                      <div class="whitespace-nowrap">
                        <a
                          v-if="contact.phone"
                          :href="`tel:${contact.phone}`"
                          class="text-primary hover:underline"
                        >
                          {{ contact.phone }}
                        </a>
                        <span v-else class="text-base-content/50">-</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="tooltip tooltip-top table-tooltip text-sm w-full" :data-tip="getCompanyName(contact)">
                      <div class="truncate w-full">
                        <span class="font-medium">{{ getCompanyName(contact) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3">
                    <div class="tooltip tooltip-top table-tooltip text-sm text-base-content/70 w-full" :data-tip="contact.position || '-'">
                      <div class="truncate w-full">
                        {{ contact.position || '-' }}
                      </div>
                    </div>
                  </td>
                  <td class="py-3 text-center">
                    <div class="flex justify-center space-x-1">
                      <div class="tooltip tooltip-top table-tooltip" :data-tip="t('common.edit')">
                        <button
                          class="btn btn-ghost btn-xs btn-square"
                          @click="editContact(contact)"
                        >
                          <Iconify icon="mdi:pencil" class="w-3 h-3" />
                        </button>
                      </div>
                      <div class="tooltip tooltip-top table-tooltip" :data-tip="t('common.delete')">
                        <button
                          class="btn btn-ghost btn-xs btn-square text-error hover:bg-error hover:text-error-content"
                          @click="deleteContact(contact)"
                        >
                          <Iconify icon="mdi:delete" class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Affichage mobile : cartes -->
          <div class="md:hidden space-y-3">
            <div
              v-for="contact in contacts"
              :key="contact.id"
              class="bg-base-100 border border-base-300 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <!-- En-tête de carte avec avatar et nom -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="avatar placeholder">
                    <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span class="text-sm">{{ getInitials(contact) }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="font-bold text-base">
                      {{ contact.firstName }} {{ contact.lastName }}
                    </div>
                    <div v-if="contact.position" class="text-sm text-base-content/70">
                      {{ contact.position }}
                    </div>
                  </div>
                </div>

                <!-- Menu d'actions mobile -->
                <div class="dropdown dropdown-end">
                  <button class="btn btn-ghost btn-sm btn-square" tabindex="0">
                    <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
                  </button>
                  <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44 z-50">
                    <li>
                      <button @click="editContact(contact)" class="text-left">
                        <Iconify icon="mdi:pencil" class="w-4 h-4" />
                        {{ t('common.edit') }}
                      </button>
                    </li>
                    <li>
                      <button @click="deleteContact(contact)" class="text-left text-error">
                        <Iconify icon="mdi:delete" class="w-4 h-4" />
                        {{ t('common.delete') }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Informations de contact -->
              <div class="space-y-2">
                <!-- Email -->
                <div v-if="contact.email" class="flex items-center space-x-2 text-sm">
                  <Iconify icon="mdi:email" class="w-4 h-4 text-base-content/50" />
                  <a :href="`mailto:${contact.email}`" class="text-primary hover:underline">
                    {{ contact.email }}
                  </a>
                </div>

                <!-- Téléphone -->
                <div v-if="contact.phone" class="flex items-center space-x-2 text-sm">
                  <Iconify icon="mdi:phone" class="w-4 h-4 text-base-content/50" />
                  <a :href="`tel:${contact.phone}`" class="text-primary hover:underline">
                    {{ contact.phone }}
                  </a>
                </div>

                <!-- Entreprise -->
                <div class="flex items-center space-x-2 text-sm">
                  <Iconify icon="mdi:office-building" class="w-4 h-4 text-base-content/50" />
                  <span>{{ getCompanyName(contact) }}</span>
                </div>
              </div>

              <!-- Tags ou badges (optionnel pour le futur) -->
              <div v-if="contact.status" class="mt-3 flex justify-end">
                <div class="badge badge-outline badge-sm">
                  {{ contact.status.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination (commune aux deux affichages) -->
        <div
          v-if="contacts && contacts.length > 0 && pagination.totalPages > 1"
          class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4"
        >
          <!-- Informations sur la pagination -->
          <div class="text-sm text-base-content/70">
            {{ t('common.showing') }}
            {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }} -
            {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems) }}
            {{ t('common.of') }} {{ pagination.totalItems }} {{ t('common.results') }}
          </div>

          <!-- Contrôles de pagination -->
          <div class="btn-group">
            <button
              class="btn btn-sm"
              :class="{ 'btn-disabled': pagination.currentPage === 1 }"
              @click="changePage(pagination.currentPage - 1)"
            >
              « {{ t('common.previous') }}
            </button>

            <!-- Pages -->
            <template v-for="page in getVisiblePages()" :key="page">
              <button v-if="page === '...'" class="btn btn-sm btn-disabled">...</button>
              <button
                v-else
                class="btn btn-sm"
                :class="{ 'btn-active': page === pagination.currentPage }"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </template>

            <button
              class="btn btn-sm"
              :class="{ 'btn-disabled': pagination.currentPage === pagination.totalPages }"
              @click="changePage(pagination.currentPage + 1)"
            >
              {{ t('common.next') }} »
            </button>
          </div>
        </div>

        <!-- État vide -->
        <div v-else class="text-center py-8">
          <Iconify icon="mdi:account-multiple" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">{{ t('contacts.noContacts') }}</h3>
          <p class="text-gray-600 mb-4">{{ t('contacts.noContactsDescription') }}</p>
          <button class="btn btn-primary" @click="openContactModal()">
            <Iconify icon="mdi:plus" class="w-4 h-4 mr-2" />
            {{ t('contacts.addFirstContact') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification de contact -->
    <ContactModal
      :is-open="isContactModalOpen"
      :contact="editingContact"
      :company-id="selectedCompanyForModal"
      :companies="companies"
      :is-edit-mode="isEditMode"
      :is-submitting="isSubmitting"
      @close="closeContactModal"
      @submit="handleContactSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import CompanySearch from '@/components/common/CompanySearch.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ContactModal from '@/components/contacts/ContactModal.vue'
import { contactService } from '@/services/contact.service'
import { useCompanyStore } from '@/stores/company'
import type { Contact, ContactCreateDto, ContactSearchParams } from '@/types/contact.types'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// Fonction debounce simple sans dépendance externe
function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): T {
  let timeout: number | null = null
  return ((...args: unknown[]) => {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }) as T
}

const { t } = useI18n()
const companyStore = useCompanyStore()

// État des données
const contacts = ref<Contact[]>([])
const loading = ref(false)

// Filtres et recherche
const searchQuery = ref('')
const selectedCompanyFilter = ref('')

// Pagination
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 20,
})

// Modal de contact
const isContactModalOpen = ref(false)
const editingContact = ref<Contact | null>(null)
const isEditMode = ref(false)
const isSubmitting = ref(false)
const selectedCompanyForModal = ref('')

// Computed
const companies = computed(() => companyStore.companies)

const searchParams = computed((): ContactSearchParams => {
  const params: ContactSearchParams = {
    page: pagination.value.currentPage,
    itemsPerPage: pagination.value.pageSize,
  }

  // Si on a une recherche, on cherche dans le nom et l'email
  if (searchQuery.value?.trim()) {
    params.name = searchQuery.value.trim()
    params.email = searchQuery.value.trim()
  }

  // Filtre par entreprise spécifique
  if (selectedCompanyFilter.value) {
    params.companyId = selectedCompanyFilter.value
  }

  return params
})

// Debounced search
const debouncedSearch = debounce(() => {
  pagination.value.currentPage = 1
  loadContacts()
}, 500)

// Charger les données au montage
onMounted(async () => {
  await Promise.all([loadContacts(), loadCompanies()])
})

// Charger les contacts
async function loadContacts() {
  loading.value = true
  try {
    const response = await contactService.getContacts(searchParams.value)
    contacts.value = response?.items || []
    pagination.value = {
      currentPage: response?.pagination?.currentPage || 1,
      totalPages: response?.pagination?.totalPages || 1,
      totalItems: response?.pagination?.totalItems || 0,
      pageSize: response?.pagination?.itemsPerPage || 20,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des contacts:', error)
    contacts.value = [] // S'assurer que contacts reste un tableau même en cas d'erreur
  } finally {
    loading.value = false
  }
}

// Charger les entreprises
async function loadCompanies() {
  try {
    // Utiliser le store pour récupérer les entreprises
    await companyStore.fetchCompanies()
  } catch (error) {
    console.error('Erreur lors du chargement des entreprises:', error)
  }
}

// Navigation pagination
function changePage(page: number | string) {
  if (typeof page === 'number' && page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.currentPage = page
    loadContacts()
  }
}

// Gestion de la modal
function openContactModal(companyId = '') {
  // Si on a un filtre de compagnie actif, on le préselectionne
  selectedCompanyForModal.value =
    companyId || selectedCompanyFilter.value || companies.value[0]?.id || ''
  editingContact.value = null
  isEditMode.value = false
  isContactModalOpen.value = true
}

function editContact(contact: Contact) {
  editingContact.value = contact
  selectedCompanyForModal.value = contact.company?.id || ''
  isEditMode.value = true
  isContactModalOpen.value = true
}

function closeContactModal() {
  isContactModalOpen.value = false
  editingContact.value = null
  isEditMode.value = false
  selectedCompanyForModal.value = ''
}

// Gestion des soumissions
async function handleContactSubmit(data: Record<string, unknown>) {
  isSubmitting.value = true
  try {
    if (isEditMode.value && 'id' in data) {
      await contactService.updateContact(String(data.id), data)
    } else {
      // Validation des champs obligatoires
      if (!data.firstName || !data.lastName) {
        throw new Error('Prénom et nom sont obligatoires')
      }
      const contactData: ContactCreateDto = {
        firstName: String(data.firstName),
        lastName: String(data.lastName),
        statusId: String(data.statusId || 'default-status-id'),
      }
      if (data.email) contactData.email = String(data.email)
      if (data.phone) contactData.phone = String(data.phone)
      if (data.position) contactData.position = String(data.position)
      if (data.companyId) contactData.companyId = String(data.companyId)
      await contactService.createContact(contactData)
    }

    await loadContacts()
    closeContactModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du contact:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Suppression d'un contact
async function deleteContact(contact: Contact) {
  if (confirm(t('contacts.confirmDelete', { name: `${contact.firstName} ${contact.lastName}` }))) {
    try {
      await contactService.deleteContact(contact.id)
      await loadContacts()
    } catch (error) {
      console.error('Erreur lors de la suppression du contact:', error)
    }
  }
}

// Utilitaires
function getInitials(contact: Contact): string {
  return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase()
}

function getCompanyName(contact: Contact): string {
  return contact.company?.name || '-'
}

// Fonction pour calculer les pages visibles dans la pagination
function getVisiblePages(): (number | string)[] {
  const pages: (number | string)[] = []
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages

  if (total <= 7) {
    // Si on a 7 pages ou moins, on les affiche toutes
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Logique pour afficher les pages avec des ellipses
    pages.push(1)

    if (current > 4) {
      pages.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }

    if (current < total - 3) {
      pages.push('...')
    }

    if (total > 1) {
      pages.push(total)
    }
  }

  return pages
}

// Gestionnaires pour le filtre de compagnie
function onCompanyFilterChanged() {
  pagination.value.currentPage = 1
  loadContacts()
}

function clearCompanyFilter() {
  selectedCompanyFilter.value = ''
  pagination.value.currentPage = 1
  loadContacts()
}
</script>

<style scoped>
.contacts-list-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Animations pour les cartes mobiles */
@media (max-width: 768px) {
  .md\:hidden .hover\:shadow-md {
    transition: all 0.2s ease-in-out;
  }

  .md\:hidden .hover\:shadow-md:active {
    transform: scale(0.98);
  }
}

/* Amélioration du survol sur desktop */
@media (min-width: 769px) {
  .table tbody tr:hover {
    background-color: hsl(var(--b2));
  }
}

/* Dividers horizontaux plus fins */
.divider-horizontal {
  width: 1px;
  height: 2.5rem;
  background: hsl(var(--bc) / 0.1);
}

/* Style pour les inputs avec boutons absolus */
.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-container .input {
  padding-right: 2.5rem !important;
  flex: 1;
}

.search-input-container .search-btn {
  position: absolute !important;
  right: 0.5rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10 !important;
  pointer-events: auto !important;
}

/* États de focus améliorés */
.input:focus,
.select:focus {
  border-color: hsl(var(--p));
  box-shadow: 0 0 0 2px hsl(var(--p) / 0.2);
}

/* Amélioration du dropdown des actions mobiles */
.dropdown-content {
  backdrop-filter: blur(8px);
  background-color: hsl(var(--b1) / 0.95);
}

/* Améliorations du tableau desktop */
.table-fixed {
  table-layout: fixed;
}

.table-fixed td {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Amélioration des avatars dans le tableau */
.table .avatar {
  flex-shrink: 0;
}

/* Espacement vertical optimisé pour le tableau */
.table tbody tr {
  border-bottom: 1px solid hsl(var(--b3));
}

.table tbody tr:last-child {
  border-bottom: none;
}

/* Hover state amélioré pour les lignes du tableau */
.table tbody tr:hover {
  background-color: hsl(var(--b2)) !important;
  transition: background-color 0.2s ease;
}

/* Responsive pour les colonnes de téléphone */
@media (max-width: 1024px) and (min-width: 768px) {
  .table-fixed colgroup col:nth-child(3) {
    width: 12%;
  }
  .table-fixed colgroup col:nth-child(5) {
    width: 12%;
  }
}

/* Correction pour le tableau */
.table {
  position: relative;
}

/* CSS spécial pour les tooltips dans les tableaux */
.table-tooltip:before,
.table-tooltip:after {
  position: fixed !important;
  z-index: 99999 !important;
}

/* Force l'affichage des tooltips au-dessus de tout */
.card {
  overflow: visible !important;
}

.card-body {
  overflow: visible !important;
}

.overflow-x-auto {
  overflow-x: auto;
  overflow-y: visible !important;
}

/* Amélioration du centrage des avatars */
.avatar.placeholder .bg-primary {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar.placeholder span {
  line-height: 1;
  display: block;
}

/* Amélioration de la troncature */
.table .truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 100%;
}

/* Assurer que les conteneurs de texte prennent toute la largeur */
.table td .w-full {
  width: 100% !important;
  min-width: 0;
}
</style>
