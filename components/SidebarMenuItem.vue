<template>
  <div class="sidebar-menu-item">
    <!-- Section title (if item has children) -->
    <div
      v-if="item.children && item.label"
      v-ripple
      @click="toggleSubmenu"
      class="menu-header flex items-center justify-between p-3 rounded-md cursor-pointer"
      :class="{ active: isActive }"
    >
      <div class="flex items-center gap-2">
        <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.label }}</span>
      </div>
      <Transition name="rotate">
        <Icon
          :name="isOpen ? 'heroicons:chevron-down' : 'heroicons:chevron-right'"
          class="transition-transform duration-200 w-5 h-5"
        />
      </Transition>
    </div>

    <!-- Simple menu item (if no children) -->
    <NuxtLink
      v-else-if="!item.children && item.to"
      :to="item.to"
      v-ripple
      class="menu-link flex items-center p-3 rounded-md gap-2"
      :class="{ active: route.path === item.to }"
    >
      <Icon v-if="item.icon" :name="item.icon" class="w-5 h-5" />
      <span class="font-medium">{{ item.label }}</span>
      <span
        v-if="item.badge"
        class="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-primary text-white"
      >
        {{ item.badge }}
      </span>
    </NuxtLink>

    <!-- Submenu container -->
    <Transition name="submenu">
      <div v-if="isOpen && item.children" class="submenu pl-3">
        <SidebarMenuItem
          v-for="(child, idx) in item.children"
          :key="idx"
          :item="child"
          :depth="depth + 1"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
})

const route = useRoute()
const isOpen = ref(false)

// Auto-expand menu item if it contains the current route
const isActive = computed(() => {
  if (!props.item.children) return false
  return props.item.children.some(
    (child) =>
      (child.to && route.path === child.to) ||
      (child.children && child.children.some((subChild) => subChild.to === route.path))
  )
})

// If the item is active (contains current route), expand it automatically
if (isActive.value) {
  isOpen.value = true
}

const toggleSubmenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.menu-header {
  transition: all 0.2s ease;
}

.menu-header:hover,
.menu-link:hover {
  background-color: rgba(var(--primary-50), 0.1);
}

.menu-header.active,
.menu-link.active {
  background-color: rgba(var(--primary-50), 0.2);
  color: var(--primary-color);
  font-weight: 500;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
  opacity: 1;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: transform 0.3s;
}

.rotate-enter-from,
.rotate-leave-to {
  transform: rotate(-90deg);
}
</style>
