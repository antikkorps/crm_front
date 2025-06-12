<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 w-full">
    <!-- Titre -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text font-medium">Titre</span>
      </label>
      <input
        v-model="formData.title"
        type="text"
        placeholder="Titre de la tâche"
        class="input input-bordered w-full"
        required
      />
    </div>

    <!-- Description -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text font-medium">Description</span>
      </label>
      <textarea
        v-model="formData.content"
        placeholder="Description de la tâche"
        class="textarea textarea-bordered h-24 w-full"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Statut -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-medium">Statut</span>
        </label>
        <select v-model="formData.taskStatus" class="select select-bordered w-full">
          <option :value="TaskStatus.PENDING">En attente</option>
          <option :value="TaskStatus.IN_PROGRESS">En cours</option>
          <option :value="TaskStatus.COMPLETED">Terminée</option>
          <option :value="TaskStatus.CANCELLED">Annulée</option>
        </select>
      </div>

      <!-- Priorité -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-medium">Priorité</span>
        </label>
        <select v-model="formData.priority" class="select select-bordered w-full">
          <option :value="TaskPriority.LOW">Basse</option>
          <option :value="TaskPriority.MEDIUM">Moyenne</option>
          <option :value="TaskPriority.HIGH">Haute</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Échéance -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-medium">Échéance</span>
        </label>
        <input v-model="formData.dueDate" type="date" class="input input-bordered w-full" />
      </div>

      <!-- Assigné à -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-medium">Assigné à</span>
        </label>
        <select v-model="formData.assignedToId" class="select select-bordered w-full">
          <option :value="null">Non assigné</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>
    </div>

    <!-- Contact et entreprise associés (optionnels) -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
      v-if="availableContacts.length > 0 || !props.companyId"
    >
      <!-- Contact associé -->
      <div class="form-control w-full" v-if="availableContacts.length > 0">
        <label class="label">
          <span class="label-text font-medium">Contact associé</span>
        </label>
        <select v-model="formData.contactId" class="select select-bordered w-full">
          <option :value="null">Aucun</option>
          <option v-for="contact in availableContacts" :key="contact.id" :value="contact.id">
            {{ contact.firstName }} {{ contact.lastName }}
          </option>
        </select>
      </div>

      <!-- Entreprise associée -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-medium">Entreprise associée</span>
        </label>
        <select
          v-model="formData.companyId"
          class="select select-bordered w-full"
          :disabled="!!props.companyId"
        >
          <option :value="null">Aucune</option>
          <!-- Si on a un companyId en props, on affiche seulement cette entreprise -->
          <option v-if="props.companyId" :value="props.companyId">
            {{ props.companyName }}
          </option>
          <!-- Sinon on affiche toutes les entreprises -->
          <option v-else v-for="company in companies" :key="company.id" :value="company.id">
            {{ company.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="modal-action mt-6 pt-3 border-t">
      <slot name="buttons">
        <button type="button" class="btn" @click="$emit('cancel')">Annuler</button>
        <button type="submit" class="btn btn-primary">
          <Iconify :icon="isEditMode ? 'mdi:content-save' : 'mdi:plus'" class="w-5 h-5 mr-1" />
          {{ isEditMode ? 'Enregistrer' : 'Créer' }}
        </button>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  TaskPriority,
  TaskStatus,
  type TaskCreateDto,
  type TaskUpdateDto,
} from '@/services/activity.service'
import { apiRequest } from '@/services/api.service'
import type { User } from '@/types/auth.types'
import type { ApiActivity } from '@/types/dashboard.types'
import { computed, onMounted, ref, watch } from 'vue'

// Interfaces pour les données associées
interface Contact {
  id: string
  firstName: string
  lastName: string
}

interface Company {
  id: string
  name: string
}

const props = defineProps({
  task: {
    type: Object as () => ApiActivity | null,
    default: null,
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  // Nouvelles props pour le contexte d'entreprise
  companyId: {
    type: String,
    default: null,
  },
  companyName: {
    type: String,
    default: null,
  },
  companyContacts: {
    type: Array as () => Contact[],
    default: () => [],
  },
})

const emit = defineEmits(['submit', 'cancel'])

// Données pour les listes déroulantes avec des types appropriés
const users = ref<User[]>([])
const contacts = ref<Contact[]>([])
const companies = ref<Company[]>([])

// Computed property pour les contacts disponibles
const availableContacts = computed(() => {
  // Si on a des contacts d'entreprise en props, on les utilise
  if (props.companyContacts && props.companyContacts.length > 0) {
    return props.companyContacts
  }
  // Sinon on utilise tous les contacts chargés
  return contacts.value
})

// Formulaire de tâche
const formData = ref<TaskCreateDto | (TaskUpdateDto & { contactId?: string; companyId?: string })>({
  title: '',
  content: '',
  dueDate: null,
  priority: TaskPriority.MEDIUM,
  taskStatus: TaskStatus.PENDING,
  assignedToId: null,
  contactId: undefined,
  companyId: undefined,
  type: 'TASK',
})

// Observer les changements de la prop task
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      formData.value = {
        title: newTask.title || '',
        content: newTask.content || '',
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : null,
        priority:
          (newTask.priority as string) === 'LOW'
            ? TaskPriority.LOW
            : (newTask.priority as string) === 'HIGH'
              ? TaskPriority.HIGH
              : TaskPriority.MEDIUM,
        taskStatus:
          (newTask.taskStatus as string) === 'COMPLETED'
            ? TaskStatus.COMPLETED
            : (newTask.taskStatus as string) === 'IN_PROGRESS'
              ? TaskStatus.IN_PROGRESS
              : (newTask.taskStatus as string) === 'CANCELLED'
                ? TaskStatus.CANCELLED
                : TaskStatus.PENDING,
        assignedToId: newTask.assignedToId || null,
        contactId: newTask.contactId || undefined,
        companyId: newTask.companyId || props.companyId || undefined,
      }
    } else if (!props.isEditMode) {
      // Réinitialiser le formulaire pour la création
      formData.value = {
        title: '',
        content: '',
        dueDate: null,
        priority: TaskPriority.MEDIUM,
        taskStatus: TaskStatus.PENDING,
        type: 'TASK',
        assignedToId: null,
        contactId: undefined,
        companyId: props.companyId || undefined, // Pré-remplir avec l'entreprise du contexte
      }
    }
  },
  { immediate: true },
)

// Récupérer les utilisateurs, contacts et entreprises
const fetchRelatedData = async () => {
  try {
    // Toujours récupérer les utilisateurs
    const usersData = await apiRequest<{ items: User[] }>('/v1/users')
    users.value = usersData.items

    // Ne charger les contacts que si on n'a pas de contacts d'entreprise fournis
    if (!props.companyContacts || props.companyContacts.length === 0) {
      const contactsData = await apiRequest<{ items: Contact[] }>('/v1/contacts?limit=10')
      contacts.value = contactsData.items
    }

    // Ne charger les entreprises que si on n'est pas dans le contexte d'une entreprise
    if (!props.companyId) {
      const companiesData = await apiRequest<{ items: Company[] }>('/v1/companies?limit=10')
      companies.value = companiesData.items
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données associées:', error)
  }
}

const handleSubmit = () => {
  emit('submit', formData.value)
}

// Charger les données associées au montage du composant
onMounted(() => {
  fetchRelatedData()
})
</script>
