export type ValidationStatus = 'pass' | 'fail' | 'review' | 'pending';

export interface AssetVerificationData {
  // Data sources
  dataSource: 'ocrolus_api' | 'ocr_fallback';
  apiAvailable: boolean;
  ocrConfidence?: number;

  // Core extracted fields (Step 10.1)
  coreFields: {
    statementDates: {
      startDate: string;
      endDate: string;
    };
    beginningBalance: number;
    endingBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    accountHolderNames: string[];
    accountAddress: string;
    accountNumber: string;
    bankName: string;
    status: ValidationStatus;
    missingFields: string[];
  };

  // Account Ownership (Step 10.2)
  accountOwnership: {
    borrowerEntity: string;
    guarantorName: string;
    accountOwners: string[];
    borrowerListed: boolean;
    guarantorListed: boolean;
    status: ValidationStatus;
  };

  // Ownership Confidence (Step 10.3)
  ownershipConfidence: {
    ocrolusScore: number;
    threshold: number;
    status: ValidationStatus;
  };

  // Multiple Account Holders (Step 10.4)
  multipleAccountHolders: {
    detectedOwners: string[];
    authorizedOwners: string[];
    unauthorizedOwners: string[];
    status: ValidationStatus;
  };

  // Spouse Detection (Step 10.5)
  spouseDetection: {
    spouseDetected: boolean;
    spouseName?: string;
    isGuarantor: boolean;
    status: ValidationStatus;
  };

  // Statement Completeness (Step 10.6)
  statementCompleteness: {
    expectedPages: number;
    detectedPages: number;
    missingPages: number[];
    status: ValidationStatus;
  };

  // Statement Recency (Step 10.7)
  statementRecency: {
    statementDate: string;
    daysSinceIssue: number;
    maxAllowedDays: number;
    status: ValidationStatus;
  };

  // Address Validation (Step 10.8)
  addressValidation: {
    statementAddress: string;
    borrowerPrimaryResidence: string;
    addressMatch: boolean;
    matchScore: number;
    status: ValidationStatus;
  };

  // Subject Property Cross-Check (Step 10.9)
  subjectPropertyCrossCheck: {
    subjectPropertyAddress: string;
    borrowerResidence: string;
    addressesMatch: boolean;
    status: ValidationStatus;
  };

  // Large Deposit Detection (Step 10.10)
  largeDepositDetection: {
    deposits: LargeDeposit[];
    totalLargeDeposits: number;
    allSourced: boolean;
    status: ValidationStatus;
  };

  // Deposit Source Validation (Step 10.11)
  depositSourceValidation: {
    knownIncomeSources: string[];
    alignedDeposits: number;
    unknownSourceDeposits: number;
    circularSources: boolean;
    status: ValidationStatus;
  };

  // Balance Math (Step 10.12)
  balanceMath: {
    beginningBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    calculatedEnding: number;
    actualEnding: number;
    variance: number;
    variancePercent: number;
    status: ValidationStatus;
  };

  // Cash Flow Consistency (Step 10.13)
  cashFlowConsistency: {
    averageMonthlyDeposits: number;
    averageMonthlyWithdrawals: number;
    depositPatternNormal: boolean;
    withdrawalPatternNormal: boolean;
    spikesDetected: boolean;
    irregularPatterns: string[];
    status: ValidationStatus;
  };

  // Balance Inflation Detection (Step 10.14)
  balanceInflation: {
    sameDayInflowOutflow: SameDayTransaction[];
    paddingDetected: boolean;
    status: ValidationStatus;
  };

  // Circular Transfer Detection (Step 10.15)
  circularTransfers: {
    suspiciousTransfers: CircularTransfer[];
    selfFundingLoops: boolean;
    status: ValidationStatus;
  };

  // Velocity Anomaly Detection (Step 10.16)
  velocityAnomaly: {
    averageTransactionsPerDay: number;
    peakTransactionsPerDay: number;
    anomalyDates: string[];
    abnormalActivity: boolean;
    status: ValidationStatus;
  };

  // Third-Party Funding Check (Step 10.17)
  thirdPartyFunding: {
    undisclosedSources: ThirdPartySource[];
    hasUndisclosedFunding: boolean;
    status: ValidationStatus;
  };

  // Liquidity Sufficiency (Step 10.18)
  liquiditySufficiency: {
    availableFunds: number;
    cashToClose: number;
    requiredReserves: number;
    totalRequired: number;
    surplus: number;
    status: ValidationStatus;
  };

  // Cross-Document Consistency (Step 10.19)
  crossDocumentConsistency: {
    posDisclosedAssets: number;
    verifiedAssets: number;
    variance: number;
    discrepancies: string[];
    status: ValidationStatus;
  };

  // Final Determination (Step 10.20)
  finalDetermination: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    reviewChecks: number;
    overallStatus: ValidationStatus;
  };

  // Metadata
  processedAt: string;
  processedBy: string;
  overallStatus: ValidationStatus;
}

export interface LargeDeposit {
  date: string;
  amount: number;
  description: string;
  source: string;
  sourced: boolean;
  explanation?: string;
}

export interface SameDayTransaction {
  date: string;
  inflowAmount: number;
  outflowAmount: number;
  description: string;
  suspicious: boolean;
}

export interface CircularTransfer {
  date: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  suspicionLevel: 'low' | 'medium' | 'high';
}

export interface ThirdPartySource {
  date: string;
  amount: number;
  source: string;
  disclosed: boolean;
}

export interface AuditLogEntry {
  timestamp: string;
  step: string;
  action: string;
  result: ValidationStatus;
  details: string;
  source: string;
}

// Ocrolus API overview data
export interface OcrolusOverviewData {
  averageDailyBalance: number;
  averageDepositCount: number;
  averageMonthlyExpense: number;
  averageMonthlyRevenue: number;
  debtCoverageRatio: number | null;
  minScoreAvailable: number;
  totalExpense: number;
  totalLoanPayments: number;
  totalLoanProceeds: number;
  totalNSFFeeCount: number;
  totalRevenue: number;
}

// Fraud document analysis result
export interface FraudDocumentAnalysis {
  documentName: string;
  pageNumbers: string;
  score: number;
  uploadedDocUUID: string;
  reasonCodes: string[];
}

// Individual Bank Statement with all verification data
export interface BankStatementData {
  statementId: string;
  accountHolderName: string;
  maskedAccountNumber: string;
  bankName: string;
  documentUrl?: string;
  verificationStatus: ValidationStatus;
  ocrolusData?: OcrolusOverviewData;
  fraudAnalysis?: FraudDocumentAnalysis[];
  authenticityPass: boolean;
  authenticityScore?: number;
  // The full verification data for this statement
  verificationData: AssetVerificationData;
}
