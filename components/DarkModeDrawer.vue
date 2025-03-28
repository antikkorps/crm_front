<template>
  <div>
    <!-- Overlay/mask pour mode drawer -->
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="close"
      ></div>
    </Transition>

    <!-- Drawer panel -->
    <div
      class="fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out transform shadow-xl"
      :class="[
        modelValue ? 'translate-x-0' : '-translate-x-full',
        'bg-white dark:bg-gray-800 w-80 sm:w-96',
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(["update:modelValue"])

function close() {
  emit("update:modelValue", false)
}

// Gérer la touche Échap
function handleEsc(e) {
  if (e.key === "Escape" && props.modelValue) {
    close()
  }
}

// Bloquer le scroll du body quand le drawer est visible
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEsc)
    } else {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEsc)
    }
  }
)

// Nettoyage
onBeforeUnmount(() => {
  document.body.style.overflow = ""
  window.removeEventListener("keydown", handleEsc)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
