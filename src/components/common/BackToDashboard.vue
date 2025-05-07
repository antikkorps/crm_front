<template>
  <div class="flex justify-center">
    <div class="tooltip" :data-tip="t('common.backToDashboard')">
      <div class="btn btn-primary btn-sm" @click="goToDashboard">
        <Iconify icon="uil:arrow-left" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const goToDashboard = () => {
  router.push({ name: 'dashboard' })
}
</script>
