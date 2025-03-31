<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <router-link to="/" class="no-underline">
          <div>MyCRM</div>
        </router-link>
      </template>
      <template #item="{ item, props, hasSubmenu, root }">
        <a class="flex items-center" v-bind="props.action">
          <!-- Afficher l'icône Iconify si disponible -->
          <Icon v-if="item.iconName" :icon="item.iconName" class="w-6 h-6" />

          <span>{{ item.label }}</span>
          <Badge
            v-if="item.badge"
            :class="{ 'ml-auto': !root, 'ml-2': root }"
            :value="item.badge"
          />
          <span
            v-if="item.shortcut"
            class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <Icon
            v-if="hasSubmenu"
            :icon="root ? 'mdi:chevron-down' : 'mdi:chevron-right'"
            class="ml-auto"
          />
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <InputText placeholder="Search" type="text" class="w-32 sm:w-auto" />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = ref([
  {
    label: 'Home',
    iconName: 'mdi:home',
    command: () => router.push('/'),
  },
  {
    label: 'Projects',
    icon: 'pi pi-search',
    badge: 3,
    items: [
      {
        label: 'Core',
        iconName: 'mdi:lightning-bolt',
        shortcut: '⌘+S',
      },
      {
        label: 'Blocks',
        iconName: 'mdi:server',
        shortcut: '⌘+B',
      },
      {
        separator: true,
      },
      {
        label: 'UI Kit',
        iconName: 'mdi:pencil',
        shortcut: '⌘+U',
      },
    ],
  },
  {
    label: 'A propos',
    iconName: 'mdi:information',
    command: () => router.push('/about'),
  },
])
</script>
