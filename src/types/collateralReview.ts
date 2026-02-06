// Phase 5: Collateral Review & Appraisal Feasibility Types

export type ProductType = 'FNF' | 'GUC' | 'DSCR' | 'Bridge';
export type TransactionType = 'Purchase' | 'Refinance';
export type CheckStatus = 'pass' | 'flag' | 'fail' | 'review';
export type SeverityLevel = 'low' | 'medium' | 'high';
export type ConfidenceTier = 'Strong Collateral' | 'Acceptable w/ review' | 'Elevated Risk' | 'High Risk';

// Engine 1: Appraisal Completeness
export interface AppraisalCompletenessData {
  appraiserLicenseValid: boolean;
  appraiserLicenseState: string;
  appraiserLicenseExpiry: string;
  signaturePresent: boolean;
  signatureType: 'digital' | 'handwritten' | 'missing';
  effectiveDate: string;
  effectiveDateDays: number;
  effectiveDateStatus: CheckStatus;
  propertyTypeMatch: boolean;
  propertyTypePOS: string;
  propertyTypeAppraisal: string;
  interiorPhotosPresent: boolean;
  exteriorPhotosPresent: boolean;
  uadFieldsComplete: boolean;
  checks: EngineCheck[];
}

// Engine 2: Subject Property Analysis
export interface SubjectPropertyData {
  addressNormalized: boolean;
  addressPOS: string;
  addressAppraisal: string;
  addressUSPS: string;
  glaVariance: number;
  glaVarianceStatus: CheckStatus;
  glaPOS: number;
  glaAppraisal: number;
  roomCount: number;
  roomCountMatch: boolean;
  unitCount: number;
  unitCountMatch: boolean;
  conditionRating: string;
  qualityRating: string;
  photosConsistent: boolean;
  checks: EngineCheck[];
}

// Engine 3: Comparable Sales / Comp Confidence
export interface ComparableSale {
  compId: string;
  address: string;
  saleDate: string;
  monthsOld: number;
  salePrice: number;
  distance: number;
  grossAdjustmentPercent: number;
  netAdjustmentPercent: number;
  recencyScore: number;
  distanceScore: number;
  adjustmentScore: number;
  condition: string;
}

export interface CompConfidenceData {
  comparables: ComparableSale[];
  recencyScoreAvg: number;
  distanceScoreAvg: number;
  adjustmentScoreAvg: number;
  compConfidenceScore: number;
  formula: string;
  checks: EngineCheck[];
}

// Engine 4: Market Stability
export interface MarketStabilityData {
  priceTrend: 'increasing' | 'stable' | 'slight_decline' | 'declining';
  priceTrendScore: number;
  supplyLevel: number; // months of supply
  supplyLevelScore: number;
  daysOnMarket: number;
  daysOnMarketScore: number;
  saleConcessionPressure: 'none' | 'occasional' | 'frequent' | 'large';
  saleConcessionScore: number;
  listingStagnationApplied: boolean;
  listingStagnationDays?: number;
  marketStabilityBase: number;
  marketStabilityAdjusted: number;
  formula: string;
  checks: EngineCheck[];
}

// Engine 5: Rental / DSCR Confidence
export interface RentalConfidenceData {
  leaseStatus: 'valid' | 'invalid' | 'not_provided';
  leaseRent?: number;
  appraisalMarketRent: number;
  baseRent: number;
  rentVariance: number;
  rentVarianceStatus: CheckStatus;
  rentCompsConsistent: boolean;
  appraiserSupportsRent: boolean;
  rentConfidenceScore: number;
  finalRent: number;
  decisionRule: string;
  checks: EngineCheck[];
}

// Engine 6: Construction Feasibility
export interface ScopeAssumptionReview {
  appraiserAssumedItems: string[];
  posBudgetItems: string[];
  scopeMatchStatus: 'full_match' | 'partial_match' | 'mismatch';
  scopeResult: 'Continue' | 'REVIEW' | 'FAIL';
}

export interface ARVCompsFeasibility {
  netAdjustmentAvg: number;
  netAdjustmentThreshold: number;
  grossAdjustmentAvg: number;
  grossAdjustmentThreshold: number;
  compConditionSupportsARV: boolean;
  compSaleDatesWithin6Months: boolean;
  arvCompStatus: CheckStatus;
}

export interface PermitValidation {
  permitActive: boolean;
  permitAddressMatch: boolean;
  permitContractorMatch: boolean;
  permitScopeMatch: boolean;
  permitStatus: CheckStatus;
}

export interface ConstructionFeasibilityData {
  productType: 'FNF' | 'GUC';
  
  // Section 1: Appraisal Scope Assumption Review
  scopeAssumptionReview: ScopeAssumptionReview;
  
  // Section 2: AIV/ARV Value Logic Check
  aiv: number;
  arv: number;
  rehabBudget: number;
  arvSupportRatio: number;
  arvSupportStatus: CheckStatus;
  arvSupportInterpretation: 'Strong' | 'Acceptable' | 'Weak ARV';
  
  // Section 3: Comparable Sales Feasibility (ARV Comps)
  arvCompsFeasibility: ARVCompsFeasibility;
  
  // Section 4: POS Budget to BCP Cost Validation
  posBudget: number;
  bcpEstimate: number;
  budgetVariance: number;
  budgetVarianceStatus: CheckStatus;
  budgetVarianceResult: 'Pass' | 'Review' | 'Fail';
  
  // Section 5: Contractor Feasibility (BCP)
  contractorScore: number;
  contractorStatus: 'Recommended' | 'Recommended w/ Max' | 'Not Recommended';
  bcpMaxSupported?: number;
  tradeCoverage?: string;
  experienceScore?: number;
  
  // Section 6: Timeline vs Appraisal Assumptions
  bcpTimelineMonths: number;
  appraisalTimelineMonths: number;
  timelineScore: number;
  timelineResult: 'Pass' | 'Review' | 'High Risk';
  
  // Section 7: Permit & Jurisdiction Validation (Refinance only)
  permitValidation?: PermitValidation;
  
  // Section 8: Final Feasibility Score
  feasibilityScore: number;
  feasibilityResult: 'Feasible' | 'Review' | 'Not Feasible';
  formula: string;
  
  checks: EngineCheck[];
}

// Engine 6 V2: Construction Feasibility (Simplified - No BCP Data)
export interface ConstructionFeasibilityV2Data {
  productType: 'FNF' | 'GUC';
  
  // Section 1: Appraisal Scope Assumption Review
  scopeAssumptionReview: ScopeAssumptionReview;
  
  // Section 2: AIV/ARV Value Logic Check
  aiv: number;
  arv: number;
  rehabBudget: number;
  arvSupportRatio: number;
  arvSupportStatus: CheckStatus;
  arvSupportInterpretation: 'Strong' | 'Acceptable' | 'Weak ARV';
  
  // Section 3: Comparable Sales Feasibility (ARV Comps)
  arvCompsFeasibility: ARVCompsFeasibility;
  
  // Section 4: POS Budget (no BCP comparison)
  posBudget: number;
  
  // Section 7: Permit & Jurisdiction Validation (Refinance only)
  permitValidation?: PermitValidation;
  
  // Section 8: Final Feasibility Score (simplified 2-factor)
  feasibilityScore: number;
  feasibilityResult: 'Feasible' | 'Review' | 'Not Feasible';
  formula: string;
  bcpDataPending: boolean;
  
  checks: EngineCheck[];
}

// Engine 7: AVM / Multi-Valuation Reconciliation
export interface AVMReconciliationData {
  appraisalValue: number;
  avmValue?: number;
  avmSource?: string;
  zhviValue?: number;
  avmVariance?: number;
  avmVarianceStatus: CheckStatus;
  avmTrendSupportsARV: boolean;
  checks: EngineCheck[];
}

// Engine 8: Red Flag / Risk Scoring
export interface RedFlag {
  flagId: string;
  category: 'appraisal_integrity' | 'subject_property' | 'comparable_sales' | 'market_conditions' | 'rental_dscr' | 'construction_feasibility' | 'cross_engine';
  trigger: string;
  severity: SeverityLevel;
  engineSource: string;
  impactsScore: boolean;
  routesToManualReview: boolean;
  details?: string;
}

export interface RiskScoringData {
  redFlags: RedFlag[];
  highSeverityCount: number;
  mediumSeverityCount: number;
  lowSeverityCount: number;
  totalFlagCount: number;
  riskProbability: number;
  confidenceDegradation: number;
  routingRecommendation: 'normal' | 'uw_review' | 'uw_manager' | 'md_review' | 'ic_committee';
}

// Common check structure
export interface EngineCheck {
  name: string;
  source: string;
  status: CheckStatus;
  value?: string | number;
  threshold?: string;
  notes?: string;
}

// Final Output
export interface CollateralReviewOutput {
  finalARV: number;
  finalAIV: number;
  confidenceMultiplier: number;
  feasibilityScore?: number;
  rentalConfidenceScore?: number;
  compConfidenceScore: number;
  marketStabilityScore: number;
  confidenceTier: ConfidenceTier;
  manualReviewRequired: boolean;
}

// Log Entry
export interface CollateralReviewLog {
  id: string;
  timestamp: string;
  tag: string;
  description: string;
  action: string;
  user: string;
  status: string;
  jsonData?: Record<string, any>;
}

// Main Phase 5 Data Structure
export interface CollateralReviewData {
  loanId: string;
  stageCode: 'collateralReview';
  status: 'pass' | 'review' | 'fail' | 'pending';
  productType: ProductType;
  transactionType: TransactionType;
  
  // Engine Data
  appraisalCompleteness: AppraisalCompletenessData;
  subjectProperty: SubjectPropertyData;
  compConfidence: CompConfidenceData;
  marketStability: MarketStabilityData;
  rentalConfidence?: RentalConfidenceData;
  constructionFeasibility?: ConstructionFeasibilityData;
  avmReconciliation: AVMReconciliationData;
  riskScoring: RiskScoringData;
  
  // Output
  output: CollateralReviewOutput;
  
  // Metadata
  logs: CollateralReviewLog[];
  ranAt: string;
  ranBy: string;
  source: string;
}
