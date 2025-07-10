import type { PaginatedResponse } from './company.types'

// Interface pour un contact
export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  mobile?: string
  position?: string
  status: {
    id: string
    name: string
    type: string
    color: string
  }
  company?: {
    id: string
    name: string
    industry?: string
    city?: string
    country?: string
    size?: string
    globalRevenue?: number
  }
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  isMainContact: boolean
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
  }
}

// DTOs pour l'API
export interface ContactCreateDto {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  mobile?: string
  position?: string
  statusId: string
  companyId?: string
  assignedToId?: string
  isMainContact?: boolean
}

export interface ContactUpdateDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  mobile?: string
  position?: string
  statusId?: string
  companyId?: string
  assignedToId?: string
  isMainContact?: boolean
}

// Interface pour les paramètres de recherche de contacts
export interface ContactSearchParams {
  name?: string
  email?: string
  phone?: string
  statusId?: string
  companyId?: string
  assignedToId?: string
  isMainContact?: boolean
  industry?: string
  city?: string
  country?: string
  size?: string
  minRevenue?: number
  maxRevenue?: number
  page?: number
  itemsPerPage?: number
  includeCompany?: boolean
  includeStatus?: boolean
  includeAssignedTo?: boolean
  includeSegments?: boolean
}

// Types pour les réponses paginées
export type PaginatedContactResponse = PaginatedResponse<Contact>

// Interface pour les statistiques de contacts
export interface ContactStats {
  // Vue d'ensemble
  overview: {
    totalContacts: number
    contactsWithEmail: number
    assignedContacts: number
    newContactsThisMonth: number
    newContactsThisWeek: number
    conversionRate: number
    engagementRate: number
  }

  // Répartition par statut
  byStatus: Array<{
    statusId: string
    count: string
    'Status.name': string
    'Status.color': string
  }>

  // Top utilisateurs par nombre de contacts assignés
  topAssignedUsers: Array<{
    assignedToId: string
    contactCount: string
    'assignedTo.firstName': string
    'assignedTo.lastName': string
    'assignedTo.email': string
    'assignedTo.avatarUrl'?: string
  }>

  // Évolution mensuelle
  monthlyGrowth: Array<{
    month: string
    newContacts: number
    totalContacts: number
  }>

  // Contacts par entreprise (Top 10)
  contactsByCompany: Array<{
    companyId: string
    contactCount: string
    'company.name': string
    industry?: string
  }>

  // Engagement
  engagement: {
    withRecentActivity: number
    withOpportunities: number
    withQuotes: number
    withWonOpportunities: number
  }
}

// Interface pour l'export de contacts
export interface ContactExportOptions {
  format: 'csv' | 'excel' | 'json'
  includeFields: string[]
  filters?: ContactSearchParams
}

// Interface pour les actions en lot sur les contacts
export interface ContactBulkAction {
  contactIds: string[]
  action: 'updateStatus' | 'assignTo' | 'addToSegment' | 'removeFromSegment' | 'delete'
  data?: {
    statusId?: string
    assignedToId?: string
    segmentId?: string
  }
}

// Interface pour la fusion de contacts
export interface ContactMergeData {
  primaryContactId: string
  secondaryContactIds: string[]
  mergeFields: {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    phone?: boolean
    mobile?: boolean
    position?: boolean
    statusId?: boolean
    companyId?: boolean
    assignedToId?: boolean
    isMainContact?: boolean
  }
}

// Interface pour les segments d'un contact
export interface ContactSegment {
  id: string
  name: string
  isDynamic: boolean
  isManuallyAdded: boolean
  addedAt: string
}
