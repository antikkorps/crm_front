<template>
  <div class="rounded-lg shadow-md p-6 mb-6 w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{{ t('contacts.title') }}</h2>
      <button class="btn btn-sm btn-outline" @click="$emit('add-contact')">
        <Iconify icon="mdi:plus" class="w-4 h-4" />
        {{ t('contacts.add') }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="contacts.length">
      <!-- Desktop Table -->
      <div class="overflow-x-auto hidden md:block">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>{{ t('common.fullName') }}</th>
              <th>{{ t('common.email') }}</th>
              <th>{{ t('common.phone') }}</th>
              <th>{{ t('common.position') }}</th>
              <th v-if="showActions" class="w-16">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="contact in contacts"
              :key="contact.id"
              class="hover:bg-base-300"
              :class="{ 'cursor-pointer': clickable }"
              @click="handleContactClick(contact)"
            >
              <td>{{ contact.firstName }} {{ contact.lastName }}</td>
              <td>
                <a
                  v-if="contact.email"
                  :href="`mailto:${contact.email}`"
                  class="text-primary hover:underline"
                  @click.stop
                >
                  {{ contact.email }}
                </a>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td>{{ contact.phone || '-' }}</td>
              <td>{{ contact.position || '-' }}</td>
              <td v-if="showActions">
                <div class="flex space-x-1">
                  <button class="btn btn-sm btn-ghost" @click.stop="$emit('edit-contact', contact)">
                    <Iconify icon="mdi:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    class="btn btn-sm btn-ghost text-error"
                    @click.stop="$emit('delete-contact', contact)"
                  >
                    <Iconify icon="mdi:trash-can" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="grid grid-cols-1 gap-4 md:hidden">
        <div
          v-for="contact in contacts"
          :key="contact.id"
          class="card bg-base-100 shadow-sm"
          :class="{ 'cursor-pointer hover:shadow-md transition-shadow': clickable }"
          @click="handleContactClick(contact)"
        >
          <div class="card-body p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="font-bold text-lg">{{ contact.firstName }} {{ contact.lastName }}</div>
              <div class="flex items-center space-x-2">
                <div v-if="showActions" class="flex space-x-1">
                  <button class="btn btn-sm btn-ghost" @click.stop="$emit('edit-contact', contact)">
                    <Iconify icon="mdi:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    class="btn btn-sm btn-ghost text-error"
                    @click.stop="$emit('delete-contact', contact)"
                  >
                    <Iconify icon="mdi:trash-can" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-500 mb-1">
              <span v-if="contact.position">{{ contact.position }}</span>
            </div>
            <div class="text-sm mb-1">
              <a
                v-if="contact.email"
                :href="`mailto:${contact.email}`"
                class="text-primary hover:underline"
                @click.stop
              >
                {{ contact.email }}
              </a>
            </div>
            <div class="text-sm">
              <span v-if="contact.phone">{{ contact.phone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <Iconify icon="mdi:account-multiple" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{{ t('contacts.noContacts') }}</p>
      <button class="btn btn-sm btn-primary mt-2" @click="$emit('add-contact')">
        {{ t('contacts.add') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompanyContact } from '@/types/company.types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  contacts: CompanyContact[]
  loading?: boolean
  showActions?: boolean
  clickable?: boolean
}>()

const emit = defineEmits<{
  'add-contact': []
  'edit-contact': [contact: CompanyContact]
  'delete-contact': [contact: CompanyContact]
  'contact-click': [contact: CompanyContact]
}>()

function handleContactClick(contact: CompanyContact) {
  emit('contact-click', contact)
}
</script>
