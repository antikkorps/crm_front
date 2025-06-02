<template>
  <dialog ref="dialogRef" :open="isOpen" class="modal">
    <div ref="modalBox" class="modal-box w-full max-w-2xl" :class="{ 'opacity-0': isOpen }">
      <h2 class="text-xl font-bold mb-4">{{ task?.title || t('tasks.details') }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Status -->
        <div class="form-control">
          <label class="label font-medium">{{ t('common.status') }}</label>
          <div>
            <span
              :class="getTaskStatusClass(task?.taskStatus || '')"
              class="px-3 py-1 rounded-full text-sm"
            >
              {{ getTaskStatusLabel(task?.taskStatus || '') }}
            </span>
          </div>
        </div>

        <!-- Priority -->
        <div class="form-control">
          <label class="label font-medium">{{ t('tasks.priority') }}</label>
          <div>
            <span :class="getTaskPriorityClass(task?.priority || '')" class="badge">
              {{ getTaskPriorityLabel(task?.priority || '') }}
            </span>
          </div>
        </div>

        <!-- Due Date -->
        <div class="form-control">
          <label class="label font-medium">{{ t('tasks.dueDate') }}</label>
          <div>{{ task?.dueDate ? formatDate(task.dueDate) : '-' }}</div>
        </div>

        <!-- Assigned To -->
        <div class="form-control">
          <label class="label font-medium">{{ t('common.assignedTo') }}</label>
          <div>
            {{
              task?.assignedTo
                ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
                : t('common.notAssigned')
            }}
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="form-control mb-6">
        <label class="label font-medium">{{ t('common.description') }}</label>
        <div class="bg-base-200 p-3 rounded-lg min-h-[100px]">
          {{ task?.content || t('common.noDescription') }}
        </div>
      </div>

      <!-- Related info -->
      <div v-if="task?.Company || task?.Contact" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div v-if="task?.Company" class="form-control">
          <label class="label font-medium">{{ t('companies.title') }}</label>
          <div>{{ task.Company.name }}</div>
        </div>

        <div v-if="task?.Contact" class="form-control">
          <label class="label font-medium">{{ t('contacts.title') }}</label>
          <div>{{ task.Contact.firstName }} {{ task.Contact.lastName }}</div>
        </div>
      </div>

      <!-- Creation info -->
      <div class="text-sm text-gray-500 mt-4 border-t pt-4">
        <div>
          {{ t('common.createdBy', 'Créé par') }}: {{ task?.createdBy?.firstName }}
          {{ task?.createdBy?.lastName }}
        </div>
        <div>
          {{ t('common.createdAt', 'Créé le') }}:
          {{ task?.createdAt ? formatDate(task.createdAt) : '-' }}
        </div>
        <div>
          {{ t('common.updatedAt', 'Mis à jour le') }}:
          {{ task?.updatedAt ? formatDate(task.updatedAt) : '-' }}
        </div>
      </div>

      <!-- Actions buttons -->
      <div class="flex justify-end space-x-3 mt-6">
        <button type="button" class="btn btn-outline" @click="closeDialog">
          {{ t('common.close') }}
        </button>
        <button
          v-if="task?.taskStatus !== 'COMPLETED'"
          type="button"
          class="btn btn-primary"
          @click="completeTask"
        >
          {{ t('tasks.complete') }}
        </button>
        <button type="button" class="btn btn-outline btn-warning" @click="editTask">
          {{ t('common.edit') }}
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="closeDialog">{{ t('common.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { formatDate } from '@/utils/date'
import gsap from 'gsap'
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  task: Activity | null
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'complete', 'edit'])
const dialogRef = ref<HTMLDialogElement | null>(null)
const modalBox = ref<HTMLElement | null>(null)

// Helper functions for tasks
function getTaskStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return t('tasks.status.pending', 'En attente')
    case 'IN_PROGRESS':
      return t('tasks.status.inProgress', 'En cours')
    case 'COMPLETED':
      return t('tasks.status.completed', 'Terminée')
    case 'CANCELLED':
      return t('tasks.status.cancelled', 'Annulée')
    default:
      return status
  }
}

function getTaskStatusClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-200 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100'
  }
}

function getTaskPriorityLabel(priority: string): string {
  switch (priority) {
    case 'LOW':
      return t('tasks.priorityLevel.low', 'Basse')
    case 'MEDIUM':
      return t('tasks.priorityLevel.medium', 'Moyenne')
    case 'HIGH':
      return t('tasks.priorityLevel.high', 'Élevée')
    default:
      return priority
  }
}

function getTaskPriorityClass(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'badge-info'
    case 'MEDIUM':
      return 'badge-warning'
    case 'HIGH':
      return 'badge-error'
    default:
      return 'badge-ghost'
  }
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      animateOpen()
    }
  },
)

// Animation d'ouverture
function animateOpen() {
  if (!modalBox.value) return

  // Préparer l'état initial
  gsap.set(modalBox.value, {
    opacity: 0,
    y: -50,
    scale: 0.95,
  })

  // Animation d'entrée
  gsap
    .timeline()
    .to(modalBox.value, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)',
    })
    .from(
      modalBox.value.querySelectorAll('.form-control'),
      {
        opacity: 0,
        y: 15,
        stagger: 0.05,
        duration: 0.3,
        ease: 'power1.out',
      },
      '-=0.2',
    )
}

// Animation de fermeture
function closeDialogWithAnimation() {
  if (!modalBox.value) {
    emit('close')
    return
  }

  gsap.to(modalBox.value, {
    opacity: 0,
    y: 20,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      emit('close')
    },
  })
}

function completeTask() {
  if (props.task) {
    emit('complete', props.task.id)
  }
}

function editTask() {
  if (props.task) {
    emit('edit', props.task)
  }
}

function closeDialog() {
  closeDialogWithAnimation()
}

watchEffect(() => {
  if (props.isOpen && modalBox.value) {
    setTimeout(() => animateOpen(), 50)
  }
})

onMounted(() => {
  if (props.isOpen && modalBox.value) {
    animateOpen()
  }
})
</script>
