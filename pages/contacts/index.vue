<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Contacts</h1>
      <NuxtLink to="/contacts/new" class="btn btn-primary"> Nouveau contact </NuxtLink>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-4 flex items-center justify-between border-b">
        <div class="relative flex-1 max-w-sm">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un contact..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Icon
            name="heroicons:magnifying-glass"
            class="absolute left-3 top-2.5 text-gray-400"
          />
        </div>

        <div class="flex space-x-2">
          <select v-model="selectedStatus" class="border rounded-lg px-3 py-2">
            <option value="">Tous les statuts</option>
            <option v-for="status in statuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center p-8">
        <div
          class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"
        ></div>
      </div>

      <div v-else-if="contacts.length === 0" class="p-8 text-center text-gray-500">
        Aucun contact trouvé
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Téléphone
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Entreprise
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="contact in contacts" :key="contact.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">
                {{ contact.firstName }} {{ contact.lastName }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
              {{ contact.email || "—" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
              {{ contact.phone || "—" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">
              {{ contact.company?.name || "—" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :style="{
                  backgroundColor: `${contact.status?.color}20`,
                  color: contact.status?.color,
                }"
              >
                {{ contact.status?.name }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <NuxtLink
                :to="`/contacts/${contact.id}`"
                class="text-blue-600 hover:text-blue-900"
              >
                Voir
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="!loading && contacts.length > 0"
        class="px-6 py-3 flex items-center justify-between border-t"
      >
        <div class="text-sm text-gray-700">
          Affichage de {{ (page - 1) * limit + 1 }} à
          {{ Math.min(page * limit, totalItems) }} sur {{ totalItems }} contacts
        </div>

        <div class="flex items-center space-x-2">
          <button
            @click="prevPage"
            :disabled="page === 1"
            class="btn btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
          >
            Précédent
          </button>
          <button
            @click="nextPage"
            :disabled="page === totalPages"
            class="btn btn-sm"
            :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
})

const { api } = useApiService()

const contacts = ref([])
const statuses = ref([])
const loading = ref(true)
const searchQuery = ref("")
const selectedStatus = ref("")

// Pagination
const page = ref(1)
const limit = ref(10)
const totalItems = ref(0)
const totalPages = ref(1)

// Chargement des contacts
const fetchContacts = async () => {
  loading.value = true
  try {
    const queryParams = new URLSearchParams({
      page: page.value.toString(),
      limit: limit.value.toString(),
    })

    if (searchQuery.value) {
      queryParams.append("search", searchQuery.value)
    }

    if (selectedStatus.value) {
      queryParams.append("statusId", selectedStatus.value)
    }

    const response = await api.get(`/contacts?${queryParams.toString()}`)
    contacts.value = response.items
    totalItems.value = response.pagination.totalItems
    totalPages.value = response.pagination.totalPages
  } catch (error) {
    console.error("Failed to load contacts:", error)
  } finally {
    loading.value = false
  }
}

// Chargement des statuts
const fetchStatuses = async () => {
  try {
    const response = await api.get("/statuses/type/CONTACT")
    statuses.value = response
  } catch (error) {
    console.error("Failed to load statuses:", error)
  }
}

// Pagination
const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
    fetchContacts()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchContacts()
  }
}

// Lors du changement des filtres, revenir à la page 1
watch(
  [searchQuery, selectedStatus],
  () => {
    page.value = 1
    fetchContacts()
  },
  { debounce: 300 }
)

onMounted(() => {
  fetchContacts()
  fetchStatuses()
})
</script>
