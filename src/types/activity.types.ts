import type { TaskCreateDto, TaskUpdateDto } from '../services/activity.service'
import { TaskPriority, TaskStatus } from '../services/activity.service'
import type { ApiActivity } from './dashboard.types'

// Export des types existants pour compatibilité
export { TaskPriority, TaskStatus }
export type { ApiActivity, TaskCreateDto, TaskUpdateDto }

// Types de base pour les activités
export type ActivityType = 'CALL' | 'MEETING' | 'TASK' | 'EMAIL' | 'NOTE'
export type CallDirection = 'INBOUND' | 'OUTBOUND'
export type CallOutcome = 'ANSWERED' | 'NO_ANSWER' | 'BUSY' | 'VOICEMAIL' | 'CALLBACK_REQUESTED'
export type MeetingType = 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE_CONFERENCE'
export type EmailStatus = 'DRAFT' | 'SENT' | 'OPENED' | 'CLICKED' | 'BOUNCED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

// Interface existante mise à jour
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

  // Nouveaux champs pour les activités spécialisées
  startTime?: string | null
  endTime?: string | null
  callDirection?: CallDirection | null
  duration?: number | null
  callOutcome?: CallOutcome | null
  callContact?: string | null
  callPhoneNumber?: string | null
  location?: string | null
  attendees?: string | null
  meetingType?: MeetingType | null
  emailSubject?: string | null
  emailStatus?: EmailStatus | null
  emailDirection?: CallDirection | null

  // Champs spécifiques aux tâches
  taskEstimatedDuration?: number | null
  progress?: number | null // 0-100 (pourcentage de progression)

  // Champs spécifiques aux emails
  emailAttachments?: number | null

  // Champs spécifiques aux notes
  noteCategory?: string | null
  noteVisibility?: 'PRIVATE' | 'SHARED' | null
}

// Interfaces spécialisées pour chaque type d'activité
export interface CallActivity extends Activity {
  type: 'CALL'
  callDirection?: CallDirection
  duration?: number
  callOutcome?: CallOutcome
}

export interface MeetingActivity extends Activity {
  type: 'MEETING'
  location?: string
  attendees?: string
  meetingType?: MeetingType
}

export interface TaskActivity extends Activity {
  type: 'TASK'
  priority?: Priority
  taskStatus?: string
  progress?: number // 0-100 (pourcentage de progression)
}

export interface EmailActivity extends Activity {
  type: 'EMAIL'
  emailSubject?: string
  emailStatus?: EmailStatus
  emailDirection?: CallDirection
}

export interface NoteActivity extends Activity {
  type: 'NOTE'
}

// Interface pour la création d'une activité générique (existante)
export interface ActivityCreateDto {
  title: string
  content?: string
  type: string
  contactId?: string
  companyId?: string
}

// Interface pour la mise à jour d'une activité générique (existante)
export interface ActivityUpdateDto {
  title?: string
  content?: string
  contactId?: string
  companyId?: string
}

// Nouvelles interfaces pour la création d'activités spécialisées
export interface CreateActivityDto {
  type: ActivityType
  title: string
  content?: string
  startTime?: string
  endTime?: string
  dueDate?: string
  contactId?: string
  companyId?: string
  assignedToId?: string

  // Champs spécifiques CALL
  callDirection?: CallDirection
  duration?: number
  callOutcome?: CallOutcome
  callContact?: string
  callPhoneNumber?: string

  // Champs spécifiques MEETING
  location?: string
  attendees?: string
  meetingType?: MeetingType

  // Champs spécifiques TASK
  priority?: Priority
  taskStatus?: string
  progress?: number // 0-100 (pourcentage de progression)

  // Champs spécifiques EMAIL
  emailSubject?: string
  emailStatus?: EmailStatus
  emailDirection?: CallDirection
}

export interface UpdateActivityDto extends Partial<CreateActivityDto> {
  id?: string
}

// Types pour les filtres
export interface ActivityFilters {
  type?: ActivityType[]
  dateRange?: {
    start: string
    end: string
  }
  status?: string[]
  assignedToId?: string
  companyId?: string
  contactId?: string
  priority?: string
  taskStatus?: string
  callOutcome?: string
  emailStatus?: string
  createdBy?: string
  progressMin?: number // Progression minimum (0-100)
  progressMax?: number // Progression maximum (0-100)
}

// Interface pour les filtres avec pagination
export interface ActivityFiltersPaginated extends ActivityFilters {
  page?: number
  limit?: number
}

// Interface pour les filtres d'interface utilisateur (plus simple)
export interface ActivityUIFilters {
  type: string
  assignedToId: string
  startDate: string
  endDate: string
  priority: string
  callOutcome: string
  emailStatus: string
  period: string
  progressMin: string // Progression minimum des tâches (ex: "0" pour 0%)
  progressMax: string // Progression maximum des tâches (ex: "100" pour 100%)
}

// Types pour les compteurs
export interface ActivityCounts {
  total: number
  calls: number
  meetings: number
  tasks: number
  emails: number
  notes: number
}
