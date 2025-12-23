import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Wallet,
  User,
  Users,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  ArrowRightLeft,
  Zap,
  UserX,
  PiggyBank,
  FileCheck,
  Shield,
  AlertTriangle,
  RefreshCw,
  Database,
  FileText
} from 'lucide-react';
import { AssetVerificationData, ValidationStatus, LargeDeposit, SameDayTransaction, CircularTransfer, ThirdPartySource, AuditLogEntry } from '@/types/assetVerification';

interface AssetVerificationTabProps {
  phaseStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastUpdated?: string;
}

const AssetVerificationTab = ({ phaseStatus, lastUpdated }: AssetVerificationTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    dataSource: true,
    coreFields: true,
    accountOwnership: true,
    ownershipConfidence: true,
    multipleHolders: true,
    spouseDetection: true,
    completeness: true,
    recency: true,
    addressValidation: true,
    subjectProperty: true,
    largeDeposits: true,
    depositSources: true,
    balanceMath: true,
    cashFlow: true,
    balanceInflation: true,
    circularTransfers: true,
    velocityAnomaly: true,
    thirdPartyFunding: true,
    liquidity: true,
    crossDocument: true,
    finalDetermination: true,
    logs: false,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Mock data
  const data: AssetVerificationData = {
    dataSource: 'ocrolus_api',
    apiAvailable: true,
    ocrConfidence: 96.5,
    coreFields: {
      statementDates: {
        startDate: '2024-11-01',
        endDate: '2024-11-30',
      },
      beginningBalance: 125000,
      endingBalance: 142500,
      totalDeposits: 45000,
      totalWithdrawals: 27500,
      accountHolderNames: ['ABC Holdings LLC'],
      accountAddress: '456 Oak Avenue, Tampa, FL 33602',
      accountNumber: '****7890',
      bankName: 'Chase Bank',
      status: 'pass',
      missingFields: [],
    },
    accountOwnership: {
      borrowerEntity: 'ABC Holdings LLC',
      guarantorName: 'John Smith',
      accountOwners: ['ABC Holdings LLC'],
      borrowerListed: true,
      guarantorListed: false,
      status: 'pass',
    },
    ownershipConfidence: {
      ocrolusScore: 94,
      threshold: 80,
      status: 'pass',
    },
    multipleAccountHolders: {
      detectedOwners: ['ABC Holdings LLC'],
      authorizedOwners: ['ABC Holdings LLC'],
      unauthorizedOwners: [],
      status: 'pass',
    },
    spouseDetection: {
      spouseDetected: false,
      isGuarantor: false,
      status: 'pass',
    },
    statementCompleteness: {
      expectedPages: 4,
      detectedPages: 4,
      missingPages: [],
      status: 'pass',
    },
    statementRecency: {
      statementDate: '2024-11-30',
      daysSinceIssue: 22,
      maxAllowedDays: 45,
      status: 'pass',
    },
    addressValidation: {
      statementAddress: '456 Oak Avenue, Tampa, FL 33602',
      borrowerPrimaryResidence: '456 Oak Avenue, Tampa, FL 33602',
      addressMatch: true,
      matchScore: 100,
      status: 'pass',
    },
    subjectPropertyCrossCheck: {
      subjectPropertyAddress: '123 Main Street, Miami, FL 33101',
      borrowerResidence: '456 Oak Avenue, Tampa, FL 33602',
      addressesMatch: false,
      status: 'pass',
    },
    largeDepositDetection: {
      deposits: [
        {
          date: '2024-11-15',
          amount: 25000,
          description: 'Wire Transfer - Investment Return',
          source: 'Investment Account',
          sourced: true,
          explanation: 'Quarterly dividend from investment portfolio',
        },
        {
          date: '2024-11-22',
          amount: 15000,
          description: 'ACH Deposit - Rent Collection',
          source: 'Rental Income',
          sourced: true,
          explanation: 'Monthly rent from 3 rental properties',
        },
      ],
      totalLargeDeposits: 40000,
      allSourced: true,
      status: 'pass',
    },
    depositSourceValidation: {
      knownIncomeSources: ['Rental Income', 'Investment Returns', 'Business Revenue'],
      alignedDeposits: 45000,
      unknownSourceDeposits: 0,
      circularSources: false,
      status: 'pass',
    },
    balanceMath: {
      beginningBalance: 125000,
      totalDeposits: 45000,
      totalWithdrawals: 27500,
      calculatedEnding: 142500,
      actualEnding: 142500,
      variance: 0,
      variancePercent: 0,
      status: 'pass',
    },
    cashFlowConsistency: {
      averageMonthlyDeposits: 42000,
      averageMonthlyWithdrawals: 28000,
      depositPatternNormal: true,
      withdrawalPatternNormal: true,
      spikesDetected: false,
      irregularPatterns: [],
      status: 'pass',
    },
    balanceInflation: {
      sameDayInflowOutflow: [],
      paddingDetected: false,
      status: 'pass',
    },
    circularTransfers: {
      suspiciousTransfers: [],
      selfFundingLoops: false,
      status: 'pass',
    },
    velocityAnomaly: {
      averageTransactionsPerDay: 3.2,
      peakTransactionsPerDay: 8,
      anomalyDates: [],
      abnormalActivity: false,
      status: 'pass',
    },
    thirdPartyFunding: {
      undisclosedSources: [],
      hasUndisclosedFunding: false,
      status: 'pass',
    },
    liquiditySufficiency: {
      availableFunds: 142500,
      cashToClose: 85000,
      requiredReserves: 24000,
      totalRequired: 109000,
      surplus: 33500,
      status: 'pass',
    },
    crossDocumentConsistency: {
      posDisclosedAssets: 145000,
      verifiedAssets: 142500,
      variance: 2500,
      discrepancies: [],
      status: 'pass',
    },
    finalDetermination: {
      totalChecks: 20,
      passedChecks: 20,
      failedChecks: 0,
      reviewChecks: 0,
      overallStatus: 'pass',
    },
    processedAt: '2024-12-20T14:30:00Z',
    processedBy: 'AI Asset Validator v1.0 + Ocrolus API',
    overallStatus: 'pass',
  };

  const auditLog: AuditLogEntry[] = [
    { timestamp: '2024-12-20T14:30:00Z', step: '10.0', action: 'Load Asset Verification Results', result: 'pass', details: 'Ocrolus API results retrieved successfully', source: 'Phase 0 – PreQual DAT' },
    { timestamp: '2024-12-20T14:30:01Z', step: '10.1', action: 'Extract Core Fields', result: 'pass', details: 'All required fields extracted', source: 'Phase 0 API' },
    { timestamp: '2024-12-20T14:30:02Z', step: '10.2', action: 'Account Ownership Verification', result: 'pass', details: 'Borrower entity listed as account owner', source: 'Phase 1 – Borrower Profiles' },
    { timestamp: '2024-12-20T14:30:03Z', step: '10.3', action: 'Ownership Confidence Check', result: 'pass', details: 'Ocrolus confidence score: 94% (≥80%)', source: 'Phase 0 – Ocrolus' },
    { timestamp: '2024-12-20T14:30:04Z', step: '10.4', action: 'Multiple Account Holder Detection', result: 'pass', details: 'No unauthorized co-owners detected', source: 'Phase 10 OCR' },
    { timestamp: '2024-12-20T14:30:05Z', step: '10.5', action: 'Spouse Detection', result: 'pass', details: 'No spouse detected on account', source: 'Phase 1 – Guarantor Data' },
    { timestamp: '2024-12-20T14:30:06Z', step: '10.6', action: 'Statement Completeness', result: 'pass', details: 'All 4 pages present', source: 'Phase 10 OCR' },
    { timestamp: '2024-12-20T14:30:07Z', step: '10.7', action: 'Statement Recency', result: 'pass', details: 'Statement issued 22 days ago (≤45 days)', source: 'Phase 10 OCR' },
    { timestamp: '2024-12-20T14:30:08Z', step: '10.8', action: 'Address Validation', result: 'pass', details: 'Statement address matches borrower primary residence', source: 'Phase 1 – Borrower Address' },
    { timestamp: '2024-12-20T14:30:09Z', step: '10.9', action: 'Subject Property Cross-Check', result: 'pass', details: 'Subject property does not match borrower residence', source: 'Phase 1 – Property Data' },
    { timestamp: '2024-12-20T14:30:10Z', step: '10.10', action: 'Large Deposit Detection', result: 'pass', details: 'All large deposits sourced and explained', source: 'Phase 10 OCR / API' },
    { timestamp: '2024-12-20T14:30:11Z', step: '10.11', action: 'Deposit Source Validation', result: 'pass', details: 'All deposits align with known income sources', source: 'Phase 10 OCR' },
    { timestamp: '2024-12-20T14:30:12Z', step: '10.12', action: 'Balance Math Verification', result: 'pass', details: 'Beginning + Deposits - Withdrawals = Ending (0% variance)', source: 'Phase 10 OCR' },
    { timestamp: '2024-12-20T14:30:13Z', step: '10.13', action: 'Cash Flow Consistency', result: 'pass', details: 'Normal spending and deposit patterns', source: 'Phase 10 OCR' },
    { timestamp: '2024-12-20T14:30:14Z', step: '10.14', action: 'Balance Inflation Detection', result: 'pass', details: 'No same-day inflow/outflow patterns detected', source: 'Phase 10 AI Fraud Engine' },
    { timestamp: '2024-12-20T14:30:15Z', step: '10.15', action: 'Circular Transfer Detection', result: 'pass', details: 'No self-funding loops detected', source: 'Phase 10 AI Fraud Engine' },
    { timestamp: '2024-12-20T14:30:16Z', step: '10.16', action: 'Velocity Anomaly Detection', result: 'pass', details: 'Normal transaction velocity', source: 'Phase 10 AI Fraud Engine' },
    { timestamp: '2024-12-20T14:30:17Z', step: '10.17', action: 'Third-Party Funding Check', result: 'pass', details: 'No undisclosed third-party funds detected', source: 'Phase 10 AI Fraud Engine' },
    { timestamp: '2024-12-20T14:30:18Z', step: '10.18', action: 'Liquidity Sufficiency Check', result: 'pass', details: 'Funds sufficient for cash to close and reserves', source: 'Phase 1 – Loan Terms' },
    { timestamp: '2024-12-20T14:30:19Z', step: '10.19', action: 'Cross-Document Consistency', result: 'pass', details: 'Asset data aligns with POS disclosures', source: 'Phase 1 – Borrower Disclosures' },
    { timestamp: '2024-12-20T14:30:20Z', step: '10.20', action: 'Final Asset Determination', result: 'pass', details: 'All 20 asset verification checks passed', source: 'All Above' },
  ];

  const getStatusBadge = (status: ValidationStatus) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="h-3 w-3 mr-1" />Passed</Badge>;
      case 'fail':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'review':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20"><AlertCircle className="h-3 w-3 mr-1" />Review</Badge>;
      case 'pending':
        return <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getStatusIcon = (status: ValidationStatus, size: string = "h-4 w-4") => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className={`${size} text-emerald-500`} />;
      case 'fail':
        return <XCircle className={`${size} text-red-500`} />;
      case 'review':
        return <AlertCircle className={`${size} text-amber-500`} />;
      case 'pending':
        return <Clock className={`${size} text-slate-500`} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Phase Introduction */}
      <div className="p-5 bg-gradient-to-r from-violet-500/10 via-violet-400/5 to-transparent rounded-xl border-l-4 border-violet-500">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-violet-500/15 rounded-lg shrink-0">
            <Wallet className="h-6 w-6 text-violet-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Asset Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This phase validates borrower liquidity, ownership, legitimacy of funds, and detects manipulation or fraud 
              prior to funding. Combines Ocrolus API results with OCR fallback, fraud detection algorithms, and 
              cross-document consistency checks.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>Data Source: {data.dataSource === 'ocrolus_api' ? 'Ocrolus API' : 'OCR Fallback'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Processed: {formatDate(data.processedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available Funds</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(data.liquiditySufficiency.availableFunds)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cash to Close</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(data.liquiditySufficiency.cashToClose)}</p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Surplus</p>
                <p className="text-xl font-bold text-emerald-500">{formatCurrency(data.liquiditySufficiency.surplus)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Checks Passed</p>
                <p className="text-xl font-bold text-foreground">{data.finalDetermination.passedChecks}/{data.finalDetermination.totalChecks}</p>
              </div>
              <Shield className="h-8 w-8 text-violet-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Source Card */}
      <Collapsible open={expandedCards.dataSource} onOpenChange={() => toggleCard('dataSource')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-violet-500" />
                  <span>Data Source & API Status</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(data.apiAvailable ? 'pass' : 'review')}
                  {expandedCards.dataSource ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {data.apiAvailable ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                    <span className="font-medium">Ocrolus API</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {data.apiAvailable ? 'API results available from PreQual DAT endpoint' : 'API unavailable - Using OCR Fallback'}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Data Quality</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Confidence Score: <span className="font-semibold text-foreground">{data.ocrConfidence}%</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Core Fields Extraction */}
      <Collapsible open={expandedCards.coreFields} onOpenChange={() => toggleCard('coreFields')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-violet-500" />
                  <span>Core Fields Extraction</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(data.coreFields.status)}
                  {expandedCards.coreFields ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{data.coreFields.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Number</p>
                    <p className="font-medium">{data.coreFields.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Statement Period</p>
                    <p className="font-medium">{formatDate(data.coreFields.statementDates.startDate)} - {formatDate(data.coreFields.statementDates.endDate)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Beginning Balance</p>
                    <p className="font-medium">{formatCurrency(data.coreFields.beginningBalance)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ending Balance</p>
                    <p className="font-medium">{formatCurrency(data.coreFields.endingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Holders</p>
                    <p className="font-medium">{data.coreFields.accountHolderNames.join(', ')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Deposits</p>
                    <p className="font-medium text-emerald-500">{formatCurrency(data.coreFields.totalDeposits)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Withdrawals</p>
                    <p className="font-medium text-red-500">{formatCurrency(data.coreFields.totalWithdrawals)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Address</p>
                    <p className="font-medium text-sm">{data.coreFields.accountAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Account Ownership Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Account Ownership Verification */}
        <Collapsible open={expandedCards.accountOwnership} onOpenChange={() => toggleCard('accountOwnership')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-violet-500" />
                    <span>Account Ownership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.accountOwnership.status)}
                    {expandedCards.accountOwnership ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Borrower Entity</p>
                    <p className="font-medium">{data.accountOwnership.borrowerEntity}</p>
                  </div>
                  {data.accountOwnership.borrowerListed ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500">Listed</Badge> :
                    <Badge className="bg-red-500/10 text-red-500">Not Listed</Badge>
                  }
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Guarantor</p>
                    <p className="font-medium">{data.accountOwnership.guarantorName}</p>
                  </div>
                  <Badge className="bg-slate-500/10 text-slate-500">N/A (Entity Account)</Badge>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Ownership Confidence */}
        <Collapsible open={expandedCards.ownershipConfidence} onOpenChange={() => toggleCard('ownershipConfidence')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-violet-500" />
                    <span>Ownership Confidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.ownershipConfidence.status)}
                    {expandedCards.ownershipConfidence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ocrolus Confidence Score</span>
                    <span className="font-bold text-lg">{data.ownershipConfidence.ocrolusScore}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${data.ownershipConfidence.ocrolusScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${data.ownershipConfidence.ocrolusScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {data.ownershipConfidence.threshold}% minimum required
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Multiple Holders & Spouse Detection */}
      <div className="grid grid-cols-2 gap-4">
        <Collapsible open={expandedCards.multipleHolders} onOpenChange={() => toggleCard('multipleHolders')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-violet-500" />
                    <span>Multiple Account Holders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.multipleAccountHolders.status)}
                    {expandedCards.multipleHolders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Detected Owners:</p>
                  {data.multipleAccountHolders.detectedOwners.map((owner, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">{owner}</span>
                      <Badge variant="outline" className="ml-auto">Authorized</Badge>
                    </div>
                  ))}
                  {data.multipleAccountHolders.unauthorizedOwners.length === 0 && (
                    <p className="text-xs text-emerald-500 mt-2">No unauthorized co-owners detected</p>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={expandedCards.spouseDetection} onOpenChange={() => toggleCard('spouseDetection')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-violet-500" />
                    <span>Spouse Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.spouseDetection.status)}
                    {expandedCards.spouseDetection ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="p-4 bg-muted/30 rounded-lg">
                  {data.spouseDetection.spouseDetected ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">Spouse Detected: {data.spouseDetection.spouseName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Guarantor Status: {data.spouseDetection.isGuarantor ? 'Listed as Guarantor' : 'Not Listed as Guarantor'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">No spouse detected on account</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Statement Completeness & Recency */}
      <div className="grid grid-cols-2 gap-4">
        <Collapsible open={expandedCards.completeness} onOpenChange={() => toggleCard('completeness')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-500" />
                    <span>Statement Completeness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.statementCompleteness.status)}
                    {expandedCards.completeness ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Pages Detected</p>
                    <p className="text-2xl font-bold">{data.statementCompleteness.detectedPages} / {data.statementCompleteness.expectedPages}</p>
                  </div>
                  {data.statementCompleteness.missingPages.length === 0 ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={expandedCards.recency} onOpenChange={() => toggleCard('recency')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-500" />
                    <span>Statement Recency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.statementRecency.status)}
                    {expandedCards.recency ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Days Since Issue</span>
                    <span className="font-bold text-lg">{data.statementRecency.daysSinceIssue} days</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${data.statementRecency.daysSinceIssue <= 45 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${(data.statementRecency.daysSinceIssue / data.statementRecency.maxAllowedDays) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Maximum allowed: {data.statementRecency.maxAllowedDays} days</p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Address Validations */}
      <div className="grid grid-cols-2 gap-4">
        <Collapsible open={expandedCards.addressValidation} onOpenChange={() => toggleCard('addressValidation')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-violet-500" />
                    <span>Address Validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.addressValidation.status)}
                    {expandedCards.addressValidation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Statement Address</p>
                  <p className="font-medium text-sm">{data.addressValidation.statementAddress}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Borrower Primary Residence</p>
                  <p className="font-medium text-sm">{data.addressValidation.borrowerPrimaryResidence}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Match Score</span>
                  <Badge className={data.addressValidation.matchScore >= 90 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}>
                    {data.addressValidation.matchScore}%
                  </Badge>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={expandedCards.subjectProperty} onOpenChange={() => toggleCard('subjectProperty')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-violet-500" />
                    <span>Subject Property Cross-Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.subjectPropertyCrossCheck.status)}
                    {expandedCards.subjectProperty ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Subject Property</p>
                  <p className="font-medium text-sm">{data.subjectPropertyCrossCheck.subjectPropertyAddress}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Borrower Residence</p>
                  <p className="font-medium text-sm">{data.subjectPropertyCrossCheck.borrowerResidence}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {!data.subjectPropertyCrossCheck.addressesMatch ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-500">Addresses are different (as expected)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Addresses match (requires review)</span>
                    </>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Large Deposits */}
      <Collapsible open={expandedCards.largeDeposits} onOpenChange={() => toggleCard('largeDeposits')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-violet-500" />
                  <span>Large Deposit Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(data.largeDepositDetection.status)}
                  {expandedCards.largeDeposits ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.largeDepositDetection.deposits.map((deposit, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{formatDate(deposit.date)}</TableCell>
                      <TableCell className="font-medium text-emerald-500">{formatCurrency(deposit.amount)}</TableCell>
                      <TableCell>{deposit.description}</TableCell>
                      <TableCell>{deposit.source}</TableCell>
                      <TableCell>
                        {deposit.sourced ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Sourced</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Unsourced</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-3 flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Large Deposits</span>
                <span className="font-bold">{formatCurrency(data.largeDepositDetection.totalLargeDeposits)}</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Deposit Sources & Balance Math */}
      <div className="grid grid-cols-2 gap-4">
        <Collapsible open={expandedCards.depositSources} onOpenChange={() => toggleCard('depositSources')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-500" />
                    <span>Deposit Source Validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.depositSourceValidation.status)}
                    {expandedCards.depositSources ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Known Income Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {data.depositSourceValidation.knownIncomeSources.map((source, idx) => (
                      <Badge key={idx} variant="outline">{source}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Aligned Deposits</p>
                    <p className="font-bold text-emerald-500">{formatCurrency(data.depositSourceValidation.alignedDeposits)}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">Unknown Sources</p>
                    <p className="font-bold">{formatCurrency(data.depositSourceValidation.unknownSourceDeposits)}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={expandedCards.balanceMath} onOpenChange={() => toggleCard('balanceMath')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-violet-500" />
                    <span>Balance Math Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.balanceMath.status)}
                    {expandedCards.balanceMath ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Beginning Balance</span>
                    <span className="font-medium">{formatCurrency(data.balanceMath.beginningBalance)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">+ Total Deposits</span>
                    <span className="font-medium text-emerald-500">{formatCurrency(data.balanceMath.totalDeposits)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">- Total Withdrawals</span>
                    <span className="font-medium text-red-500">{formatCurrency(data.balanceMath.totalWithdrawals)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-violet-500/10 rounded border border-violet-500/20">
                    <span className="font-medium">= Calculated Ending</span>
                    <span className="font-bold">{formatCurrency(data.balanceMath.calculatedEnding)}</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-muted-foreground">Actual Ending</span>
                    <span className="font-medium">{formatCurrency(data.balanceMath.actualEnding)}</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-muted-foreground">Variance</span>
                    <span className={`font-medium ${data.balanceMath.variance === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {formatCurrency(data.balanceMath.variance)} ({formatPercent(data.balanceMath.variancePercent)})
                    </span>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Cash Flow & Fraud Detection */}
      <Collapsible open={expandedCards.cashFlow} onOpenChange={() => toggleCard('cashFlow')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  <span>Cash Flow Consistency</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(data.cashFlowConsistency.status)}
                  {expandedCards.cashFlow ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Avg Monthly Deposits</p>
                  <p className="font-bold text-emerald-500">{formatCurrency(data.cashFlowConsistency.averageMonthlyDeposits)}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Avg Monthly Withdrawals</p>
                  <p className="font-bold text-red-500">{formatCurrency(data.cashFlowConsistency.averageMonthlyWithdrawals)}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Deposit Pattern</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {data.cashFlowConsistency.depositPatternNormal ? (
                      <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500 font-medium">Normal</span></>
                    ) : (
                      <><AlertTriangle className="h-4 w-4 text-amber-500" /><span className="text-amber-500 font-medium">Irregular</span></>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Spikes Detected</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {!data.cashFlowConsistency.spikesDetected ? (
                      <><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500 font-medium">None</span></>
                    ) : (
                      <><AlertTriangle className="h-4 w-4 text-amber-500" /><span className="text-amber-500 font-medium">Yes</span></>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Fraud Detection Section */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>AI Fraud Detection Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Balance Inflation */}
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Balance Inflation</span>
                {getStatusIcon(data.balanceInflation.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.balanceInflation.paddingDetected ? 'Same-day patterns detected' : 'No padding detected'}
              </p>
            </div>

            {/* Circular Transfers */}
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Circular Transfers</span>
                {getStatusIcon(data.circularTransfers.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.circularTransfers.selfFundingLoops ? 'Self-funding loops found' : 'No circular transfers'}
              </p>
            </div>

            {/* Velocity Anomaly */}
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Velocity Anomaly</span>
                {getStatusIcon(data.velocityAnomaly.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {data.velocityAnomaly.averageTransactionsPerDay}/day | Peak: {data.velocityAnomaly.peakTransactionsPerDay}/day
              </p>
            </div>

            {/* Third-Party Funding */}
            <div className="p-4 bg-background rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Third-Party Funding</span>
                {getStatusIcon(data.thirdPartyFunding.status)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.thirdPartyFunding.hasUndisclosedFunding ? 'Undisclosed sources found' : 'No undisclosed sources'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity & Cross-Document */}
      <div className="grid grid-cols-2 gap-4">
        <Collapsible open={expandedCards.liquidity} onOpenChange={() => toggleCard('liquidity')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-violet-500" />
                    <span>Liquidity Sufficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.liquiditySufficiency.status)}
                    {expandedCards.liquidity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Available Funds</span>
                    <span className="font-bold">{formatCurrency(data.liquiditySufficiency.availableFunds)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Cash to Close</span>
                    <span className="font-medium">{formatCurrency(data.liquiditySufficiency.cashToClose)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Required Reserves</span>
                    <span className="font-medium">{formatCurrency(data.liquiditySufficiency.requiredReserves)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    <span className="font-medium">Total Required</span>
                    <span className="font-bold">{formatCurrency(data.liquiditySufficiency.totalRequired)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <span className="font-medium text-emerald-500">Surplus</span>
                    <span className="font-bold text-emerald-500">{formatCurrency(data.liquiditySufficiency.surplus)}</span>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={expandedCards.crossDocument} onOpenChange={() => toggleCard('crossDocument')}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-violet-500" />
                    <span>Cross-Document Consistency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(data.crossDocumentConsistency.status)}
                    {expandedCards.crossDocument ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">POS Disclosed Assets</span>
                    <span className="font-medium">{formatCurrency(data.crossDocumentConsistency.posDisclosedAssets)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Verified Assets</span>
                    <span className="font-medium">{formatCurrency(data.crossDocumentConsistency.verifiedAssets)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Variance</span>
                    <span className={`font-medium ${Math.abs(data.crossDocumentConsistency.variance) < 5000 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {formatCurrency(data.crossDocumentConsistency.variance)}
                    </span>
                  </div>
                  {data.crossDocumentConsistency.discrepancies.length === 0 && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-emerald-500">No discrepancies detected</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Final Determination */}
      <Card className="border-violet-500/30 bg-gradient-to-r from-violet-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-500" />
              <span>Final Asset Determination</span>
            </div>
            {getStatusBadge(data.finalDetermination.overallStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-lg border text-center">
              <p className="text-3xl font-bold text-foreground">{data.finalDetermination.totalChecks}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Checks</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">
              <p className="text-3xl font-bold text-emerald-500">{data.finalDetermination.passedChecks}</p>
              <p className="text-xs text-muted-foreground mt-1">Passed</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
              <p className="text-3xl font-bold text-red-500">{data.finalDetermination.failedChecks}</p>
              <p className="text-xs text-muted-foreground mt-1">Failed</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 text-center">
              <p className="text-3xl font-bold text-amber-500">{data.finalDetermination.reviewChecks}</p>
              <p className="text-xs text-muted-foreground mt-1">Manual Review</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(data.finalDetermination.overallStatus, "h-5 w-5")}
                <span className="font-medium">
                  {data.finalDetermination.overallStatus === 'pass' && 'All asset verification checks passed — Proceed to Phase 11'}
                  {data.finalDetermination.overallStatus === 'fail' && 'Asset verification failed — Manual review required'}
                  {data.finalDetermination.overallStatus === 'review' && 'Asset verification requires manual review'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Processed by: {data.processedBy}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Collapsible open={expandedCards.logs} onOpenChange={() => toggleCard('logs')}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Validation Audit Log</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{auditLog.length} entries</Badge>
                  {expandedCards.logs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Step</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs">{entry.step}</TableCell>
                        <TableCell className="text-sm">{entry.action}</TableCell>
                        <TableCell>{getStatusBadge(entry.result)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{entry.details}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{entry.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default AssetVerificationTab;
