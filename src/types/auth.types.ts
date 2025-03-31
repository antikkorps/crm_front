export interface LoginRequest {
  email: string;
  password: string;
  tenantDomain?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  roleId?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  role?: {
    id: string;
    name: string;
    permissions: any;
  };
  tenant?: {
    id: string;
    name: string;
    domain: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}
