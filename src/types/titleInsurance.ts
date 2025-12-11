export type ValidationStatus = 'pass' | 'fail' | 'review' | 'pending';
export type LienType = 'Mortgage' | 'Judgment' | 'Tax Lien' | 'HOA Lien' | 'UCC' | 'Easement' | 'Restriction' | 'Code Enforcement' | 'Claim of Lien' | 'Construction Lien' | 'Tax Certificate';
export type RBIClassification = 'Voluntary Financial Lien' | 'Involuntary Financial Lien' | 'Super-Priority Lien' | 'Priority Lien' | 'Statutory Lien' | 'Fixture or Personal Property Encumbrance' | 'Non-Financial Property Right' | 'Use Restrictions / Non-Financial' | 'Financial or Statutory Lien';
export type LienCategory = 'Mortgage / Deed of Trust' | 'Judgment' | 'Tax Lien (IRS, State, County)' | 'Tax Certificate' | 'HOA Lien' | 'UCC Filing' | 'Easement' | 'Restrictions / CCRs / Code Enforcement' | 'Claim of Lien';
export type EntityType = 'LLC' | 'Individual' | 'Corporation' | 'Trust' | 'Partnership';
export type ChainOfTitleItemType = 
  | 'Owner History' 
  | 'Transfer' 
  | 'Quitclaim' 
  | 'Warranty Deed' 
  | 'New Lien Recorded' 
  | 'Release Not Filed' 
  | 'Sudden Ownership Change' 
  | 'Flip 0-12 Months' 
  | 'Related Party Transfer' 
  | 'Unexpected New Lien (<90 Days)' 
  | 'Ownership Transfer 3-12 Months';

export type ChainOfTitleRBIClassification = 
  | 'Historical Ownership Data' 
  | 'Property Transfer Event' 
  | 'Transfer Instrument' 
  | 'Financial Encumbrance' 
  | 'Outstanding Encumbrance' 
  | 'Red-Flag / Risk Alert' 
  | 'Related Party Transfer' 
  | 'Red-Flag / New Risk';

export interface OwnershipMatch {
  transactionType: 'Purchase' | 'Refinance';
  // For Purchase
  sellerName?: string;
  vestedOwner: string;
  // For Refinance
  borrowerName?: string;
  guarantorName?: string;
  matchScore: number;
  status: ValidationStatus;
}

export interface LienItem {
  id: string;
  scheduleBTitle?: string;
  scheduleBText: string;
  detectedLienType: LienType;
  lienCategory: LienCategory;
  rbiClassification: RBIClassification;
  autoTagApplied: string;
  expectedParty: string;
  actualParty: string;
  partyMatchResult: 'Expected Party' | 'Unexpected Party';
  underwritingActionRequired: string;
  result: 'Passed' | 'Requires Payoff' | 'Manual Review';
  confidenceScore: number;
}

export interface EntityInfo {
  entityName: string;
  registeredAgent?: string;
  address: string;
  entityType: EntityType;
}

export type AffiliationCategory = 'Name' | 'Entity' | 'Mail Address' | 'Registered Agent' | 'Known Affiliates';

export interface AffiliationMatch {
  entityA: string;
  entityB: string;
  category: AffiliationCategory;
  matchTypeDetected: string;
  similarityScore: number;
  result: 'Passed' | 'Flagged';
}

export interface AffiliatedEntitiesData {
  vestedOwner: EntityInfo;
  assignor?: EntityInfo;
  seller?: EntityInfo;
  borrower: EntityInfo;
  guarantors: EntityInfo[];
  lienholderParties: EntityInfo[];
  affiliationDetections: AffiliationMatch[];
  overallStatus: ValidationStatus;
}

export interface CommitmentAmountValidation {
  titleCommitmentAmount: number;
  posLoanAmount: number;
  difference: number;
  differencePercent: number;
  matchScore: number;
  result: ValidationStatus;
}

export interface ALTAPolicyReview {
  policyType: {
    extractedType: string;
    businessRule: string;
    result: ValidationStatus;
  };
  lossPayee: {
    extractedClause: string;
    businessRule: string;
    matchScore: number;
    result: ValidationStatus;
  };
}

export interface ChainOfTitleItem {
  id: string;
  itemType: ChainOfTitleItemType;
  rbiClassification: ChainOfTitleRBIClassification;
  ocrExtractedData: string;
  autoTag: string;
  underwritingActionRequired: string;
  result: 'Pass' | 'Manual Review';
  date?: string;
}

export interface ISAOAReconciliation {
  sources: {
    source: string;
    extractedName: string;
    matches: boolean;
  }[];
  businessRule: string;
  matchScore: number;
  result: ValidationStatus;
}

export interface PurchaseContractReconciliation {
  sellerNameMatch: {
    contractValue: string;
    titleValue: string;
    matchScore: number;
    result: ValidationStatus;
  };
  buyerNameMatch: {
    contractValue: string;
    posValue: string;
    matchScore: number;
    result: ValidationStatus;
  };
  propertyAddressMatch: {
    contractValue: string;
    matchScore: number;
    result: ValidationStatus;
  };
  purchasePriceConfirmation: {
    contractValue: number;
    matchScore: number;
    result: ValidationStatus;
  };
  closingDate?: {
    contractValue: string;
    matchScore: number;
    result: ValidationStatus;
  };
}

export interface TitleInsuranceData {
  transactionType: 'Purchase' | 'Refinance';
  ownershipMatch: OwnershipMatch;
  lienItems: LienItem[];
  affiliatedEntities: AffiliatedEntitiesData;
  commitmentAmount: CommitmentAmountValidation;
  altaPolicyReview: ALTAPolicyReview;
  chainOfTitle: ChainOfTitleItem[];
  isaoaReconciliation: ISAOAReconciliation;
  purchaseContractReconciliation?: PurchaseContractReconciliation;
  overallStatus: ValidationStatus;
  processedAt: string;
  processedBy: string;
}
