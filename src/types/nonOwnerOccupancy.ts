export type TransactionType = 'Purchase' | 'Refinance';
export type ValidationStatus = 'pass' | 'warn' | 'fail';
export type MatchStatus = 'MATCH' | 'NO MATCH' | 'PARTIAL MATCH';

export interface NormalizedAddress {
  original: string;
  normalized: string;
  source: 'borrower' | 'guarantor' | 'tlo' | 'credit_report' | 'bank_statement' | 'gov_id' | 'title' | 'tax';
  sourceDetail?: string;
  matchScore?: number; // 0-100, fuzzy match score
}

export interface AddressMatchResult {
  address: NormalizedAddress;
  matchStatus: MatchStatus;
  matchScore: number;
  reason?: string;
}

export interface TitleOwnerCheck {
  titleOwner: string;
  titleOwnerAddress?: string;
  borrowerEntity: string;
  guarantors: string[];
  isMatch: boolean;
  reason?: string;
}

export interface HomesteadCheck {
  hasHomestead: boolean;
  exemptionHolder?: string;
  exemptionDate?: string;
  taxRecordSource?: string;
  reason?: string;
}

export interface ValidationCheck {
  name: string;
  ok: boolean;
  detail: string;
}

export interface ManualReviewReason {
  type: 'address_match' | 'title_owner_mismatch' | 'homestead_exemption' | 'missing_data' | 'api_failure';
  description: string;
  severity: 'high' | 'medium' | 'low';
  sourceDocumentLink?: string;
}

export interface NonOwnerOccupancyResult {
  loan_id: string;
  stage_code: 'nonOwnerOccupancy';
  status: ValidationStatus;
  transaction_type: TransactionType;
  
  // Property and comparison data
  property_address: string;
  property_address_normalized: string;
  
  borrower_addresses: NormalizedAddress[];
  guarantor_addresses: NormalizedAddress[];
  tlo_addresses: NormalizedAddress[];
  credit_report_addresses: NormalizedAddress[];
  bank_statement_addresses: NormalizedAddress[];
  gov_id_addresses: NormalizedAddress[];
  
  // Match results
  address_matches: AddressMatchResult[];
  has_any_match: boolean;
  
  // Refinance-specific checks
  title_owner_check?: TitleOwnerCheck;
  homestead_check?: HomesteadCheck;
  
  // Manual review
  requires_manual_review: boolean;
  manual_review_reasons: ManualReviewReason[];
  
  // Override capability
  override_applied: boolean;
  override_by?: string;
  override_at?: string;
  override_reason?: string;
  
  // Validation
  checks: ValidationCheck[];
  
  // Metadata
  ran_at: string;
  ran_by: string;
  source: string;
}

export interface LoanContext {
  loan_id: string;
  transaction_type: TransactionType;
  property_address: string;
  borrower_entity: string;
  borrower_addresses: string[];
  guarantor_names: string[];
  guarantor_addresses: string[];
}
