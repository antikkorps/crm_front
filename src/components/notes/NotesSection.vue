<template>
  <div class="rounded-lg shadow-md p-6 mb-6 w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{{ title || t('notes.title') }}</h2>
      <button class="btn btn-sm btn-outline" @click="$emit('add')">
        <Iconify icon="mdi:plus" class="w-4 h-4" />
        {{ t('notes.add') }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="notes.length">
      <!-- Desktop Table -->
      <div class="overflow-x-auto hidden md:block">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>{{ t('common.content') }}</th>
              <th>{{ t('common.createdAt') }}</th>
              <th>{{ t('common.createdBy') }}</th>
              <th v-if="showActions" class="w-16">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="note in notes"
              :key="note.id"
              class="hover:bg-base-300"
              :class="{ 'cursor-pointer': clickable }"
              @click="handleNoteClick(note)"
            >
              <td>
                <div class="max-w-xs">
                  <p class="text-sm font-medium truncate">{{ note.title || note.content }}</p>
                  <p
                    v-if="showPreview && note.content && note.content.length > 50"
                    class="text-xs text-gray-500 mt-1"
                  >
                    {{ note.content.substring(0, 100) }}{{ note.content.length > 100 ? '...' : '' }}
                  </p>
                </div>
              </td>
              <td>
                <span class="text-sm">{{ formatDate(note.createdAt) }}</span>
              </td>
              <td>
                <div v-if="note.createdBy" class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-6 h-6 rounded-full">
                      <template
                        v-if="
                          note.createdBy &&
                          'avatarUrl' in note.createdBy &&
                          note.createdBy.avatarUrl &&
                          typeof note.createdBy.avatarUrl === 'string'
                        "
                      >
                        <img
                          :src="note.createdBy.avatarUrl"
                          :alt="`${note.createdBy.firstName} ${note.createdBy.lastName}`"
                        />
                      </template>
                      <div
                        v-else
                        class="w-full h-full bg-primary text-primary-content flex items-center justify-center text-xs font-medium"
                      >
                        {{ getInitials(note.createdBy.firstName, note.createdBy.lastName) }}
                      </div>
                    </div>
                  </div>
                  <span class="text-sm"
                    >{{ note.createdBy.firstName }} {{ note.createdBy.lastName }}</span
                  >
                </div>
                <span v-else class="text-gray-400 text-sm">{{ t('common.unknown') }}</span>
              </td>
              <td v-if="showActions">
                <div class="flex space-x-1">
                  <button
                    class="btn btn-sm btn-ghost"
                    @click.stop="$emit('view', note)"
                    :title="t('common.view')"
                  >
                    <Iconify icon="mdi:eye" class="w-4 h-4" />
                  </button>
                  <button
                    class="btn btn-sm btn-ghost"
                    @click.stop="$emit('edit', note)"
                    :title="t('common.edit')"
                  >
                    <Iconify icon="mdi:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    class="btn btn-sm btn-ghost text-error"
                    @click.stop="$emit('delete', note)"
                    :title="t('common.delete')"
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
          v-for="note in notes"
          :key="note.id"
          class="card bg-base-100 shadow-sm border"
          :class="{ 'cursor-pointer hover:shadow-md transition-shadow': clickable }"
          @click="handleNoteClick(note)"
        >
          <div class="card-body p-4">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <p class="text-sm font-medium mb-2">{{ note.title || note.content }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Iconify icon="mdi:calendar" class="w-3 h-3" />
                  <span>{{ formatDate(note.createdAt) }}</span>
                </div>
                <div v-if="note.createdBy" class="flex items-center gap-2 text-xs text-gray-500">
                  <Iconify icon="mdi:account" class="w-3 h-3" />
                  <span>{{ note.createdBy.firstName }} {{ note.createdBy.lastName }}</span>
                </div>
              </div>
              <div v-if="showActions" class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-sm btn-ghost" @click.stop>
                  <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
                >
                  <li>
                    <a @click.stop="$emit('view', note)">{{ t('common.view') }}</a>
                  </li>
                  <li>
                    <a @click.stop="$emit('edit', note)">{{ t('common.edit') }}</a>
                  </li>
                  <li>
                    <a @click.stop="$emit('delete', note)" class="text-error">{{
                      t('common.delete')
                    }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <Iconify icon="mdi:note-text" class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{{ emptyMessage || t('notes.noNotes') }}</p>
      <button class="btn btn-sm btn-primary mt-2" @click="$emit('add')">
        {{ t('notes.add') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/activity.types'
import { formatDate } from '@/utils/date'
import { useI18n } from 'vue-i18n'

interface Props {
  notes: Activity[]
  title?: string
  loading?: boolean
  showActions?: boolean
  clickable?: boolean
  showPreview?: boolean
  emptyMessage?: string
}

interface Emits {
  (e: 'add'): void
  (e: 'view', note: Activity): void
  (e: 'edit', note: Activity): void
  (e: 'delete', note: Activity): void
  (e: 'note-click', note: Activity): void
}

withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  clickable: false,
  showPreview: true,
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

function handleNoteClick(note: Activity) {
  if (defineProps<Props>().clickable) {
    emit('note-click', note)
  }
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}
</script>
