import { apiRequest } from './api.service'

export interface DashboardStats {
  contacts: number
  companies: number
  tasks: number
  upcomingActivities: number
  overdueActivities: number
}

export const StatsService = {
  async getStats(): Promise<DashboardStats> {
    return await apiRequest<DashboardStats>('/v1/stats/dashboard')
  },
}
