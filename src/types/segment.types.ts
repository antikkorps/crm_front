// Types pour les opérateurs de règles
export type SegmentOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'

// Types pour les champs disponibles dans les règles
export type SegmentField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'position'
  | 'statusId'
  | 'companyId'
  | 'assignedToId'

// Interface pour une condition simple
export interface SegmentCondition {
  field: SegmentField
  operator: SegmentOperator
  value: string
}

// Interface pour une condition complexe (AND/OR)
export interface SegmentConditionGroup {
  operator: 'AND' | 'OR'
  conditions: (SegmentCondition | SegmentConditionGroup)[]
}

// Type union pour toutes les conditions possibles
export type SegmentRule = SegmentCondition | SegmentConditionGroup

// Interface pour un segment
export interface Segment {
  id: string
  name: string
  description?: string
  isDynamic: boolean
  rules?: SegmentRule[]
  contactCount: number
  lastEvaluatedAt?: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  }
}

// Interface pour un contact dans un segment
export interface SegmentContact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
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
  }
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  isManuallyAdded: boolean
  addedAt: string
  segmentId: string
}

// DTOs pour l'API
export interface SegmentCreateDto {
  name: string
  description?: string
  isDynamic: boolean
  rules?: SegmentRule[]
}

export interface SegmentUpdateDto {
  name?: string
  description?: string
  isDynamic?: boolean
  rules?: SegmentRule[]
}

// Interface pour la prévisualisation des règles
export interface SegmentPreview {
  contactCount: number
  sampleContacts: Array<{
    id: string
    firstName: string
    lastName: string
    email?: string
    company?: {
      name: string
    }
  }>
  isValid: boolean
  errors?: string[]
}

// Interface pour les paramètres de recherche de segments
export interface SegmentSearchParams {
  name?: string
  isDynamic?: boolean
  page?: number
  itemsPerPage?: number
  includeContactCount?: boolean
  includeCreatedBy?: boolean
}

// Interface pour les paramètres de recherche de contacts dans un segment
export interface SegmentContactsSearchParams {
  segmentId: string
  name?: string
  email?: string
  statusId?: string
  companyId?: string
  assignedToId?: string
  isManuallyAdded?: boolean
  page?: number
  itemsPerPage?: number
  includeCompany?: boolean
  includeStatus?: boolean
  includeAssignedTo?: boolean
}

// Import du type PaginatedResponse
import type { PaginatedResponse } from './company.types'

// Types pour les réponses paginées
export type PaginatedSegmentResponse = PaginatedResponse<Segment>
export type PaginatedSegmentContactResponse = PaginatedResponse<SegmentContact>

// Interface pour les statistiques de segments
export interface SegmentStats {
  // Vue d'ensemble
  overview: {
    totalSegments: number
    dynamicSegments: number
    manualSegments: number
    totalContactsInSegments: number
    recentlyEvaluatedSegments: number
  }

  // Segments populaires (Top 10 par nombre de contacts)
  topSegments: Array<{
    id: string
    name: string
    description: string | null
    isDynamic: boolean
    contactCount: number
  }>

  // Segments avec activité récente
  segmentsWithRecentActivity: Array<{
    segmentId: string
    segmentName: string
    activityCount: number
    lastActivityAt: string
  }>

  // Segments avec opportunités
  segmentsWithOpportunities: Array<{
    segmentId: string
    segmentName: string
    opportunityValue: number
    opportunityCount: number
  }>

  // Segments avec devis
  segmentsWithQuotes: Array<{
    segmentId: string
    segmentName: string
    quoteAmount: number
    quoteCount: number
  }>

  // Taux d'engagement par segment
  engagementRates: Array<{
    segmentId: string
    segmentName: string
    activeContacts: number
    totalContacts: number
    engagementRate: number
  }>

  // Évolution mensuelle de création de segments
  monthlySegmentGrowth: Array<{
    month: string
    count: string
  }>

  // Performance
  performance: {
    averageContactsPerSegment: number
    segmentsWithActivity: number
    segmentsWithOpportunities: number
    segmentsWithQuotes: number
  }
}

// Interface pour l'évaluation d'un segment
export interface SegmentEvaluationResult {
  segmentId: string
  contactCount: number
  evaluationTime: number
  errors?: string[]
  warnings?: string[]
}

// Interface pour les actions en lot sur les contacts
export interface SegmentBulkAction {
  segmentId: string
  contactIds: string[]
  action: 'add' | 'remove'
}

// Interface pour l'export de contacts d'un segment
export interface SegmentExportOptions {
  segmentId: string
  format: 'csv' | 'excel' | 'json'
  includeFields: string[]
  filters?: SegmentContactsSearchParams
}
