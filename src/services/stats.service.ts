import { apiRequest } from './api.service'

export interface DashboardStats {
  contacts: number
  companies: number
  tasks: number
  upcomingActivities: number
  overdueActivities: number
}

export interface DashboardSummary {
  totalContacts: number
  totalCompanies: number
  totalOpportunities: number
  totalActivities: number
  recentActivities: Array<{
    id: string
    type: string
    title: string
    date: string
    entityId: string
    entityType: string
    entityName: string
  }>
}

export interface ContactStatusDistribution {
  labels: string[]
  values: number[]
  colors: string[]
}

export interface CompanyStatusDistribution {
  labels: string[]
  values: number[]
  colors: string[]
}

export interface ActivityTrend {
  period: string
  count: number
}

export interface UserPerformance {
  userId: string
  userName: string
  completedActivities: number
  createdOpportunities: number
  wonOpportunities: number
  conversionRate: number
}

export interface ReminderStats {
  today: number
  thisWeek: number
  overdue: number
  completed: number
}

export const StatsService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    return await apiRequest<DashboardSummary>('/v1/analytics/dashboard-summary')
  },

  async getContactStatusDistribution(): Promise<ContactStatusDistribution> {
    return await apiRequest<ContactStatusDistribution>('/v1/analytics/contact-status')
  },

  async getCompanyStatusDistribution(): Promise<CompanyStatusDistribution> {
    return await apiRequest<CompanyStatusDistribution>('/v1/analytics/company-status')
  },

  async getActivityTrends(): Promise<ActivityTrend[]> {
    const response = await apiRequest<{ items: ActivityTrend[] }>('/v1/analytics/activity-trends')
    return response.items || []
  },

  async getUserPerformance(): Promise<UserPerformance[]> {
    const response = await apiRequest<{ items: UserPerformance[] }>(
      '/v1/analytics/user-performance',
    )
    return response.items || []
  },

  async getReminderStats(): Promise<ReminderStats> {
    return await apiRequest<ReminderStats>('/v1/analytics/reminder-stats')
  },
}
