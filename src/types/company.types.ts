export interface Company {
  id: string
  name: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  zipCode?: string
  country?: string
  status: {
    id: string
    name: string
    type: string
    color: string
  }
  size?: string
  globalRevenue?: number
  generatedRevenue?: number
  createdAt: string
  updatedAt: string
  assignedTo?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string
  }
}

export interface CompanyContact {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  position?: string
  isMainContact: boolean
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
  address?: {
    street?: string
    city?: string
    zipCode?: string
    country?: string
  }
  statusId: string
  size?: string
  revenue?: number
}

export interface CompanyUpdateDto {
  name?: string
  description?: string
  industry?: string
  website?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    zipCode?: string
    country?: string
  }
  statusId?: string
  size?: string
  revenue?: number
}

export interface CompanyNoteCreateDto {
  content: string
  companyId: string
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
