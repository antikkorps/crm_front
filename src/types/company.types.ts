export interface Speciality {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  addressComplement?: string
  city?: string
  zipCode?: string
  country?: string
  codeRegional?: string
  clientGroup?: string
  clientNumber?: string
  status: {
    id: string
    name: string
    type: string
    color: string
  }
  size?: string
  globalRevenue?: number
  generatedRevenue?: number
  operatingRooms?: number | null
  createdAt: string
  updatedAt: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  Specialities?: Speciality[]
  specialityId?: string
}

export interface CompanyContact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  companyId: string
}

export interface CompanyNote {
  id: string
  content: string
  createdAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
  }
  companyId: string
}

export interface CompanyTask {
  id: string
  title: string
  content?: string
  dueDate?: string
  priority: string
  status: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
  }
  companyId: string
  createdAt: string
}

export interface CompanyQuote {
  id: string
  reference: string
  status: string
  totalAmount: number
  createdAt: string
  validUntil?: string
  companyId: string
}

export interface CompanyCreateDto {
  name: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  addressComplement?: string
  city?: string
  zipCode?: string
  country?: string
  codeRegional?: string
  clientGroup?: string
  clientNumber?: string
  statusId: string
  size?: string
  revenue?: number
  operatingRooms?: number | null
  specialities?: string[]
}

export interface CompanyUpdateDto {
  name?: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  addressComplement?: string
  city?: string
  zipCode?: string
  country?: string
  codeRegional?: string
  clientGroup?: string
  clientNumber?: string
  statusId?: string
  size?: string
  revenue?: number
  operatingRooms?: number | null
  specialities?: string[]
  assignedToId?: string
}

// Types pour l'API backend (avec specialitiesIds)
export interface CompanyCreateApiDto {
  name: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  addressComplement?: string
  city?: string
  zipCode?: string
  country?: string
  codeRegional?: string
  clientGroup?: string
  clientNumber?: string
  statusId: string
  size?: string
  revenue?: number
  operatingRooms?: number | null
  specialitiesIds?: string[]
}

export interface CompanyUpdateApiDto {
  name?: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  addressComplement?: string
  city?: string
  zipCode?: string
  country?: string
  codeRegional?: string
  clientGroup?: string
  clientNumber?: string
  statusId?: string
  size?: string
  revenue?: number
  operatingRooms?: number | null
  specialitiesIds?: string[]
  assignedToId?: string
}

export interface CompanyNoteCreateDto {
  content: string
  companyId: string
}

export interface ContactCreateDto {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  companyId: string
}

export interface ContactUpdateDto {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  position?: string
}

export interface Status {
  id: string
  name: string
  type: string
  color: string
  order: number
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination?: {
    totalItems?: number
    totalPages?: number
    currentPage?: number
    itemsPerPage?: number
    hasNextPage?: boolean
    hasPreviousPage?: boolean
  }
}

export type PaginatedStatusResponse = PaginatedResponse<Status>

export type CompanyStatus = Status

export interface CompanySearchParams {
  name?: string
  industry?: string
  statusId?: string
  size?: string
  revenue?: number
  page?: number
  itemsPerPage?: number
  specialityId?: string
  minOperatingRooms?: number
  maxOperatingRooms?: number
  minRevenue?: number
  maxRevenue?: number
  includeSpecialities?: boolean
  includeStatus?: boolean
  includeAssignedTo?: boolean
}
