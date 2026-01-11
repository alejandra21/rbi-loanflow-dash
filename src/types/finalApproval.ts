export type FinalDecision = 'approved' | 'approved_with_conditions' | 'suspended' | 'declined';
export type RiskCategory = 'credit' | 'collateral' | 'legal_title' | 'insurance' | 'fraud_aml' | 'operational';
export type ApprovalAuthority = 'automated' | 'underwriter' | 'senior_underwriter' | 'credit_committee' | 'executive';
export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface PhaseOutcome {
  phaseName: string;
  phaseNumber: number;
  status: 'pass' | 'fail' | 'manual_review' | 'pending';
  riskCategory: RiskCategory;
  completedAt?: string;
  issues: string[];
  isHardStop: boolean;
}

export interface Exception {
  id: string;
  phaseName: string;
  phaseNumber: number;
  description: string;
  severity: ExceptionSeverity;
  riskCategory: RiskCategory;
  compensatingFactors?: string[];
  status: 'pending' | 'approved' | 'denied' | 'waived';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface ApprovalCondition {
  id: string;
  description: string;
  category: 'prior_to_docs' | 'prior_to_funding' | 'prior_to_closing' | 'ongoing';
  status: 'pending' | 'satisfied' | 'waived';
  dueDate?: string;
  satisfiedAt?: string;
  satisfiedBy?: string;
}

export interface RiskSummary {
  category: RiskCategory;
  categoryLabel: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  reviewChecks: number;
  hardStops: number;
  status: 'pass' | 'fail' | 'review';
}

export interface ApprovalAuthorityRouting {
  requiredAuthority: ApprovalAuthority;
  authorityLabel: string;
  reason: string;
  delegationChain: {
    level: ApprovalAuthority;
    name: string;
    approved: boolean;
    approvedAt?: string;
  }[];
}

export interface ApprovalMemo {
  generatedAt: string;
  generatedBy: string;
  loanId: string;
  borrowerName: string;
  loanAmount: number;
  loanType: string;
  decision: FinalDecision;
  decisionRationale: string;
  riskSummary: string;
  exceptionsApproved: number;
  conditionsCount: number;
  approvalChain: {
    role: string;
    name: string;
    decision: string;
    timestamp: string;
  }[];
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  fieldLocked?: string;
  previousValue?: string;
  newValue?: string;
}

export interface FinalApprovalData {
  // Phase outcomes from all phases (1-10)
  phaseOutcomes: PhaseOutcome[];
  
  // Risk consolidation
  riskSummary: RiskSummary[];
  totalHardStops: number;
  hasUnresolvedHardStops: boolean;
  
  // Exception management
  exceptions: Exception[];
  totalExceptions: number;
  approvedExceptions: number;
  pendingExceptions: number;
  deniedExceptions: number;
  
  // Approval authority
  authorityRouting: ApprovalAuthorityRouting;
  
  // Final decision
  finalDecision: FinalDecision;
  decisionLabel: string;
  decisionTimestamp: string;
  decisionBy: string;
  
  // Conditions (for conditional approval)
  conditions: ApprovalCondition[];
  
  // Approval memo
  approvalMemo: ApprovalMemo;
  
  // Audit trail
  auditTrail: AuditTrailEntry[];
  
  // Data field locks
  lockedFields: string[];
  
  // Metadata
  processedAt: string;
  processedBy: string;
  overallStatus: 'pass' | 'fail' | 'review' | 'pending';
}

// Helper function to get decision badge color
export const getDecisionColor = (decision: FinalDecision): string => {
  switch (decision) {
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'approved_with_conditions':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'suspended':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'declined':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get risk category icon/label
export const getRiskCategoryLabel = (category: RiskCategory): string => {
  switch (category) {
    case 'credit':
      return 'Credit Risk';
    case 'collateral':
      return 'Collateral Risk';
    case 'legal_title':
      return 'Legal/Title Risk';
    case 'insurance':
      return 'Insurance Risk';
    case 'fraud_aml':
      return 'Fraud/AML Risk';
    case 'operational':
      return 'Operational/Data Integrity';
    default:
      return 'Unknown Risk';
  }
};

// Helper function to get authority label
export const getAuthorityLabel = (authority: ApprovalAuthority): string => {
  switch (authority) {
    case 'automated':
      return 'Automated Approval';
    case 'underwriter':
      return 'Underwriter';
    case 'senior_underwriter':
      return 'Senior Underwriter';
    case 'credit_committee':
      return 'Credit Committee';
    case 'executive':
      return 'Executive Approval';
    default:
      return 'Unknown Authority';
  }
};
