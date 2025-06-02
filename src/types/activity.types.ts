import type { TaskCreateDto, TaskUpdateDto } from '../services/activity.service'
import { TaskPriority, TaskStatus } from '../services/activity.service'
import type { ApiActivity } from './dashboard.types'

export { TaskPriority, TaskStatus }
export type { ApiActivity, TaskCreateDto, TaskUpdateDto }

// Interface locale pour le front-end, légèrement adaptée de l'API
export interface Activity {
  id: string
  title: string
  content: string | null
  type: string
  dueDate?: string | null
  taskStatus?: string | null
  priority?: string | null
  createdAt: string
  updatedAt: string
  contactId?: string | null
  companyId?: string | null
  assignedToId?: string | null
  Company?: { name: string; id: string }
  Contact?: { firstName: string; lastName: string; id: string }
  assignedTo?: { firstName: string; lastName: string; id: string }
  createdBy: { firstName: string; lastName: string; id: string }
}

// Interface pour la création d'une activité générique (non-tâche)
export interface ActivityCreateDto {
  title: string
  content?: string
  type: string
  contactId?: string
  companyId?: string
}

// Interface pour la mise à jour d'une activité générique
export interface ActivityUpdateDto {
  title?: string
  content?: string
  contactId?: string
  companyId?: string
}
