import type { ApiActivity } from '../types/dashboard.types'
import { apiRequest } from './api.service'

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
  // Récupérer toutes les tâches
  async getAllTasks(): Promise<ApiActivity[]> {
    const response = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/type/TASK')
    return response.items
  },

  // Récupérer les tâches assignées à l'utilisateur courant
  async getMyTasks(): Promise<ApiActivity[]> {
    const response = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/my-tasks')
    return response.items
  },

  // Mettre à jour une tâche
  async updateTask(id: string, data: TaskUpdateDto): Promise<ApiActivity> {
    return apiRequest<ApiActivity>(`/v1/activities/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  // Créer une nouvelle tâche
  async createTask(data: TaskCreateDto): Promise<ApiActivity> {
    return apiRequest<ApiActivity>('/v1/activities', {
      method: 'POST',
      body: data,
    })
  },

  // Supprimer une tâche
  async deleteTask(id: string): Promise<void> {
    await apiRequest<void>(`/v1/activities/${id}`, {
      method: 'DELETE',
    })
  },

  // Marquer une tâche comme terminée
  async completeTask(id: string): Promise<ApiActivity> {
    return this.updateTask(id, { taskStatus: TaskStatus.COMPLETED })
  },

  // Récupérer les activités récentes
  async getRecentActivities(): Promise<ApiActivity[]> {
    const response = await apiRequest<{ items: ApiActivity[] }>('/v1/activities/recent')

    // Si le tableau est vide, on peut retourner une activité synthétique pour informer l'utilisateur
    if (response.items.length === 0) {
      console.log('Aucune activité récente trouvée dans les 7 derniers jours')
    }

    return response.items
  },
}
