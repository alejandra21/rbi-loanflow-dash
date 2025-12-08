export type ValidationStatus = 'pass' | 'warn' | 'fail' | 'pending';
export type SystemBehavior = 'stop_workflow' | 'manual_review' | 'auto_pass';

export interface CPLDocument {
  lenderName: string;
  propertyAddress: string;
  loanAmount: number;
  agentName: string;
  underwriter: string;
  effectiveDate: string;
  cplType: 'ALTA' | 'T-50' | string;
  lossPayee: string;
  purpose: 'Purchase' | 'Refinance' | string;
  borrowerName: string;
  ocrStatus: 'readable' | 'unreadable' | 'incomplete';
  sourceFile: string;
}

export interface TitleCommitment {
  propertyAddress: string;
  loanAmount: number;
  underwriter: string;
  agentName: string;
  vestedOwner: string;
  borrowerName: string;
}

export interface POSData {
  propertyAddress: string;
  scheduledClosingDate: string;
  loanPurpose: 'Purchase' | 'Refinance';
  borrowerName: string;
  propertyState: string;
  loanAmount: number;
  buyerName?: string;
  sellerName?: string;
}

export interface USPSNormalizedAddress {
  standardizedAddress: string;
  matchScore: number;
}

export interface ValidationCheck {
  stepNumber: string;
  name: string;
  status: ValidationStatus;
  logicCriteria: string;
  posValue: string;
  cplValue: string;
  errorMessage?: string;
  systemBehavior: SystemBehavior;
  details?: string;
}

export interface CPLFieldValidation {
  field: string;
  value: string | number;
  isValid: boolean;
  errorMessage?: string;
  requiresManualReview?: boolean;
}

export interface AddressValidation {
  source: string;
  address: string;
  matches: boolean;
}

export interface ClosingProtectionData {
  cplDocument: CPLDocument;
  titleCommitment: TitleCommitment;
  posData: POSData;
  uspsAddress: USPSNormalizedAddress;
  appraisalAddress: string;
  validationChecks: ValidationCheck[];
  overallStatus: ValidationStatus;
  processedAt: string;
  processedBy: string;
}
