<template>
  <div class="card bg-base-100 shadow-sm h-full">
    <div class="card-body">
      <h2 class="card-title flex justify-between items-center">
        <span>{{ title }}</span>
        <button class="btn btn-sm btn-primary" @click="onAddTask">
          <Iconify icon="mdi:plus" class="w-4 h-4 mr-1" /> {{ addButtonLabel }}
        </button>
      </h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th class="w-12"></th>
              <th>Tâche</th>
              <th>Assigné à</th>
              <th>Échéance</th>
              <th class="w-12"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(task, index) in tasks"
              :key="index"
              :class="task.isOverdue ? 'text-error' : ''"
            >
              <td>
                <input
                  type="checkbox"
                  :checked="task.isCompleted"
                  class="checkbox checkbox-sm"
                  @change="toggleTaskStatus(index)"
                />
              </td>
              <td>{{ task.title }}</td>
              <td>{{ task.assignee }}</td>
              <td>{{ task.dueDate }}</td>
              <td>
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-xs">
                    <Iconify icon="mdi:dots-vertical" class="w-4 h-4" />
                  </label>
                  <ul
                    tabindex="0"
                    class="dropdown-content z-[1] menu menu-sm shadow bg-base-100 rounded-box w-32"
                  >
                    <li><a @click="onEditTask(index)">Modifier</a></li>
                    <li><a @click="onCompleteTask(index)">Terminer</a></li>
                    <li><a class="text-error" @click="onDeleteTask(index)">Supprimer</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

export interface Task {
  title: string
  assignee: string
  dueDate: string
  isCompleted: boolean
  isOverdue: boolean
}

defineProps({
  title: {
    type: String,
    default: 'Tâches prioritaires',
  },
  addButtonLabel: {
    type: String,
    default: 'Nouvelle tâche',
  },
  tasks: {
    type: Array as () => Task[],
    required: true,
  },
})

const emit = defineEmits(['add', 'edit', 'complete', 'delete', 'toggle-status'])

const onAddTask = () => emit('add')
const onEditTask = (index: number) => emit('edit', index)
const onCompleteTask = (index: number) => emit('complete', index)
const onDeleteTask = (index: number) => emit('delete', index)
const toggleTaskStatus = (index: number) => emit('toggle-status', index)
</script>
