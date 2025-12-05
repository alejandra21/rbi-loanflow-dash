import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, Shield, MapPin, DollarSign, Calendar, User, Building, Info, AlertCircle } from "lucide-react";
import { useState } from "react";
import { ClosingProtectionData, ValidationCheck } from "@/types/closingProtection";
import { ManualReviewModal } from "./ManualReviewModal";

interface ClosingProtectionTabProps {
  data: ClosingProtectionData;
  phaseStatus: string;
  lastUpdated: string;
}

export const ClosingProtectionTab = ({
  data,
  phaseStatus,
  lastUpdated
}: ClosingProtectionTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    cplDocument: true,
    crossReference: true,
    validationChecks: true,
    auditLog: false
  });

  const [manualReviewOpen, setManualReviewOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState<{
    metric: string;
    posValue: string | number;
    aiValue: string | number;
    difference: string | number;
  } | null>(null);

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const openManualReview = (check: ValidationCheck) => {
    setSelectedCheck({
      metric: check.name,
      posValue: check.posValue,
      aiValue: check.cplValue,
      difference: check.errorMessage || 'N/A'
    });
    setManualReviewOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pass":
      case "passed":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>;
      case "warn":
      case "warning":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Warning</Badge>;
      case "fail":
      case "failed":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      case "pending":
        return <Badge variant="outline" className="gap-1"><AlertCircle className="h-3 w-3" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getValidationStatusBadge = (check: ValidationCheck) => {
    const { status, systemBehavior } = check;
    
    if (status === 'pass') {
      return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> OK</Badge>;
    }
    
    if (systemBehavior === 'stop_workflow') {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Stop Workflow</Badge>;
    }
    
    if (systemBehavior === 'manual_review') {
      return (
        <Badge 
          variant="warning" 
          className="gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => openManualReview(check)}
        >
          <AlertTriangle className="h-3 w-3" /> Manual Review
        </Badge>
      );
    }
    
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Phase Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium">CPL Validation</h2>
          {getStatusBadge(phaseStatus)}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* CPL Document Details */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('cplDocument')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              CPL Document (AI Extracted)
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.cplDocument ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.cplDocument && (
          <CardContent className="space-y-6">
            {/* OCR Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">OCR Extraction Status</span>
              </div>
              {data.cplDocument.ocrStatus === 'readable' ? (
                <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Readable</Badge>
              ) : (
                <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> {data.cplDocument.ocrStatus}</Badge>
              )}
            </div>

            {/* CPL Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Building className="h-3 w-3" /> Lender Name
                </p>
                <p className="text-sm font-medium">{data.cplDocument.lenderName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Property Address
                </p>
                <p className="text-sm font-medium">{data.cplDocument.propertyAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Loan Amount
                </p>
                <p className="text-sm font-medium">{formatCurrency(data.cplDocument.loanAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <User className="h-3 w-3" /> Closing Agent
                </p>
                <p className="text-sm font-medium">{data.cplDocument.graterAgentName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Underwriter</p>
                <p className="text-sm font-medium">{data.cplDocument.underwriter}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Effective Date
                </p>
                <p className="text-sm font-medium">{formatDate(data.cplDocument.effectiveDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">CPL Type</p>
                <Badge variant={data.cplDocument.cplType === 'ALTA' || data.cplDocument.cplType === 'T-50' ? 'default' : 'secondary'}>
                  {data.cplDocument.cplType}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Loss Payee</p>
                <p className="text-sm font-medium">{data.cplDocument.lossPayee}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Transaction Purpose</p>
                <Badge variant="outline">{data.cplDocument.purpose}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Borrower Name</p>
                <p className="text-sm font-medium">{data.cplDocument.borrowerName}</p>
              </div>
            </div>

            <Separator />

            {/* Source Document */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Source Document</span>
              <Button size="sm" variant="outline" onClick={() => window.open(data.cplDocument.sourceFile, '_blank')}>
                <FileText className="h-4 w-4 mr-1" />
                View CPL
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Cross-Reference Data */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('crossReference')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Cross-Reference Sources
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.crossReference ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.crossReference && (
          <CardContent className="space-y-6">
            {/* Title Commitment */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Title Commitment
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Property Address</p>
                  <p className="text-sm">{data.titleCommitment.propertyAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                  <p className="text-sm">{formatCurrency(data.titleCommitment.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Underwriter</p>
                  <p className="text-sm">{data.titleCommitment.underwriter}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Agent Name</p>
                  <p className="text-sm">{data.titleCommitment.agentName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vested Owner</p>
                  <p className="text-sm">{data.titleCommitment.vestedOwner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Borrower Name</p>
                  <p className="text-sm">{data.titleCommitment.borrowerName}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* POS Data */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                POS / Loan Application
              </h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Property Address</p>
                  <p className="text-sm">{data.posData.propertyAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Scheduled Closing Date</p>
                  <p className="text-sm">{formatDate(data.posData.scheduledClosingDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Purpose</p>
                  <Badge variant="outline">{data.posData.loanPurpose}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Borrower Name</p>
                  <p className="text-sm">{data.posData.borrowerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Property State</p>
                  <p className="text-sm">{data.posData.propertyState}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* USPS & Appraisal Addresses */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address Verification
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">USPS Standardized Address</p>
                  <p className="text-sm font-medium">{data.uspsAddress.standardizedAddress}</p>
                  <div className="mt-2">
                    <Badge variant={data.uspsAddress.matchScore >= 90 ? 'success' : 'warning'}>
                      {data.uspsAddress.matchScore}% Match
                    </Badge>
                  </div>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Appraisal Address</p>
                  <p className="text-sm font-medium">{data.appraisalAddress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Validation Checks Table */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('validationChecks')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Validation Checks
            </div>
            <div className="flex items-center gap-2">
              {(() => {
                const hasFail = data.validationChecks.some(c => c.status === 'fail');
                const hasWarn = data.validationChecks.some(c => c.status === 'warn');
                if (hasFail) {
                  return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Issues Found</Badge>;
                }
                if (hasWarn) {
                  return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Warnings</Badge>;
                }
                return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> All Passed</Badge>;
              })()}
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.validationChecks ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.validationChecks && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Step</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Logic / Pass Criteria</TableHead>
                  <TableHead>POS / Reference</TableHead>
                  <TableHead>CPL Value</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.validationChecks.map((check, index) => (
                  <TableRow key={index} className={check.status === 'fail' ? 'bg-destructive/5' : check.status === 'warn' ? 'bg-warning/5' : ''}>
                    <TableCell className="font-mono text-xs">{check.stepNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{check.name}</span>
                        {check.details && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">{check.details}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">{check.logicCriteria}</TableCell>
                    <TableCell className="text-sm">{check.posValue}</TableCell>
                    <TableCell className="text-sm">{check.cplValue}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        {getValidationStatusBadge(check)}
                        {check.errorMessage && check.status !== 'pass' && (
                          <span className="text-xs text-destructive max-w-[200px] text-right">{check.errorMessage}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Business Rules Reference */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('auditLog')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Business Rules Reference
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.auditLog ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.auditLog && (
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-2">Lender Name Requirements</p>
                <p className="text-muted-foreground text-xs">
                  Must equal "RBI Private Lending, LLC ISAOA/ATIMA" — Exception: Texas (TX) uses "RBI Private Lending, LLC"
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-2">State-Specific CPL Form</p>
                <p className="text-muted-foreground text-xs">
                  Texas: T-50 form required | All other states: ALTA form required
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium mb-2">Effective Date</p>
                <p className="text-muted-foreground text-xs">
                  CPL Effective Date must be ≤ scheduled closing date (within 60 days)
                </p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Pending Integrations
                </p>
                <p className="text-muted-foreground text-xs">
                  • 8.5 Authorized Agent Match — Requires Funding Shield API integration<br />
                  • 8.7 Underwriter Name Validation — Requires approved underwriter contact list
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Manual Review Modal */}
      <ManualReviewModal
        open={manualReviewOpen}
        onOpenChange={setManualReviewOpen}
        metricName={selectedCheck?.metric || ''}
        posValue={selectedCheck?.posValue || ''}
        aiValue={selectedCheck?.aiValue || ''}
        deviation={selectedCheck?.difference || ''}
      />
    </div>
  );
};
