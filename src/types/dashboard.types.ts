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
  content: string | null
  createdAt: string
  updatedAt: string
  Company?: { name: string; id: string }
  Contact?: { firstName: string; lastName: string; id: string }
  assignedTo?: { firstName: string; lastName: string; id: string }
  createdBy: { firstName: string; lastName: string; id: string }
  startTime?: string | null
  endTime?: string | null
  dueDate?: string | null
  taskStatus?: string | null
  callOutcome?: string | null
  priority?: string | null
  location?: string | null
  attendees?: string | null
  assignedToId?: string | null
  contactId?: string | null
  companyId?: string | null
}