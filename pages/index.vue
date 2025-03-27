<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Tableau de bord</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <DashboardCard
        title="Contacts"
        :value="dashboardData.counts?.contacts || 0"
        icon="carbon:user"
      />
      <DashboardCard
        title="Entreprises"
        :value="dashboardData.counts?.companies || 0"
        icon="carbon:enterprise"
      />
      <DashboardCard
        title="Notes"
        :value="dashboardData.counts?.notes || 0"
        icon="carbon:document"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Rappels à venir</h2>
        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"
          ></div>
        </div>
        <div
          v-else-if="dashboardData.counts?.reminders?.upcoming === 0"
          class="text-center py-8 text-gray-500"
        >
          Aucun rappel à venir
        </div>
        <ul v-else class="divide-y">
          <!-- Ici on afficherait les rappels -->
          <li
            v-for="i in dashboardData.counts?.reminders?.upcoming"
            :key="i"
            class="py-3"
          >
            Rappel #{{ i }}
          </li>
        </ul>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Activités récentes</h2>
        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"
          ></div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">Aucune activité récente</div>
      </div>
    </div>
    <Button label="Submit" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
})

const { api } = useApiService()
const dashboardData = ref({})
const loading = ref(true)

onMounted(async () => {
  try {
    dashboardData.value = await api.get("/analytics/dashboard")
  } catch (error) {
    console.error("Failed to load dashboard data:", error)
  } finally {
    loading.value = false
  }
})
</script>
