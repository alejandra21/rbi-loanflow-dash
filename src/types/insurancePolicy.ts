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

// Program-Specific Validations

export interface DSCRBridgeValidation {
  rcvCoverageLimit: number;
  loanAmount: number;
  replacementCostEstimate: number;
  rcvMeetsRequirement: boolean;
  rentLossCoverage: {
    hasRentLoss: boolean;
    monthsCovered: number;
    minimumRequired: number;
    detectedKeywords: string[];
  };
  status: ValidationStatus;
}

export interface GUCValidation {
  rcvCoverageLimit: number;
  loanAmount: number;
  constructionBudget: number;
  rcvMeetsRequirement: boolean;
  workersComp: {
    laborPerformed: boolean;
    isListed: boolean;
    policyDetails?: string;
  };
  status: ValidationStatus;
}

export interface FixFlipValidation {
  policyType: {
    isBuilderRisk: boolean;
    hasHO3Conversion: boolean;
    detectedPolicyType: string;
  };
  coverageTerm: {
    rehabPeriodMonths: number;
    dispositionPeriodMonths: number;
    totalRequired: number;
    policyTermMonths: number;
    meetsRequirement: boolean;
  };
  rcvValidation: {
    rcvLimit: number;
    loanAmount: number;
    replacementCostEstimate: number;
    meetsRequirement: boolean;
  };
  workersComp: {
    contractorLaborUsed: boolean;
    isListed: boolean;
    policyDetails?: string;
  };
  status: ValidationStatus;
}

export interface FloodInsuranceRequirements {
  policyType: {
    isFEMA: boolean;
    isPrivateFlood: boolean;
    isAcceptable: boolean;
    detectedType: string;
  };
  coverageTerm: {
    termMonths: number;
    minimumRequired: number;
    meetsRequirement: boolean;
  };
  coverageAmount: {
    femaCoverage: number;
    femaMaximum: number;
    additionalCoverageRequired: number;
    loanAmount: number;
    siteValue: number;
    totalCoverage: number;
    meetsRequirement: boolean;
  };
  status: ValidationStatus;
}

// Condo Insurance Validations

export interface MasterCondoInsuranceValidation {
  isRequired: boolean;
  propertyType: string;
  isHOAProperty: boolean;
  policyPresent: boolean;
  addressMatch: {
    fullAddress: string;
    unitNumber: string;
    matches: boolean;
  };
  rbiMortgageeClause: {
    isPresent: boolean;
    isCorrect: boolean;
  };
  totalCoverage: number;
  totalUnits: number;
  status: ValidationStatus;
}

export interface HO6InsuranceValidation {
  isRequired: boolean;
  propertyType: string;
  policyPresent: boolean;
  addressMatch: {
    fullAddress: string;
    unitNumber: string;
    matches: boolean;
  };
  rbiMortgageeClause: {
    isPresent: boolean;
    isCorrect: boolean;
  };
  coverageAmount: {
    amount: number;
    aivValue: number;
    purchasePrice: number;
    minimumRequired: number;
    minimumPercentage: number;
    meetsRequirement: boolean;
  };
  coverageTerm: {
    termMonths: number;
    minimumRequired: number;
    meetsRequirement: boolean;
  };
  status: ValidationStatus;
}

// Document Requirements

export interface DocumentRequirement {
  documentType: string;
  posDocType: string;
  isRequired: boolean;
  requiredForPrograms?: string[];
  condition?: string;
  isPresent: boolean;
  status: ValidationStatus;
}

export interface DocumentRequirementsValidation {
  propertyType: string;
  loanProgram: string;
  floodZone: string;
  isHOAProperty: boolean;
  documents: DocumentRequirement[];
  overallStatus: ValidationStatus;
}

export interface InsurancePolicyData {
  transactionType: 'Purchase' | 'Refinance';
  state: string;
  loanProgram: 'DSCR' | 'Bridge' | 'Fix & Flip' | 'Ground-Up Construction';
  propertyType: 'Single Family' | 'Multi-Family' | 'Condo' | 'Townhouse' | 'Commercial';
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
  // Program-specific validations
  dscrBridgeValidation?: DSCRBridgeValidation;
  gucValidation?: GUCValidation;
  fixFlipValidation?: FixFlipValidation;
  floodRequirements?: FloodInsuranceRequirements;
  // Condo-specific validations
  masterCondoInsurance?: MasterCondoInsuranceValidation;
  ho6Insurance?: HO6InsuranceValidation;
  // Document requirements
  documentRequirements?: DocumentRequirementsValidation;
  overallStatus: ValidationStatus;
  processedAt: string;
  processedBy: string;
}
