/**
 * Tipos TypeScript para HidroElétrica Pro SRM
 * 
 * Define as interfaces para todas as entidades corporativas do sistema.
 * Garante tipagem forte e documentação automática.
 */

// ============================================================================
// VENDOR (Fornecedor)
// ============================================================================

export interface VendorContact {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface VendorCompliance {
  certifications: string[];        // URLs de certificados
  insurancePolicy: string;         // URL da apólice
  taxCompliance: boolean;          // Regularidade fiscal
  laborCompliance: boolean;        // Regularidade trabalhista
  lastAuditDate: Date;
}

export interface VendorBankAccount {
  bank: string;
  agency: string;
  account: string;
  accountType: 'checking' | 'savings';
}

export type VendorStatus = 'active' | 'pending' | 'rejected' | 'suspended';

export interface Vendor {
  id: string;
  legalName: string;               // Razão social
  tradeName: string;               // Nome fantasia
  cnpj: string;                    // CNPJ (único)
  status: VendorStatus;
  category: string;                // Categoria (ex: Equipamentos)
  contact: VendorContact;
  compliance: VendorCompliance;
  bankAccount: VendorBankAccount;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;               // userId do comprador
  idf?: number;                    // Índice de Desempenho do Fornecedor (0-10)
  complianceDocuments?: Array<{    // Documentos de compliance
    id: string;
    type: 'cnpj' | 'certidao' | 'certification';
    url: string;
    uploadedAt: string;
    expiresAt?: string;
    status: 'pending' | 'approved' | 'rejected';
  }>
  tags: string[];                  // Tags para busca
}

// ============================================================================
// RFQ (Requisição de Cotação)
// ============================================================================

export interface RFQEvaluationCriteria {
  price: number;                   // Peso (0-100)
  deliveryTime: number;            // Peso (0-100)
  quality: number;                 // Peso (0-100)
  compliance: number;              // Peso (0-100)
}

export type RFQStatus = 'open' | 'analyzing' | 'closed';

export interface RFQ {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;                    // kg, unidade, hora, etc.
  status: RFQStatus;
  createdBy: string;               // userId do comprador
  createdAt: Date;
  dueDate: Date;
  closedAt?: Date;
  invitedVendors: string[];        // Array de vendorIds
  evaluationCriteria: RFQEvaluationCriteria;
  attachments: string[];           // URLs de arquivos
  notes: string;
  tags: string[];
}

// ============================================================================
// PROPOSAL (Proposta Comercial)
// ============================================================================

export interface ProposalWarranty {
  months: number;
  description: string;
}

export interface ProposalScore {
  price: number;                   // Score (0-100)
  deliveryTime: number;            // Score (0-100)
  quality: number;                 // Score (0-100)
  compliance: number;              // Score (0-100)
  total: number;                   // Score ponderado
}

export type ProposalStatus = 'submitted' | 'accepted' | 'rejected' | 'withdrawn';

export interface Proposal {
  id: string;
  rfqId: string;
  vendorId: string;
  status: ProposalStatus;
  price: number;                   // Preço unitário
  totalPrice: number;              // Preço total
  currency: 'BRL' | 'USD' | 'EUR';
  deliveryDays: number;
  paymentTerms: string;            // Ex: '30 dias'
  warranty: ProposalWarranty;
  confidential: boolean;
  submittedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  attachments: string[];
  notes: string;
  score: ProposalScore;
}

// ============================================================================
// KPI (Key Performance Indicator)
// ============================================================================

export interface KPIQuality {
  score: number;                   // 0-100
  defectRate: number;              // %
  reworkRate: number;              // %
  notes: string;
}

export interface KPIPunctuality {
  score: number;                   // 0-100
  onTimeDeliveryRate: number;      // %
  avgDelayDays: number;
  notes: string;
}

export interface KPICompliance {
  score: number;                   // 0-100
  documentationCompliance: boolean;
  regulatoryCompliance: boolean;
  auditFindings: string[];
  notes: string;
}

export type KPITrend = 'improving' | 'stable' | 'declining';

export interface KPI {
  id: string;
  vendorId: string;
  period: string;                  // YYYY-MM
  quality: KPIQuality;
  punctuality: KPIPunctuality;
  compliance: KPICompliance;
  overallScore: number;            // 0-100
  trend: KPITrend;
  evaluatedBy: string;             // userId do auditor
  evaluatedAt: Date;
  recommendations: string;
  attachments: string[];
}

// ============================================================================
// INTERNAL USER (Usuário Interno)
// ============================================================================

export type UserRole = 'buyer' | 'vendor' | 'auditor' | 'admin';

export interface UserNotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface UserMetadata {
  language: 'pt-BR' | 'en-US';
  timezone: string;                // Ex: 'America/Sao_Paulo'
  theme: 'light' | 'dark';
}

export interface InternalUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department: string;              // Ex: 'Sourcing', 'Compliance'
  permissions: string[];           // Ex: ['create_rfq', 'approve_proposal']
  status: 'active' | 'inactive' | 'suspended';
  phone: string;
  avatar?: string;                 // URL da foto
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  biometricEnabled: boolean;
  notificationPreferences: UserNotificationPreferences;
  metadata: UserMetadata;
}

// ============================================================================
// NOTIFICATION (Notificação)
// ============================================================================

export type NotificationType = 
  | 'rfq_created' 
  | 'proposal_submitted' 
  | 'proposal_accepted' 
  | 'proposal_rejected' 
  | 'kpi_updated'
  | 'vendor_status_changed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string;               // ID da entidade relacionada
  read: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;              // Deep link
}

// ============================================================================
// AUDIT LOG (Log de Auditoria)
// ============================================================================

export type AuditAction = 'create' | 'update' | 'delete' | 'approve' | 'reject';
export type AuditEntity = 'vendor' | 'rfq' | 'proposal' | 'kpi' | 'user';

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// FILTER & SORT TYPES
// ============================================================================

export interface VendorFilter {
  status?: VendorStatus;
  category?: string;
  searchTerm?: string;
  tags?: string[];
}

export interface RFQFilter {
  status?: RFQStatus;
  category?: string;
  createdBy?: string;
  searchTerm?: string;
}

export interface ProposalFilter {
  rfqId?: string;
  vendorId?: string;
  status?: ProposalStatus;
  minPrice?: number;
  maxPrice?: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}
