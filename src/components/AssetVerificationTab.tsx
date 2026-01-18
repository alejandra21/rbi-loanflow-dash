import { useState } from 'react';
import { cn } from '@/lib/utils';
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
  FileText,
  ExternalLink
} from 'lucide-react';
import { AssetVerificationData, ValidationStatus, LargeDeposit, SameDayTransaction, CircularTransfer, ThirdPartySource, AuditLogEntry, BankStatementData, OcrolusOverviewData, FraudDocumentAnalysis } from '@/types/assetVerification';
import BankStatementTabs from '@/components/asset-verification/BankStatementTabs';
import OcrolusOverviewCard from '@/components/asset-verification/OcrolusOverviewCard';
import FraudDocumentsCard from '@/components/asset-verification/FraudDocumentsCard';

interface AssetVerificationTabProps {
  phaseStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastUpdated?: string;
}

const AssetVerificationTab = ({ phaseStatus, lastUpdated }: AssetVerificationTabProps) => {
  const [activeStatementId, setActiveStatementId] = useState<string>('stmt-1');
  const [activeSection, setActiveSection] = useState<'ocrolus' | 'statements'>('statements');
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
    ocrolusOverview: true,
    fraudDocuments: true,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Mock bank statements data
  const mockBankStatements: BankStatementData[] = [
    {
      statementId: 'stmt-1',
      accountHolderName: 'Maria Rodriguez',
      maskedAccountNumber: '5555',
      bankName: 'Chase Bank',
      documentUrl: 'https://example.com/statement1.pdf',
      verificationStatus: 'pass',
      authenticityPass: true,
      authenticityScore: 98,
      ocrolusData: {
        averageDailyBalance: 45234.56,
        averageDepositCount: 12,
        averageMonthlyExpense: 8500.00,
        averageMonthlyRevenue: 15750.00,
        debtCoverageRatio: 1.85,
        minScoreAvailable: 95,
        totalExpense: 25500.00,
        totalLoanPayments: 3200.00,
        totalLoanProceeds: 0.00,
        totalNSFFeeCount: 0,
        totalRevenue: 47250.00,
      },
      fraudAnalysis: [
        {
          documentName: 'chase_statement_nov2024.pdf',
          pageNumbers: '1-5',
          score: 98,
          uploadedDocUUID: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          reasonCodes: [],
        },
      ],
      verificationData: {
        dataSource: 'ocrolus_api',
        apiAvailable: true,
        ocrConfidence: 96.5,
        coreFields: {
          statementDates: { startDate: '2024-11-01', endDate: '2024-11-30' },
          beginningBalance: 125000,
          endingBalance: 142500,
          totalDeposits: 45000,
          totalWithdrawals: 27500,
          accountHolderNames: ['Maria Rodriguez'],
          accountAddress: '456 Oak Avenue, Tampa, FL 33602',
          accountNumber: '****5555',
          bankName: 'Chase Bank',
          status: 'pass',
          missingFields: [],
        },
        accountOwnership: {
          borrowerEntity: 'ABC Holdings LLC',
          guarantorName: 'Maria Rodriguez',
          accountOwners: ['Maria Rodriguez'],
          borrowerListed: false,
          guarantorListed: true,
          status: 'pass',
        },
        ownershipConfidence: { ocrolusScore: 94, threshold: 80, status: 'pass' },
        multipleAccountHolders: { detectedOwners: ['Maria Rodriguez'], authorizedOwners: ['Maria Rodriguez'], unauthorizedOwners: [], status: 'pass' },
        spouseDetection: { spouseDetected: false, isGuarantor: false, status: 'pass' },
        statementCompleteness: { expectedPages: 4, detectedPages: 4, missingPages: [], status: 'pass' },
        statementRecency: { statementDate: '2024-11-30', daysSinceIssue: 22, maxAllowedDays: 45, status: 'pass' },
        addressValidation: { statementAddress: '456 Oak Avenue, Tampa, FL 33602', borrowerPrimaryResidence: '456 Oak Avenue, Tampa, FL 33602', addressMatch: true, matchScore: 100, status: 'pass' },
        subjectPropertyCrossCheck: { subjectPropertyAddress: '123 Main Street, Miami, FL 33101', borrowerResidence: '456 Oak Avenue, Tampa, FL 33602', addressesMatch: false, status: 'pass' },
        largeDepositDetection: { deposits: [{ date: '2024-11-15', amount: 25000, description: 'Wire Transfer - Investment Return', source: 'Investment Account', sourced: true, explanation: 'Quarterly dividend' }], totalLargeDeposits: 25000, allSourced: true, status: 'pass' },
        depositSourceValidation: { knownIncomeSources: ['Rental Income', 'Investment Returns'], alignedDeposits: 45000, unknownSourceDeposits: 0, circularSources: false, status: 'pass' },
        balanceMath: { beginningBalance: 125000, totalDeposits: 45000, totalWithdrawals: 27500, calculatedEnding: 142500, actualEnding: 142500, variance: 0, variancePercent: 0, status: 'pass' },
        cashFlowConsistency: { averageMonthlyDeposits: 42000, averageMonthlyWithdrawals: 28000, depositPatternNormal: true, withdrawalPatternNormal: true, spikesDetected: false, irregularPatterns: [], status: 'pass' },
        balanceInflation: { sameDayInflowOutflow: [], paddingDetected: false, status: 'pass' },
        circularTransfers: { suspiciousTransfers: [], selfFundingLoops: false, status: 'pass' },
        velocityAnomaly: { averageTransactionsPerDay: 3.2, peakTransactionsPerDay: 8, anomalyDates: [], abnormalActivity: false, status: 'pass' },
        thirdPartyFunding: { undisclosedSources: [], hasUndisclosedFunding: false, status: 'pass' },
        liquiditySufficiency: { availableFunds: 142500, cashToClose: 85000, requiredReserves: 24000, totalRequired: 109000, surplus: 33500, status: 'pass' },
        crossDocumentConsistency: { posDisclosedAssets: 145000, verifiedAssets: 142500, variance: 2500, discrepancies: [], status: 'pass' },
        finalDetermination: { totalChecks: 20, passedChecks: 20, failedChecks: 0, reviewChecks: 0, overallStatus: 'pass' },
        processedAt: '2024-12-20T14:30:00Z',
        processedBy: 'AI Asset Validator v1.0 + Ocrolus API',
        overallStatus: 'pass',
      },
    },
    {
      statementId: 'stmt-2',
      accountHolderName: 'Jose Garcia',
      maskedAccountNumber: '2222',
      bankName: 'Bank of America',
      documentUrl: undefined,
      verificationStatus: 'review',
      authenticityPass: true,
      authenticityScore: 75,
      ocrolusData: {
        averageDailyBalance: 28500.00,
        averageDepositCount: 8,
        averageMonthlyExpense: 12500.00,
        averageMonthlyRevenue: 18000.00,
        debtCoverageRatio: 1.44,
        minScoreAvailable: 72,
        totalExpense: 37500.00,
        totalLoanPayments: 4500.00,
        totalLoanProceeds: 0.00,
        totalNSFFeeCount: 2,
        totalRevenue: 54000.00,
      },
      fraudAnalysis: [
        {
          documentName: 'boa_statement_nov2024.pdf',
          pageNumbers: '1-4',
          score: 75,
          uploadedDocUUID: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          reasonCodes: ['BALANCE_SPIKE', 'NEW_ACCOUNT'],
        },
      ],
      verificationData: {
        dataSource: 'ocrolus_api',
        apiAvailable: true,
        ocrConfidence: 89.2,
        coreFields: {
          statementDates: { startDate: '2024-11-01', endDate: '2024-11-30' },
          beginningBalance: 45000,
          endingBalance: 52000,
          totalDeposits: 22000,
          totalWithdrawals: 15000,
          accountHolderNames: ['Jose Garcia'],
          accountAddress: '789 Pine Street, Orlando, FL 32801',
          accountNumber: '****2222',
          bankName: 'Bank of America',
          status: 'pass',
          missingFields: [],
        },
        accountOwnership: {
          borrowerEntity: 'ABC Holdings LLC',
          guarantorName: 'Jose Garcia',
          accountOwners: ['Jose Garcia'],
          borrowerListed: false,
          guarantorListed: true,
          status: 'pass',
        },
        ownershipConfidence: { ocrolusScore: 72, threshold: 80, status: 'review' },
        multipleAccountHolders: { detectedOwners: ['Jose Garcia'], authorizedOwners: ['Jose Garcia'], unauthorizedOwners: [], status: 'pass' },
        spouseDetection: { spouseDetected: false, isGuarantor: false, status: 'pass' },
        statementCompleteness: { expectedPages: 4, detectedPages: 4, missingPages: [], status: 'pass' },
        statementRecency: { statementDate: '2024-11-30', daysSinceIssue: 22, maxAllowedDays: 45, status: 'pass' },
        addressValidation: { statementAddress: '789 Pine Street, Orlando, FL 32801', borrowerPrimaryResidence: '789 Pine Street, Orlando, FL 32801', addressMatch: true, matchScore: 100, status: 'pass' },
        subjectPropertyCrossCheck: { subjectPropertyAddress: '123 Main Street, Miami, FL 33101', borrowerResidence: '789 Pine Street, Orlando, FL 32801', addressesMatch: false, status: 'pass' },
        largeDepositDetection: { deposits: [{ date: '2024-11-10', amount: 15000, description: 'Transfer from Savings', source: 'Unknown', sourced: false }], totalLargeDeposits: 15000, allSourced: false, status: 'review' },
        depositSourceValidation: { knownIncomeSources: ['Salary'], alignedDeposits: 7000, unknownSourceDeposits: 15000, circularSources: false, status: 'review' },
        balanceMath: { beginningBalance: 45000, totalDeposits: 22000, totalWithdrawals: 15000, calculatedEnding: 52000, actualEnding: 52000, variance: 0, variancePercent: 0, status: 'pass' },
        cashFlowConsistency: { averageMonthlyDeposits: 18000, averageMonthlyWithdrawals: 14000, depositPatternNormal: false, withdrawalPatternNormal: true, spikesDetected: true, irregularPatterns: ['Large deposit spike on Nov 10'], status: 'review' },
        balanceInflation: { sameDayInflowOutflow: [], paddingDetected: false, status: 'pass' },
        circularTransfers: { suspiciousTransfers: [], selfFundingLoops: false, status: 'pass' },
        velocityAnomaly: { averageTransactionsPerDay: 2.5, peakTransactionsPerDay: 6, anomalyDates: [], abnormalActivity: false, status: 'pass' },
        thirdPartyFunding: { undisclosedSources: [], hasUndisclosedFunding: false, status: 'pass' },
        liquiditySufficiency: { availableFunds: 52000, cashToClose: 30000, requiredReserves: 12000, totalRequired: 42000, surplus: 10000, status: 'pass' },
        crossDocumentConsistency: { posDisclosedAssets: 55000, verifiedAssets: 52000, variance: 3000, discrepancies: [], status: 'pass' },
        finalDetermination: { totalChecks: 20, passedChecks: 16, failedChecks: 0, reviewChecks: 4, overallStatus: 'review' },
        processedAt: '2024-12-20T14:32:00Z',
        processedBy: 'AI Asset Validator v1.0 + Ocrolus API',
        overallStatus: 'review',
      },
    },
  ];

  // Get the active statement data
  const activeStatement = mockBankStatements.find(s => s.statementId === activeStatementId) || mockBankStatements[0];
  const data = activeStatement.verificationData;

  // Calculate aggregated stats across all statements
  const aggregatedStats = {
    totalAvailableFunds: mockBankStatements.reduce((sum, s) => sum + s.verificationData.liquiditySufficiency.availableFunds, 0),
    totalCashToClose: mockBankStatements.reduce((sum, s) => sum + s.verificationData.liquiditySufficiency.cashToClose, 0),
    totalSurplus: mockBankStatements.reduce((sum, s) => sum + s.verificationData.liquiditySufficiency.surplus, 0),
    totalChecks: mockBankStatements.reduce((sum, s) => sum + s.verificationData.finalDetermination.totalChecks, 0),
    passedChecks: mockBankStatements.reduce((sum, s) => sum + s.verificationData.finalDetermination.passedChecks, 0),
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

      {/* Summary Stats - Aggregated */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available Funds</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(aggregatedStats.totalAvailableFunds)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cash to Close</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(aggregatedStats.totalCashToClose)}</p>
              </div>
              <PiggyBank className="h-8 w-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Surplus/Deficit</p>
                <p className="text-2xl font-bold text-emerald-500">{formatCurrency(aggregatedStats.totalSurplus)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Checks Passed</p>
                <p className="text-2xl font-bold text-foreground">/{aggregatedStats.totalChecks}</p>
              </div>
              <Shield className="h-8 w-8 text-violet-500/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Section Tabs: Ocrolus Report & Bank Statements */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveSection('ocrolus')}
          className={cn(
            "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
            activeSection === 'ocrolus'
              ? "border-primary bg-background shadow-sm"
              : "border-border bg-card/50 hover:bg-card hover:border-muted-foreground/30"
          )}
        >
          <FileText className={cn(
            "h-5 w-5",
            activeSection === 'ocrolus' ? "text-primary" : "text-muted-foreground"
          )} />
          <span className={cn(
            "font-medium",
            activeSection === 'ocrolus' ? "text-foreground" : "text-muted-foreground"
          )}>Ocrolus Report</span>
          <Badge variant="secondary" className="text-xs">
            {data.apiAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </button>
        
        <button
          onClick={() => setActiveSection('statements')}
          className={cn(
            "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
            activeSection === 'statements'
              ? "border-primary bg-background shadow-sm"
              : "border-border bg-card/50 hover:bg-card hover:border-muted-foreground/30"
          )}
        >
          <FileCheck className={cn(
            "h-5 w-5",
            activeSection === 'statements' ? "text-primary" : "text-muted-foreground"
          )} />
          <span className={cn(
            "font-medium",
            activeSection === 'statements' ? "text-foreground" : "text-muted-foreground"
          )}>Bank Statements</span>
          <Badge variant="secondary" className="text-xs">
            {mockBankStatements.length} Statements
          </Badge>
        </button>
      </div>

      {/* Bank Statement Selector Cards */}
      {activeSection === 'statements' && (
        <div className="grid grid-cols-2 gap-4">
          {mockBankStatements.map((statement) => (
            <button
              key={statement.statementId}
              onClick={() => setActiveStatementId(statement.statementId)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                activeStatementId === statement.statementId
                  ? "border-primary bg-background shadow-sm"
                  : "border-border bg-card/50 hover:bg-card hover:border-muted-foreground/30"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-lg",
                activeStatementId === statement.statementId
                  ? "bg-primary/10"
                  : "bg-muted"
              )}>
                <Building2 className={cn(
                  "h-5 w-5",
                  activeStatementId === statement.statementId
                    ? "text-primary"
                    : "text-muted-foreground"
                )} />
              </div>
              <div>
                <p className={cn(
                  "font-medium",
                  activeStatementId === statement.statementId
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}>
                  {statement.accountHolderName}
                </p>
                <p className="text-sm text-muted-foreground">
                  .... {statement.maskedAccountNumber}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bank Statement Document Card */}
      {activeSection === 'statements' && (
        <Card className="bg-card/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Bank Statement Document</p>
                  <p className="text-sm text-muted-foreground">
                    {activeStatement.documentUrl 
                      ? `${activeStatement.bankName} - ${formatDate(activeStatement.verificationData.coreFields.statementDates.startDate)} to ${formatDate(activeStatement.verificationData.coreFields.statementDates.endDate)}`
                      : '- Not provided to Not provided'
                    }
                  </p>
                </div>
              </div>
              {activeStatement.documentUrl ? (
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Document
                </Button>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                  No Document Available
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ocrolus Overview Card */}
      {activeStatement.ocrolusData && (
        <OcrolusOverviewCard
          ocrolusData={activeStatement.ocrolusData}
          authenticityPass={activeStatement.authenticityPass}
          authenticityScore={activeStatement.authenticityScore}
          isExpanded={expandedCards.ocrolusOverview}
          onToggle={() => toggleCard('ocrolusOverview')}
        />
      )}

      {/* Fraud Documents Analysis Card */}
      {activeStatement.fraudAnalysis && activeStatement.fraudAnalysis.length > 0 && (
        <FraudDocumentsCard
          fraudAnalysis={activeStatement.fraudAnalysis}
          isExpanded={expandedCards.fraudDocuments}
          onToggle={() => toggleCard('fraudDocuments')}
        />
      )}

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
      <div className="grid grid-cols-2 gap-4 items-stretch">
        {/* Account Ownership Verification */}
        <Collapsible open={expandedCards.accountOwnership} onOpenChange={() => toggleCard('accountOwnership')} className="h-full">
          <Card className="h-full">
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
                    <p className="text-xs text-muted-foreground">Account Holder</p>
                    <p className="font-medium">{data.accountOwnership.accountOwners.join(', ')}</p>
                  </div>
                </div>
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
        <Collapsible open={expandedCards.ownershipConfidence} onOpenChange={() => toggleCard('ownershipConfidence')} className="h-full">
          <Card className="h-full">
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
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <Collapsible open={expandedCards.multipleHolders} onOpenChange={() => toggleCard('multipleHolders')} className="h-full">
          <Card className="h-full">
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

        <Collapsible open={expandedCards.spouseDetection} onOpenChange={() => toggleCard('spouseDetection')} className="h-full">
          <Card className="h-full">
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
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <Collapsible open={expandedCards.completeness} onOpenChange={() => toggleCard('completeness')} className="h-full">
          <Card className="h-full">
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

        <Collapsible open={expandedCards.recency} onOpenChange={() => toggleCard('recency')} className="h-full">
          <Card className="h-full">
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
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <Collapsible open={expandedCards.addressValidation} onOpenChange={() => toggleCard('addressValidation')} className="h-full">
          <Card className="h-full">
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

        <Collapsible open={expandedCards.subjectProperty} onOpenChange={() => toggleCard('subjectProperty')} className="h-full">
          <Card className="h-full">
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
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <Collapsible open={expandedCards.depositSources} onOpenChange={() => toggleCard('depositSources')} className="h-full">
          <Card className="h-full">
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

        <Collapsible open={expandedCards.balanceMath} onOpenChange={() => toggleCard('balanceMath')} className="h-full">
          <Card className="h-full">
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
            <span>AI Fraud & Manipulation Detection Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Fraud Pattern</TableHead>
                <TableHead>Detection Logic</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[140px]">Trigger Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Balance Padding */}
              <TableRow>
                <TableCell className="font-medium">Balance Padding</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Large deposit immediately withdrawn post-statement
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.balanceInflation.status)}
                    <span className={data.balanceInflation.paddingDetected ? 'text-amber-500' : 'text-emerald-500'}>
                      {data.balanceInflation.paddingDetected ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {data.balanceInflation.paddingDetected ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manual Review</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Auto-Pass</Badge>
                  )}
                </TableCell>
              </TableRow>

              {/* Temporary Parking */}
              <TableRow>
                <TableCell className="font-medium">Temporary Parking</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Funds appear only during statement window
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.balanceInflation.status)}
                    <span className={data.balanceInflation.sameDayInflowOutflow.length > 0 ? 'text-amber-500' : 'text-emerald-500'}>
                      {data.balanceInflation.sameDayInflowOutflow.length > 0 ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {data.balanceInflation.sameDayInflowOutflow.length > 0 ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manual Review</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Auto-Pass</Badge>
                  )}
                </TableCell>
              </TableRow>

              {/* Circular Transfers */}
              <TableRow>
                <TableCell className="font-medium">Circular Transfers</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Funds move between borrower-controlled accounts
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.circularTransfers.status)}
                    <span className={data.circularTransfers.selfFundingLoops ? 'text-amber-500' : 'text-emerald-500'}>
                      {data.circularTransfers.selfFundingLoops ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {data.circularTransfers.selfFundingLoops ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manual Review</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Auto-Pass</Badge>
                  )}
                </TableCell>
              </TableRow>

              {/* Velocity Spike */}
              <TableRow>
                <TableCell className="font-medium">Velocity Spike</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Transaction frequency deviates from baseline (Avg: {data.velocityAnomaly.averageTransactionsPerDay}/day, Peak: {data.velocityAnomaly.peakTransactionsPerDay}/day)
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.velocityAnomaly.status)}
                    <span className={data.velocityAnomaly.abnormalActivity ? 'text-amber-500' : 'text-emerald-500'}>
                      {data.velocityAnomaly.abnormalActivity ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {data.velocityAnomaly.abnormalActivity ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manual Review</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Auto-Pass</Badge>
                  )}
                </TableCell>
              </TableRow>

              {/* Third-Party Masking */}
              <TableRow>
                <TableCell className="font-medium">Third-Party Masking</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Funds routed through unrelated entities
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(data.thirdPartyFunding.status)}
                    <span className={data.thirdPartyFunding.hasUndisclosedFunding ? 'text-amber-500' : 'text-emerald-500'}>
                      {data.thirdPartyFunding.hasUndisclosedFunding ? 'Detected' : 'Clear'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {data.thirdPartyFunding.hasUndisclosedFunding ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manual Review</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Auto-Pass</Badge>
                  )}
                </TableCell>
              </TableRow>

              {/* Statement Tampering */}
              <TableRow>
                <TableCell className="font-medium">Statement Tampering</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  OCR detects altered formatting / inconsistencies (Confidence: {data.ocrConfidence?.toFixed(1)}%)
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon((data.ocrConfidence && data.ocrConfidence < 85) ? 'review' : 'pass')}
                    <span className={(data.ocrConfidence && data.ocrConfidence < 85) ? 'text-amber-500' : 'text-emerald-500'}>
                      {(data.ocrConfidence && data.ocrConfidence < 85) ? 'Suspected' : 'Clear'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {(data.ocrConfidence && data.ocrConfidence < 85) ? (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Manual Review</Badge>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Auto-Pass</Badge>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Liquidity & Cross-Document */}
      <div className="grid grid-cols-2 gap-4 items-stretch">
        <Collapsible open={expandedCards.liquidity} onOpenChange={() => toggleCard('liquidity')} className="h-full">
          <Card className="h-full">
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

        <Collapsible open={expandedCards.crossDocument} onOpenChange={() => toggleCard('crossDocument')} className="h-full">
          <Card className="h-full">
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
