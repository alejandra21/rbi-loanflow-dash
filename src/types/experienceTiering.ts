export type TierLevel = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
export type ValidationStatus = 'pass' | 'warn' | 'fail';
export type EvaluationOutcome = 'Pass' | 'Manual Review' | 'Fail';

export interface EntityMatch {
  entityName: string;
  confidence: number;
  method: 'entity_search' | 'property_search_fallback';
  alternativesCount?: number;
}

export interface Transaction {
  address: string;
  purchaseDate: string;
  saleDate?: string;
  purchaseAmount: number;
  saleAmount?: number;
  exitType?: string;
}

export interface Discrepancy {
  type: 'date_mismatch' | 'amount_mismatch' | 'address_mismatch' | 'ownership_mismatch' | 'entity_match' | 'other';
  message: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface ValidationCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface ManualValidation {
  required: boolean;
  reason?: 'Data discrepancy' | 'Insufficient evidence' | 'Edge case' | 'Other';
  comment?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export interface ExperienceTieringMetrics {
  verified_exits_count: number;
  verified_volume_usd: number;
  lookback_months: number;
  borrower_experience_score: number; // 0-100 (60% weight)
  guarantor_record_score: number; // 0-100 (20% weight)
  liquidity_ratio: number; // 0-100 (10% weight)
  performance_record_score: number; // 0-100 (10% weight)
}

export interface ExperienceTieringResult {
  loan_id: string;
  stage_code: 'experienceTiering';
  status: ValidationStatus;
  assigned_tier: TierLevel | null;
  confidence_score: number; // 0-1.0
  exposure_limit_usd: number;
  recommended_ltc_cap: number; // percentage
  recommended_arv_cap: number; // percentage
  exception_flag: boolean;
  exception_reason?: string;
  metrics: ExperienceTieringMetrics;
  checks: ValidationCheck[];
  discrepancies: Discrepancy[];
  manual_validation: ManualValidation;
  ran_at: string;
  ran_by: string;
  source: 'PrequalDat';
  entity_match?: EntityMatch;
  ownership_verified?: boolean;
  evaluation_outcome?: EvaluationOutcome;
  transactions?: Transaction[];
}

export interface LoanContext {
  loan_id: string;
  loan_type: 'Fix & Flip' | 'Ground-Up Construction' | 'DSCR' | string;
  property_addresses: string[];
  borrower_name: string;
  guarantor_names?: string[];
  legal_entity_names?: string[];
  self_reported_exits?: Transaction[];
  rehab_cost?: number;
  total_project_cost?: number;
}
