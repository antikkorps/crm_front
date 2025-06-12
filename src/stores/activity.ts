import { ActivityService, TaskPriority, TaskStatus } from '@/services/activity.service'
import type {
  Activity,
  ActivityCreateDto,
  ActivityUpdateDto,
  TaskCreateDto,
  TaskUpdateDto,
} from '@/types/activity.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Get all activities
  const fetchActivities = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await ActivityService.getAllActivities()
      activities.value = result as Activity[]
      return result
    } catch (e) {
      error.value = 'Failed to fetch activities'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // Get a specific activity
  const getActivity = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      return await ActivityService.getActivityById(id)
    } catch (e) {
      error.value = `Failed to fetch activity with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Create new activity
  const createActivity = async (activity: ActivityCreateDto) => {
    isLoading.value = true
    error.value = null
    try {
      const newActivity = await ActivityService.createActivity(activity)
      activities.value.push(newActivity as Activity)
      return newActivity
    } catch (e) {
      error.value = 'Failed to create activity'
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Update activity
  const updateActivity = async (id: string, activity: ActivityUpdateDto) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedActivity = await ActivityService.updateActivity(id, activity)
      const index = activities.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        activities.value[index] = updatedActivity as Activity
      }
      return updatedActivity
    } catch (e) {
      error.value = `Failed to update activity with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Delete activity
  const deleteActivity = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await ActivityService.deleteActivity(id)
      activities.value = activities.value.filter((a) => a.id !== id)
    } catch (e) {
      error.value = `Failed to delete activity with id ${id}`
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // Tâches
  const fetchTasks = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await ActivityService.getAllTasks()
      activities.value = result as Activity[]
      return result
    } catch (e) {
      error.value = 'Failed to fetch tasks'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMyTasks = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await ActivityService.getMyTasks()
      activities.value = result as Activity[]
      return result
    } catch (e) {
      error.value = 'Failed to fetch my tasks'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const createTask = async (data: TaskCreateDto) => {
    isLoading.value = true
    error.value = null
    try {
      const newTask = await ActivityService.createTask(data)
      activities.value.push(newTask as Activity)
      return newTask
    } catch (e) {
      error.value = 'Failed to create task'
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTask = async (id: string, data: TaskUpdateDto) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedTask = await ActivityService.updateTask(id, data)
      const index = activities.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        activities.value[index] = updatedTask as Activity
      }
      return updatedTask
    } catch (e) {
      error.value = `Failed to update task with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      await ActivityService.deleteTask(id)
      activities.value = activities.value.filter((a) => a.id !== id)
    } catch (e) {
      error.value = `Failed to delete task with id ${id}`
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const completeTask = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const completedTask = await ActivityService.completeTask(id)
      const index = activities.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        activities.value[index] = completedTask as Activity
      }
      return completedTask
    } catch (e) {
      error.value = `Failed to complete task with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const reopenTask = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      const reopenedTask = await ActivityService.reopenTask(id)
      const index = activities.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        activities.value[index] = reopenedTask as Activity
      }
      return reopenedTask
    } catch (e) {
      error.value = `Failed to reopen task with id ${id}`
      console.error(e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Activités récentes
  const fetchRecentActivities = async () => {
    isLoading.value = true
    error.value = null
    try {
      const result = await ActivityService.getRecentActivities()
      activities.value = result as Activity[]
      return result
    } catch (e) {
      error.value = 'Failed to fetch recent activities'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    activities,
    isLoading,
    error,
    fetchActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    fetchTasks,
    fetchMyTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    reopenTask,
    fetchRecentActivities,
    TaskStatus,
    TaskPriority,
  }
})
