<template>
  <div class="flex justify-center">
    <div class="tooltip" data-tip="Retour au tableau de bord">
      <div class="btn btn-primary btn-sm" @click="goToDashboard">
        <Iconify icon="uil:arrow-left" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push({ name: 'dashboard' })
}
</script>
