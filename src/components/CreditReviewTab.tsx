import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, Shield, AlertCircleIcon, CreditCard, AlertCircle, ArrowRight, Info } from "lucide-react";
import { useState } from "react";
interface CreditReviewTabProps {
  phase: any;
}
export const CreditReviewTab = ({
  phase
}: CreditReviewTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    creditReviewSummary: true,
    creditPull: false,
    latePayment: false,
    creditUtilization: false,
    tlo: false,
    lexisNexis: false,
    flagDat: false,
    logs: false,
    matrixSnapshot: false
  });
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  const toggleLog = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };
  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      'Platinum': 'bg-gradient-to-r from-slate-400 to-slate-600 text-white',
      'Gold': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'Silver': 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      'Bronze': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    };
    return colors[tier] || 'bg-muted';
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
  const companyTier = "Gold"; // Company tier
  const ltc = 75; // Loan to Cost
  const ltv = 68; // Loan to Value
  const loanLimit = 500000; // Loan Limit
  const productMin = 680; // Product Minimum FICO Score requirement
  const loanProgram = "DSCR"; // Loan Program
  const verifiedProjects = 3; // Verified Projects count

  // Tier change tracking
  const tierChanged = true; // Whether tier was forced to change
  const previousTier = "Silver"; // Previous tier before change
  const tierChangeReason = "LTV ratio exceeded threshold for Silver tier. Required upgrade to Gold tier to meet product guidelines."; // Reason for tier change

  const creditPullData = {
    borrower: {
      name: "John Doe",
      fico: 720,
      pullDate: "2025-11-01",
      bureau: "Experian",
      isForeignNational: false,
      ssn: "***-**-1234",
      // Last 4 digits
      ssnIssueDate: "1995-03-15",
      // SSN Issue Date
      dob: "1990-05-20",
      // Date of Birth
      apiStatus: "success",
      // success, failure, missing_authorization
      ownershipPercentage: 65,
      // % of ownership
      utilization: 35 // Credit utilization percentage
    },
    coBorrower: {
      name: "Jane Smith",
      fico: 695,
      pullDate: "2025-11-01",
      bureau: "Experian",
      isForeignNational: true,
      ssn: null,
      // No SSN for foreign national
      ssnIssueDate: null,
      dob: "1988-08-12",
      apiStatus: "success",
      ownershipPercentage: 35,
      // % of ownership
      utilization: 42 // Credit utilization percentage
    }
  };

  // Get all guarantors
  const guarantors = [creditPullData.borrower, creditPullData.coBorrower];
  const numGuarantors = guarantors.length;
  const lowestFICO = Math.min(...guarantors.map(g => g.isForeignNational && !g.ssn ? Infinity : g.fico).filter(f => f !== Infinity));

  // Validation: Product Min vs Lowest FICO Score
  const ficoMeetsProductMin = lowestFICO >= productMin;
  const ficoDifference = lowestFICO - productMin;

  // Validation logic for Credit Pull
  const validateCreditPull = (borrowerData: typeof creditPullData.borrower | typeof creditPullData.coBorrower) => {
    // Check API status
    if (borrowerData.apiStatus === "failure" || borrowerData.apiStatus === "missing_authorization") {
      return {
        status: "fail",
        reason: "Underwriting/Credit Analyst review"
      };
    }

    // Check ownership percentage
    if (borrowerData.ownershipPercentage < 20) {
      return {
        status: "fail",
        reason: "Ownership percentage below 20% - Manual review"
      };
    }

    // Check SSN Issue Date < DOB (if both exist)
    if (borrowerData.ssnIssueDate && borrowerData.dob) {
      const ssnDate = new Date(borrowerData.ssnIssueDate);
      const dobDate = new Date(borrowerData.dob);
      if (ssnDate < dobDate) {
        return {
          status: "fail",
          reason: "SSN issue date before DOB - Manual review"
        };
      }
    }

    // Check credit report age (>90 days from closing date)
    const pullDate = new Date(borrowerData.pullDate);
    const closing = new Date(closingDate);
    const daysDiff = Math.floor((closing.getTime() - pullDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 90) {
      return {
        status: "fail",
        reason: "Credit report >90 days old - Manual review"
      };
    }

    // Check utilization
    if (borrowerData.utilization > 75) {
      return {
        status: "fail",
        reason: "Utilization exceeds 75% - Manual review"
      };
    }
    return {
      status: "pass",
      reason: null
    };
  };
  const borrowerValidation = validateCreditPull(creditPullData.borrower);
  const coBorrowerValidation = validateCreditPull(creditPullData.coBorrower);

  // Overall status for the card
  const overallStatus = borrowerValidation.status === "fail" || coBorrowerValidation.status === "fail" ? "fail" : "pass";

  // Mock data for Late Payments - by guarantor
  const latePaymentData = {
    borrower: {
      name: "John Doe",
      creditReport: "s3://bucket-name/credit-reports/LOAN123456/John_Doe_Credit_Report.pdf",
      evaluationPeriod: "24 months",
      payments: [{
        date: "2024-08-15",
        creditor: "Wells Fargo",
        daysLate: 30,
        amount: 450,
        severity: "minor"
      }, {
        date: "2024-03-22",
        creditor: "Chase",
        daysLate: 15,
        amount: 220,
        severity: "minor"
      }],
      summary: {
        late30Days: 1,
        late60Days: 0,
        late90Days: 0,
        late120Plus: 0
      }
    },
    coBorrower: {
      name: "Jane Smith",
      creditReport: "s3://bucket-name/credit-reports/LOAN123456/Jane_Smith_Credit_Report.pdf",
      evaluationPeriod: "24 months",
      payments: [{
        date: "2024-06-10",
        creditor: "Bank of America",
        daysLate: 60,
        amount: 800,
        severity: "moderate"
      }],
      summary: {
        late30Days: 0,
        late60Days: 1,
        late90Days: 0,
        late120Plus: 0
      }
    }
  };

  // Determine late payment decision per guarantor
  const evaluateLatePayments = (summary: typeof latePaymentData.borrower.summary): "pass" | "manual_credit_exception_60_90" | "manual_credit_severity_120" => {
    if (summary.late120Plus > 0) {
      return "manual_credit_severity_120";
    } else if (summary.late60Days > 0 || summary.late90Days > 0) {
      return "manual_credit_exception_60_90";
    } else {
      return "pass"; // 30-day or clean
    }
  };
  const borrowerLatePaymentDecision = evaluateLatePayments(latePaymentData.borrower.summary);
  const coBorrowerLatePaymentDecision = evaluateLatePayments(latePaymentData.coBorrower.summary);

  // Mock data for Credit Utilization Analysis
  const creditUtilizationAnalysisData = {
    creditReport: "s3://bucket-name/credit-reports/LOAN123456/Credit_Report.pdf",
    revolvingUtilization: 45,
    // Percentage (0-100)
    isFrozen: false // Set to true to simulate frozen credit report
  };

  // Mock data for TLO Review - By Guarantor
  const tloData = {
    borrower: {
      name: "John Doe",
      pdfReport: "s3://bucket-name/tlo-reports/LOAN123456/TLO_Report_Borrower.pdf",
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
        dobYearDiff: 0,
        missingFields: [] as string[]
      },
      backgroundCheck: {
        liens: {
          active: false,
          satisfiedOrAged: false,
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
    },
    coBorrower: {
      name: "Jane Smith",
      pdfReport: "s3://bucket-name/tlo-reports/LOAN123456/TLO_Report_CoBorrower.pdf",
      reportDate: "2025-10-20",
      extracted: {
        fullName: "Jane Smith",
        last4SSN: "5678",
        dateOfBirth: "1988-08-12"
      },
      posData: {
        fullName: "Jane Smith",
        last4SSN: "5678",
        dateOfBirth: "1988-08-12"
      },
      validation: {
        nameMatch: true,
        ssnMatch: true,
        dobMatch: true,
        dobYearDiff: 0,
        missingFields: [] as string[]
      },
      backgroundCheck: {
        liens: {
          active: false,
          satisfiedOrAged: false,
          monthsSinceLatest: 135
        },
        judgments: {
          active: false,
          satisfiedOrAged: false,
          monthsSinceLatest: 130
        },
        bankruptcies: {
          active: false,
          satisfiedOrAged: false,
          monthsSinceLatest: 145
        },
        foreclosures: {
          withinLast36Months: false,
          monthsSinceLatest: 50
        },
        unclearDisposition: false
      }
    }
  };

  // Calculate TLO decisions for each guarantor
  const calculateTLODecision = (guarantorData: typeof tloData.borrower) => {
    const requiresIdentityManualValidation = !guarantorData.validation.ssnMatch || Math.abs(guarantorData.validation.dobYearDiff) > 1 || guarantorData.validation.missingFields.length > 0;
    const hasActiveLiensJudgmentsBankruptcies = guarantorData.backgroundCheck.liens.active || guarantorData.backgroundCheck.judgments.active || guarantorData.backgroundCheck.bankruptcies.active;
    const hasActiveWithin120Months = guarantorData.backgroundCheck.liens.monthsSinceLatest <= 120 && !guarantorData.backgroundCheck.liens.satisfiedOrAged || guarantorData.backgroundCheck.judgments.monthsSinceLatest <= 120 && !guarantorData.backgroundCheck.judgments.satisfiedOrAged || guarantorData.backgroundCheck.bankruptcies.monthsSinceLatest <= 120 && !guarantorData.backgroundCheck.bankruptcies.satisfiedOrAged;
    const hasSatisfiedOrAged = guarantorData.backgroundCheck.liens.satisfiedOrAged || guarantorData.backgroundCheck.judgments.satisfiedOrAged || guarantorData.backgroundCheck.bankruptcies.satisfiedOrAged;
    const hasForeclosuresLast36 = guarantorData.backgroundCheck.foreclosures.withinLast36Months;
    let decision: "pass" | "manual_validation" | "non_pass" = "pass";
    if ((hasActiveLiensJudgmentsBankruptcies || hasActiveWithin120Months) && hasForeclosuresLast36) {
      decision = "non_pass";
    } else if ((hasSatisfiedOrAged || requiresIdentityManualValidation || guarantorData.backgroundCheck.unclearDisposition) && hasForeclosuresLast36) {
      decision = "manual_validation";
    } else if (!hasActiveWithin120Months && !hasForeclosuresLast36) {
      decision = "pass";
    } else if (requiresIdentityManualValidation) {
      decision = "manual_validation";
    }
    return {
      decision,
      requiresIdentityManualValidation
    };
  };
  const borrowerTLOResult = calculateTLODecision(tloData.borrower);
  const coBorrowerTLOResult = calculateTLODecision(tloData.coBorrower);

  // Overall TLO decision (worst case)
  const overallTLODecision = borrowerTLOResult.decision === "non_pass" || coBorrowerTLOResult.decision === "non_pass" ? "non_pass" : borrowerTLOResult.decision === "manual_validation" || coBorrowerTLOResult.decision === "manual_validation" ? "manual_validation" : "pass";

  // Mock data for LexisNexis - By Guarantor
  const lexisNexisData = {
    borrower: {
      name: "John Doe",
      matchStatus: "match",
      // "clear" or "match"
      matchedEntities: [{
        name: "John Doe",
        matchScore: 95,
        type: "Exact Name Match",
        risk: "Low"
      }, {
        name: "Jonathan Doe",
        matchScore: 78,
        type: "Similar Name Match",
        risk: "Medium"
      }],
      reportDate: "2025-10-15",
      closeDate: "2025-11-10"
    },
    coBorrower: {
      name: "Jane Smith",
      matchStatus: "clear",
      // "clear" or "match"
      matchedEntities: [],
      reportDate: "2025-10-16",
      closeDate: "2025-11-10"
    }
  };

  // Calculate if reports are older than 60 days from close date
  const borrowerReportAge = Math.floor((new Date(lexisNexisData.borrower.closeDate).getTime() - new Date(lexisNexisData.borrower.reportDate).getTime()) / (1000 * 60 * 60 * 24));
  const coBorrowerReportAge = Math.floor((new Date(lexisNexisData.coBorrower.closeDate).getTime() - new Date(lexisNexisData.coBorrower.reportDate).getTime()) / (1000 * 60 * 60 * 24));
  const isBorrowerReportStale = borrowerReportAge > 60;
  const isCoBorrowerReportStale = coBorrowerReportAge > 60;
  const isAnyReportStale = isBorrowerReportStale || isCoBorrowerReportStale;
  const hasAnyMatch = lexisNexisData.borrower.matchStatus === "match" || lexisNexisData.coBorrower.matchStatus === "match";

  // Mock data for FlagDat - By Guarantor
  const flagDatData = {
    borrower: {
      name: "John Doe",
      watchlistMatches: 2,
      blacklistMatches: 0,
      lastChecked: "2025-11-10"
    },
    coBorrower: {
      name: "Jane Smith",
      watchlistMatches: 0,
      blacklistMatches: 0,
      lastChecked: "2025-11-10"
    }
  };
  const totalWatchlistMatches = flagDatData.borrower.watchlistMatches + flagDatData.coBorrower.watchlistMatches;
  const totalBlacklistMatches = flagDatData.borrower.blacklistMatches + flagDatData.coBorrower.blacklistMatches;
  const hasAnyFlagDatMatches = totalWatchlistMatches > 0 || totalBlacklistMatches > 0;

  // Mock logs data
  const logsData = [{
    id: "log-001",
    tag: "credit_pull",
    timestamp: "2025-11-10 14:23:15",
    description: "Credit Pull Initiated",
    action: "Credit Pull Initiated",
    user: "System",
    status: "completed",
    exceptionTag: "credit_api",
    exceptionType: null,
    jsonData: {
      borrower: "John Doe",
      bureau: "Experian",
      fico_score: 720,
      pull_date: "2025-11-01"
    }
  }, {
    id: "log-002",
    tag: "tlo",
    timestamp: "2025-11-10 14:25:42",
    description: "TLO Verification",
    action: "TLO Verification",
    user: "System",
    status: "completed",
    exceptionTag: "identity_verification",
    exceptionType: null,
    jsonData: {
      ssn_match: true,
      dob_match: true,
      address_verified: true,
      confidence: 95
    }
  }, {
    id: "log-003",
    tag: "lexisnexis",
    timestamp: "2025-11-10 14:28:10",
    description: "LexisNexis Check",
    action: "LexisNexis Check",
    user: "System",
    status: "completed",
    exceptionTag: "watchlist_screening",
    exceptionType: null,
    jsonData: {
      match_status: "clear",
      m_score: 85,
      report_date: "2025-10-15"
    }
  }];
  return <div className="space-y-4">
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

      {/* Summary Section */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('creditReviewSummary')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Credit Review Summary
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.creditReviewSummary ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.creditReviewSummary && <CardContent className="space-y-6">
          {/* Section 1: Borrower & Program */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Borrower & Program</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Number of Guarantors</p>
                <p className="text-lg font-bold">{numGuarantors}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Company Tier</p>
                <Badge className={`${getTierColor(companyTier)} text-sm font-semibold px-3 py-1`}>
                  {companyTier}
                </Badge>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Loan Program</p>
                <p className="text-lg font-bold">{loanProgram}</p>
              </div>
              {tierChanged && <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Tier Change</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{tierChangeReason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getTierColor(previousTier)} text-xs font-semibold px-2 py-1`}>
                    {previousTier}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge className={`${getTierColor(companyTier)} text-xs font-semibold px-2 py-1`}>
                    {companyTier}
                  </Badge>
                </div>
              </div>}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Section 2: Creditworthiness */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Creditworthiness</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Lowest Middle FICO</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {ficoMeetsProductMin ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-amber-500" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {ficoMeetsProductMin 
                            ? `FICO ${lowestFICO} meets minimum requirement of ${productMin}`
                            : `FICO ${lowestFICO} below minimum requirement of ${productMin}`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-lg font-bold text-primary">{lowestFICO}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Product Min FICO</p>
                <p className="text-lg font-bold">{productMin}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Verified Projects</p>
                <p className="text-lg font-bold">{verifiedProjects}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Lowest FICO {'>'} Product Min</p>
                <div className="flex items-center gap-2 mt-2">
                  {ficoMeetsProductMin ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Pass
                    </Badge> : <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" /> Fail
                    </Badge>}
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Section 3: Exposure Eligibility */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Exposure Eligibility</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">LTC</p>
                <p className="text-lg font-bold">{ltc}%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">LTV</p>
                <p className="text-lg font-bold">{ltv}%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Loan Limit</p>
                <p className="text-lg font-bold">${loanLimit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Matrix Snapshot Panel */}
          <Collapsible
            open={expandedCards.matrixSnapshot}
            onOpenChange={() => toggleCard('matrixSnapshot')}
          >
            <div className="space-y-3">
              <CollapsibleTrigger className="flex items-center gap-2 w-full">
                <h3 className="text-sm font-semibold text-muted-foreground">Matrix Snapshot</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.matrixSnapshot ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="rounded-lg overflow-hidden border border-border">
                  {/* Header with dark background */}
                  <div className="bg-slate-700 text-white px-4 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide">Borrower Funded Loan – 3–5 Projects, FICO 660+</p>
                  </div>
                  
                  {/* Table */}
                  <Table>
                    <TableHeader className="bg-slate-800">
                      <TableRow className="border-slate-700 hover:bg-slate-800">
                        <TableHead className="text-white text-xs font-semibold h-10">PROGRAM</TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">
                          <div className="flex items-center gap-1">
                            MIN PROJECTS
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Minimum verified projects required</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">
                          <div className="flex items-center gap-1">
                            MAX PROJECTS
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Maximum verified projects in range</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">MIN FICO</TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">MAX FICO</TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">LTC OR LTP</TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">ARLTV NJC</TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">ARLTV JD</TableHead>
                        <TableHead className="text-white text-xs font-semibold h-10">MAX LOAN AMOUNT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-slate-900">
                      <TableRow className="border-slate-700 hover:bg-slate-800/50">
                        <TableCell className="text-white font-medium">{loanProgram}</TableCell>
                        <TableCell className="text-white">{verifiedProjects}</TableCell>
                        <TableCell className="text-white">5</TableCell>
                        <TableCell className="text-white">{productMin}</TableCell>
                        <TableCell className="text-white">699</TableCell>
                        <TableCell className="text-white">{ltc.toFixed(2)}</TableCell>
                        <TableCell className="text-white">{ltv.toFixed(2)}</TableCell>
                        <TableCell className="text-white">{ltv.toFixed(2)}</TableCell>
                        <TableCell className="text-white">${loanLimit.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </CardContent>}
      </Card>

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
        {expandedCards.creditPull && <CardContent className="space-y-4">
            {guarantors.map((guarantor, index) => <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{guarantor.name}</h4>
                  <Badge variant="outline">{guarantor.ownershipPercentage}% ownership</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">Middle FICO Score</p>
                    <p className="font-medium text-sm flex items-center">
                      {guarantor.isForeignNational && !guarantor.ssn ? "N/A" : guarantor.fico}
                      <CreditCard className="h-4 w-4 ml-1" />
                    </p>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">Bureau</p>
                    <p className="font-medium text-sm">{guarantor.bureau}</p>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium text-sm ${guarantor.utilization > 75 ? 'text-destructive' : ''}`}>
                        {guarantor.utilization}%
                      </p>
                      {guarantor.utilization > 75 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">DOB</p>
                    <p className="font-medium text-sm">{guarantor.dob}</p>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">DOB vs SSN Issued</p>
                    {guarantor.ssnIssueDate && guarantor.dob ? <div className="flex items-center space-x-2">
                        <p className={`font-medium text-sm ${new Date(guarantor.ssnIssueDate) < new Date(guarantor.dob) ? 'text-destructive' : 'text-success'}`}>
                          {new Date(guarantor.ssnIssueDate) < new Date(guarantor.dob) ? 'Invalid' : 'Valid'}
                        </p>
                        {new Date(guarantor.ssnIssueDate) < new Date(guarantor.dob) ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-success" />}
                      </div> : <p className="font-medium text-sm">N/A</p>}
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">Foreign National</p>
                    <p className="font-medium text-sm">{guarantor.isForeignNational ? "Yes" : "No"}</p>
                  </div>
                  
                  {guarantor.ssnIssueDate && <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">SSN Issued Date</p>
                      <p className="font-medium text-sm">{guarantor.ssnIssueDate}</p>
                    </div>}
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">Pull Date</p>
                    <p className="font-medium text-sm">{guarantor.pullDate}</p>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded space-y-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    {getStatusBadge(validateCreditPull(guarantor).status)}
                  </div>
                </div>
                
                {validateCreditPull(guarantor).reason && <div className="p-3 bg-destructive/10 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <p className="text-sm text-destructive">{validateCreditPull(guarantor).reason}</p>
                  </div>}
              </div>)}
          </CardContent>}
      </Card>


      {/* Section 3: Late Payment History Evaluation - By Guarantor */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('latePayment')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              Late Payment History Evaluation
              {borrowerLatePaymentDecision === "manual_credit_severity_120" || coBorrowerLatePaymentDecision === "manual_credit_severity_120" ? getStatusBadge('fail') : borrowerLatePaymentDecision === "manual_credit_exception_60_90" || coBorrowerLatePaymentDecision === "manual_credit_exception_60_90" ? getStatusBadge('review') : getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.latePayment ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.latePayment && <CardContent className="space-y-4">
            {/* Borrower Late Payments */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{latePaymentData.borrower.name}</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/20 rounded space-y-2">
                  <p className="text-2xl font-bold text-center">{latePaymentData.borrower.summary.late30Days}</p>
                  <p className="text-xs text-muted-foreground text-center">30 days or clean</p>
                  <Badge variant="success" className="w-full justify-center">Pass</Badge>
                </div>
                <div className="p-3 bg-muted/20 rounded space-y-2">
                  <p className="text-2xl font-bold text-center">{latePaymentData.borrower.summary.late60Days + latePaymentData.borrower.summary.late90Days}</p>
                  <p className="text-xs text-muted-foreground text-center">60-90 days</p>
                  <Badge variant="warning" className="w-full justify-center">Manual Review</Badge>
                </div>
                <div className="p-3 bg-muted/20 rounded space-y-2">
                  <p className="text-2xl font-bold text-center">{latePaymentData.borrower.summary.late120Plus}</p>
                  <p className="text-xs text-muted-foreground text-center">120+ days</p>
                  <Badge variant="destructive" className="w-full justify-center">Severity</Badge>
                </div>
              </div>

              {borrowerLatePaymentDecision === "manual_credit_severity_120" && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">🔴 Manual Review Required: CreditSeverity_120</p>
                </div>}
              {borrowerLatePaymentDecision === "manual_credit_exception_60_90" && <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                  <p className="text-sm font-medium text-warning">⚠ Manual Review Required: CreditException_60_90</p>
                </div>}
              {borrowerLatePaymentDecision === "pass" && <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Pass - Continue workflow</p>
                </div>}
            </div>

            {/* Co-Borrower Late Payments */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{latePaymentData.coBorrower.name}</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/20 rounded space-y-2">
                  <p className="text-2xl font-bold text-center">{latePaymentData.coBorrower.summary.late30Days}</p>
                  <p className="text-xs text-muted-foreground text-center">30 days or clean</p>
                  <Badge variant="success" className="w-full justify-center">Pass</Badge>
                </div>
                <div className="p-3 bg-muted/20 rounded space-y-2">
                  <p className="text-2xl font-bold text-center">{latePaymentData.coBorrower.summary.late60Days + latePaymentData.coBorrower.summary.late90Days}</p>
                  <p className="text-xs text-muted-foreground text-center">60-90 days</p>
                  <Badge variant="warning" className="w-full justify-center">Manual Review</Badge>
                </div>
                <div className="p-3 bg-muted/20 rounded space-y-2">
                  <p className="text-2xl font-bold text-center">{latePaymentData.coBorrower.summary.late120Plus}</p>
                  <p className="text-xs text-muted-foreground text-center">120+ days</p>
                  <Badge variant="destructive" className="w-full justify-center">Severity</Badge>
                </div>
              </div>

              {coBorrowerLatePaymentDecision === "manual_credit_severity_120" && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">🔴 Manual Review Required: CreditSeverity_120</p>
                </div>}
              {coBorrowerLatePaymentDecision === "manual_credit_exception_60_90" && <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                  <p className="text-sm font-medium text-warning">⚠ Manual Review Required: CreditException_60_90</p>
                </div>}
              {coBorrowerLatePaymentDecision === "pass" && <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Pass - Continue workflow</p>
                </div>}
            </div>
          </CardContent>}
      </Card>

      {/* Section 4: TLO Review - By Guarantor */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('tlo')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              TLO Review
              {overallTLODecision === "non_pass" ? getStatusBadge('fail') : overallTLODecision === "manual_validation" ? getStatusBadge('warn') : getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.tlo ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.tlo && <CardContent className="space-y-4">
            {/* Borrower TLO Review */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{tloData.borrower.name}</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download Report
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded">
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="text-sm font-medium">{tloData.borrower.reportDate}</p>
              </div>

              <Separator />

              {/* Identity Verification */}
              <div>
                <p className="text-sm font-semibold mb-3">Identity Verification</p>
                <div className="space-y-3">
                  {/* Full Name */}
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Full Name</span>
                      {tloData.borrower.validation.nameMatch ? <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Match
                        </Badge> : <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Mismatch
                        </Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">TLO Report</p>
                        <p className="font-medium">{tloData.borrower.extracted.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">POS Data</p>
                        <p className="font-medium">{tloData.borrower.posData.fullName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Last 4 SSN */}
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Last 4 SSN</span>
                      {tloData.borrower.validation.missingFields.includes("SSN") ? <Badge variant="destructive">Missing</Badge> : tloData.borrower.validation.ssnMatch ? <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Match
                        </Badge> : <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Mismatch
                        </Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">TLO Report</p>
                        <p className="font-medium">***-**-{tloData.borrower.extracted.last4SSN}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">POS Data</p>
                        <p className="font-medium">***-**-{tloData.borrower.posData.last4SSN}</p>
                      </div>
                    </div>
                  </div>

                  {/* DOB */}
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Date of Birth</span>
                      {tloData.borrower.validation.missingFields.includes("DOB") ? <Badge variant="destructive">Missing</Badge> : tloData.borrower.validation.dobMatch ? <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Match
                        </Badge> : <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {Math.abs(tloData.borrower.validation.dobYearDiff)} year diff
                        </Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">TLO Report</p>
                        <p className="font-medium">{tloData.borrower.extracted.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">POS Data</p>
                        <p className="font-medium">{tloData.borrower.posData.dateOfBirth}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Background Check Details */}
              <div>
                <p className="text-sm font-semibold mb-3">Background Check Details (Rule CR-24)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Liens</span>
                      {tloData.borrower.backgroundCheck.liens.active ? <Badge variant="destructive">Active</Badge> : tloData.borrower.backgroundCheck.liens.satisfiedOrAged ? <Badge variant="warning">Satisfied/Aged</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.borrower.backgroundCheck.liens.monthsSinceLatest} months since latest
                    </p>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Judgments</span>
                      {tloData.borrower.backgroundCheck.judgments.active ? <Badge variant="destructive">Active</Badge> : tloData.borrower.backgroundCheck.judgments.satisfiedOrAged ? <Badge variant="warning">Satisfied/Aged</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.borrower.backgroundCheck.judgments.monthsSinceLatest} months since latest
                    </p>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Bankruptcies</span>
                      {tloData.borrower.backgroundCheck.bankruptcies.active ? <Badge variant="destructive">Active</Badge> : tloData.borrower.backgroundCheck.bankruptcies.satisfiedOrAged ? <Badge variant="warning">Satisfied/Aged</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.borrower.backgroundCheck.bankruptcies.monthsSinceLatest} months since latest
                    </p>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Foreclosures</span>
                      {tloData.borrower.backgroundCheck.foreclosures.withinLast36Months ? <Badge variant="destructive">Within 36 mo</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.borrower.backgroundCheck.foreclosures.monthsSinceLatest} months since latest
                    </p>
                  </div>
                </div>
              </div>

              {/* Decision */}
              {borrowerTLOResult.decision === "non_pass" && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">❌ Non-Pass</p>
                </div>}
              {borrowerTLOResult.decision === "manual_validation" && <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                  <p className="text-sm font-medium text-warning">⚠ Manual Validation Required</p>
                </div>}
              {borrowerTLOResult.decision === "pass" && <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Pass</p>
                </div>}
            </div>

            {/* Co-Borrower TLO Review */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{tloData.coBorrower.name}</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download Report
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded">
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="text-sm font-medium">{tloData.coBorrower.reportDate}</p>
              </div>

              <Separator />

              {/* Identity Verification */}
              <div>
                <p className="text-sm font-semibold mb-3">Identity Verification</p>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Full Name</span>
                      {tloData.coBorrower.validation.nameMatch ? <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Match
                        </Badge> : <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Mismatch
                        </Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">TLO Report</p>
                        <p className="font-medium">{tloData.coBorrower.extracted.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">POS Data</p>
                        <p className="font-medium">{tloData.coBorrower.posData.fullName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Last 4 SSN</span>
                      {tloData.coBorrower.validation.missingFields.includes("SSN") ? <Badge variant="destructive">Missing</Badge> : tloData.coBorrower.validation.ssnMatch ? <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Match
                        </Badge> : <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Mismatch
                        </Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">TLO Report</p>
                        <p className="font-medium">***-**-{tloData.coBorrower.extracted.last4SSN}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">POS Data</p>
                        <p className="font-medium">***-**-{tloData.coBorrower.posData.last4SSN}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Date of Birth</span>
                      {tloData.coBorrower.validation.missingFields.includes("DOB") ? <Badge variant="destructive">Missing</Badge> : tloData.coBorrower.validation.dobMatch ? <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Match
                        </Badge> : <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {Math.abs(tloData.coBorrower.validation.dobYearDiff)} year diff
                        </Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">TLO Report</p>
                        <p className="font-medium">{tloData.coBorrower.extracted.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">POS Data</p>
                        <p className="font-medium">{tloData.coBorrower.posData.dateOfBirth}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Background Check Details */}
              <div>
                <p className="text-sm font-semibold mb-3">Background Check Details (Rule CR-24)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Liens</span>
                      {tloData.coBorrower.backgroundCheck.liens.active ? <Badge variant="destructive">Active</Badge> : tloData.coBorrower.backgroundCheck.liens.satisfiedOrAged ? <Badge variant="warning">Satisfied/Aged</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.coBorrower.backgroundCheck.liens.monthsSinceLatest} months since latest
                    </p>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Judgments</span>
                      {tloData.coBorrower.backgroundCheck.judgments.active ? <Badge variant="destructive">Active</Badge> : tloData.coBorrower.backgroundCheck.judgments.satisfiedOrAged ? <Badge variant="warning">Satisfied/Aged</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.coBorrower.backgroundCheck.judgments.monthsSinceLatest} months since latest
                    </p>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Bankruptcies</span>
                      {tloData.coBorrower.backgroundCheck.bankruptcies.active ? <Badge variant="destructive">Active</Badge> : tloData.coBorrower.backgroundCheck.bankruptcies.satisfiedOrAged ? <Badge variant="warning">Satisfied/Aged</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.coBorrower.backgroundCheck.bankruptcies.monthsSinceLatest} months since latest
                    </p>
                  </div>

                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Foreclosures</span>
                      {tloData.coBorrower.backgroundCheck.foreclosures.withinLast36Months ? <Badge variant="destructive">Within 36 mo</Badge> : <Badge variant="success">Clear</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tloData.coBorrower.backgroundCheck.foreclosures.monthsSinceLatest} months since latest
                    </p>
                  </div>
                </div>
              </div>

              {/* Decision */}
              {coBorrowerTLOResult.decision === "non_pass" && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">❌ Non-Pass</p>
                </div>}
              {coBorrowerTLOResult.decision === "manual_validation" && <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                  <p className="text-sm font-medium text-warning">⚠ Manual Validation Required</p>
                </div>}
              {coBorrowerTLOResult.decision === "pass" && <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Pass</p>
                </div>}
            </div>
          </CardContent>}
      </Card>

      {/* Section 5: LexisNexis - By Guarantor */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('lexisNexis')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              LexisNexis
              {hasAnyMatch || isAnyReportStale ? getStatusBadge('fail') : getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.lexisNexis ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.lexisNexis && <CardContent className="space-y-4">
            {/* Borrower LexisNexis */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{lexisNexisData.borrower.name}</h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Match Status</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {lexisNexisData.borrower.matchStatus === "match" ? "Match/Hit" : "Clear"}
                    </p>
                    {lexisNexisData.borrower.matchStatus === "match" ? <Badge variant="destructive">Match Found</Badge> : <Badge variant="success">Clear</Badge>}
                  </div>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Report Date</p>
                  <p className="text-sm font-medium">{lexisNexisData.borrower.reportDate}</p>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Report Age</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{borrowerReportAge} days</p>
                    {isBorrowerReportStale && <Badge variant="destructive">Stale</Badge>}
                  </div>
                </div>
              </div>

              {lexisNexisData.borrower.matchStatus === "match" && lexisNexisData.borrower.matchedEntities.length > 0 && <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold mb-3">Matched Entities</p>
                    <div className="space-y-3">
                      {lexisNexisData.borrower.matchedEntities.map((entity, index) => <div key={index} className="p-3 bg-muted/20 rounded-lg">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Name</p>
                              <p className="text-sm font-medium">{entity.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Match Score</p>
                              <p className="text-sm font-medium">{entity.matchScore}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Type</p>
                              <p className="text-sm font-medium">{entity.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Risk</p>
                              <Badge variant={entity.risk === "Low" ? "success" : entity.risk === "Medium" ? "warning" : "destructive"}>
                                {entity.risk}
                              </Badge>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>
                </>}

              {lexisNexisData.borrower.matchStatus === "match" ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">⚠ Match Found - Manual Review: KYC required</p>
                </div> : isBorrowerReportStale ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">🔴 Report is {">"}60 days old - Manual Review required</p>
                </div> : <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Clear - Continue workflow</p>
                </div>}
            </div>

            {/* Co-Borrower LexisNexis */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{lexisNexisData.coBorrower.name}</h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Match Status</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">
                      {lexisNexisData.coBorrower.matchStatus === "match" ? "Match/Hit" : "Clear"}
                    </p>
                    {lexisNexisData.coBorrower.matchStatus === "match" ? <Badge variant="destructive">Match Found</Badge> : <Badge variant="success">Clear</Badge>}
                  </div>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Report Date</p>
                  <p className="text-sm font-medium">{lexisNexisData.coBorrower.reportDate}</p>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Report Age</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{coBorrowerReportAge} days</p>
                    {isCoBorrowerReportStale && <Badge variant="destructive">Stale</Badge>}
                  </div>
                </div>
              </div>

              {lexisNexisData.coBorrower.matchStatus === "match" && lexisNexisData.coBorrower.matchedEntities.length > 0 && <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold mb-3">Matched Entities</p>
                    <div className="space-y-3">
                      {lexisNexisData.coBorrower.matchedEntities.map((entity, index) => <div key={index} className="p-3 bg-muted/20 rounded-lg">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Name</p>
                              <p className="text-sm font-medium">{entity.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Match Score</p>
                              <p className="text-sm font-medium">{entity.matchScore}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Type</p>
                              <p className="text-sm font-medium">{entity.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Risk</p>
                              <Badge variant={entity.risk === "Low" ? "success" : entity.risk === "Medium" ? "warning" : "destructive"}>
                                {entity.risk}
                              </Badge>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>
                </>}

              {lexisNexisData.coBorrower.matchStatus === "match" ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">⚠ Match Found - Manual Review: KYC required</p>
                </div> : isCoBorrowerReportStale ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">🔴 Report is {">"}60 days old - Manual Review required</p>
                </div> : <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ Clear - Continue workflow</p>
                </div>}
            </div>
          </CardContent>}
      </Card>

      {/* Section 6: FlagDat - By Guarantor */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('flagDat')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              FlagDat
              {hasAnyFlagDatMatches ? getStatusBadge('fail') : getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.flagDat ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.flagDat && <CardContent className="space-y-4">
            {/* Borrower FlagDat */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{flagDatData.borrower.name}</h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">WatchList Matches</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {flagDatData.borrower.watchlistMatches}
                    </p>
                    {flagDatData.borrower.watchlistMatches > 0 ? <Badge variant="destructive">{flagDatData.borrower.watchlistMatches} Match(es)</Badge> : <Badge variant="success">No Match</Badge>}
                  </div>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">BlackList Matches</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {flagDatData.borrower.blacklistMatches}
                    </p>
                    {flagDatData.borrower.blacklistMatches > 0 ? <Badge variant="destructive">{flagDatData.borrower.blacklistMatches} Match(es)</Badge> : <Badge variant="success">No Match</Badge>}
                  </div>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Last Checked</p>
                  <p className="text-sm font-medium">{flagDatData.borrower.lastChecked}</p>
                </div>
              </div>

              {flagDatData.borrower.watchlistMatches > 0 || flagDatData.borrower.blacklistMatches > 0 ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">⚠ {flagDatData.borrower.watchlistMatches + flagDatData.borrower.blacklistMatches} match(es) found - Manual Review by Underwriting/Credit Analyst required</p>
                </div> : <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ No matches - Continue workflow</p>
                </div>}
            </div>

            {/* Co-Borrower FlagDat */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{flagDatData.coBorrower.name}</h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">WatchList Matches</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {flagDatData.coBorrower.watchlistMatches}
                    </p>
                    {flagDatData.coBorrower.watchlistMatches > 0 ? <Badge variant="destructive">{flagDatData.coBorrower.watchlistMatches} Match(es)</Badge> : <Badge variant="success">No Match</Badge>}
                  </div>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">BlackList Matches</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {flagDatData.coBorrower.blacklistMatches}
                    </p>
                    {flagDatData.coBorrower.blacklistMatches > 0 ? <Badge variant="destructive">{flagDatData.coBorrower.blacklistMatches} Match(es)</Badge> : <Badge variant="success">No Match</Badge>}
                  </div>
                </div>
                <div className="p-3 border rounded space-y-2">
                  <p className="text-xs text-muted-foreground">Last Checked</p>
                  <p className="text-sm font-medium">{flagDatData.coBorrower.lastChecked}</p>
                </div>
              </div>

              {flagDatData.coBorrower.watchlistMatches > 0 || flagDatData.coBorrower.blacklistMatches > 0 ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">⚠ {flagDatData.coBorrower.watchlistMatches + flagDatData.coBorrower.blacklistMatches} match(es) found - Manual Review by Underwriting/Credit Analyst required</p>
                </div> : <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ No matches - Continue workflow</p>
                </div>}
            </div>
          </CardContent>}
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
        {expandedCards.logs && <CardContent>
            <div className="space-y-3">
              {logsData.map(log => <div key={log.id} className="border rounded-lg">
                  <div className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleLog(log.id)}>
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{log.tag}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{log.timestamp}</p>
                          <p className="text-sm mt-1">{log.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-wrap justify-end">
                          <Badge variant="outline" className="text-xs">
                            {log.exceptionTag}
                          </Badge>
                          {log.exceptionType && <Badge variant="destructive" className="text-xs font-semibold px-2.5 py-1">
                              {log.exceptionType}
                            </Badge>}
                          <Badge variant={log.status === 'completed' ? 'default' : log.status === 'warning' ? 'warning' : 'outline'} className="text-xs">
                            {log.status}
                          </Badge>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedLogs[log.id] ? '' : '-rotate-90'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedLogs[log.id] && <div className="px-3 pb-3 border-t bg-muted/20">
                      <pre className="text-xs overflow-x-auto p-3 bg-background rounded mt-2">
                        {JSON.stringify(log.jsonData, null, 2)}
                      </pre>
                    </div>}
                </div>)}
            </div>
          </CardContent>}
      </Card>
    </div>;
};