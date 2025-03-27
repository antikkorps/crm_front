<template>
  <Card>
    <template #header>
      <div class="flex justify-between items-center mx-2 sm:mx-3 pt-3">
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <Button
          v-if="showAddButton"
          text
          rounded
          aria-label="Ajouter"
          @click="$emit('add')"
        >
          <template #icon>
            <Icon name="mdi:plus" class="w-5 h-5" />
          </template>
        </Button>
      </div>
    </template>

    <template #content>
      <div v-if="loading" class="flex justify-center py-4">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </div>
      <div v-else-if="items.length === 0" class="text-center py-6 text-gray-500">
        {{ emptyMessage }}
      </div>
      <ul v-else class="list-none p-0 m-0">
        <li
          v-for="item in items"
          :key="item.id"
          class="flex items-center p-3 border-bottom-1 surface-border"
        >
          <Avatar shape="circle" class="mr-3">
            <template #icon>
              <Icon :name="iconName" class="w-5 h-5" />
            </template>
          </Avatar>
          <div class="flex-1">
            <span class="font-bold block mb-1">{{ item.title }}</span>
            <span class="text-500">{{ item.subtitle }}</span>
          </div>
          <div>
            <Button text rounded aria-label="Options" @click="$emit('options', item)">
              <template #icon>
                <Icon name="mdi:dots-vertical" class="w-5 h-5" />
              </template>
            </Button>
          </div>
        </li>
      </ul>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <Button v-if="footerButtonLabel" @click="$emit('view-all')" text>
          <span>{{ footerButtonLabel }}</span>
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  emptyMessage: {
    type: String,
    default: "Aucun élément à afficher",
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  footerButtonLabel: {
    type: String,
    default: "",
  },
  iconName: {
    type: String,
    default: "mdi:calendar",
  },
})

defineEmits(["add", "options", "view-all"])
</script>

<style scoped>
.reminder-card :deep(.p-card-footer) {
  padding: 0.5rem 1rem !important;
}

.reminder-card :deep(.p-card-content) {
  padding-bottom: 0.5rem !important;
}
</style>