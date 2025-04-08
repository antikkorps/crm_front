<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg flex items-center gap-2">
        <Iconify :icon="icon" class="w-6 h-6" :class="iconClass" />
        {{ props.title }}
      </h3>
      <p class="py-4">{{ props.message }}</p>
      <div class="modal-action">
        <button class="btn" @click="handleCancel">{{ props.cancelText }}</button>
        <button 
          class="btn" 
          :class="confirmButtonClass" 
          @click="handleConfirm"
        >
          {{ props.confirmText }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps({
  title: {
    type: String,
    default: 'Confirmation',
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: 'Confirmer',
  },
  cancelText: {
    type: String,
    default: 'Annuler',
  },
  icon: {
    type: String,
    default: 'mdi:alert-circle-outline',
  },
  iconClass: {
    type: String,
    default: 'text-warning',
  },
  confirmButtonClass: {
    type: String,
    default: 'btn-primary',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const dialogRef = ref<HTMLDialogElement | null>(null);

const showDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal();
  }
};

const closeDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
  }
};

const handleConfirm = () => {
  emit('confirm');
  closeDialog();
};

const handleCancel = () => {
  emit('cancel');
  closeDialog();
};

// Exposer des méthodes pour le composant parent
defineExpose({
  showDialog,
  closeDialog,
});
</script>
