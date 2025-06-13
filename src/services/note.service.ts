import type { Activity, ActivityFilters, CreateActivityDto } from '@/types/activity.types'
import { ActivityService } from './activity.service'

// Types pour compatibilité avec l'interface notes existante
export interface NoteCreateDto extends Omit<CreateActivityDto, 'type'> {
  title: string
  content: string
  companyId?: string
  contactId?: string
}

export interface NoteUpdateDto {
  title?: string
  content?: string
  companyId?: string
  contactId?: string
}

// Service des notes qui utilise ActivityService en arrière-plan
export const NoteService = {
  // Récupérer toutes les notes avec filtres optionnels
  async getAllNotes(companyId?: string, contactId?: string): Promise<Activity[]> {
    const filters: ActivityFilters = {
      type: ['NOTE'],
      ...(companyId && { companyId }),
      ...(contactId && { contactId }),
    }
    return ActivityService.getAllActivities(filters)
  },

  // Récupérer les notes d'une entreprise
  async getNotesByCompany(companyId: string): Promise<Activity[]> {
    return this.getAllNotes(companyId)
  },

  // Récupérer les notes d'un contact
  async getNotesByContact(contactId: string): Promise<Activity[]> {
    return this.getAllNotes(undefined, contactId)
  },

  // Récupérer une note par son ID
  async getNoteById(id: string): Promise<Activity> {
    return ActivityService.getActivityById(id)
  },

  // Créer une nouvelle note
  async createNote(data: NoteCreateDto): Promise<Activity> {
    const noteData: CreateActivityDto = {
      ...data,
      type: 'NOTE',
    }
    return ActivityService.createSpecializedActivity(noteData)
  },

  // Mettre à jour une note
  async updateNote(id: string, data: NoteUpdateDto): Promise<Activity> {
    return ActivityService.updateSpecializedActivity(id, { ...data, type: 'NOTE' })
  },

  // Supprimer une note
  async deleteNote(id: string): Promise<void> {
    return ActivityService.deleteActivity(id)
  },

  // Dupliquer une note
  async duplicateNote(id: string): Promise<Activity> {
    return ActivityService.duplicateActivity(id)
  },

  // Compter les notes
  async getNotesCount(companyId?: string): Promise<number> {
    const notes = await this.getAllNotes(companyId)
    return notes.length
  },

  // Rechercher dans les notes
  async searchNotes(query: string, companyId?: string): Promise<Activity[]> {
    const notes = await this.getAllNotes(companyId)
    return notes.filter(
      (note) =>
        note.title?.toLowerCase().includes(query.toLowerCase()) ||
        note.content?.toLowerCase().includes(query.toLowerCase()),
    )
  },
}
