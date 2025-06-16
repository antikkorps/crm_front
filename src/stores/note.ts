import type { NoteCreateDto, NoteUpdateDto } from '@/services/note.service'
import { NoteService } from '@/services/note.service'
import type { Activity } from '@/types/activity.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNoteStore = defineStore('note', () => {
  const notes = ref<Activity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Récupérer toutes les notes
  const fetchNotes = async (companyId?: string, contactId?: string) => {
    isLoading.value = true
    error.value = null
    try {
      const result = await NoteService.getAllNotes(companyId, contactId)
      notes.value = result
      return result
    } catch (e) {
      error.value = 'Failed to fetch notes'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // Récupérer les notes d'une entreprise
  const fetchNotesByCompany = async (companyId: string) => {
    return fetchNotes(companyId)
  }

  // Récupérer les notes d'un contact
  const fetchNotesByContact = async (contactId: string) => {
    return fetchNotes(undefined, contactId)
  }

  // Récupérer une note par son ID
  const getNote = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      return await NoteService.getNoteById(id)
    } catch (e) {
      error.value = `Failed to fetch note with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Créer une nouvelle note
  const createNote = async (data: NoteCreateDto) => {
    isLoading.value = true
    error.value = null
    try {
      const newNote = await NoteService.createNote(data)
      notes.value.unshift(newNote) // Ajouter en début de liste
      return newNote
    } catch (e) {
      error.value = 'Failed to create note'
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Mettre à jour une note
  const updateNote = async (id: string, data: NoteUpdateDto) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedNote = await NoteService.updateNote(id, data)
      const index = notes.value.findIndex((n) => n.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      return updatedNote
    } catch (e) {
      error.value = `Failed to update note with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Supprimer une note
  const deleteNote = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await NoteService.deleteNote(id)
      notes.value = notes.value.filter((n) => n.id !== id)
    } catch (e) {
      error.value = `Failed to delete note with id ${id}`
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // Dupliquer une note
  const duplicateNote = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const duplicatedNote = await NoteService.duplicateNote(id)
      notes.value.unshift(duplicatedNote)
      return duplicatedNote
    } catch (e) {
      error.value = `Failed to duplicate note with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Rechercher dans les notes
  const searchNotes = async (query: string, companyId?: string) => {
    isLoading.value = true
    error.value = null
    try {
      const results = await NoteService.searchNotes(query, companyId)
      return results
    } catch (e) {
      error.value = 'Failed to search notes'
      console.error(e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // Compter les notes
  const getNotesCount = async (companyId?: string) => {
    try {
      return await NoteService.getNotesCount(companyId)
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    fetchNotesByCompany,
    fetchNotesByContact,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    searchNotes,
    getNotesCount,
  }
})
