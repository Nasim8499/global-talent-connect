import type { Worker, Project, Payment, Agreement, Notification, ActivityLog } from '@/types';

export const owner = {
  name: 'Shariyar Nasim',
  passport: 'B00288020',
  nationality: 'Bangladeshi',
  internalId: 'OWNER-2026-0001_SHARIYAR_NASIM',
  role: 'owner' as const,
  company: 'VisaHOBe PTE. LTD.',
};

export const partner = {
  name: 'MD Hasan Raja',
  passport: 'B00591924',
  nationality: 'Bangladeshi',
  internalId: 'PARTNER-2026-0001_HASAN_RAJA',
  role: 'partner' as const,
};

export const demoWorkers: Worker[] = [
  { id: 'w1', internalId: 'WKR-2026-0001', firstName: 'Mohammad', lastName: 'Rahman', passport: 'B00312456', nationality: 'Bangladeshi', status: 'deployed', jobTitle: 'Construction Worker', destinationCountry: 'Singapore', projectId: 'p1', phone: '+880 1711 234567', createdAt: '2026-01-15' },
  { id: 'w2', internalId: 'WKR-2026-0002', firstName: 'Abdul', lastName: 'Karim', passport: 'B00498732', nationality: 'Bangladeshi', status: 'visa_processing', jobTitle: 'Electrician', destinationCountry: 'Singapore', projectId: 'p1', phone: '+880 1812 345678', createdAt: '2026-01-20' },
  { id: 'w3', internalId: 'WKR-2026-0003', firstName: 'Rafiqul', lastName: 'Islam', passport: 'B00567123', nationality: 'Bangladeshi', status: 'approved', jobTitle: 'Welder', destinationCountry: 'Singapore', projectId: 'p1', createdAt: '2026-02-01' },
  { id: 'w4', internalId: 'WKR-2026-0004', firstName: 'Jahangir', lastName: 'Alam', passport: 'B00623891', nationality: 'Bangladeshi', status: 'documents_pending', jobTitle: 'Plumber', destinationCountry: 'Malaysia', projectId: 'p2', createdAt: '2026-02-10' },
  { id: 'w5', internalId: 'WKR-2026-0005', firstName: 'Sohel', lastName: 'Mia', passport: 'B00789234', nationality: 'Bangladeshi', status: 'registered', jobTitle: 'General Worker', destinationCountry: 'Qatar', createdAt: '2026-02-15' },
  { id: 'w6', internalId: 'WKR-2026-0006', firstName: 'Kamrul', lastName: 'Hasan', passport: 'B00834567', nationality: 'Bangladeshi', status: 'deployed', jobTitle: 'Scaffolder', destinationCountry: 'Singapore', projectId: 'p1', createdAt: '2026-01-18' },
  { id: 'w7', internalId: 'WKR-2026-0007', firstName: 'Mizanur', lastName: 'Hoque', passport: 'B00912345', nationality: 'Bangladeshi', status: 'completed', jobTitle: 'Painter', destinationCountry: 'Singapore', createdAt: '2025-11-05' },
  { id: 'w8', internalId: 'WKR-2026-0008', firstName: 'Tanvir', lastName: 'Ahmed', passport: 'B00956789', nationality: 'Bangladeshi', status: 'visa_processing', jobTitle: 'Mason', destinationCountry: 'Malaysia', projectId: 'p2', createdAt: '2026-02-20' },
];

export const demoProjects: Project[] = [
  { id: 'p1', batchCode: 'SG_BATCH_01_2026', name: 'Singapore Marina Bay Phase 3', employer: 'Hyundai E&C Singapore', country: 'Singapore', workerCount: 4, targetWorkers: 10, status: 'processing', startDate: '2026-01-10', revenue: 48000, expenses: 22000 },
  { id: 'p2', batchCode: 'MY_BATCH_01_2026', name: 'KL Metro Extension Line 3', employer: 'Gamuda Berhad', country: 'Malaysia', workerCount: 2, targetWorkers: 8, status: 'recruiting', startDate: '2026-02-01', revenue: 12000, expenses: 5000 },
  { id: 'p3', batchCode: 'QA_BATCH_01_2026', name: 'Doha Commercial Complex', employer: 'Al Jaber Group', country: 'Qatar', workerCount: 0, targetWorkers: 15, status: 'planning', startDate: '2026-03-15', revenue: 0, expenses: 0 },
];

export const demoPayments: Payment[] = [
  { id: 'pay1', workerId: 'w1', type: 'worker_fee', amount: 3500, currency: 'SGD', status: 'paid', date: '2026-01-20', description: 'Processing fee — Mohammad Rahman' },
  { id: 'pay2', workerId: 'w2', type: 'visa_fee', amount: 800, currency: 'SGD', status: 'pending', date: '2026-02-05', description: 'Visa application — Abdul Karim' },
  { id: 'pay3', type: 'service_charge', amount: 12000, currency: 'SGD', status: 'paid', date: '2026-01-25', description: 'Employer service charge — Hyundai E&C' },
  { id: 'pay4', workerId: 'w4', type: 'worker_fee', amount: 2800, currency: 'MYR', status: 'overdue', date: '2026-02-15', description: 'Processing fee — Jahangir Alam' },
  { id: 'pay5', type: 'expense', amount: 1500, currency: 'SGD', status: 'paid', date: '2026-02-01', description: 'Office rent — February' },
  { id: 'pay6', type: 'revenue', amount: 24000, currency: 'SGD', status: 'paid', date: '2026-01-30', description: 'Batch SG_BATCH_01 first tranche' },
  { id: 'pay7', workerId: 'w6', type: 'worker_fee', amount: 3500, currency: 'SGD', status: 'paid', date: '2026-01-22', description: 'Processing fee — Kamrul Hasan' },
  { id: 'pay8', type: 'expense', amount: 2200, currency: 'SGD', status: 'paid', date: '2026-02-10', description: 'Medical screening batch' },
];

export const demoAgreements: Agreement[] = [
  { id: 'a1', type: 'partnership', title: 'Partnership Agreement — Nasim & Raja', parties: ['Shariyar Nasim', 'MD Hasan Raja'], status: 'active', createdAt: '2025-12-01', referenceNo: 'AGR-PARTNER-2025-001' },
  { id: 'a2', type: 'worker', title: 'Worker Deployment — Mohammad Rahman', parties: ['VisaHOBe PTE. LTD.', 'Mohammad Rahman'], status: 'active', createdAt: '2026-01-15', referenceNo: 'AGR-WKR-2026-001' },
  { id: 'a3', type: 'employer', title: 'Employer Contract — Hyundai E&C', parties: ['VisaHOBe PTE. LTD.', 'Hyundai E&C Singapore'], status: 'active', createdAt: '2026-01-08', referenceNo: 'AGR-EMP-2026-001' },
  { id: 'a4', type: 'service', title: 'Service Agreement — Gamuda Berhad', parties: ['VisaHOBe PTE. LTD.', 'Gamuda Berhad'], status: 'pending_signature', createdAt: '2026-02-05', referenceNo: 'AGR-SVC-2026-001' },
  { id: 'a5', type: 'worker', title: 'Worker Deployment — Kamrul Hasan', parties: ['VisaHOBe PTE. LTD.', 'Kamrul Hasan'], status: 'active', createdAt: '2026-01-18', referenceNo: 'AGR-WKR-2026-002' },
];

export const demoNotifications: Notification[] = [
  { id: 'n1', title: 'Visa Approved', message: "Rafiqul Islam's visa for Singapore has been approved.", type: 'success', read: false, createdAt: '2026-03-20T10:30:00' },
  { id: 'n2', title: 'Payment Overdue', message: 'Processing fee for Jahangir Alam is 5 days overdue.', type: 'urgent', read: false, createdAt: '2026-03-20T09:00:00' },
  { id: 'n3', title: 'New Worker Registered', message: 'Sohel Mia has been registered for Qatar deployment.', type: 'info', read: true, createdAt: '2026-03-19T14:00:00' },
  { id: 'n4', title: 'Document Missing', message: 'Abdul Karim is missing medical certificate.', type: 'warning', read: false, createdAt: '2026-03-18T16:00:00' },
  { id: 'n5', title: 'Batch Report Ready', message: 'SG_BATCH_01_2026 monthly report is available.', type: 'info', read: true, createdAt: '2026-03-17T11:00:00' },
];

export const demoActivityLogs: ActivityLog[] = [
  { id: 'l1', action: 'Worker Deployed', user: 'Shariyar Nasim', details: 'Mohammad Rahman deployed to Singapore', timestamp: '2026-03-20T11:00:00' },
  { id: 'l2', action: 'Payment Received', user: 'System', details: 'SGD 24,000 from Hyundai E&C', timestamp: '2026-03-19T15:30:00' },
  { id: 'l3', action: 'Agreement Signed', user: 'MD Hasan Raja', details: 'Partnership agreement renewed', timestamp: '2026-03-18T10:00:00' },
  { id: 'l4', action: 'Visa Submitted', user: 'Staff', details: 'Abdul Karim visa sent to MOM', timestamp: '2026-03-17T09:00:00' },
  { id: 'l5', action: 'Worker Registered', user: 'Shariyar Nasim', details: 'Tanvir Ahmed added to system', timestamp: '2026-03-16T14:00:00' },
  { id: 'l6', action: 'Expense Logged', user: 'System', details: 'Medical screening SGD 2,200', timestamp: '2026-03-15T16:00:00' },
];

export const statusLabels: Record<string, string> = {
  registered: 'Registered',
  documents_pending: 'Docs Pending',
  visa_processing: 'Visa Processing',
  approved: 'Approved',
  deployed: 'Deployed',
  completed: 'Completed',
  planning: 'Planning',
  recruiting: 'Recruiting',
  processing: 'Processing',
  draft: 'Draft',
  pending_signature: 'Pending Sign',
  active: 'Active',
  expired: 'Expired',
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
};

export const countryFlags: Record<string, string> = {
  Singapore: '🇸🇬',
  Malaysia: '🇲🇾',
  Qatar: '🇶🇦',
  Bangladesh: '🇧🇩',
  'Saudi Arabia': '🇸🇦',
  UAE: '🇦🇪',
};
