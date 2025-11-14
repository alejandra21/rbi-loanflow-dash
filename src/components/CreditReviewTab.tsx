import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, Shield, AlertCircleIcon, CreditCard, AlertCircle } from "lucide-react";
import { useState } from "react";

interface CreditReviewTabProps {
  phase: any;
}

export const CreditReviewTab = ({ phase }: CreditReviewTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    creditPull: false,
    latePayment: false,
    creditUtilization: false,
    tlo: false,
    lexisNexis: false,
    flagDat: false,
    logs: false
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
      case "verified":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>;
      case "warn":
      case "pending":
      case "review":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Warning</Badge>;
      case "fail":
      case "critical":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Fail</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Mock data for Credit Pull & FICO
  const closingDate = "2025-11-15"; // Loan closing date
  
  const creditPullData = {
    borrower: {
      name: "John Doe",
      fico: 720,
      pullDate: "2025-11-01",
      bureau: "Experian",
      isForeignNational: false,
      ssn: "***-**-1234", // Last 4 digits
      ssnIssueDate: "1995-03-15", // SSN Issue Date
      dob: "1990-05-20", // Date of Birth
      apiStatus: "success", // success, failure, missing_authorization
      ownershipPercentage: 65 // % of ownership
    },
    coBorrower: {
      name: "Jane Smith",
      fico: 695,
      pullDate: "2025-11-01",
      bureau: "Experian",
      isForeignNational: true,
      ssn: null, // No SSN for foreign national
      ssnIssueDate: null,
      dob: "1988-08-12",
      apiStatus: "success",
      ownershipPercentage: 35 // % of ownership
    }
  };

  // Validation logic for Credit Pull
  const validateCreditPull = (borrowerData: typeof creditPullData.borrower | typeof creditPullData.coBorrower) => {
    // Check API status
    if (borrowerData.apiStatus === "failure" || borrowerData.apiStatus === "missing_authorization") {
      return { status: "fail", reason: "Underwriting/Credit Analyst review" };
    }

    // Check ownership percentage
    if (borrowerData.ownershipPercentage < 20) {
      return { status: "fail", reason: "Ownership percentage below 20% - Manual review" };
    }

    // Check SSN Issue Date < DOB (if both exist)
    if (borrowerData.ssnIssueDate && borrowerData.dob) {
      const ssnDate = new Date(borrowerData.ssnIssueDate);
      const dobDate = new Date(borrowerData.dob);
      if (ssnDate < dobDate) {
        return { status: "fail", reason: "SSN issue date before DOB - Manual review" };
      }
    }

    // Check credit report age (>90 days from closing date)
    const pullDate = new Date(borrowerData.pullDate);
    const closing = new Date(closingDate);
    const daysDiff = Math.floor((closing.getTime() - pullDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 90) {
      return { status: "fail", reason: "Credit report >90 days old - Manual review" };
    }

    return { status: "pass", reason: null };
  };

  const borrowerValidation = validateCreditPull(creditPullData.borrower);
  const coBorrowerValidation = validateCreditPull(creditPullData.coBorrower);
  
  // Overall status for the card
  const overallStatus = borrowerValidation.status === "fail" || coBorrowerValidation.status === "fail" ? "fail" : "pass";

  // Mock data for Late Payments
  const latePaymentData = {
    creditReport: "s3://bucket-name/credit-reports/LOAN123456/Credit_Report.pdf",
    evaluationPeriod: "24 months",
    payments: [
      { date: "2024-08-15", creditor: "Wells Fargo", daysLate: 30, amount: 450, severity: "minor" },
      { date: "2024-03-22", creditor: "Chase", daysLate: 15, amount: 220, severity: "minor" },
    ],
    summary: {
      late30Days: 1,
      late60Days: 0,
      late90Days: 0,
      late120Plus: 0
    }
  };

  // Determine late payment decision
  let latePaymentDecision: "pass" | "manual_credit_exception_60_90" | "manual_credit_severity_120" = "pass";
  
  if (latePaymentData.summary.late120Plus > 0) {
    latePaymentDecision = "manual_credit_severity_120";
  } else if (latePaymentData.summary.late60Days > 0 || latePaymentData.summary.late90Days > 0) {
    latePaymentDecision = "manual_credit_exception_60_90";
  } else {
    latePaymentDecision = "pass"; // 30-day or clean
  }

  // Mock data for Credit Utilization Analysis
  const creditUtilizationAnalysisData = {
    creditReport: "s3://bucket-name/credit-reports/LOAN123456/Credit_Report.pdf",
    revolvingUtilization: 45, // Percentage (0-100)
    isFrozen: false, // Set to true to simulate frozen credit report
  };

  // Mock data for TLO Review
  const tloData = {
    pdfReport: "s3://bucket-name/tlo-reports/LOAN123456/TLO_Report.pdf",
    reportDate: "2025-10-20",
    extracted: {
      fullName: "John Doe",
      last4SSN: "1234",
      dateOfBirth: "1985-06-15"
    },
    posData: {
      fullName: "John Doe",
      last4SSN: "1234",
      dateOfBirth: "1985-06-15"
    },
    validation: {
      nameMatch: true,
      ssnMatch: true,
      dobMatch: true,
      dobYearDiff: 0, // Years difference
      missingFields: [] as string[] // ["DOB", "SSN"] if any missing
    },
    identityVerificationStatus: "pass", // "pass" or "manual_validation_required"
    // Rule CR-24: Combined Background Result
    backgroundCheck: {
      liens: {
        active: false,
        satisfiedOrAged: false, // Satisfied or aged 120 months
        monthsSinceLatest: 130
      },
      judgments: {
        active: false,
        satisfiedOrAged: false,
        monthsSinceLatest: 125
      },
      bankruptcies: {
        active: false,
        satisfiedOrAged: false,
        monthsSinceLatest: 140
      },
      foreclosures: {
        withinLast36Months: false,
        monthsSinceLatest: 48
      },
      unclearDisposition: false
    }
  };

  // Calculate identity validation status
  const requiresIdentityManualValidation = 
    !tloData.validation.ssnMatch || 
    Math.abs(tloData.validation.dobYearDiff) > 1 ||
    tloData.validation.missingFields.length > 0;

  // Calculate Rule CR-24: Combined Background Result
  const hasActiveLiensJudgmentsBankruptcies = 
    tloData.backgroundCheck.liens.active ||
    tloData.backgroundCheck.judgments.active ||
    tloData.backgroundCheck.bankruptcies.active;

  const hasActiveWithin120Months = 
    (tloData.backgroundCheck.liens.monthsSinceLatest <= 120 && !tloData.backgroundCheck.liens.satisfiedOrAged) ||
    (tloData.backgroundCheck.judgments.monthsSinceLatest <= 120 && !tloData.backgroundCheck.judgments.satisfiedOrAged) ||
    (tloData.backgroundCheck.bankruptcies.monthsSinceLatest <= 120 && !tloData.backgroundCheck.bankruptcies.satisfiedOrAged);

  const hasSatisfiedOrAged = 
    tloData.backgroundCheck.liens.satisfiedOrAged ||
    tloData.backgroundCheck.judgments.satisfiedOrAged ||
    tloData.backgroundCheck.bankruptcies.satisfiedOrAged;

  const hasForeclosuresLast36 = tloData.backgroundCheck.foreclosures.withinLast36Months;

  // Determine background decision
  let backgroundDecision: "pass" | "manual_validation" | "non_pass" = "pass";
  
  // Fail Criteria: Any active or unresolved record 120 months AND foreclosures within last 36 months
  if ((hasActiveLiensJudgmentsBankruptcies || hasActiveWithin120Months) && hasForeclosuresLast36) {
    backgroundDecision = "non_pass";
  }
  // Manual Validation: Satisfied/aged 120 months OR identity mismatch OR unclear disposition, AND foreclosures within 36 months
  else if ((hasSatisfiedOrAged || requiresIdentityManualValidation || tloData.backgroundCheck.unclearDisposition) && hasForeclosuresLast36) {
    backgroundDecision = "manual_validation";
  }
  // Pass: No active liens, judgments, bankruptcies within 120 months OR foreclosures within 36 months
  else if (!hasActiveWithin120Months && !hasForeclosuresLast36) {
    backgroundDecision = "pass";
  }
  // Manual Validation for identity issues even without foreclosures
  else if (requiresIdentityManualValidation) {
    backgroundDecision = "manual_validation";
  }

  // Mock data for LexisNexis
  const lexisNexisData = {
    matchStatus: "clear", // "clear" or "match"
    exactNameMatch: false,
    mScore: 85, // M=100 means exact match
    reportDate: "2025-10-15",
    closeDate: "2025-11-10", // Loan close date for comparison
    status: "pass"
  };

  // Calculate if report is older than 60 days from close date
  const reportAge = Math.floor(
    (new Date(lexisNexisData.closeDate).getTime() - new Date(lexisNexisData.reportDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const isReportStale = reportAge > 60;

  // Mock data for FlagDat
  const flagDatData = {
    watchlistCheck: false, // false = no match, true = match found
    blacklistCheck: false, // false = no match, true = match found
    status: "pass",
    lastChecked: "2025-11-10"
  };

  // Mock logs data
  const logsData = [
    {
      timestamp: "2025-11-10 14:23:15",
      action: "Credit Pull Initiated",
      user: "System",
      status: "completed"
    },
    {
      timestamp: "2025-11-10 14:25:42",
      action: "TLO Verification",
      user: "System",
      status: "completed"
    },
    {
      timestamp: "2025-11-10 14:28:10",
      action: "LexisNexis Check",
      user: "System",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Credit Review</span>
          <StatusBadge status={phase.status} />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Section 1: Credit Pull & FICO */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('creditPull')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Credit Pull & FICO
              {getStatusBadge(overallStatus)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.creditPull ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.creditPull && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Borrower */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{creditPullData.borrower.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Ownership %</span>
                    <span className={`text-sm font-semibold ${creditPullData.borrower.ownershipPercentage < 20 ? 'text-destructive' : ''}`}>
                      {creditPullData.borrower.ownershipPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">FICO Score</span>
                    <span className="text-lg font-bold text-primary">
                      {creditPullData.borrower.isForeignNational && !creditPullData.borrower.ssn ? "N/A" : creditPullData.borrower.fico}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">DOB</span>
                    <span className="text-sm">{creditPullData.borrower.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Foreign National</span>
                    <span className="text-sm">{creditPullData.borrower.isForeignNational ? "Yes" : "No"}</span>
                  </div>
                  {creditPullData.borrower.ssn && (
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">SSN</span>
                      <span className="text-sm font-mono">{creditPullData.borrower.ssn}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Bureau</span>
                    <span className="text-sm">{creditPullData.borrower.bureau}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Pull Date</span>
                    <span className="text-sm">{creditPullData.borrower.pullDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    {getStatusBadge(borrowerValidation.status)}
                  </div>
                  {borrowerValidation.reason && (
                    <div className="p-2 bg-destructive/10 rounded-md">
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {borrowerValidation.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Co-Borrower */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{creditPullData.coBorrower.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Ownership %</span>
                    <span className={`text-sm font-semibold ${creditPullData.coBorrower.ownershipPercentage < 20 ? 'text-destructive' : ''}`}>
                      {creditPullData.coBorrower.ownershipPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">FICO Score</span>
                    <span className="text-lg font-bold text-primary">
                      {creditPullData.coBorrower.isForeignNational && !creditPullData.coBorrower.ssn ? "N/A" : creditPullData.coBorrower.fico}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">DOB</span>
                    <span className="text-sm">{creditPullData.coBorrower.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Foreign National</span>
                    <span className="text-sm">{creditPullData.coBorrower.isForeignNational ? "Yes" : "No"}</span>
                  </div>
                  {creditPullData.coBorrower.ssn && (
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">SSN</span>
                      <span className="text-sm font-mono">{creditPullData.coBorrower.ssn}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Bureau</span>
                    <span className="text-sm">{creditPullData.coBorrower.bureau}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Pull Date</span>
                    <span className="text-sm">{creditPullData.coBorrower.pullDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    {getStatusBadge(coBorrowerValidation.status)}
                  </div>
                  {coBorrowerValidation.reason && (
                    <div className="p-2 bg-destructive/10 rounded-md">
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {coBorrowerValidation.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 2: Credit Utilization Analysis (Revolving %) */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('creditUtilization')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Utilization Analysis
              {(() => {
                const utilization = creditUtilizationAnalysisData.revolvingUtilization;
                const isFrozen = creditUtilizationAnalysisData.isFrozen;
                if (utilization >= 70 || isFrozen) {
                  return getStatusBadge('fail');
                } else if (utilization >= 50 && utilization < 70) {
                  return getStatusBadge('warn');
                } else {
                  return getStatusBadge('pass');
                }
              })()}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.creditUtilization ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.creditUtilization && (
          <CardContent className="space-y-4">
            {/* PDF Report */}
            <div className="p-3 bg-muted/30 rounded flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Credit Report</p>
                <p className="text-sm font-medium">{creditUtilizationAnalysisData.creditReport}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>

            <Separator />

            {/* Utilization Display */}
            <div>
              <p className="text-sm font-semibold mb-3">Revolving Utilization</p>
              <div className="p-6 border rounded text-center space-y-3">
                <p className="text-5xl font-bold">
                  {creditUtilizationAnalysisData.isFrozen ? "Frozen" : `${creditUtilizationAnalysisData.revolvingUtilization}%`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {creditUtilizationAnalysisData.isFrozen ? "Credit Report Frozen" : "Current Revolving Credit Utilization"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Decision */}
            {(() => {
              const utilization = creditUtilizationAnalysisData.revolvingUtilization;
              const isFrozen = creditUtilizationAnalysisData.isFrozen;

              if (utilization >= 70 || isFrozen) {
                return (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                    <p className="text-sm font-medium text-destructive">🔴 Non-Pass: Manual Review by Underwriting/Credit Analyst</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isFrozen ? "Credit report is frozen" : `Utilization ≥70% (${utilization}%)`}
                    </p>
                  </div>
                );
              } else if (utilization >= 50 && utilization < 70) {
                return (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                    <p className="text-sm font-medium text-warning">⚠ Manual Review: High Utilization</p>
                    <p className="text-xs text-muted-foreground mt-1">Utilization 50-69% ({utilization}%)</p>
                  </div>
                );
              } else {
                return (
                  <div className="p-3 bg-success/10 border border-success/20 rounded">
                    <p className="text-sm font-medium text-success">✓ Pass</p>
                    <p className="text-xs text-muted-foreground mt-1">Utilization &lt;50% ({utilization}%)</p>
                  </div>
                );
              }
            })()}
          </CardContent>
        )}
      </Card>

      {/* Section 3: Late Payment History Evaluation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('latePayment')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              Late Payment History Evaluation
              {latePaymentDecision === "manual_credit_severity_120" ? getStatusBadge('fail') :
               latePaymentDecision === "manual_credit_exception_60_90" ? getStatusBadge('warn') :
               getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.latePayment ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.latePayment && (
          <CardContent className="space-y-4">
            {/* Credit Report */}
            <div className="p-3 bg-muted/30 rounded flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Credit Report</p>
                <p className="text-sm font-medium">Evaluation Period: {latePaymentData.evaluationPeriod}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>

            <Separator />

            {/* Summary Grid */}
            <div>
              <p className="text-sm font-semibold mb-3">Late Payment Summary (24 months)</p>
              <div className="grid grid-cols-3 gap-4">
                {/* Box 1: 30 days or clean - Pass */}
                <div className="p-4 border rounded space-y-2">
                  <p className="text-3xl font-bold text-center">{latePaymentData.summary.late30Days}</p>
                  <p className="text-xs text-muted-foreground text-center">30 days or clean</p>
                  <Badge variant="success" className="w-full justify-center">Pass</Badge>
                </div>

                {/* Box 2: 60-90 days - Manual Review */}
                <div className="p-4 border rounded space-y-2">
                  <p className="text-3xl font-bold text-center">{latePaymentData.summary.late60Days + latePaymentData.summary.late90Days}</p>
                  <p className="text-xs text-muted-foreground text-center">60-90 days</p>
                  <Badge variant="warning" className="w-full justify-center">Manual Review: CreditException_60_90</Badge>
                </div>

                {/* Box 3: 120+ days - Credit Severity */}
                <div className="p-4 border rounded space-y-2">
                  <p className="text-3xl font-bold text-center">{latePaymentData.summary.late120Plus}</p>
                  <p className="text-xs text-muted-foreground text-center">120+ days</p>
                  <Badge variant="destructive" className="w-full justify-center">CreditSeverity_120</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Decision */}
            {latePaymentDecision === "manual_credit_severity_120" ? (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">🔴 Manual Review Required: CreditSeverity_120</p>
                <p className="text-xs text-muted-foreground mt-1">120+ day late payments detected within 24 months</p>
              </div>
            ) : latePaymentDecision === "manual_credit_exception_60_90" ? (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                <p className="text-sm font-medium text-warning">⚠ Manual Review Required: CreditException_60_90</p>
                <p className="text-xs text-muted-foreground mt-1">60-90 day late payments detected within 24 months</p>
              </div>
            ) : (
              <div className="p-3 bg-success/10 border border-success/20 rounded">
                <p className="text-sm font-medium text-success">✓ Pass</p>
                <p className="text-xs text-muted-foreground mt-1">30-day late or clean payment history</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Section 4: TLO Review */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('tlo')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              TLO Review
              {backgroundDecision === "non_pass" ? getStatusBadge('fail') : 
               backgroundDecision === "manual_validation" ? getStatusBadge('warn') : 
               getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.tlo ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.tlo && (
          <CardContent className="space-y-4">
            {/* PDF Report */}
            <div className="p-3 bg-muted/30 rounded flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">TLO Report</p>
                <p className="text-sm font-medium">Report Date: {tloData.reportDate}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>

            <Separator />

            {/* Extracted Data vs POS Comparison */}
            <div>
              <p className="text-sm font-semibold mb-3">Identity Verification</p>
              <div className="space-y-3">
                {/* Full Name */}
                <div className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Full Name</span>
                    {tloData.validation.nameMatch ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Match
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Mismatch
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">TLO Report</p>
                      <p className="font-medium">{tloData.extracted.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">POS Data</p>
                      <p className="font-medium">{tloData.posData.fullName}</p>
                    </div>
                  </div>
                </div>

                {/* Last 4 SSN */}
                <div className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Last 4 SSN</span>
                    {tloData.validation.missingFields.includes("SSN") ? (
                      <Badge variant="destructive">Missing</Badge>
                    ) : tloData.validation.ssnMatch ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Match
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Mismatch
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">TLO Report</p>
                      <p className="font-medium">***-**-{tloData.extracted.last4SSN}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">POS Data</p>
                      <p className="font-medium">***-**-{tloData.posData.last4SSN}</p>
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Date of Birth</span>
                    {tloData.validation.missingFields.includes("DOB") ? (
                      <Badge variant="destructive">Missing</Badge>
                    ) : Math.abs(tloData.validation.dobYearDiff) > 1 ? (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Mismatch ({tloData.validation.dobYearDiff > 0 ? '+' : ''}{tloData.validation.dobYearDiff} years)
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Match
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">TLO Report</p>
                      <p className="font-medium">{tloData.extracted.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">POS Data</p>
                      <p className="font-medium">{tloData.posData.dateOfBirth}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Verification Status */}
            <div>
              <p className="text-sm font-semibold mb-2">Identity Verification Status</p>
              {requiresIdentityManualValidation ? (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded space-y-2">
                  <p className="text-sm font-medium text-destructive">⚠ Manual Validation Required - Identity Mismatch</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {!tloData.validation.ssnMatch && <p>• SSN mismatch detected</p>}
                    {Math.abs(tloData.validation.dobYearDiff) > 1 && <p>• DOB mismatch {">"}1 year ({tloData.validation.dobYearDiff > 0 ? '+' : ''}{tloData.validation.dobYearDiff} years)</p>}
                    {tloData.validation.missingFields.map((field, idx) => (
                      <p key={idx}>• Missing {field} field</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Pass - All identity data verified</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Combined Background Result */}
            <div>
              <p className="text-sm font-semibold mb-3">Combined Background Result</p>
              
              {/* Background Checks */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">Liens</p>
                    <p className="text-xs text-muted-foreground">
                      {tloData.backgroundCheck.liens.active ? 'Active' : 
                       tloData.backgroundCheck.liens.satisfiedOrAged ? 'Satisfied/Aged 120+ months' :
                       `Last: ${tloData.backgroundCheck.liens.monthsSinceLatest} months ago`}
                    </p>
                  </div>
                  {tloData.backgroundCheck.liens.active ? (
                    <Badge variant="destructive">Active</Badge>
                  ) : tloData.backgroundCheck.liens.monthsSinceLatest > 120 ? (
                    <Badge variant="success">Clear</Badge>
                  ) : (
                    <Badge variant="warning">Review</Badge>
                  )}
                </div>

                <div className="flex justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">Judgments</p>
                    <p className="text-xs text-muted-foreground">
                      {tloData.backgroundCheck.judgments.active ? 'Active' : 
                       tloData.backgroundCheck.judgments.satisfiedOrAged ? 'Satisfied/Aged 120+ months' :
                       `Last: ${tloData.backgroundCheck.judgments.monthsSinceLatest} months ago`}
                    </p>
                  </div>
                  {tloData.backgroundCheck.judgments.active ? (
                    <Badge variant="destructive">Active</Badge>
                  ) : tloData.backgroundCheck.judgments.monthsSinceLatest > 120 ? (
                    <Badge variant="success">Clear</Badge>
                  ) : (
                    <Badge variant="warning">Review</Badge>
                  )}
                </div>

                <div className="flex justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">Bankruptcies</p>
                    <p className="text-xs text-muted-foreground">
                      {tloData.backgroundCheck.bankruptcies.active ? 'Active' : 
                       tloData.backgroundCheck.bankruptcies.satisfiedOrAged ? 'Satisfied/Aged 120+ months' :
                       `Last: ${tloData.backgroundCheck.bankruptcies.monthsSinceLatest} months ago`}
                    </p>
                  </div>
                  {tloData.backgroundCheck.bankruptcies.active ? (
                    <Badge variant="destructive">Active</Badge>
                  ) : tloData.backgroundCheck.bankruptcies.monthsSinceLatest > 120 ? (
                    <Badge variant="success">Clear</Badge>
                  ) : (
                    <Badge variant="warning">Review</Badge>
                  )}
                </div>

                <div className="flex justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-medium">Foreclosures</p>
                    <p className="text-xs text-muted-foreground">
                      Last: {tloData.backgroundCheck.foreclosures.monthsSinceLatest} months ago
                    </p>
                  </div>
                  {tloData.backgroundCheck.foreclosures.withinLast36Months ? (
                    <Badge variant="destructive">Within 36 months</Badge>
                  ) : (
                    <Badge variant="success">Clear</Badge>
                  )}
                </div>
              </div>

              {/* Background Decision */}
              {backgroundDecision === "non_pass" ? (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded space-y-2">
                  <p className="text-sm font-medium text-destructive">🔴 Non-Pass with Validation</p>
                  <p className="text-xs text-muted-foreground">
                    Any active or unresolved record within 120 months AND foreclosures within the last 36 months
                  </p>
                  <p className="text-xs font-medium">→ File declined automatically. Routed to Manual Validation</p>
                </div>
              ) : backgroundDecision === "manual_validation" ? (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded space-y-2">
                  <p className="text-sm font-medium text-warning">⚠ Manual Validation Required</p>
                  <p className="text-xs text-muted-foreground">
                    {hasSatisfiedOrAged && "Satisfied or aged 120 months"}
                    {requiresIdentityManualValidation && " • Identity mismatch"}
                    {tloData.backgroundCheck.unclearDisposition && " • Unclear disposition"}
                    {hasForeclosuresLast36 && " • Foreclosures within last 36 months"}
                  </p>
                  <p className="text-xs font-medium">→ Assigned to Underwriter review queue</p>
                </div>
              ) : (
                <div className="p-3 bg-success/10 border border-success/20 rounded space-y-2">
                  <p className="text-sm font-medium text-success">✓ Pass</p>
                  <p className="text-xs text-muted-foreground">
                    No active liens, judgments, bankruptcies within last 120 months. No foreclosures within the last 36 months
                  </p>
                  <p className="text-xs font-medium">→ Continue to Step 4 (Non-Owner Occupancy Verification)</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 5: LexisNexis */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('lexisNexis')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              LexisNexis
              {lexisNexisData.matchStatus === "match" || isReportStale ? getStatusBadge('fail') : getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.lexisNexis ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.lexisNexis && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Match Status</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {lexisNexisData.matchStatus === "match" ? "Match/Hit" : "Clear"}
                  </p>
                  {lexisNexisData.matchStatus === "match" ? (
                    <Badge variant="destructive">Match Found</Badge>
                  ) : (
                    <Badge variant="success">Clear</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">M Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{lexisNexisData.mScore}</p>
                  {lexisNexisData.mScore === 100 && lexisNexisData.exactNameMatch && (
                    <Badge variant="destructive">Exact Match</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="text-sm font-medium">{lexisNexisData.reportDate}</p>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Report Age</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{reportAge} days</p>
                  {isReportStale && (
                    <Badge variant="destructive">Stale</Badge>
                  )}
                </div>
              </div>
            </div>

            {(lexisNexisData.matchStatus === "match" && lexisNexisData.exactNameMatch && lexisNexisData.mScore === 100) ? (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">⚠ Exact Name Match (M=100) - Manual Review: KYC required</p>
              </div>
            ) : isReportStale ? (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">🔴 Report is {">"}60 days old - Manual Review required</p>
              </div>
            ) : (
              <div className="p-3 bg-success/10 border border-success/20 rounded">
                <p className="text-sm font-medium text-success">✓ Clear - Continue workflow</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Section 6: FlagDat */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('flagDat')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              FlagDat
              {getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.flagDat ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.flagDat && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">WatchList Check</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {flagDatData.watchlistCheck ? "True" : "False"}
                  </p>
                  {flagDatData.watchlistCheck ? (
                    <Badge variant="destructive">Match Found</Badge>
                  ) : (
                    <Badge variant="success">No Match</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">BlackList Check</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {flagDatData.blacklistCheck ? "True" : "False"}
                  </p>
                  {flagDatData.blacklistCheck ? (
                    <Badge variant="destructive">Match Found</Badge>
                  ) : (
                    <Badge variant="success">No Match</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Last Checked</p>
                <p className="text-sm font-medium">{flagDatData.lastChecked}</p>
              </div>
            </div>
            {(flagDatData.watchlistCheck || flagDatData.blacklistCheck) ? (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">⚠ Match found - Manual Review by Underwriting/Credit Analyst required</p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded">
                <p className="text-sm font-medium text-success">✓ No match - Continue workflow</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Section 7: Logs */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('logs')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.logs ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.logs && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsData.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="success">{log.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
