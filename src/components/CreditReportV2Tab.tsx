import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, Shield, AlertCircleIcon, CreditCard, Info, ArrowRight } from "lucide-react";
import { useState } from "react";
import { CreditReviewSummary } from "@/components/CreditReviewSummary";
interface CreditReportV2TabProps {
  phase: any;
}
export const CreditReportV2Tab = ({
  phase
}: CreditReportV2TabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    creditReviewSummary: true,
    flagDat: false,
    logs: false
  });
  const [expandedGuarantors, setExpandedGuarantors] = useState<Record<string, boolean>>({
    'John Doe': false,
    'Jane Smith': false
  });
  const [expandedGuarantorSections, setExpandedGuarantorSections] = useState<Record<string, boolean>>({
    'John Doe-creditReport': false,
    'John Doe-tlo': false,
    'John Doe-lexisNexis': false,
    'Jane Smith-creditReport': false,
    'Jane Smith-tlo': false,
    'Jane Smith-lexisNexis': false
  });
  const [expandedBackgroundCheckDetails, setExpandedBackgroundCheckDetails] = useState<Record<string, boolean>>({
    'John Doe': false,
    'Jane Smith': false
  });
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [showApiMatches, setShowApiMatches] = useState(false);
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  const toggleGuarantor = (name: string) => {
    setExpandedGuarantors(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  const toggleGuarantorSection = (key: string) => {
    setExpandedGuarantorSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  const toggleBackgroundCheckDetails = (name: string) => {
    setExpandedBackgroundCheckDetails(prev => ({
      ...prev,
      [name]: !prev[name]
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

  // Mock data
  const closingDate = "2025-11-15";
  const companyTier = "Gold";
  const ltc = 75;
  const ltv = 68;
  const loanLimit = 500000;
  const productMin = 680;
  const loanProgram = "DSCR";
  const verifiedProjects = 3;
  const tierChanged = true;
  const previousTier = "Silver";
  const tierChangeReason = "LTV ratio exceeded threshold for Silver tier. Required upgrade to Gold tier to meet product guidelines.";

  // Mock data for TLO, LexisNexis, and FlagDat
  const tloData = {
    "John Doe": {
      pdfReport: "s3://bucket-name/tlo-reports/LOAN123456/TLO_Report_John.pdf",
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
          count: 2,
          recent: 1,
          old: 1,
          monthsSinceLatest: 118,
          items: [
            { type: "Tax Lien", amount: "$15,000", date: "2015-03-15", status: "Satisfied" },
            { type: "Judgment Lien", amount: "$8,500", date: "2024-01-10", status: "Active" }
          ]
        },
        judgments: {
          count: 0,
          recent: 0,
          old: 0,
          monthsSinceLatest: null,
          items: []
        },
        bankruptcies: {
          count: 1,
          recent: 0,
          old: 1,
          monthsSinceLatest: 140,
          items: [
            { type: "Chapter 7", filingDate: "2013-03-20", dischargeDate: "2013-09-15", status: "Discharged" }
          ]
        },
        foreclosures: {
          count: 1,
          recent: 1,
          old: 0,
          monthsSinceLatest: 48,
          items: [
            { address: "123 Main St, City, ST", date: "2021-01-15", status: "Completed" }
          ]
        },
        unclearDisposition: false
      }
    },
    "Jane Smith": {
      pdfReport: "s3://bucket-name/tlo-reports/LOAN123456/TLO_Report_Jane.pdf",
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
        ssnMatch: false,
        dobMatch: true,
        dobYearDiff: 0,
        missingFields: [] as string[]
      },
      backgroundCheck: {
        liens: {
          count: 2,
          recent: 1,
          old: 1,
          monthsSinceLatest: 118,
          items: [
            { type: "Tax Lien", amount: "$12,000", date: "2016-05-20", status: "Satisfied" },
            { type: "Contractor Lien", amount: "$5,000", date: "2024-02-10", status: "Active" }
          ]
        },
        judgments: {
          count: 0,
          recent: 0,
          old: 0,
          monthsSinceLatest: null,
          items: []
        },
        bankruptcies: {
          count: 1,
          recent: 0,
          old: 1,
          monthsSinceLatest: 140,
          items: [
            { type: "Chapter 13", filingDate: "2013-05-10", dischargeDate: "2018-06-20", status: "Discharged" }
          ]
        },
        foreclosures: {
          count: 1,
          recent: 1,
          old: 0,
          monthsSinceLatest: 48,
          items: [
            { address: "456 Oak Ave, City, ST", date: "2021-03-22", status: "Completed" }
          ]
        },
        unclearDisposition: false
      }
    }
  };
  const lexisNexisData = {
    "John Doe": {
      matchStatus: "match",
      matchedEntities: [{
        name: "John Doe",
        matchScore: 95,
        type: "Exact Name Match",
        risk: "Low",
        country: "United States",
        description: "Sentenced to 100 months in prison for fraud.",
        class: "Enforcement"
      }, {
        name: "Jonathan Doe",
        matchScore: 78,
        type: "Similar Name Match",
        risk: "Medium",
        country: "United States",
        description: "Sentenced to 168 months in prison for embezzlement.",
        class: "Enforcement"
      }],
      reportDate: "2025-10-15",
      closeDate: "2025-11-10"
    },
    "Jane Smith": {
      matchStatus: "clear",
      matchedEntities: [],
      reportDate: "2025-10-16",
      closeDate: "2025-11-10"
    }
  };
  const flagDatData = {
    "John Doe": {
      watchlistMatches: 2,
      blacklistMatches: 0,
      lastChecked: "2025-11-10"
    },
    "Jane Smith": {
      watchlistMatches: 0,
      blacklistMatches: 0,
      lastChecked: "2025-11-10"
    }
  };

  // Mock API matching results
  const flagDatApiMatches = [
    {
      id: 1,
      guarantor: "John Doe",
      type: "watchlist",
      matchScore: 92,
      country: "United States",
      description: "Sanctions List - OFAC",
      class: "Government Watchlist"
    },
    {
      id: 2,
      guarantor: "John Doe",
      type: "watchlist",
      matchScore: 87,
      country: "United Kingdom",
      description: "Politically Exposed Person (PEP)",
      class: "PEP Database"
    }
  ];
  const calculateTLODecision = (guarantorData: typeof tloData["John Doe"]) => {
    const requiresIdentityManualValidation = !guarantorData.validation.ssnMatch || Math.abs(guarantorData.validation.dobYearDiff) > 1 || guarantorData.validation.missingFields.length > 0;
    const hasActiveLiensJudgmentsBankruptcies = guarantorData.backgroundCheck.liens.recent > 0 || guarantorData.backgroundCheck.judgments.recent > 0 || guarantorData.backgroundCheck.bankruptcies.recent > 0;
    const hasActiveWithin120Months = (guarantorData.backgroundCheck.liens.monthsSinceLatest !== null && guarantorData.backgroundCheck.liens.monthsSinceLatest <= 120 && guarantorData.backgroundCheck.liens.old === 0) || 
                                      (guarantorData.backgroundCheck.judgments.monthsSinceLatest !== null && guarantorData.backgroundCheck.judgments.monthsSinceLatest <= 120 && guarantorData.backgroundCheck.judgments.old === 0) || 
                                      (guarantorData.backgroundCheck.bankruptcies.monthsSinceLatest !== null && guarantorData.backgroundCheck.bankruptcies.monthsSinceLatest <= 120 && guarantorData.backgroundCheck.bankruptcies.old === 0);
    const hasSatisfiedOrAged = guarantorData.backgroundCheck.liens.old > 0 || guarantorData.backgroundCheck.judgments.old > 0 || guarantorData.backgroundCheck.bankruptcies.old > 0;
    const hasForeclosuresLast36 = guarantorData.backgroundCheck.foreclosures.recent > 0;
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
  const guarantors = [{
    name: "John Doe",
    ownership: 60,
    fico: 720,
    pullDate: "2025-11-01",
    bureau: "Experian",
    pullType: "Hard Pull" as const,
    isForeignNational: false,
    ssn: "***-**-1234",
    dob: "1985-06-15",
    ssnIssueDate: "2000-01-01",
    utilization: 35,
    hasCreditAuth: true,
    validation: 'pass' as const,
    latePayments: {
      thirtyDays: 0,
      sixtyDays: 0,
      ninetyDays: 0
    },
    publicRecords: {
      count: 0,
      collections: 0,
      bankruptcies: "No (0)"
    }
  }, {
    name: "Jane Smith",
    ownership: 40,
    fico: 695,
    pullDate: "2025-11-01",
    bureau: "TransUnion",
    pullType: "Soft Pull" as const,
    isForeignNational: false,
    ssn: "***-**-5678",
    dob: "1988-03-22",
    ssnIssueDate: "2003-05-15",
    utilization: 55,
    hasCreditAuth: true,
    validation: 'warn' as const,
    latePayments: {
      thirtyDays: 1,
      sixtyDays: 0,
      ninetyDays: 0
    },
    publicRecords: {
      count: 0,
      collections: 0,
      bankruptcies: "No (0)"
    }
  }];
  const numGuarantors = guarantors.length;
  const overallStatus = guarantors.some(g => g.validation === 'warn') ? 'warn' : 'pass';
  const lowestFICO = Math.min(...guarantors.map(g => g.fico));
  const ficoMeetsProductMin = lowestFICO >= productMin;
  const auditLogs = [{
    id: "log-001",
    tag: "credit_pull",
    timestamp: "2025-11-10 14:25:32",
    description: "Credit Report Pull",
    action: "Credit Report Retrieved",
    user: "System",
    status: "completed",
    exceptionTag: "credit_verification",
    exceptionType: null,
    jsonData: {
      bureau: "Experian",
      fico_score: 720,
      report_date: "2025-11-01"
    }
  }];

  // Calculate if DOB vs SSN is valid
  const isDobVsSsnValid = (dob: string, ssnIssueDate: string | undefined) => {
    if (!ssnIssueDate) return null;
    const dobDate = new Date(dob);
    const ssnDate = new Date(ssnIssueDate);
    return ssnDate > dobDate;
  };

  // Calculate if utilization is valid
  const isUtilizationValid = (utilization: number) => utilization < 50;

  // Calculate if credit report date is valid (within 90 days of closing)
  const isCreditReportDateValid = (pullDate: string) => {
    const closingDateObj = new Date(closingDate);
    const pullDateObj = new Date(pullDate);
    const daysDiff = Math.floor((closingDateObj.getTime() - pullDateObj.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 90;
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Credit Report v2</span>
          <StatusBadge status={phase.status} />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Credit Review Summary */}
      <CreditReviewSummary expandedCards={expandedCards} toggleCard={toggleCard} overallStatus={overallStatus} numGuarantors={numGuarantors} companyTier={companyTier} loanProgram={loanProgram} tierChanged={tierChanged} previousTier={previousTier} tierChangeReason={tierChangeReason} lowestFICO={lowestFICO} productMin={productMin} verifiedProjects={verifiedProjects} ficoMeetsProductMin={ficoMeetsProductMin} ltc={ltc} ltv={ltv} loanLimit={loanLimit} closingDate={closingDate} />


      {/* Guarantors */}
      {guarantors.map(guarantor => <Card key={guarantor.name}>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleGuarantor(guarantor.name)}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>{guarantor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {guarantor.ownership}% Ownership
                </Badge>
                {getStatusBadge(guarantor.validation)}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedGuarantors[guarantor.name] ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>

          {expandedGuarantors[guarantor.name] && <CardContent className="space-y-6">
              {/* Credit Report Validations */}
              <Collapsible open={expandedGuarantorSections[`${guarantor.name}-creditReport`]} onOpenChange={() => toggleGuarantorSection(`${guarantor.name}-creditReport`)}>
                <CollapsibleTrigger className="flex items-center w-full hover:bg-muted/30 p-3 rounded transition-colors">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-semibold text-muted-foreground flex-1 text-left">Credit Report Validations</h3>
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant="default" className="text-xs">
                      {guarantor.pullType}
                    </Badge>
                    {(() => {
                // Calculate overall validation status for Credit Report
                const hasFails = !isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) || !isCreditReportDateValid(guarantor.pullDate) || guarantor.latePayments.ninetyDays > 0 || guarantor.publicRecords.count > 0;
                const hasWarnings = !isUtilizationValid(guarantor.utilization) || guarantor.latePayments.thirtyDays > 0 || guarantor.latePayments.sixtyDays > 0;
                return hasFails ? getStatusBadge('fail') : hasWarnings ? getStatusBadge('warn') : getStatusBadge('pass');
              })()}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedGuarantorSections[`${guarantor.name}-creditReport`] ? '' : '-rotate-90'}`} />
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 bg-muted/20 rounded-lg mt-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3 w-3" />
                        Download Credit Report
                      </Button>
                    </div>
                    
                    {/* Identity */}
                    <div>
                      <h5 className="text-sm font-semibold mb-3 text-muted-foreground">Identity</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">DOB</p>
                          <p className="font-medium text-sm">{guarantor.dob}</p>
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
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">DOB vs SSN Issued</p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Validates that SSN was issued after the borrower&apos;s date of birth</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          {isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) !== null ? <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">
                                {isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) ? 'Valid' : 'Invalid'}
                              </p>
                              {isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </div> : <p className="font-medium text-sm">N/A</p>}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Credit Authorization */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-muted-foreground">Credit Authorization</h5>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download Report
                        </Button>
                      </div>
                      <div className="p-3 bg-muted/20 rounded space-y-1">
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">Credit Authorization</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Confirms borrower has authorized credit report pull</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{guarantor.hasCreditAuth ? "Received" : "Not Received"}</p>
                          {guarantor.hasCreditAuth && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                      {guarantor.hasCreditAuth && <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✓ Credit Authorization Received - Continue workflow
                          </p>
                        </div>}
                    </div>

                    <Separator />

                    {/* Credit Report */}
                    <div>
                      <h5 className="text-sm font-semibold mb-3 text-muted-foreground">Credit Report</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">Credit Bureau</p>
                          <p className="font-medium text-sm">{guarantor.bureau}</p>
                        </div>
                        
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">FICO Score</p>
                          <p className="font-medium text-sm">{guarantor.fico}</p>
                        </div>
                        
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">Credit Pull Date</p>
                          <p className="font-medium text-sm">{guarantor.pullDate}</p>
                        </div>
                      </div>
                      
                      {isCreditReportDateValid(guarantor.pullDate) && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✓ Credit Pull Date Valid - Within 90 days
                          </p>
                        </div>
                      )}
                      
                      {!isCreditReportDateValid(guarantor.pullDate) && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-700 dark:text-red-300">
                            ✗ Credit Pull Date Invalid - Older than 90 days
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Utilization Analysis */}
                    <div>
                      <h5 className="text-sm font-semibold mb-3 text-muted-foreground">Utilization Analysis</h5>
                      <div className="p-3 bg-muted/20 rounded space-y-1">
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">Utilization Ratio</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Credit utilization as percentage of available credit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{guarantor.utilization}%</p>
                          {guarantor.utilization < 50 ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        </div>
                      </div>

                      <Collapsible className="mt-3">
                        <div className="flex items-center justify-between">
                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-primary hover:underline">
                            View Utilization Guidelines
                            <ChevronDown className="h-3 w-3" />
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-2">
                          <div className="p-3 bg-muted/10 rounded text-xs space-y-2">
                            <p className="font-semibold">Utilization Thresholds:</p>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Range</TableHead>
                                  <TableHead className="text-xs">Decision</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-xs">{"< 50%"}</TableCell>
                                  <TableCell className="text-xs">Pass</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs">50–69%</TableCell>
                                  <TableCell className="text-xs">Manual Review – High Utilization</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs">{">= 70% or Frozen Report"}</TableCell>
                                  <TableCell className="text-xs">Non-Pass – Manual Validation: High Utilization Manual Review by Underwriting/Credit Analyst</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      {guarantor.utilization < 50 && <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✓ Low Utilization - Continue workflow
                          </p>
                        </div>}
                    </div>

                    <Separator />

                    {/* Late Payment History */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-muted-foreground">Late Payment History</h5>
                        
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">30 Days</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{guarantor.latePayments.thirtyDays}</p>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">60 Days</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{guarantor.latePayments.sixtyDays}</p>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          </div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">90+ Days</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{guarantor.latePayments.ninetyDays}</p>
                            <XCircle className="h-4 w-4 text-red-600" />
                          </div>
                        </div>
                      </div>
                      {guarantor.latePayments.thirtyDays === 0 && guarantor.latePayments.sixtyDays === 0 && guarantor.latePayments.ninetyDays === 0 && <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            ✓ No Late Payments - Continue workflow
                          </p>
                        </div>}
                    </div>

                    <Separator />

                    {/* Public Record Review */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-muted-foreground">Public Record Review</h5>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download Report
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-muted/20 rounded space-y-1">
                            <p className="text-xs text-muted-foreground">Public Records</p>
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{guarantor.publicRecords.count}</p>
                              {guarantor.publicRecords.count === 0 && <CheckCircle className="h-4 w-4 text-green-600" />}
                            </div>
                          </div>
                          <div className="p-3 bg-muted/20 rounded space-y-1">
                            <p className="text-xs text-muted-foreground">Collections</p>
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{guarantor.publicRecords.collections}</p>
                              {guarantor.publicRecords.collections === 0 && <CheckCircle className="h-4 w-4 text-green-600" />}
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">Bankruptcies</p>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{guarantor.publicRecords.bankruptcies}</p>
                            {guarantor.publicRecords.bankruptcies === "No (0)" && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                        </div>
                        {guarantor.publicRecords.count === 0 && guarantor.publicRecords.collections === 0 && <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300">
                              ✓ No Public Records or Collections - Continue workflow
                            </p>
                          </div>}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-6" />

              {/* TLO Validations */}
              <Collapsible open={expandedGuarantorSections[`${guarantor.name}-tlo`]} onOpenChange={() => toggleGuarantorSection(`${guarantor.name}-tlo`)}>
                <CollapsibleTrigger className="flex items-center w-full hover:bg-muted/30 p-3 rounded transition-colors">
                  <Shield className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-semibold text-muted-foreground flex-1 text-left">TLO Validations</h3>
                  <div className="flex items-center gap-2 ml-auto">
                    {(() => {
                const tloResult = calculateTLODecision(tloData[guarantor.name as keyof typeof tloData]);
                return tloResult.decision === "non_pass" ? getStatusBadge('fail') : tloResult.decision === "manual_validation" ? getStatusBadge('warn') : getStatusBadge('pass');
              })()}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedGuarantorSections[`${guarantor.name}-tlo`] ? '' : '-rotate-90'}`} />
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  {(() => {
              const tloGuarantorData = tloData[guarantor.name as keyof typeof tloData];
              const tloResult = calculateTLODecision(tloGuarantorData);
              return <div className="p-4 bg-muted/20 rounded-lg mt-3 space-y-4">
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-3 w-3" />
                            Download Report
                          </Button>
                        </div>

                        <div className="p-3 bg-muted/20 rounded">
                          <p className="text-xs text-muted-foreground">Report Date</p>
                          <p className="text-sm font-medium">{tloGuarantorData.reportDate}</p>
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
                                {tloGuarantorData.validation.nameMatch ? <Badge variant="success" className="gap-1">
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
                                  <p className="font-medium">{tloGuarantorData.extracted.fullName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">POS Data</p>
                                  <p className="font-medium">{tloGuarantorData.posData.fullName}</p>
                                </div>
                              </div>
                            </div>

                            {/* Last 4 SSN */}
                            <div className="p-3 border rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">Last 4 SSN</span>
                                {tloGuarantorData.validation.missingFields.includes("SSN") ? <Badge variant="destructive">Missing</Badge> : tloGuarantorData.validation.ssnMatch ? <Badge variant="success" className="gap-1">
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
                                  <p className="font-medium">***-**-{tloGuarantorData.extracted.last4SSN}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">POS Data</p>
                                  <p className="font-medium">***-**-{tloGuarantorData.posData.last4SSN}</p>
                                </div>
                              </div>
                            </div>

                            {/* DOB */}
                            <div className="p-3 border rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">Date of Birth</span>
                                {tloGuarantorData.validation.missingFields.includes("DOB") ? <Badge variant="destructive">Missing</Badge> : tloGuarantorData.validation.dobMatch ? <Badge variant="success" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Match
                                  </Badge> : <Badge variant="warning" className="gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {Math.abs(tloGuarantorData.validation.dobYearDiff)} year diff
                                  </Badge>}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">TLO Report</p>
                                  <p className="font-medium">{tloGuarantorData.extracted.dateOfBirth}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">POS Data</p>
                                  <p className="font-medium">{tloGuarantorData.posData.dateOfBirth}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Background Check */}
                        <div>
                          <p className="text-sm font-semibold mb-3">Background Check</p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Type</TableHead>
                                <TableHead className="text-xs">Count</TableHead>
                                <TableHead className="text-xs">
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-warning" />
                                    <span className="text-warning">Recent</span>
                                  </div>
                                </TableHead>
                                <TableHead className="text-xs">
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-success" />
                                    Old
                                  </div>
                                </TableHead>
                                <TableHead className="text-xs">Months Since Latest</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-xs font-semibold">Liens</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.liens.count}</TableCell>
                                <TableCell className="text-xs text-warning">{tloGuarantorData.backgroundCheck.liens.recent}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.liens.old}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.liens.monthsSinceLatest}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs font-semibold">Judgments</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.judgments.count}</TableCell>
                                <TableCell className="text-xs text-warning">{tloGuarantorData.backgroundCheck.judgments.recent}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.judgments.old}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.judgments.monthsSinceLatest ?? '—'}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs font-semibold">Bankruptcies</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.bankruptcies.count}</TableCell>
                                <TableCell className="text-xs text-warning">{tloGuarantorData.backgroundCheck.bankruptcies.recent}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.bankruptcies.old}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.bankruptcies.monthsSinceLatest}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="text-xs font-semibold">Foreclosures</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.foreclosures.count}</TableCell>
                                <TableCell className="text-xs text-warning">{tloGuarantorData.backgroundCheck.foreclosures.recent}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.foreclosures.old}</TableCell>
                                <TableCell className="text-xs">{tloGuarantorData.backgroundCheck.foreclosures.monthsSinceLatest}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>

                          {/* Detailed Items */}
                          {(tloGuarantorData.backgroundCheck.liens.items.length > 0 ||
                            tloGuarantorData.backgroundCheck.judgments.items.length > 0 ||
                            tloGuarantorData.backgroundCheck.bankruptcies.items.length > 0 ||
                            tloGuarantorData.backgroundCheck.foreclosures.items.length > 0) && (
                            <Collapsible 
                              open={expandedBackgroundCheckDetails[guarantor.name]}
                              onOpenChange={() => toggleBackgroundCheckDetails(guarantor.name)}
                              className="mt-4"
                            >
                              <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium hover:text-primary transition-colors">
                                <ChevronDown className={`h-4 w-4 transition-transform ${expandedBackgroundCheckDetails[guarantor.name] ? 'transform rotate-180' : ''}`} />
                                View Detailed Items Found
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-3 space-y-3">
                                {tloGuarantorData.backgroundCheck.liens.items.length > 0 && (
                                  <div className="p-3 bg-muted/30 rounded border">
                                    <p className="text-xs font-semibold mb-2">Liens Found:</p>
                                    {tloGuarantorData.backgroundCheck.liens.items.map((item, idx) => (
                                      <div key={idx} className="text-xs mb-2 last:mb-0">
                                        <span className="font-medium">{item.type}</span> - {item.amount} | {item.date} | <span className={item.status === "Active" ? "text-warning" : "text-success"}>{item.status}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {tloGuarantorData.backgroundCheck.judgments.items.length > 0 && (
                                  <div className="p-3 bg-muted/30 rounded border">
                                    <p className="text-xs font-semibold mb-2">Judgments Found:</p>
                                    {tloGuarantorData.backgroundCheck.judgments.items.map((item: any, idx: number) => (
                                      <div key={idx} className="text-xs mb-2 last:mb-0">
                                        <span className="font-medium">{item.type}</span> - {item.amount} | {item.date} | <span className={item.status === "Active" ? "text-warning" : "text-success"}>{item.status}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {tloGuarantorData.backgroundCheck.bankruptcies.items.length > 0 && (
                                  <div className="p-3 bg-muted/30 rounded border">
                                    <p className="text-xs font-semibold mb-2">Bankruptcies Found:</p>
                                    {tloGuarantorData.backgroundCheck.bankruptcies.items.map((item, idx) => (
                                      <div key={idx} className="text-xs mb-2 last:mb-0">
                                        <span className="font-medium">{item.type}</span> | Filed: {item.filingDate} | Discharged: {item.dischargeDate} | <span className="text-muted-foreground">{item.status}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {tloGuarantorData.backgroundCheck.foreclosures.items.length > 0 && (
                                  <div className="p-3 bg-muted/30 rounded border">
                                    <p className="text-xs font-semibold mb-2">Foreclosures Found:</p>
                                    {tloGuarantorData.backgroundCheck.foreclosures.items.map((item, idx) => (
                                      <div key={idx} className="text-xs mb-2 last:mb-0">
                                        <span className="font-medium">{item.address}</span> | {item.date} | <span className="text-muted-foreground">{item.status}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>

                        {/* Decision */}
                        {tloResult.decision === "non_pass" && <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                            <p className="text-sm font-medium text-destructive">🔴 Non-Pass</p>
                          </div>}
                        {tloResult.decision === "manual_validation" && <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                            <p className="text-sm font-medium text-warning">⚠ Manual Validation Required</p>
                          </div>}
                        {tloResult.decision === "pass" && <div className="p-3 bg-success/10 border border-success/20 rounded">
                            <p className="text-sm font-medium text-success">✓ Pass</p>
                          </div>}
                      </div>;
            })()}
                </CollapsibleContent>
              </Collapsible>

              <Separator className="my-6" />

              {/* LexisNexis Validations */}
              <Collapsible open={expandedGuarantorSections[`${guarantor.name}-lexisNexis`]} onOpenChange={() => toggleGuarantorSection(`${guarantor.name}-lexisNexis`)}>
                <CollapsibleTrigger className="flex items-center w-full hover:bg-muted/30 p-3 rounded transition-colors">
                  <Shield className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-semibold text-muted-foreground flex-1 text-left">LexisNexis Validations</h3>
                  <div className="flex items-center gap-2 ml-auto">
                    {(() => {
                const lexisData = lexisNexisData[guarantor.name as keyof typeof lexisNexisData];
                const reportAge = Math.floor((new Date(lexisData.closeDate).getTime() - new Date(lexisData.reportDate).getTime()) / (1000 * 60 * 60 * 24));
                const isReportStale = reportAge > 60;
                const hasMatch = lexisData.matchStatus === "match";
                return hasMatch || isReportStale ? getStatusBadge('fail') : getStatusBadge('pass');
              })()}
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedGuarantorSections[`${guarantor.name}-lexisNexis`] ? '' : '-rotate-90'}`} />
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  {(() => {
              const lexisData = lexisNexisData[guarantor.name as keyof typeof lexisNexisData];
              const reportAge = Math.floor((new Date(lexisData.closeDate).getTime() - new Date(lexisData.reportDate).getTime()) / (1000 * 60 * 60 * 24));
              const isReportStale = reportAge > 60;
              const hasMatch = lexisData.matchStatus === "match";
              return <div className="p-4 bg-muted/20 rounded-lg mt-3 space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 border rounded space-y-2">
                            <p className="text-xs text-muted-foreground">Match Status</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">
                                {lexisData.matchStatus === "match" ? "Match/Hit" : "Clear"}
                              </p>
                              {lexisData.matchStatus === "match" ? <Badge variant="destructive">Match Found</Badge> : <Badge variant="success">Clear</Badge>}
                            </div>
                          </div>
                          <div className="p-3 border rounded space-y-2">
                            <p className="text-xs text-muted-foreground">Report Date</p>
                            <p className="text-sm font-medium">{lexisData.reportDate}</p>
                          </div>
                          <div className="p-3 border rounded space-y-2">
                            <p className="text-xs text-muted-foreground">Report Age</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{reportAge} days</p>
                              {isReportStale && <Badge variant="destructive">Stale</Badge>}
                            </div>
                          </div>
                        </div>

                        {hasMatch && lexisData.matchedEntities.length > 0 && <>
                            <Separator />
                            <div>
                              <p className="text-sm font-semibold mb-3">Matched Entities</p>
                              <div className="space-y-3">
                                {lexisData.matchedEntities.map((entity, index) => <div key={index} className="p-3 bg-muted/20 rounded-lg">
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
                                      <div>
                                        <p className="text-xs text-muted-foreground">Country</p>
                                        <p className="text-sm font-medium">{entity.country}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Class</p>
                                        <p className="text-sm font-medium">{entity.class}</p>
                                      </div>
                                      <div className="col-span-2">
                                        <p className="text-xs text-muted-foreground">Description</p>
                                        <p className="text-sm font-medium">{entity.description}</p>
                                      </div>
                                    </div>
                                  </div>)}
                              </div>
                            </div>
                          </>}

                        {hasMatch ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                            <p className="text-sm font-medium text-destructive">🔴 Match Found - Manual Review Required</p>
                          </div> : isReportStale ? <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                            <p className="text-sm font-medium text-destructive">🔴 Report is {">"}60 days old - Manual Review required</p>
                          </div> : <div className="p-3 bg-success/10 border border-success/20 rounded">
                            <p className="text-sm font-medium text-success">✓ Clear - Continue workflow</p>
                          </div>}
                      </div>;
            })()}
                </CollapsibleContent>
              </Collapsible>

            </CardContent>}
        </Card>)}

      {/* FlagDat Validations */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('flagDat')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              FlagDat Validations
              {(() => {
                const hasAnyMatches = Object.values(flagDatData).some(data => 
                  data.watchlistMatches > 0 || data.blacklistMatches > 0
                );
                return hasAnyMatches ? getStatusBadge('fail') : getStatusBadge('pass');
              })()}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.flagDat ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.flagDat && <CardContent className="space-y-4">
            {/* Toggle for API Matching Results */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Show API Matching Results</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiMatches(!showApiMatches)}
              >
                {showApiMatches ? 'Hide' : 'Show'}
              </Button>
            </div>

            {/* Fields Display - Not Grouped by Guarantor */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Validation Fields</h3>
              
              {/* Watchlist Section */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Watchlist</h4>
                  {(() => {
                    const totalMatches = Object.values(flagDatData).reduce((sum, data) => sum + data.watchlistMatches, 0);
                    return totalMatches > 0 ? <Badge variant="destructive">{totalMatches} Match(es)</Badge> : <Badge variant="success">No Match</Badge>;
                  })()}
                </div>
                
                <div className="space-y-2">
                  {guarantors.map(guarantor => {
                    const flagData = flagDatData[guarantor.name as keyof typeof flagDatData];
                    return (
                      <div key={guarantor.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <span className="text-sm">{guarantor.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{flagData.watchlistMatches}</span>
                          {flagData.watchlistMatches > 0 ? getStatusBadge('fail') : getStatusBadge('pass')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Blacklist Section */}
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Blacklist</h4>
                  {(() => {
                    const totalMatches = Object.values(flagDatData).reduce((sum, data) => sum + data.blacklistMatches, 0);
                    return totalMatches > 0 ? <Badge variant="destructive">{totalMatches} Match(es)</Badge> : <Badge variant="success">No Match</Badge>;
                  })()}
                </div>
                
                <div className="space-y-2">
                  {guarantors.map(guarantor => {
                    const flagData = flagDatData[guarantor.name as keyof typeof flagDatData];
                    return (
                      <div key={guarantor.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <span className="text-sm">{guarantor.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{flagData.blacklistMatches}</span>
                          {flagData.blacklistMatches > 0 ? getStatusBadge('fail') : getStatusBadge('pass')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Last Checked */}
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="text-sm font-medium">Last Checked</h4>
                <div className="space-y-2">
                  {guarantors.map(guarantor => {
                    const flagData = flagDatData[guarantor.name as keyof typeof flagDatData];
                    return (
                      <div key={guarantor.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <span className="text-sm">{guarantor.name}</span>
                        <span className="text-sm font-medium">{flagData.lastChecked}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* API Matching Results - Shown when toggled */}
            {showApiMatches && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">API Matching Results</h3>
                {flagDatApiMatches.length > 0 ? (
                  <div className="space-y-2">
                    {flagDatApiMatches.map(match => (
                      <div key={match.id} className="p-4 border rounded-lg bg-muted/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{match.guarantor}</Badge>
                            <Badge variant={match.type === 'watchlist' ? 'warning' : 'destructive'} className="text-xs">
                              {match.type}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">Score: {match.matchScore}%</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Country</p>
                            <p className="font-medium">{match.country}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Description</p>
                            <p className="font-medium">{match.description}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Class</p>
                            <p className="font-medium">{match.class}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-muted/20 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">No API matching results available</p>
                  </div>
                )}
              </div>
            )}

            {/* Overall Status Message */}
            {(() => {
              const hasAnyMatches = Object.values(flagDatData).some(data => 
                data.watchlistMatches > 0 || data.blacklistMatches > 0
              );
              const totalMatches = Object.values(flagDatData).reduce((sum, data) => 
                sum + data.watchlistMatches + data.blacklistMatches, 0
              );
              
              return hasAnyMatches ? (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                  <p className="text-sm font-medium text-destructive">⚠ {totalMatches} match(es) found - Manual Review by Underwriting/Credit Analyst required</p>
                </div>
              ) : (
                <div className="p-3 bg-success/10 border border-success/20 rounded">
                  <p className="text-sm font-medium text-success">✓ No matches - Continue workflow</p>
                </div>
              );
            })()}
          </CardContent>}
      </Card>

      {/* Logs */}
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
        {expandedCards.logs && <CardContent className="space-y-3">
            {auditLogs.map(log => <div key={log.id} className="border rounded-lg">
                <div className="p-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleLog(log.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="outline" className="text-xs">
                        {log.tag}
                      </Badge>
                      <span className="text-sm font-medium">{log.description}</span>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedLogs[log.id] ? '' : '-rotate-90'}`} />
                  </div>
                </div>

                {expandedLogs[log.id] && <div className="p-3 bg-muted/20 border-t space-y-2">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Action:</span>
                        <span className="ml-2 font-medium">{log.action}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <span className="ml-2 font-medium">{log.user}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-2 font-medium">{log.status}</span>
                      </div>
                      {log.exceptionTag && <div>
                          <span className="text-muted-foreground">Exception Tag:</span>
                          <span className="ml-2 font-medium">{log.exceptionTag}</span>
                        </div>}
                    </div>
                    {log.jsonData && <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">JSON Data:</p>
                        <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                          {JSON.stringify(log.jsonData, null, 2)}
                        </pre>
                      </div>}
                  </div>}
              </div>)}
          </CardContent>}
      </Card>
    </div>;
};