<template>
  <div class="card bg-base-100 shadow-sm h-full">
    <div class="card-body">
      <h2 class="card-title">{{ title }}</h2>
      <div class="grid grid-cols-7 gap-1 text-center mb-2">
        <div class="text-sm font-medium" v-for="day in weekDays" :key="day">
          {{ day }}
        </div>
        <div
          v-for="n in daysInMonth"
          :key="n"
          class="aspect-square flex items-center justify-center text-sm rounded-md"
          :class="getDayClass(n)"
          @click="onDayClick(n)"
        >
          {{ n }}
        </div>
      </div>
      <div class="divider my-1"></div>
      <div class="space-y-2">
        <div
          v-for="(event, index) in events"
          :key="index"
          class="flex items-center gap-2"
          @click="onEventClick(index)"
        >
          <div class="w-2 h-2 rounded-full" :class="`bg-${event.color}`"></div>
          <span class="text-sm">{{ event.date }}</span>
          <span class="text-sm font-medium">{{ event.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

export interface CalendarEvent {
  date: string
  title: string
  color: string
}

const props = defineProps({
  title: {
    type: String,
    default: 'Événements à venir',
  },
  weekDays: {
    type: Array as () => string[],
    default: () => ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  },
  daysInMonth: {
    type: Number,
    default: 31,
  },
  currentDay: {
    type: Number,
    default: 9,
  },
  events: {
    type: Array as () => CalendarEvent[],
    required: true,
  },
  eventDays: {
    type: Array as () => number[],
    default: () => [3, 8, 12, 15, 21],
  },
})

const emit = defineEmits(['day-click', 'event-click'])

const getDayClass = (day: number) => {
  const hasEvent = props.eventDays.includes(day)
  const isToday = day === props.currentDay

  if (isToday) return 'bg-primary text-white font-bold'
  if (hasEvent) return 'bg-base-200 font-medium cursor-pointer hover:bg-primary hover:text-white'
  return 'hover:bg-base-200 cursor-pointer'
}

const onDayClick = (day: number) => emit('day-click', day)
const onEventClick = (index: number) => emit('event-click', index)
</script>
