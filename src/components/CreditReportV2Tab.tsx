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

export const CreditReportV2Tab = ({ phase }: CreditReportV2TabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    creditReviewSummary: true,
    logs: false,
  });
  
  const [expandedGuarantors, setExpandedGuarantors] = useState<Record<string, boolean>>({
    'John Doe': false,
    'Jane Smith': false
  });
  
  const [expandedGuarantorSections, setExpandedGuarantorSections] = useState<Record<string, boolean>>({
    'John Doe-creditReport': false,
    'John Doe-tlo': false,
    'John Doe-lexisNexis': false,
    'John Doe-flagDat': false,
    'Jane Smith-creditReport': false,
    'Jane Smith-tlo': false,
    'Jane Smith-lexisNexis': false,
    'Jane Smith-flagDat': false,
  });
  
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  
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

  const guarantors = [
    {
      name: "John Doe",
      ownership: 60,
      fico: 720,
      pullDate: "2025-11-01",
      bureau: "Experian",
      isForeignNational: false,
      ssn: "***-**-1234",
      dob: "1985-06-15",
      ssnIssueDate: "2000-01-01",
      utilization: 35,
      hasCreditAuth: true,
      validation: 'pass',
      latePayments: {
        thirtyDays: 0,
        sixtyDays: 0,
        ninetyDays: 0
      },
      publicRecords: {
        count: 0,
        collections: 0,
        bankruptcies: "No (0)"
      },
      tlo: {
        decision: "pass",
        identityValidation: true
      },
      lexisNexis: {
        matches: false,
        reportDate: "2025-10-15"
      },
      flagDat: {
        matches: false
      }
    },
    {
      name: "Jane Smith",
      ownership: 40,
      fico: 695,
      pullDate: "2025-11-01",
      bureau: "TransUnion",
      isForeignNational: false,
      ssn: "***-**-5678",
      dob: "1988-03-22",
      ssnIssueDate: "2003-05-15",
      utilization: 55,
      hasCreditAuth: true,
      validation: 'warn',
      latePayments: {
        thirtyDays: 1,
        sixtyDays: 0,
        ninetyDays: 0
      },
      publicRecords: {
        count: 0,
        collections: 0,
        bankruptcies: "No (0)"
      },
      tlo: {
        decision: "manual_validation",
        identityValidation: false
      },
      lexisNexis: {
        matches: false,
        reportDate: "2025-10-15"
      },
      flagDat: {
        matches: false
      }
    }
  ];

  const numGuarantors = guarantors.length;
  const overallStatus = guarantors.some(g => g.validation === 'fail') ? 'fail' : 
                       guarantors.some(g => g.validation === 'warn') ? 'warn' : 'pass';
  
  const lowestFICO = Math.min(...guarantors.map(g => g.fico));
  const ficoMeetsProductMin = lowestFICO >= productMin;

  const auditLogs = [
    {
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
    }
  ];

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

  return (
    <div className="space-y-4">
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
      <CreditReviewSummary
        expandedCards={expandedCards}
        toggleCard={toggleCard}
        overallStatus={overallStatus}
        numGuarantors={numGuarantors}
        companyTier={companyTier}
        loanProgram={loanProgram}
        tierChanged={tierChanged}
        previousTier={previousTier}
        tierChangeReason={tierChangeReason}
        lowestFICO={lowestFICO}
        productMin={productMin}
        verifiedProjects={verifiedProjects}
        ficoMeetsProductMin={ficoMeetsProductMin}
        ltc={ltc}
        ltv={ltv}
        loanLimit={loanLimit}
        closingDate={closingDate}
      />


      {/* Guarantors */}
      {guarantors.map((guarantor) => (
        <Card key={guarantor.name}>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleGuarantor(guarantor.name)}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>{guarantor.name}</span>
                <Badge variant="outline" className="text-xs">
                  {guarantor.ownership}% Ownership
                </Badge>
                {getStatusBadge(guarantor.validation)}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedGuarantors[guarantor.name] ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>

          {expandedGuarantors[guarantor.name] && (
            <CardContent className="space-y-6">
              {/* Credit Report Validations */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit Report Validations
                </h3>
                
                <div className="space-y-4">
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
                      
                      {guarantor.ssnIssueDate && (
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">SSN Issued Date</p>
                          <p className="font-medium text-sm">{guarantor.ssnIssueDate}</p>
                        </div>
                      )}
                      
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
                        {isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) !== null ? (
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) ? 'Valid' : 'Invalid'}
                            </p>
                            {isDobVsSsnValid(guarantor.dob, guarantor.ssnIssueDate) ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        ) : (
                          <p className="font-medium text-sm">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Credit Authorization */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3 text-muted-foreground">Credit Authorization</h5>
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">Credit Authorization</p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Borrower authorization to pull credit report</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{guarantor.hasCreditAuth ? 'Yes' : 'No'}</p>
                          {guarantor.hasCreditAuth ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        {guarantor.hasCreditAuth && (
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download Authorization
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Credit Score & Usage */}
                  <div>
                    <h5 className="text-sm font-semibold mb-3 text-muted-foreground">Credit Score & Usage</h5>
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
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">Utilization</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Credit utilization should be below 50% for optimal approval</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{guarantor.utilization}%</p>
                          {isUtilizationValid(guarantor.utilization) ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/20 rounded space-y-1">
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">Credit Report Date</p>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Credit report must be less than 90 days old from closing date</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{guarantor.pullDate}</p>
                          {isCreditReportDateValid(guarantor.pullDate) ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Utilization Business Rules */}
                    <Collapsible
                      open={expandedCards.utilizationRules}
                      onOpenChange={() => toggleCard('utilizationRules')}
                    >
                      <div className="space-y-3 mt-3">
                        <CollapsibleTrigger className="flex items-center gap-2 w-full">
                          <h6 className="text-xs font-semibold text-muted-foreground">Utilization Business Rules</h6>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.utilizationRules ? '' : '-rotate-90'}`} />
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="rounded-lg border border-border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Utilization Range</TableHead>
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
                      </div>
                    </Collapsible>
                  </div>

                  <Separator />

                  {/* Late Payment History */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-muted-foreground">Late Payment History</h5>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download Report
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-muted/20 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">30 Days</p>
                        <p className="font-medium text-sm">{guarantor.latePayments.thirtyDays}</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">60 Days</p>
                        <p className="font-medium text-sm">{guarantor.latePayments.sixtyDays}</p>
                      </div>
                      <div className="p-3 bg-muted/20 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">90+ Days</p>
                        <p className="font-medium text-sm">{guarantor.latePayments.ninetyDays}</p>
                      </div>
                    </div>
                    {guarantor.latePayments.thirtyDays === 0 && 
                     guarantor.latePayments.sixtyDays === 0 && 
                     guarantor.latePayments.ninetyDays === 0 && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✓ No Late Payments - Continue workflow
                        </p>
                      </div>
                    )}
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
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">Collection/charge-offs</p>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{guarantor.publicRecords.collections}</p>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded space-y-1 col-span-2">
                          <p className="text-xs text-muted-foreground">Bankruptcies</p>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{guarantor.publicRecords.bankruptcies}</p>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {guarantor.publicRecords.count === 0 && 
                     guarantor.publicRecords.collections === 0 && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✓ No Public Records Found - Continue workflow
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* TLO Validations */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  TLO Validations
                  {getStatusBadge(guarantor.tlo.decision)}
                </h3>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm">
                    TLO Decision: <span className="font-semibold">{guarantor.tlo.decision === 'pass' ? 'Pass' : 'Manual Validation Required'}</span>
                  </p>
                  <p className="text-sm mt-2">
                    Identity Validation: <span className="font-semibold">{guarantor.tlo.identityValidation ? 'Valid' : 'Requires Review'}</span>
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* LexisNexis Validations */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  LexisNexis Validations
                  {getStatusBadge(guarantor.lexisNexis.matches ? 'fail' : 'pass')}
                </h3>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm">
                    Watchlist Matches: <span className="font-semibold">{guarantor.lexisNexis.matches ? 'Found' : 'None'}</span>
                  </p>
                  <p className="text-sm mt-2">
                    Report Date: <span className="font-semibold">{guarantor.lexisNexis.reportDate}</span>
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* FlagDat Validations */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                  <AlertCircleIcon className="h-4 w-4" />
                  FlagDat Validations
                  {getStatusBadge(guarantor.flagDat.matches ? 'fail' : 'pass')}
                </h3>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm">
                    Fraud Matches: <span className="font-semibold">{guarantor.flagDat.matches ? 'Found' : 'None'}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

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
        {expandedCards.logs && (
          <CardContent className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="border rounded-lg">
                <div
                  className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleLog(log.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="outline" className="text-xs">
                        {log.tag}
                      </Badge>
                      <span className="text-sm font-medium">{log.description}</span>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedLogs[log.id] ? '' : '-rotate-90'
                      }`}
                    />
                  </div>
                </div>

                {expandedLogs[log.id] && (
                  <div className="p-3 bg-muted/20 border-t space-y-2">
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
                      {log.exceptionTag && (
                        <div>
                          <span className="text-muted-foreground">Exception Tag:</span>
                          <span className="ml-2 font-medium">{log.exceptionTag}</span>
                        </div>
                      )}
                    </div>
                    {log.jsonData && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">JSON Data:</p>
                        <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                          {JSON.stringify(log.jsonData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
