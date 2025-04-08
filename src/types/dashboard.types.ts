export interface Stats {
  contacts: number
  companies: number
  notes: number
  reminders: {
    upcoming: number
    overdue: number
  }
}

export interface ApiActivity {
  id: string
  type: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  Company?: { name: string }
  Contact?: { firstName: string; lastName: string }
  assignedTo?: { firstName: string; lastName: string }
  createdBy: { firstName: string; lastName: string }
  startTime?: string
  endTime?: string
  dueDate?: string
  taskStatus?: string
  callOutcome?: string
}