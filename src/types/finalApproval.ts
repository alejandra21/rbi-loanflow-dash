export type FinalDecision = 'approved' | 'approved_with_conditions' | 'suspended' | 'declined';
export type RiskCategory = 'credit' | 'collateral' | 'legal_title' | 'insurance' | 'fraud_aml' | 'operational';
export type ApprovalAuthority = 'automated' | 'underwriter' | 'senior_underwriter' | 'credit_committee' | 'executive';
export type ExceptionSeverity = 'hard' | 'soft';
export type PhaseTerminalState = 'pass' | 'pass_with_exception' | 'manual_review_required' | 'fail' | 'not_run';
export type ClearToCloseStatus = 'eligible' | 'not_eligible' | 'file_closed' | 'pending';
export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

// Risk Score (Rule-Based Loan Scoring)
export interface RiskScoreData {
  overallScore: number; // 0-100 scale
  overallRiskLevel: RiskLevel;
  scoreBreakdown: {
    category: RiskCategory;
    categoryLabel: string;
    score: number; // 0-100
    weight: number; // percentage weight in overall score
    weightedScore: number;
    riskLevel: RiskLevel;
    contributingFactors: string[];
  }[];
  scoringFactors: {
    factor: string;
    value: string | number;
    impact: 'positive' | 'negative' | 'neutral';
    pointsContributed: number;
    sourcePhase: number;
  }[];
  thresholds: {
    autoApprove: number; // Score above this = auto approve eligible
    manualReview: number; // Score between this and autoApprove = manual review
    decline: number; // Score below this = decline
  };
  recommendation: 'auto_approve' | 'manual_review' | 'decline';
  calculatedAt: string;
  calculatedBy: string;
  version: string;
}

// Cross-Phase Input Sources
export interface CrossPhaseInput {
  dataField: string;
  sourcePhase: number;
  sourceSystem: string;
  notes: string;
  value?: string | number;
}

// Phase Completion Gate (Step 11.1)
export interface PhaseCompletionGate {
  allPhasesExecuted: boolean;
  phasesNotRun: number[];
  phasesWithoutTerminalState: number[];
  hardStopGate: boolean;
  gateResult: 'proceed' | 'hard_stop_suspend' | 'decline';
  gateMessage: string;
}

export interface PhaseOutcome {
  phaseName: string;
  phaseNumber: number;
  status: PhaseTerminalState;
  riskCategory: RiskCategory;
  completedAt?: string;
  issues: string[];
  isHardStop: boolean;
  exceptionCount: number;
  hardExceptionCount: number;
  softExceptionCount: number;
}

// Enhanced Exception Schema (Step 11.2)
export interface Exception {
  id: string;
  originPhase: number;
  phaseName: string;
  riskCategory: RiskCategory;
  policyRuleId: string;
  severity: ExceptionSeverity;
  isCurable: boolean;
  isCompensatorAllowed: boolean;
  description: string;
  compensatingFactors?: CompensatingFactor[];
  appliedCompensators?: string[];
  status: 'pending' | 'approved' | 'denied' | 'waived' | 'escalated';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  requiresRemediation?: boolean;
  remediationPhase?: number;
}

// Compensating Factors (Step 11.4)
export interface CompensatingFactor {
  id: string;
  type: 'lower_ltv' | 'higher_dscr' | 'excess_liquidity' | 'additional_guarantor' | 'proven_experience' | 'other';
  description: string;
  isAllowedByPolicy: boolean;
  isSufficient: boolean;
  value?: string | number;
  minimumRequired?: string | number;
}

// Hard Stop Types (Step 11.3)
export interface HardStop {
  id: string;
  type: 'borrower_identity_mismatch' | 'fraud_indicators' | 'title_ownership_unresolved' | 'missing_cpl' | 'missing_insurance' | 'appraisal_manipulation' | 'invalid_value' | 'insurance_rcv_below_minimum' | 'other';
  description: string;
  isResolved: boolean;
  isOverrideable: boolean;
  sourcePhase: number;
  detectedAt: string;
}

// Authority Matrix (Step 11.5)
export interface AuthorityMatrixEntry {
  riskProfile: string;
  exceptionRange: string;
  requiredApproval: ApprovalAuthority;
  canAIApprove: boolean;
  restrictions: string[];
}

// Non-Delegable Items - AI Cannot Approve
export interface NonDelegableItem {
  type: 'policy_override' | 'fraud_exception' | 'title_defect' | 'authority_stacking';
  description: string;
  requiresHumanApproval: boolean;
  minimumAuthority: ApprovalAuthority;
}

// Manual Decision Capture (Step 11.6)
export interface ManualDecisionRecord {
  decision: FinalDecision;
  rationale: string;
  compensatingFactorsSelected: string[];
  policyCitation: string;
  approverIdentity: string;
  approverRole: ApprovalAuthority;
  timestamp: string;
  isValid: boolean;
  missingFields: string[];
}

// Cross-Risk Reconciliation (Step 11.7)
export interface CrossRiskReconciliation {
  isConsistent: boolean;
  inconsistencies: {
    category1: RiskCategory;
    category2: RiskCategory;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  requiresManualReview: boolean;
  reconciliationStatus: 'pass' | 'fail' | 'review_required';
}

export interface ApprovalCondition {
  id: string;
  description: string;
  category: 'prior_to_docs' | 'prior_to_funding' | 'prior_to_closing' | 'ongoing';
  status: 'pending' | 'satisfied' | 'waived';
  dueDate?: string;
  satisfiedAt?: string;
  satisfiedBy?: string;
  isMeasurable: boolean;
  isVerifiable: boolean;
  responsiblePhase?: number;
  blocksCloseToClose: boolean;
}

// Individual validation within a risk category
export interface RiskValidation {
  id: string;
  name: string;
  description: string;
  sourcePhase: number;
  phaseName: string;
  status: PhaseTerminalState;
  severity?: ExceptionSeverity;
  issue?: string;
  exceptionId?: string;
  policyReference?: string;
}

export interface RiskSummary {
  category: RiskCategory;
  categoryLabel: string;
  // Contributing phases for this risk category
  contributingPhases: {
    phaseNumber: number;
    phaseName: string;
    status: PhaseTerminalState;
    validationCount: number;
  }[];
  // Detailed validations
  validations: RiskValidation[];
  // Summary counts by terminal state
  passCount: number;
  passWithExceptionCount: number;
  manualReviewCount: number;
  failCount: number;
  // Exception counts
  hardExceptions: number;
  softExceptions: number;
  hardStops: number;
  // Overall category status
  overallStatus: PhaseTerminalState;
}

export interface ApprovalAuthorityRouting {
  requiredAuthority: ApprovalAuthority;
  authorityLabel: string;
  reason: string;
  exceptionCount: number;
  hardExceptionCount: number;
  softExceptionCount: number;
  canAIAutoApprove: boolean;
  nonDelegableItems: NonDelegableItem[];
  delegationChain: {
    level: ApprovalAuthority;
    name: string;
    approved: boolean;
    approvedAt?: string;
    decision?: string;
  }[];
  authorityMatrix: AuthorityMatrixEntry[];
}

export interface ApprovalMemo {
  generatedAt: string;
  generatedBy: string;
  loanId: string;
  borrowerName: string;
  borrowerEntity: string;
  loanAmount: number;
  loanType: string;
  loanPurpose: string;
  propertyAddress: string;
  decision: FinalDecision;
  decisionRationale: string;
  riskSummary: string;
  phaseResults: { phase: number; name: string; result: string }[];
  exceptionsApproved: number;
  exceptionLog: { id: string; description: string; status: string }[];
  compensatingFactors: string[];
  conditionsCount: number;
  conditionsToFunding: string[];
  approvalChain: {
    role: string;
    name: string;
    decision: string;
    timestamp: string;
    signature?: string;
  }[];
  version: string;
  isImmutable: boolean;
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
  isImmutable: boolean;
  step?: string;
}

// Clear-to-Close Gate (Step 11.13)
export interface ClearToCloseGate {
  finalState: FinalDecision;
  allConditionsMet: boolean;
  pendingConditions: number;
  status: ClearToCloseStatus;
  eligibleForPhase12: boolean;
  gateMessage: string;
  lastEvaluatedAt: string;
}

// Remediation Loop Control (Step 11.10)
export interface RemediationRequest {
  id: string;
  targetPhase: number;
  requestType: 'data_correction' | 'document_upload' | 're_validation' | 'exception_review';
  description: string;
  requestedAt: string;
  requestedBy: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  completedAt?: string;
  triggersReUnderwrite: boolean;
  reUnderwritePhases?: number[];
}

// Locked Fields (Step 11.11)
export interface LockedFieldEntry {
  fieldName: string;
  displayName: string;
  value: string | number;
  lockedAt: string;
  lockedBy: string;
  requiresExecutiveOverride: boolean;
  changeTriggersReUnderwrite: boolean;
  reUnderwriteFromPhase?: number;
}

export interface FinalApprovalData {
  // Risk Score (Rule-Based Loan Scoring)
  riskScore: RiskScoreData;
  
  // Cross-Phase Inputs
  crossPhaseInputs: CrossPhaseInput[];
  
  // Phase Completion Gate (Step 11.1)
  phaseCompletionGate: PhaseCompletionGate;
  
  // Phase outcomes from all phases (1-10)
  phaseOutcomes: PhaseOutcome[];
  
  // Risk consolidation
  riskSummary: RiskSummary[];
  totalHardStops: number;
  hasUnresolvedHardStops: boolean;
  hardStops: HardStop[];
  
  // Exception management (Step 11.2)
  exceptions: Exception[];
  totalExceptions: number;
  approvedExceptions: number;
  pendingExceptions: number;
  deniedExceptions: number;
  hardExceptions: number;
  softExceptions: number;
  
  // Compensating factors (Step 11.4)
  permittedCompensators: CompensatingFactor[];
  
  // Cross-Risk Reconciliation (Step 11.7)
  crossRiskReconciliation: CrossRiskReconciliation;
  
  // Approval authority (Step 11.5)
  authorityRouting: ApprovalAuthorityRouting;
  
  // Manual decision record (Step 11.6)
  manualDecisionRecord?: ManualDecisionRecord;
  
  // Final decision (Step 11.8)
  finalDecision: FinalDecision;
  decisionLabel: string;
  decisionTimestamp: string;
  decisionBy: string;
  
  // Conditions (Step 11.9)
  conditions: ApprovalCondition[];
  
  // Remediation requests (Step 11.10)
  remediationRequests: RemediationRequest[];
  
  // Locked fields (Step 11.11)
  lockedFields: LockedFieldEntry[];
  
  // Approval memo (Step 11.12)
  approvalMemo: ApprovalMemo;
  
  // Clear-to-Close Gate (Step 11.13)
  clearToCloseGate: ClearToCloseGate;
  
  // Audit trail
  auditTrail: AuditTrailEntry[];
  
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
      return 'AI Auto-Approve';
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

// Helper function to get phase terminal state label
export const getPhaseStateLabel = (state: PhaseTerminalState): string => {
  switch (state) {
    case 'pass':
      return 'PASS';
    case 'pass_with_exception':
      return 'PASS WITH EXCEPTION';
    case 'manual_review_required':
      return 'MANUAL REVIEW REQUIRED';
    case 'fail':
      return 'FAIL';
    case 'not_run':
      return 'NOT RUN';
    default:
      return 'UNKNOWN';
  }
};

// Helper function to get clear-to-close status label
export const getClearToCloseLabel = (status: ClearToCloseStatus): string => {
  switch (status) {
    case 'eligible':
      return 'Eligible for Phase 12';
    case 'not_eligible':
      return 'Not Eligible';
    case 'file_closed':
      return 'File Closed';
    case 'pending':
      return 'Pending Conditions';
    default:
      return 'Unknown';
  }
};

// Helper to determine approval authority based on exception count
export const determineApprovalAuthority = (
  softExceptions: number, 
  hardExceptions: number, 
  hasNonDelegable: boolean
): ApprovalAuthority => {
  if (hasNonDelegable) return 'executive';
  if (hardExceptions > 0) return 'credit_committee';
  if (softExceptions > 2) return 'credit_committee';
  if (softExceptions > 0) return 'underwriter';
  return 'automated';
};

// Helper function to get risk level color
export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'moderate':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'elevated':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get risk level label
export const getRiskLevelLabel = (level: RiskLevel): string => {
  switch (level) {
    case 'low':
      return 'Low Risk';
    case 'moderate':
      return 'Moderate Risk';
    case 'elevated':
      return 'Elevated Risk';
    case 'high':
      return 'High Risk';
    default:
      return 'Unknown';
  }
};
