export type ValidationStatus = 'pass' | 'fail' | 'review' | 'pending';

export interface PolicyParsingValidation {
  insuredName: string;
  propertyAddress: string;
  deductible: number;
  coverageLimit: number;
  endorsements: string[];
  occupancy: string;
  policyType: string;
  policyNumber: string;
  effectiveDate: string;
  expirationDate: string;
  ocrConfidence: number;
  status: ValidationStatus;
  missingFields: string[];
}

export interface InsuredNameMatch {
  posEntityName: string;
  policyInsuredName: string;
  matchScore: number;
  suffixMatch: boolean;
  status: ValidationStatus;
  discrepancies: string[];
}

export interface LenderLossPayee {
  extractedClause: string;
  expectedClause: string;
  hasISAOA: boolean;
  hasATIMA: boolean;
  correctLenderName: boolean;
  status: ValidationStatus;
}

export interface MortgageeClauseEndorsement {
  endorsementType: string;
  endorsementNumber: string;
  isPresent: boolean;
  isCorrect: boolean;
  status: ValidationStatus;
  notes: string;
}

export interface PropertyAddressMatch {
  sources: {
    source: string;
    address: string;
    matches: boolean;
  }[];
  overallMatchScore: number;
  status: ValidationStatus;
  mismatches: string[];
}

export interface DeductibleValidation {
  deductibleAmount: number;
  coverageLimit: number;
  deductiblePercent: number;
  maxAllowedPercent: number;
  maxAllowedAmount: number;
  meetsLimit: boolean;
  status: ValidationStatus;
}

export interface CoInsuranceValidation {
  hasCoInsurance: boolean;
  detectedClauses: string[];
  status: ValidationStatus;
}

export interface LiabilityCoverageValidation {
  coverageAmount: number;
  minimumRequired: number;
  meetsRequirement: boolean;
  status: ValidationStatus;
}

export interface WindHailCoverage {
  isIncluded: boolean;
  exclusionDetected: boolean;
  coverageDetails: string;
  status: ValidationStatus;
}

export interface FloodInsuranceValidation {
  femaFloodZone: string;
  isRequired: boolean;
  hasCoverage: boolean;
  policyNumber?: string;
  status: ValidationStatus;
}

export interface EarthquakeInsuranceValidation {
  propertyState: string;
  isRequired: boolean;
  hasEndorsement: boolean;
  status: ValidationStatus;
}

export interface OccupancyValidation {
  policyOccupancy: string;
  posOccupancy: string;
  isNonOwnerOccupied: boolean;
  status: ValidationStatus;
}

export interface SpecialEndorsement {
  endorsementName: string;
  isRequired: boolean;
  isPresent: boolean;
  status: ValidationStatus;
}

export interface SpecialEndorsementsValidation {
  loanProgram: string;
  requiredEndorsements: SpecialEndorsement[];
  overallStatus: ValidationStatus;
}

export interface InsurancePolicyData {
  transactionType: 'Purchase' | 'Refinance';
  state: string;
  loanProgram: 'DSCR' | 'Bridge' | 'Fix & Flip' | 'Ground-Up Construction';
  policyParsing: PolicyParsingValidation;
  insuredNameMatch: InsuredNameMatch;
  lenderLossPayee: LenderLossPayee;
  mortgageeClause: MortgageeClauseEndorsement;
  propertyAddressMatch: PropertyAddressMatch;
  deductibleValidation: DeductibleValidation;
  coInsuranceValidation: CoInsuranceValidation;
  liabilityCoverage: LiabilityCoverageValidation;
  windHailCoverage: WindHailCoverage;
  floodInsurance: FloodInsuranceValidation;
  earthquakeInsurance: EarthquakeInsuranceValidation;
  occupancyValidation: OccupancyValidation;
  specialEndorsements: SpecialEndorsementsValidation;
  overallStatus: ValidationStatus;
  processedAt: string;
  processedBy: string;
}
