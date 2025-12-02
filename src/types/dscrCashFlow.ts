export interface AppraisalInput {
  occupancy: 'Occupied' | 'Vacant';
  actualLeaseRent: number | null;
  marketRent: number;
  appraisedValue: number;
  appraisalDate: string;
  pdfSource: string;
  borrowerCreditScorePOS: number;
  borrowerCreditScoreBureau: number;
  loanAmount: number;
  interestRate: number;
  term: number;
  termsFileSource: string;
  // LTV and LTC from POS
  posLTV: number;
  posLTC: number;
  // LTV and LTC extracted from Appraisal PDF
  appraisalLTV: number;
  appraisalLTC: number;
}

export interface RentDecision {
  selectedRent: number;
  decisionRule: string;
  ruleApplied: 'occupied_lesser' | 'vacant_market';
}

export interface DSCRCalculation {
  selectedRent: number;
  posDebtService: number;
  calculatedDSCR: number;
}

export interface ComparisonMetric {
  metric: string;
  posValue: number | string;
  aiValue: number | string;
  difference: number | string;
  tolerance: string;
  flag: 'none' | 'minor' | 'major';
  flagDetails?: string;
}

export interface TierChange {
  posTier: string;
  aiCalculatedTier: string;
  tierChanged: boolean;
  reason?: string;
}

export interface AIDecision {
  outcome: 'pass' | 'minor_deviation' | 'major_deviation';
  action: 'proceed_phase_7' | 'auto_reprice' | 'manual_review';
  actionTaken?: string;
  reason?: string;
}

export interface DownstreamNotification {
  posUpdated: boolean;
  downstreamServicesNotified: boolean;
  lastUpdateTimestamp?: string;
}

export interface ToleranceRule {
  metric: string;
  threshold: string;
  deviationType: 'minor' | 'major';
  action: string;
}

export interface DSCRAuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  tag: string;
  status: 'completed' | 'failed' | 'pending';
  details: string;
  jsonData?: Record<string, any>;
}

export interface DSCRCashFlowData {
  appraisalInput: AppraisalInput;
  rentDecision: RentDecision;
  dscrCalculation: DSCRCalculation;
  comparisonMetrics: ComparisonMetric[];
  tierChange: TierChange;
  aiDecision: AIDecision;
  downstreamNotification: DownstreamNotification;
  toleranceRules: ToleranceRule[];
  logs: DSCRAuditLog[];
}
