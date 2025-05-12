<template>
  <div class="status-page container mx-auto p-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <BackToDashboard />
      <div>
        <h1 class="text-2xl font-bold mt-4">Status d'entreprise</h1>
        <p class="text-sm text-gray-500">
          Gérez les status qui seront utilisés pour catégoriser vos entreprises
        </p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <Iconify icon="mdi:plus" class="w-5 h-5 mr-2" />
        Ajouter un status
      </button>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="statusStore.isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="statusStore.error" class="alert alert-error mb-6">
      <Iconify icon="mdi:alert-circle" class="w-6 h-6" />
      <span>{{ statusStore.error }}</span>
    </div>

    <!-- Aucun status trouvé -->
    <div v-else-if="!statusStore.statuses.length" class="py-12 text-center">
      <div class="mb-4 text-gray-400">
        <Iconify icon="mdi:tag-off" class="w-16 h-16 mx-auto" />
      </div>
      <h3 class="text-lg font-bold mb-2">Aucun status trouvé</h3>
      <p class="text-gray-500 mb-6">Commencez par créer un status pour vos entreprises</p>
      <button class="btn btn-primary" @click="openCreateModal">
        <Iconify icon="mdi:plus" class="w-5 h-5 mr-2" />
        Ajouter un status
      </button>
    </div>

    <!-- Liste des statuss -->
    <div v-else class="status-grid">
      <!-- Version bureau (masquée sur mobile) -->
      <div class="overflow-x-auto hidden md:block">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Couleur</th>
              <th>Ordre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="status in statusStore.getStatusesOrdered"
              :key="status.id"
              class="hover:bg-gray-50"
            >
              <td class="font-medium">{{ status.name }}</td>
              <td>{{ status.type }}</td>
              <td>
                <div class="flex items-center">
                  <div
                    class="w-6 h-6 rounded-full mr-2"
                    :style="{ backgroundColor: status.color }"
                  ></div>
                  <span>{{ status.color }}</span>
                </div>
              </td>
              <td>{{ status.order }}</td>
              <td>
                <div class="flex space-x-2">
                  <button class="btn btn-sm btn-ghost" @click="editStatus(status)">
                    <Iconify icon="mdi:pencil" class="w-5 h-5 text-primary" />
                  </button>
                  <button class="btn btn-sm btn-ghost" @click="confirmDelete(status)">
                    <Iconify icon="mdi:trash" class="w-5 h-5 text-error" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Version mobile (visible uniquement sur mobile) -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div
          v-for="status in statusStore.getStatusesOrdered"
          :key="status.id"
          class="card bg-base-100 shadow-sm"
        >
          <div class="card-body p-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: status.color }"></div>
                <h3 class="font-bold">{{ status.name }}</h3>
              </div>
              <div class="badge">{{ status.type }}</div>
            </div>
            <div class="flex justify-between items-center mt-4">
              <div class="text-sm text-gray-500">Ordre: {{ status.order }}</div>
              <div class="flex space-x-2">
                <button class="btn btn-sm btn-ghost" @click="editStatus(status)">
                  <Iconify icon="mdi:pencil" class="w-4 h-4 text-primary" />
                </button>
                <button class="btn btn-sm btn-ghost" @click="confirmDelete(status)">
                  <Iconify icon="mdi:trash" class="w-4 h-4 text-error" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour créer/modifier un status -->
    <div class="modal" :class="{ 'modal-open': showModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ isEditing ? 'Modifier le status' : 'Créer un status' }}
        </h3>

        <form @submit.prevent="submitForm">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Nom</span>
            </label>
            <input
              v-model="statusForm.name"
              type="text"
              class="input input-bordered w-full"
              placeholder="Ex: Prospect, Client, Partenaire..."
              required
            />
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Type</span>
            </label>
            <select v-model="statusForm.type" class="select select-bordered w-full" required>
              <option value="COMPANY">Entreprise</option>
              <option value="CONTACT">Contact</option>
              <option value="DEAL">Opportunité</option>
            </select>
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Couleur</span>
            </label>
            <input
              v-model="statusForm.color"
              type="color"
              class="input h-12 w-full cursor-pointer"
              required
            />
          </div>

          <div class="form-control mb-6">
            <label class="label">
              <span class="label-text">Ordre d'affichage</span>
            </label>
            <input
              v-model="statusForm.order"
              type="number"
              class="input input-bordered w-full"
              min="1"
              required
            />
          </div>

          <div class="modal-action">
            <button type="button" class="btn" @click="closeModal">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="statusStore.isLoading">
              {{ isEditing ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
      <div class="modal-backdrop" @click="closeModal"></div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <ConfirmDialog
      ref="confirmDialogRef"
      title="Confirmation de suppression"
      message="Êtes-vous sûr de vouloir supprimer ce status ? Cette action est irréversible et pourrait affecter les entreprises utilisant ce status."
      confirmText="Supprimer"
      confirmButtonClass="btn-error"
      icon="mdi:delete-alert"
      iconClass="text-error"
      @confirm="deleteStatus"
    />
  </div>
</template>

<script setup lang="ts">
import BackToDashboard from '@/components/common/BackToDashboard.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useStatusStore } from '@/stores/status'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import type { Status } from '@/types/company.types'
import { computed, onMounted, reactive, ref } from 'vue'

// Stores
const statusStore = useStatusStore()
const toastStore = useToastStore()
const userStore = useUserStore()

// Récupérer l'utilisateur courant et son tenantId
const currentUser = computed(() => userStore.currentUser)
const tenantId = computed(() => currentUser.value?.tenantId || '')

// État local
const showModal = ref(false)
const isEditing = ref(false)
const statusToDelete = ref<Status | null>(null)
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog> | null>(null)

// Formulaire
const statusForm = reactive({
  id: '',
  name: '',
  type: 'COMPANY',
  color: '#3498db',
  order: 1,
})

// Charger les status au montage du composant
onMounted(async () => {
  try {
    console.log('Avant fetchStatuses: statuses.length =', statusStore.statuses.length)
    await statusStore.fetchStatuses()
    console.log('Après fetchStatuses: statuses.length =', statusStore.statuses.length)
  } catch (error) {
    console.error('Erreur lors du chargement des status:', error)
    toastStore.error('Erreur lors du chargement des status')
  }
})

// Ouvrir le modal pour créer un nouveau status
function openCreateModal() {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

// Ouvrir le modal pour modifier un status existant
function editStatus(status: Status) {
  resetForm()
  statusForm.id = status.id
  statusForm.name = status.name
  statusForm.type = status.type
  statusForm.color = status.color
  statusForm.order = status.order
  isEditing.value = true
  showModal.value = true
}

// Confirmer la suppression d'un status
function confirmDelete(status: Status) {
  statusToDelete.value = status
  if (confirmDialogRef.value) {
    confirmDialogRef.value.showDialog()
  }
}

// Supprimer un status
async function deleteStatus() {
  if (!statusToDelete.value) return

  try {
    await statusStore.deleteStatus(statusToDelete.value.id)
    toastStore.success('status supprimé avec succès')
    statusToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression du status:', error)
    toastStore.error('Erreur lors de la suppression du status')
  }
}

// Soumettre le formulaire (création ou mise à jour)
async function submitForm() {
  try {
    if (isEditing.value) {
      const { id, ...updateData } = statusForm
      await statusStore.updateStatus(id, updateData)
      toastStore.success('status mis à jour avec succès')
    } else {
      if (!tenantId.value) {
        toastStore.error('Impossible de créer un status : tenantId non disponible')
        return
      }

      // Créer le status avec tous les champs nécessaires, y compris tenantId
      const createData = {
        name: statusForm.name,
        type: statusForm.type,
        color: statusForm.color,
        order: statusForm.order,
        tenantId: tenantId.value, // Utiliser le tenantId de l'utilisateur connecté
      }

      const result = await statusStore.createStatus(createData)
      console.log('status créé:', result)
      toastStore.success('status créé avec succès')
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du status:', error)
    toastStore.error('Erreur lors de la sauvegarde du status')
  }
}

// Fermer le modal et réinitialiser le formulaire
function closeModal() {
  showModal.value = false
  resetForm()
}

// Réinitialiser le formulaire
function resetForm() {
  statusForm.id = ''
  statusForm.name = ''
  statusForm.type = 'COMPANY'
  statusForm.color = '#3498db'
  statusForm.order = statusStore.statuses.length + 1
}
</script>

<style scoped>
/* Styles spécifiques pour les appareils mobiles */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }
}
</style>
