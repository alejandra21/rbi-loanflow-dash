import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, Shield, MapPin, DollarSign, Calendar, User, Building, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ClosingProtectionData, ValidationCheck } from "@/types/closingProtection";
import { ManualReviewModal } from "./ManualReviewModal";

interface ClosingProtectionTabProps {
  data: ClosingProtectionData;
  phaseStatus: string;
  lastUpdated: string;
}

interface FieldValidation {
  isValid: boolean;
  errorMessage?: string;
  requiresManualReview?: boolean;
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

  const [addressDrilldownOpen, setAddressDrilldownOpen] = useState(false);
  const [crossmatchDrilldownOpen, setCrossmatchDrilldownOpen] = useState(false);

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

  const openManualReview = (metric: string, posValue: string, cplValue: string, errorMessage: string) => {
    setSelectedCheck({
      metric,
      posValue,
      aiValue: cplValue,
      difference: errorMessage
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
          onClick={() => openManualReview(check.name, check.posValue, check.cplValue, check.errorMessage || 'N/A')}
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

  // Validation functions
  const isTexas = data.posData.propertyState === 'TX';
  const expectedLenderName = isTexas ? "RBI Private Lending, LLC" : "RBI Private Lending, LLC ISAOA/ATIMA";
  const expectedLossPayee = isTexas ? "RBI Private Lending, LLC" : "RBI Private Lending, LLC ISAOA/ATIMA";
  const expectedCPLType = isTexas ? "T-50" : "ALTA";

  const validateLenderName = (): FieldValidation => {
    const isValid = data.cplDocument.lenderName === expectedLenderName;
    return {
      isValid,
      errorMessage: isValid ? undefined : `Expected: ${expectedLenderName}`,
      requiresManualReview: !isValid
    };
  };

  const validatePropertyAddress = (): FieldValidation => {
    const cplAddr = data.cplDocument.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim();
    const appraisalAddr = data.appraisalAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim();
    const uspsAddr = data.uspsAddress.standardizedAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim();
    const titleAddr = data.titleCommitment.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim();
    
    const matchesAppraisal = cplAddr === appraisalAddr;
    const matchesUSPS = uspsAddr.includes(cplAddr.split(' ')[0]) || cplAddr.includes(uspsAddr.split(' ')[0]);
    const matchesTitle = cplAddr === titleAddr;
    
    const isValid = matchesAppraisal && matchesTitle && data.uspsAddress.matchScore >= 90;
    return {
      isValid,
      errorMessage: isValid ? undefined : "Address mismatch detected across documents",
      requiresManualReview: !isValid
    };
  };

  const validateLoanAmount = (): FieldValidation => {
    const isValid = data.cplDocument.loanAmount >= data.titleCommitment.loanAmount;
    return {
      isValid,
      errorMessage: isValid ? undefined : `CPL amount (${formatCurrency(data.cplDocument.loanAmount)}) < Title (${formatCurrency(data.titleCommitment.loanAmount)})`,
      requiresManualReview: !isValid
    };
  };

  const validateEffectiveDate = (): FieldValidation => {
    const effectiveDate = new Date(data.cplDocument.effectiveDate);
    const closingDate = new Date(data.posData.scheduledClosingDate);
    const daysDiff = Math.floor((closingDate.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    const isValid = effectiveDate <= closingDate && daysDiff <= 60;
    return {
      isValid,
      errorMessage: isValid ? undefined : daysDiff > 60 ? `Effective date is ${daysDiff} days before closing (max 60)` : "Effective date is after closing date",
      requiresManualReview: !isValid
    };
  };

  const validateCPLType = (): FieldValidation => {
    const isValid = data.cplDocument.cplType === expectedCPLType;
    return {
      isValid,
      errorMessage: isValid ? undefined : `Expected ${expectedCPLType} for ${isTexas ? 'Texas' : 'non-Texas'} property`,
      requiresManualReview: !isValid
    };
  };

  const validateLossPayee = (): FieldValidation => {
    const isValid = data.cplDocument.lossPayee.includes(expectedLossPayee);
    return {
      isValid,
      errorMessage: isValid ? undefined : `Must include: ${expectedLossPayee}`,
      requiresManualReview: !isValid
    };
  };

  const validateTitleCrossmatch = (): FieldValidation => {
    const underwriterMatch = data.cplDocument.underwriter === data.titleCommitment.underwriter;
    const agentMatch = data.cplDocument.agentName === data.titleCommitment.agentName;
    const addressMatch = validatePropertyAddress().isValid;
    const amountValid = validateLoanAmount().isValid;
    const isValid = underwriterMatch && agentMatch && addressMatch && amountValid;
    return {
      isValid,
      errorMessage: isValid ? undefined : "Mismatch in underwriter, agent, address, or loan amount",
      requiresManualReview: !isValid
    };
  };

  const validatePurchaseFlow = (): { purposeValid: FieldValidation; crossDocValid: FieldValidation } | null => {
    if (data.posData.loanPurpose !== 'Purchase') return null;
    
    const purposeValid: FieldValidation = {
      isValid: data.cplDocument.purpose === 'Purchase' || data.cplDocument.purpose.toLowerCase().includes('purchase'),
      errorMessage: data.cplDocument.purpose === 'Purchase' ? undefined : "CPL must specify 'Purchase'",
      requiresManualReview: data.cplDocument.purpose !== 'Purchase'
    };

    const crossDocValid: FieldValidation = {
      isValid: validatePropertyAddress().isValid && data.cplDocument.underwriter === data.titleCommitment.underwriter,
      errorMessage: validatePropertyAddress().isValid && data.cplDocument.underwriter === data.titleCommitment.underwriter ? undefined : "Cross-document validation failed",
      requiresManualReview: !(validatePropertyAddress().isValid && data.cplDocument.underwriter === data.titleCommitment.underwriter)
    };

    return { purposeValid, crossDocValid };
  };

  const validateRefinanceFlow = (): { borrowerValid: FieldValidation; crossDocValid: FieldValidation } | null => {
    if (data.posData.loanPurpose !== 'Refinance') return null;

    const borrowerMatches = data.cplDocument.borrowerName === data.posData.borrowerName && 
                           data.cplDocument.borrowerName === data.titleCommitment.vestedOwner;
    
    const borrowerValid: FieldValidation = {
      isValid: borrowerMatches,
      errorMessage: borrowerMatches ? undefined : "Borrower/Owner mismatch across CPL, POS, and Title",
      requiresManualReview: !borrowerMatches
    };

    const crossDocValid: FieldValidation = {
      isValid: validatePropertyAddress().isValid && data.cplDocument.underwriter === data.titleCommitment.underwriter,
      errorMessage: validatePropertyAddress().isValid ? undefined : "Cross-document validation failed",
      requiresManualReview: !(validatePropertyAddress().isValid && data.cplDocument.underwriter === data.titleCommitment.underwriter)
    };

    return { borrowerValid, crossDocValid };
  };

  // Get all validations
  const lenderValidation = validateLenderName();
  const addressValidation = validatePropertyAddress();
  const loanAmountValidation = validateLoanAmount();
  const effectiveDateValidation = validateEffectiveDate();
  const cplTypeValidation = validateCPLType();
  const lossPayeeValidation = validateLossPayee();
  const titleCrossmatchValidation = validateTitleCrossmatch();
  const purchaseFlow = validatePurchaseFlow();
  const refinanceFlow = validateRefinanceFlow();

  const ValidationIndicator = ({ validation, label, onManualReview }: { 
    validation: FieldValidation; 
    label: string;
    onManualReview?: () => void;
  }) => (
    <div className="flex items-center gap-1.5">
      {validation.isValid ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : validation.requiresManualReview ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle 
                className="h-4 w-4 text-amber-500 cursor-pointer" 
                onClick={onManualReview}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{validation.errorMessage}</p>
              <p className="text-xs text-muted-foreground mt-1">Click for manual review</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <XCircle className="h-4 w-4 text-destructive" />
      )}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );

  const FieldWithValidation = ({ 
    label, 
    value, 
    validation,
    icon: Icon,
    onManualReview
  }: { 
    label: string; 
    value: string | React.ReactNode;
    validation: FieldValidation;
    icon?: React.ElementType;
    onManualReview?: () => void;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {Icon && <Icon className="h-3 w-3" />} {label}
        </p>
        {validation.isValid ? (
          <span className="text-xs text-green-600 flex items-center gap-1">
            Valid <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span 
                  className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer hover:text-amber-600"
                  onClick={onManualReview}
                >
                  Review Required <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{validation.errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );

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

      {/* CPL Document Details with Inline Validations */}
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

            {/* CPL Details Grid with Validations */}
            <div className="grid grid-cols-2 gap-6">
              {/* 1. Lender Name */}
              <FieldWithValidation
                label="Lender Name"
                value={data.cplDocument.lenderName}
                validation={lenderValidation}
                icon={Building}
                onManualReview={() => openManualReview(
                  "Lender Name Verification",
                  expectedLenderName,
                  data.cplDocument.lenderName,
                  lenderValidation.errorMessage || "Mismatch"
                )}
              />

              {/* 2. Property Address with Drilldown */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Property Address
                  </p>
                  {addressValidation.isValid ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      Valid <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span 
                            className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer hover:text-amber-600"
                            onClick={() => openManualReview(
                              "Property Address Match",
                              "See address comparison below",
                              data.cplDocument.propertyAddress,
                              addressValidation.errorMessage || "Address mismatch"
                            )}
                          >
                            Review Required <AlertTriangle className="h-3.5 w-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{addressValidation.errorMessage}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-sm font-medium">{data.cplDocument.propertyAddress}</p>
                <Collapsible open={addressDrilldownOpen} onOpenChange={setAddressDrilldownOpen}>
                  <CollapsibleTrigger className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                    <ChevronDown className={`h-3 w-3 transition-transform ${addressDrilldownOpen ? '' : '-rotate-90'}`} />
                    View address comparison
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 p-3 bg-muted/30 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Appraisal:</span>
                      <span>{data.appraisalAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">USPS Normalized:</span>
                      <span>{data.uspsAddress.standardizedAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title Commitment:</span>
                      <span>{data.titleCommitment.propertyAddress}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-muted-foreground">USPS Match Score:</span>
                      <Badge variant={data.uspsAddress.matchScore >= 90 ? 'success' : 'warning'} className="text-xs">
                        {data.uspsAddress.matchScore}%
                      </Badge>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* 3. Loan Amount */}
              <FieldWithValidation
                label="Loan Amount"
                value={formatCurrency(data.cplDocument.loanAmount)}
                validation={loanAmountValidation}
                icon={DollarSign}
                onManualReview={() => openManualReview(
                  "CPL Loan Amount Validation",
                  `Title Commitment: ${formatCurrency(data.titleCommitment.loanAmount)}`,
                  formatCurrency(data.cplDocument.loanAmount),
                  loanAmountValidation.errorMessage || "Amount mismatch"
                )}
              />

              {/* Agent Name (display only) */}
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <User className="h-3 w-3" /> Agent Name
                </p>
                <p className="text-sm font-medium">{data.cplDocument.agentName}</p>
              </div>

              {/* Underwriter (display only) */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Underwriter</p>
                <p className="text-sm font-medium">{data.cplDocument.underwriter}</p>
              </div>

              {/* 4. Effective Date */}
              <FieldWithValidation
                label="Effective Date"
                value={formatDate(data.cplDocument.effectiveDate)}
                validation={effectiveDateValidation}
                icon={Calendar}
                onManualReview={() => openManualReview(
                  "Effective Date Verification",
                  `Scheduled Closing: ${formatDate(data.posData.scheduledClosingDate)}`,
                  formatDate(data.cplDocument.effectiveDate),
                  effectiveDateValidation.errorMessage || "Date issue"
                )}
              />

              {/* 5. CPL Type */}
              <FieldWithValidation
                label="CPL Type"
                value={<Badge variant={data.cplDocument.cplType === 'ALTA' || data.cplDocument.cplType === 'T-50' ? 'default' : 'secondary'}>{data.cplDocument.cplType}</Badge>}
                validation={cplTypeValidation}
                onManualReview={() => openManualReview(
                  "State-Specific CPL Form Check",
                  `Expected: ${expectedCPLType} (${data.posData.propertyState})`,
                  data.cplDocument.cplType,
                  cplTypeValidation.errorMessage || "Wrong form type"
                )}
              />

              {/* Transaction Type (display only) */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Transaction Type</p>
                <Badge variant="outline">{data.cplDocument.purpose}</Badge>
              </div>

              {/* 6. Loss Payee */}
              <FieldWithValidation
                label="Loss Payee"
                value={data.cplDocument.lossPayee}
                validation={lossPayeeValidation}
                onManualReview={() => openManualReview(
                  "Loss Payee Validation",
                  `Expected: ${expectedLossPayee}`,
                  data.cplDocument.lossPayee,
                  lossPayeeValidation.errorMessage || "Loss payee mismatch"
                )}
              />
            </div>

            <Separator />

            {/* 7. CPL → Title Commitment Crossmatch */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  CPL → Title Commitment Crossmatch
                </h4>
                {titleCrossmatchValidation.isValid ? (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    All Aligned <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span 
                    className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer hover:text-amber-600"
                    onClick={() => openManualReview(
                      "CPL → Title Crossmatch",
                      "Title Commitment data",
                      "CPL Document data",
                      titleCrossmatchValidation.errorMessage || "Crossmatch failed"
                    )}
                  >
                    Review Required <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <Collapsible open={crossmatchDrilldownOpen} onOpenChange={setCrossmatchDrilldownOpen}>
                <CollapsibleTrigger className="text-xs text-primary hover:underline flex items-center gap-1">
                  <ChevronDown className={`h-3 w-3 transition-transform ${crossmatchDrilldownOpen ? '' : '-rotate-90'}`} />
                  View crossmatch details
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-3 bg-muted/30 rounded-lg space-y-2 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">Field</span>
                    <span className="text-muted-foreground font-medium">CPL</span>
                    <span className="text-muted-foreground font-medium">Title</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Underwriter</span>
                    <span>{data.cplDocument.underwriter}</span>
                    <span className="flex items-center gap-1">
                      {data.titleCommitment.underwriter}
                      {data.cplDocument.underwriter === data.titleCommitment.underwriter ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Agent</span>
                    <span>{data.cplDocument.agentName}</span>
                    <span className="flex items-center gap-1">
                      {data.titleCommitment.agentName}
                      {data.cplDocument.agentName === data.titleCommitment.agentName ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span>{formatCurrency(data.cplDocument.loanAmount)}</span>
                    <span className="flex items-center gap-1">
                      {formatCurrency(data.titleCommitment.loanAmount)}
                      {data.cplDocument.loanAmount >= data.titleCommitment.loanAmount ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                    </span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Separator />

            {/* 8. Purchase Flow Validations */}
            {purchaseFlow && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Purchase Transaction Validation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">8a. CPL Purpose = Purchase</span>
                    {purchaseFlow.purposeValid.isValid ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span 
                        className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer"
                        onClick={() => openManualReview(
                          "CPL Purpose Verification",
                          "Purchase",
                          data.cplDocument.purpose,
                          purchaseFlow.purposeValid.errorMessage || "Purpose mismatch"
                        )}
                      >
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">8b. Cross-Document Validation (CPL → Title)</span>
                    {purchaseFlow.crossDocValid.isValid ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span 
                        className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer"
                        onClick={() => openManualReview(
                          "Cross-Document Validation",
                          "Property Address + Underwriter alignment",
                          "See details",
                          purchaseFlow.crossDocValid.errorMessage || "Cross-doc validation failed"
                        )}
                      >
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  {purchaseFlow.purposeValid.isValid && purchaseFlow.crossDocValid.isValid && (
                    <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Ready for Phase 9
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. Refinance Flow Validations */}
            {refinanceFlow && (
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Refinance Transaction Validation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">9a. Borrower/Owner Match</span>
                    {refinanceFlow.borrowerValid.isValid ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span 
                        className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer"
                        onClick={() => openManualReview(
                          "Borrower Match Verification",
                          `POS: ${data.posData.borrowerName}, Title Vested: ${data.titleCommitment.vestedOwner}`,
                          data.cplDocument.borrowerName,
                          refinanceFlow.borrowerValid.errorMessage || "Borrower mismatch"
                        )}
                      >
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">9b. Cross-Document Validation (CPL → Title → Loan Docs)</span>
                    {refinanceFlow.crossDocValid.isValid ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span 
                        className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer"
                        onClick={() => openManualReview(
                          "Cross-Document Validation",
                          "Borrower, Address, Underwriter alignment",
                          "See details",
                          refinanceFlow.crossDocValid.errorMessage || "Cross-doc validation failed"
                        )}
                      >
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>
                  {refinanceFlow.borrowerValid.isValid && refinanceFlow.crossDocValid.isValid && (
                    <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Ready for Phase 9
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                  <p className="text-sm">{formatCurrency(data.posData.loanAmount)}</p>
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
              Validation Checks Summary
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
                <h4 className="font-semibold mb-2">Lender Name Requirements</h4>
                <p className="text-muted-foreground">Standard: "RBI Private Lending, LLC ISAOA/ATIMA"</p>
                <p className="text-muted-foreground">Texas Exception: "RBI Private Lending, LLC"</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">CPL Form Types</h4>
                <p className="text-muted-foreground">Texas: T-50 form required</p>
                <p className="text-muted-foreground">All other states: ALTA form required</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Effective Date Rule</h4>
                <p className="text-muted-foreground">CPL Effective Date must be ≤ scheduled closing date and within 60 days</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Loan Amount Rule</h4>
                <p className="text-muted-foreground">CPL loan amount must be ≥ Title Commitment loan amount</p>
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
        posValue={String(selectedCheck?.posValue || '')}
        aiValue={String(selectedCheck?.aiValue || '')}
        deviation={String(selectedCheck?.difference || '')}
      />
    </div>
  );
};
