<template>
  <div>
    <h1 class="text-3xl font-bold mt-3 mb-6">Tableau de bord</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatsCard
        title="Contacts"
        :value="dashboardData.counts?.contacts || 0"
        icon="carbon:user"
      />
      <StatsCard
        title="Entreprises"
        :value="dashboardData.counts?.companies || 0"
        icon="carbon:enterprise"
      />
      <StatsCard
        title="Notes"
        :value="dashboardData.counts?.notes || 0"
        icon="carbon:document"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Rappels à venir avec le composant réutilisable -->
      <ReminderCard
        title="Rappels à venir"
        :loading="loading"
        :items="formattedReminders"
        empty-message="Aucun rappel à venir"
        footer-button-label="Voir tous"
        icon-name="mdi:calendar"
        @add="handleAddReminder"
        @options="handleReminderOptions"
        @view-all="navigateToReminders"
      />

      <!-- Activités récentes avec le même composant -->
      <ReminderCard
        title="Activités récentes"
        :loading="loading"
        :items="formattedActivities"
        empty-message="Aucune activité récente"
        footer-button-label="Historique"
        :show-add-button="false"
        icon-name="mdi:history"
        @view-all="navigateToActivities"
      />
    </div>
    <v-button>Hello</v-button>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
})

const { api } = useApiService()
const dashboardData = ref({})
const loading = ref(true)

const formattedReminders = computed(() => {
  if (!dashboardData.value.reminders?.upcoming) return []

  // Transformer les données brutes en format attendu par le composant
  return Array.from(
    { length: dashboardData.value.counts?.reminders?.upcoming || 0 },
    (_, i) => ({
      id: i + 1,
      title: `Rappel #${i + 1}`,
      subtitle: "10 mars 2025 - 14:00",
    })
  )
})

// De même pour les activités
const formattedActivities = computed(() => {
  // Similaire à formattedReminders, mais pour les activités
  return []
})

// Fonctions de gestion des événements
const handleAddReminder = () => {
  // Logique pour ajouter un rappel
  navigateTo("/reminders/new")
}

const handleReminderOptions = (reminder) => {
  // Logique pour gérer les options d'un rappel
  console.log("Options for reminder:", reminder)
}

const navigateToReminders = () => navigateTo("/reminders")
const navigateToActivities = () => navigateTo("/activities")

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
