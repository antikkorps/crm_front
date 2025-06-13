import type {
  Activity,
  ActivityCounts,
  ActivityFilters,
  ActivityFiltersPaginated,
  CallActivity,
  CreateActivityDto,
  EmailActivity,
  MeetingActivity,
  NoteActivity,
  UpdateActivityDto,
} from '../types/activity.types'
import type { ApiActivity } from '../types/dashboard.types'
import { apiRequest } from './api.service'

// Fonction utilitaire pour convertir ApiActivity vers Activity
function convertApiActivityToActivity(apiActivity: ApiActivity): Activity {
  return {
    ...apiActivity,
    // Conversion des champs string vers les types énumérés si nécessaire
    type: apiActivity.type as Activity['type'],
    priority: apiActivity.priority as Activity['priority'],
    taskStatus: apiActivity.taskStatus as Activity['taskStatus'],
    callOutcome: apiActivity.callOutcome as Activity['callOutcome'],
  }
}

// Interfaces existantes pour compatibilité
export interface ActivityCreateDto {
  title: string
  content?: string
  type: string
  contactId?: string
  companyId?: string
}

export interface ActivityUpdateDto {
  title?: string
  content?: string
  contactId?: string
  companyId?: string
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface TaskUpdateDto {
  title?: string
  content?: string
  dueDate?: string | null
  priority?: TaskPriority
  taskStatus?: TaskStatus
  assignedToId?: string | null
}

export interface TaskCreateDto extends TaskUpdateDto {
  title: string
  type: 'TASK'
  contactId?: string
  companyId?: string
}

export const ActivityService = {
  // ======================== MÉTHODES EXISTANTES (TÂCHES) ========================

  // Récupérer toutes les tâches
  async getAllTasks(): Promise<Activity[]> {
    const response = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/type/TASK')
    return response.items.map(convertApiActivityToActivity)
  },

  // Récupérer les tâches assignées à l'utilisateur courant
  async getMyTasks(): Promise<Activity[]> {
    const response = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/my-tasks')
    return response.items.map(convertApiActivityToActivity)
  },

  // Mettre à jour une tâche
  async updateTask(id: string, data: TaskUpdateDto): Promise<Activity> {
    const response = await apiRequest<ApiActivity>(`/v1/activities/${id}`, {
      method: 'PUT',
      body: data,
    })
    return convertApiActivityToActivity(response)
  },

  // Créer une nouvelle tâche
  async createTask(data: TaskCreateDto): Promise<Activity> {
    const response = await apiRequest<ApiActivity>('/v1/activities', {
      method: 'POST',
      body: data,
    })
    return convertApiActivityToActivity(response)
  },

  // Marquer une tâche comme terminée
  async completeTask(id: string): Promise<Activity> {
    return this.updateTask(id, { taskStatus: TaskStatus.COMPLETED })
  },

  // Rouvrir une tâche terminée
  async reopenTask(id: string): Promise<Activity> {
    return this.updateTask(id, { taskStatus: TaskStatus.IN_PROGRESS })
  },

  // Supprimer une tâche
  async deleteTask(id: string): Promise<void> {
    await apiRequest<void>(`/v1/activities/${id}`, {
      method: 'DELETE',
    })
  },

  // ======================== MÉTHODES GÉNÉRIQUES (TOUTES ACTIVITÉS) ========================

  // Récupérer toutes les activités (toutes catégories)
  async getAllActivities(filters?: ActivityFilters): Promise<Activity[]> {
    const params = new URLSearchParams()

    if (filters?.type?.length) {
      params.append('type', filters.type.join(','))
    }
    if (filters?.assignedToId) {
      params.append('assignedToId', filters.assignedToId)
    }
    if (filters?.contactId) {
      params.append('contactId', filters.contactId)
    }
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start)
      params.append('endDate', filters.dateRange.end)
    }

    const queryString = params.toString()

    // Utiliser l'endpoint spécifique si on filtre par companyId
    let url: string
    if (filters?.companyId) {
      url = queryString
        ? `/v1/activities/company/${filters.companyId}?${queryString}`
        : `/v1/activities/company/${filters.companyId}`
    } else {
      url = queryString ? `/v1/activities?${queryString}` : '/v1/activities'
    }

    const response = await apiRequest<{ items: ApiActivity[] }>(url)
    return response.items.map(convertApiActivityToActivity)
  },

  // Récupérer les activités avec pagination
  async getActivitiesPaginated(filters?: ActivityFiltersPaginated): Promise<{
    data: Activity[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const params = new URLSearchParams()

    // Paramètres de pagination
    if (filters?.page) {
      params.append('page', filters.page.toString())
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString())
    }

    // Autres filtres (pas companyId car il sera dans l'URL)
    if (filters?.type?.length) {
      params.append('type', filters.type.join(','))
    }
    if (filters?.assignedToId) {
      params.append('assignedToId', filters.assignedToId)
    }
    if (filters?.contactId) {
      params.append('contactId', filters.contactId)
    }
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start)
      params.append('endDate', filters.dateRange.end)
    }
    if (filters?.status?.length) {
      params.append('status', filters.status.join(','))
    }

    const queryString = params.toString()

    // Utiliser l'endpoint spécifique si on filtre par companyId
    let url: string
    if (filters?.companyId) {
      url = queryString
        ? `/v1/activities/company/${filters.companyId}?${queryString}`
        : `/v1/activities/company/${filters.companyId}`
    } else {
      url = queryString ? `/v1/activities?${queryString}` : '/v1/activities'
    }

    console.log('URL API appelée:', url)
    console.log('Paramètres:', Object.fromEntries(params.entries()))

    const response = await apiRequest<{
      items: ApiActivity[]
      pagination: {
        totalItems: number
        totalPages: number
        currentPage: number
        itemsPerPage: number
        hasNextPage: boolean
        hasPreviousPage: boolean
      }
    }>(url)

    return {
      data: response.items.map(convertApiActivityToActivity),
      total: response.pagination.totalItems,
      page: response.pagination.currentPage,
      limit: response.pagination.itemsPerPage,
      totalPages: response.pagination.totalPages,
    }
  },

  // Récupérer une activité par son ID
  async getActivityById(id: string): Promise<Activity> {
    const response = await apiRequest<ApiActivity>(`/v1/activities/${id}`)
    return convertApiActivityToActivity(response)
  },

  // Créer une nouvelle activité (générique)
  async createActivity(data: ActivityCreateDto): Promise<Activity> {
    const response = await apiRequest<ApiActivity>('/v1/activities', {
      method: 'POST',
      body: data,
    })
    return convertApiActivityToActivity(response)
  },

  // Créer une nouvelle activité spécialisée
  async createSpecializedActivity(data: CreateActivityDto): Promise<Activity> {
    const response = await apiRequest<ApiActivity>('/v1/activities', {
      method: 'POST',
      body: data,
    })
    return convertApiActivityToActivity(response)
  },

  // Mettre à jour une activité
  async updateActivity(id: string, data: ActivityUpdateDto): Promise<Activity> {
    const response = await apiRequest<ApiActivity>(`/v1/activities/${id}`, {
      method: 'PUT',
      body: data,
    })
    return convertApiActivityToActivity(response)
  },

  // Mettre à jour une activité spécialisée
  async updateSpecializedActivity(id: string, data: UpdateActivityDto): Promise<Activity> {
    const response = await apiRequest<ApiActivity>(`/v1/activities/${id}`, {
      method: 'PUT',
      body: data,
    })
    return convertApiActivityToActivity(response)
  },

  // Supprimer une activité
  async deleteActivity(id: string): Promise<void> {
    await apiRequest<void>(`/v1/activities/${id}`, {
      method: 'DELETE',
    })
  },

  // Récupérer les activités récentes
  async getRecentActivities(): Promise<Activity[]> {
    const response = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/recent')

    // Si le tableau est vide, on peut retourner une activité synthétique pour informer l'utilisateur
    if (response.items.length === 0) {
      console.log('Aucune activité récente trouvée dans les 7 derniers jours')
    }

    return response.items.map(convertApiActivityToActivity)
  },

  // ======================== MÉTHODES SPÉCIALISÉES PAR TYPE ========================

  // APPELS
  async createCall(
    data: Omit<CreateActivityDto, 'type'> & { type: 'CALL' },
  ): Promise<CallActivity> {
    return this.createSpecializedActivity(data) as Promise<CallActivity>
  },

  async updateCall(id: string, data: UpdateActivityDto): Promise<CallActivity> {
    return this.updateSpecializedActivity(id, { ...data, type: 'CALL' }) as Promise<CallActivity>
  },

  async getCalls(): Promise<CallActivity[]> {
    return this.getAllActivities({ type: ['CALL'] }) as Promise<CallActivity[]>
  },

  // RÉUNIONS
  async createMeeting(
    data: Omit<CreateActivityDto, 'type'> & { type: 'MEETING' },
  ): Promise<MeetingActivity> {
    return this.createSpecializedActivity(data) as Promise<MeetingActivity>
  },

  async updateMeeting(id: string, data: UpdateActivityDto): Promise<MeetingActivity> {
    return this.updateSpecializedActivity(id, {
      ...data,
      type: 'MEETING',
    }) as Promise<MeetingActivity>
  },

  async getMeetings(): Promise<MeetingActivity[]> {
    return this.getAllActivities({ type: ['MEETING'] }) as Promise<MeetingActivity[]>
  },

  // EMAILS
  async createEmail(
    data: Omit<CreateActivityDto, 'type'> & { type: 'EMAIL' },
  ): Promise<EmailActivity> {
    return this.createSpecializedActivity(data) as Promise<EmailActivity>
  },

  async updateEmail(id: string, data: UpdateActivityDto): Promise<EmailActivity> {
    return this.updateSpecializedActivity(id, { ...data, type: 'EMAIL' }) as Promise<EmailActivity>
  },

  async getEmails(): Promise<EmailActivity[]> {
    return this.getAllActivities({ type: ['EMAIL'] }) as Promise<EmailActivity[]>
  },

  // NOTES
  async createNote(
    data: Omit<CreateActivityDto, 'type'> & { type: 'NOTE' },
  ): Promise<NoteActivity> {
    return this.createSpecializedActivity(data) as Promise<NoteActivity>
  },

  async updateNote(id: string, data: UpdateActivityDto): Promise<NoteActivity> {
    return this.updateSpecializedActivity(id, { ...data, type: 'NOTE' }) as Promise<NoteActivity>
  },

  async getNotes(): Promise<NoteActivity[]> {
    return this.getAllActivities({ type: ['NOTE'] }) as Promise<NoteActivity[]>
  },

  // ======================== MÉTHODES UTILITAIRES ========================

  // Obtenir les compteurs d'activités
  async getActivityCounts(filters?: ActivityFilters): Promise<ActivityCounts> {
    const activities = await this.getAllActivities(filters)

    return {
      total: activities.length,
      calls: activities.filter((a) => a.type === 'CALL').length,
      meetings: activities.filter((a) => a.type === 'MEETING').length,
      tasks: activities.filter((a) => a.type === 'TASK').length,
      emails: activities.filter((a) => a.type === 'EMAIL').length,
      notes: activities.filter((a) => a.type === 'NOTE').length,
    }
  },

  // Dupliquer une activité
  async duplicateActivity(id: string): Promise<Activity> {
    const activity = await this.getActivityById(id)

    // Préparer les données pour la création
    const createData: CreateActivityDto = {
      title: `${activity.title} (Copie)`,
      content: activity.content || undefined,
      type: activity.type as CreateActivityDto['type'],
      companyId: activity.companyId || undefined,
      contactId: activity.contactId || undefined,
      assignedToId: activity.assignedToId || undefined,
      priority: activity.priority as CreateActivityDto['priority'],
      dueDate: activity.dueDate || undefined,
      // Propriétés spécialisées
      startTime: activity.startTime || undefined,
      endTime: activity.endTime || undefined,
      callDirection: activity.callDirection || undefined,
      duration: activity.duration || undefined,
      callOutcome: activity.callOutcome || undefined,
      location: activity.location || undefined,
      attendees: activity.attendees || undefined,
      meetingType: activity.meetingType || undefined,
      emailSubject: activity.emailSubject || undefined,
      emailStatus: activity.emailStatus || undefined,
    }

    return this.createSpecializedActivity(createData)
  },

  // Marquer une activité comme terminée (pour tous types)
  async completeActivity(id: string): Promise<Activity> {
    const activity = await this.getActivityById(id)

    if (activity.type === 'TASK') {
      return this.updateTask(id, { taskStatus: TaskStatus.COMPLETED })
    }

    // Pour les autres types, on peut marquer dans le contenu ou un champ spécifique
    return this.updateActivity(id, {
      content: activity.content
        ? `${activity.content}\n\n[Marqué comme terminé]`
        : '[Marqué comme terminé]',
    })
  },
}
