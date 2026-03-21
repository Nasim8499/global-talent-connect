export type UserRole = 'super_admin' | 'owner' | 'partner' | 'staff' | 'viewer';
export type WorkerStatus = 'registered' | 'documents_pending' | 'visa_processing' | 'approved' | 'deployed' | 'completed';
export type ProjectStatus = 'planning' | 'recruiting' | 'processing' | 'deployed' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type AgreementStatus = 'draft' | 'pending_signature' | 'active' | 'expired';

export interface Worker {
  id: string;
  internalId: string;
  firstName: string;
  lastName: string;
  passport: string;
  nationality: string;
  status: WorkerStatus;
  jobTitle: string;
  destinationCountry: string;
  projectId?: string;
  phone?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  batchCode: string;
  name: string;
  employer: string;
  country: string;
  workerCount: number;
  targetWorkers: number;
  status: ProjectStatus;
  startDate: string;
  revenue: number;
  expenses: number;
}

export interface Payment {
  id: string;
  workerId?: string;
  type: 'worker_fee' | 'visa_fee' | 'service_charge' | 'expense' | 'revenue';
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: string;
  description: string;
}

export interface Agreement {
  id: string;
  type: 'partnership' | 'worker' | 'employer' | 'service';
  title: string;
  parties: string[];
  status: AgreementStatus;
  createdAt: string;
  referenceNo: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
}
