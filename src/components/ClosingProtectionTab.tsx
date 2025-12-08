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
    purchaseValidations: false,
    refinanceValidations: false,
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
    const {
      status,
      systemBehavior
    } = check;
    if (status === 'pass') {
      return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> OK</Badge>;
    }
    if (systemBehavior === 'stop_workflow') {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Stop Workflow</Badge>;
    }
    if (systemBehavior === 'manual_review') {
      return <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => openManualReview(check.name, check.posValue, check.cplValue, check.errorMessage || 'N/A')}>
          <AlertTriangle className="h-3 w-3" /> Manual Review
        </Badge>;
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
  const validatePurchaseFlow = (): {
    purposeValid: FieldValidation;
    crossDocValid: FieldValidation;
  } | null => {
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
    return {
      purposeValid,
      crossDocValid
    };
  };
  const validateRefinanceFlow = (): {
    borrowerValid: FieldValidation;
    crossDocValid: FieldValidation;
  } | null => {
    if (data.posData.loanPurpose !== 'Refinance') return null;
    const borrowerMatches = data.cplDocument.borrowerName === data.posData.borrowerName && data.cplDocument.borrowerName === data.titleCommitment.vestedOwner;
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
    return {
      borrowerValid,
      crossDocValid
    };
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
  const ValidationIndicator = ({
    validation,
    label,
    onManualReview
  }: {
    validation: FieldValidation;
    label: string;
    onManualReview?: () => void;
  }) => <div className="flex items-center gap-1.5">
      {validation.isValid ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : validation.requiresManualReview ? <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertTriangle className="h-4 w-4 text-amber-500 cursor-pointer" onClick={onManualReview} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{validation.errorMessage}</p>
              <p className="text-xs text-muted-foreground mt-1">Click for manual review</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> : <XCircle className="h-4 w-4 text-destructive" />}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>;
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
  }) => <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {Icon && <Icon className="h-3 w-3" />} {label}
        </p>
        {validation.isValid ? <span className="text-xs text-green-600 flex items-center gap-1">
            Valid <CheckCircle2 className="h-3.5 w-3.5" />
          </span> : <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer hover:text-amber-600" onClick={onManualReview}>
                  Review Required <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{validation.errorMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>;
  return <div className="space-y-4">
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
        {expandedCards.cplDocument && <CardContent className="space-y-6">
            {/* Download CPL Button and Transaction Type */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download CPL
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Transaction Type:</span>
                <Badge variant="secondary" className="text-sm font-medium">Purchase</Badge>
              </div>
            </div>

            {/* OCR Extraction Status */}
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">OCR Extraction Status</span>
              </div>
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Readable
              </Badge>
            </div>

            {/* CPL Basic Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Underwriter */}
              


              {/* Effective Date - 4 Column Layout */}
              <div className="col-span-full border rounded-lg overflow-hidden mt-2">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Effective Date Validation
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="font-medium mb-1">Effective Date Rule:</p>
                          <p className="text-xs">CPL Effective Date must be ≤ scheduled closing date and within 60 days</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  {effectiveDateValidation.isValid ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1">
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-6">
                  {/* Effective Date */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Effective Date</p>
                    <p className="text-sm font-medium flex items-center gap-1 text-foreground">
                      {formatDate(data.cplDocument.effectiveDate)}
                      {effectiveDateValidation.isValid ? <CheckCircle className="h-3 w-3 text-emerald-600" /> : <AlertTriangle className="h-3 w-3 text-destructive" />}
                    </p>
                  </div>
                  {/* Closing Date */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Closing Date</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {formatDate(data.posData.scheduledClosingDate)}
                      
                    </p>
                  </div>
                  {/* Date Age */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date Age</p>
                    {(() => {
                    const effectiveDate = new Date(data.cplDocument.effectiveDate);
                    const closingDate = new Date(data.posData.scheduledClosingDate);
                    const daysDiff = Math.ceil((closingDate.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
                    const isOverThreshold = daysDiff > 60;
                    return <p className="text-sm font-medium flex items-center gap-1 text-foreground">
                              {daysDiff} days
                              {isOverThreshold ? <AlertTriangle className="h-3 w-3 text-destructive" /> : <CheckCircle className="h-3 w-3 text-emerald-600" />}
                            </p>;
                  })()}
                  </div>
                  {/* Days Threshold */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Days Threshold</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      60
                      
                    </p>
                  </div>
                </div>
              </div>
            </div>

            </div>

            <Separator />

            {/* Property Address Validation Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Property Address
                </span>
                {addressValidation.isValid ? <Badge variant="success" className="gap-1">
                    <CheckCircle className="h-3 w-3" /> Passed
                  </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("Property Address Verification", data.cplDocument.propertyAddress, "Multiple Sources", addressValidation.errorMessage || "Mismatch")}>
                    <AlertTriangle className="h-3 w-3" /> Review
                  </Badge>}
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="w-[280px]">Subject Property Address</TableHead>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>External Source</TableHead>
                    <TableHead>External Address</TableHead>
                    <TableHead className="text-center w-[100px]">Match Score</TableHead>
                    <TableHead className="text-center w-[100px]">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Title Commitment */}
                  <TableRow>
                    <TableCell className="font-medium text-primary">{data.cplDocument.propertyAddress}</TableCell>
                    <TableCell className="text-muted-foreground">→</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">TITLE COMMITMENT
                    </span>
                        <p className="text-xs text-primary">{data.titleCommitment.vestedOwner}</p>
                      </div>
                    </TableCell>
                    <TableCell>{data.titleCommitment.propertyAddress}</TableCell>
                    <TableCell className="text-center">
                      {data.cplDocument.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() === data.titleCommitment.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() ? '100%' : '85%'}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.cplDocument.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() === data.titleCommitment.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() ? <Badge variant="success">Passed</Badge> : <Badge variant="warning">Review</Badge>}
                    </TableCell>
                  </TableRow>
                  {/* USPS Normalized */}
                  <TableRow>
                    <TableCell className="font-medium text-primary">{data.cplDocument.propertyAddress}</TableCell>
                    <TableCell className="text-muted-foreground">→</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">USPS NORMALIZED</span>
                        <p className="text-xs text-muted-foreground">Address Standardization</p>
                      </div>
                    </TableCell>
                    <TableCell>{data.uspsAddress.standardizedAddress}</TableCell>
                    <TableCell className="text-center">{data.uspsAddress.matchScore}%</TableCell>
                    <TableCell className="text-center">
                      {data.uspsAddress.matchScore >= 90 ? <Badge variant="success">Passed</Badge> : <Badge variant="warning">Review</Badge>}
                    </TableCell>
                  </TableRow>
                  {/* Appraisal */}
                  <TableRow>
                    <TableCell className="font-medium text-primary">{data.cplDocument.propertyAddress}</TableCell>
                    <TableCell className="text-muted-foreground">→</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">APPRAISAL</span>
                        <p className="text-xs text-muted-foreground">Property Valuation</p>
                      </div>
                    </TableCell>
                    <TableCell>{data.appraisalAddress}</TableCell>
                    <TableCell className="text-center">
                      {data.cplDocument.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() === data.appraisalAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() ? '100%' : '92%'}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.cplDocument.propertyAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() === data.appraisalAddress.toLowerCase().replace(/[,.\s]+/g, ' ').trim() ? <Badge variant="success">Passed</Badge> : <Badge variant="success">Passed</Badge>}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Separator />

            {/* Validation Cards */}
            <div className="space-y-4">
              {/* Lender Name Validation Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium flex items-center gap-1">
                    Lender Name
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="font-medium mb-1">Standard:</p>
                          <p className="text-xs mb-2">"RBI Private Lending, LLC ISAOA/ATIMA"</p>
                          <p className="font-medium mb-1">Texas Exception:</p>
                          <p className="text-xs">"RBI Private Lending, LLC"</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  {lenderValidation.isValid ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("Lender Name Verification", expectedLenderName, data.cplDocument.lenderName, lenderValidation.errorMessage || "Mismatch")}>
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium">{data.cplDocument.lenderName}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Business Rule</p>
                    <p className="text-sm font-medium">{expectedLenderName}</p>
                  </div>
                </div>
              </div>

              {/* Loan Amount Validation Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium flex items-center gap-1">
                    Loan Amount
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="font-medium mb-1">Validation Rule:</p>
                          <p className="text-xs">CPL loan amount must be ≥ Title Commitment loan amount</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  {loanAmountValidation.isValid ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("CPL Loan Amount Validation", formatCurrency(data.posData.loanAmount), formatCurrency(data.cplDocument.loanAmount), loanAmountValidation.errorMessage || "Amount mismatch")}>
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium">{formatCurrency(data.cplDocument.loanAmount)}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Title Commitment</p>
                    <p className="text-sm font-medium">{formatCurrency(data.posData.loanAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Loss Payee Validation Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium flex items-center gap-1">
                    Loss Payee
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="font-medium mb-1">Standard:</p>
                          <p className="text-xs mb-2">"RBI Private Lending, LLC ISAOA/ATIMA"</p>
                          <p className="font-medium mb-1">Texas Exception:</p>
                          <p className="text-xs">"RBI Private Lending, LLC"</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  {lossPayeeValidation.isValid ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("Loss Payee Validation", expectedLossPayee, data.cplDocument.lossPayee, lossPayeeValidation.errorMessage || "Loss payee mismatch")}>
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium">{data.cplDocument.lossPayee}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Business Rule</p>
                    <p className="text-sm font-medium">{expectedLossPayee}</p>
                  </div>
                </div>
              </div>

              {/* Underwriter Validation Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium">Underwriter</span>
                  {data.cplDocument.underwriter === data.titleCommitment.underwriter ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("Underwriter Verification", data.titleCommitment.underwriter, data.cplDocument.underwriter, "Underwriter mismatch between CPL and Title Commitment")}>
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium">{data.cplDocument.underwriter}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Title Commitment</p>
                    <p className="text-sm font-medium">{data.titleCommitment.underwriter}</p>
                  </div>
                </div>
              </div>

              {/* Agent Validation Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium">Agent</span>
                  {data.cplDocument.agentName === data.titleCommitment.agentName ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("Agent Verification", data.titleCommitment.agentName, data.cplDocument.agentName, "Agent mismatch between CPL and Title Commitment")}>
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium">{data.cplDocument.agentName}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Title Commitment</p>
                    <p className="text-sm font-medium">{data.titleCommitment.agentName}</p>
                  </div>
                </div>
              </div>

              {/* CPL Type Validation Card */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium flex items-center gap-1">
                    CPL Type
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="font-medium mb-1">Texas:</p>
                          <p className="text-xs mb-2">T-50 form required</p>
                          <p className="font-medium mb-1">All other states:</p>
                          <p className="text-xs">ALTA form required</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  {cplTypeValidation.isValid ? <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge> : <Badge variant="warning" className="gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview("CPL Type Verification", expectedCPLType, data.cplDocument.cplType, cplTypeValidation.errorMessage || "CPL Type mismatch")}>
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium">{data.cplDocument.cplType}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Business Rule ({isTexas ? 'Texas' : 'Non-Texas'})</p>
                    <p className="text-sm font-medium">{expectedCPLType}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 7. CPL → Title Commitment Crossmatch */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  CPL → Title Commitment Crossmatch
                </h4>
                {titleCrossmatchValidation.isValid ? <span className="text-xs text-green-600 flex items-center gap-1">
                    All Aligned <CheckCircle2 className="h-3.5 w-3.5" />
                  </span> : <span className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer hover:text-amber-600" onClick={() => openManualReview("CPL → Title Crossmatch", "Title Commitment data", "CPL Document data", titleCrossmatchValidation.errorMessage || "Crossmatch failed")}>
                    Review Required <AlertTriangle className="h-3.5 w-3.5" />
                  </span>}
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
                      {data.cplDocument.underwriter === data.titleCommitment.underwriter ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-destructive" />}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Agent</span>
                    <span>{data.cplDocument.agentName}</span>
                    <span className="flex items-center gap-1">
                      {data.titleCommitment.agentName}
                      {data.cplDocument.agentName === data.titleCommitment.agentName ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-destructive" />}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span>{formatCurrency(data.cplDocument.loanAmount)}</span>
                    <span className="flex items-center gap-1">
                      {formatCurrency(data.titleCommitment.loanAmount)}
                      {data.cplDocument.loanAmount >= data.titleCommitment.loanAmount ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-destructive" />}
                    </span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <Separator />

            {/* 8. Purchase Flow Validations */}
            {purchaseFlow && <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Purchase Transaction Validation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPL Purpose = Purchase</span>
                    {purchaseFlow.purposeValid.isValid ? <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span> : <span className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer" onClick={() => openManualReview("CPL Purpose Verification", "Purchase", data.cplDocument.purpose, purchaseFlow.purposeValid.errorMessage || "Purpose mismatch")}>
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cross-Document Validation (CPL → Title)</span>
                    {purchaseFlow.crossDocValid.isValid ? <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span> : <span className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer" onClick={() => openManualReview("Cross-Document Validation", "Property Address + Underwriter alignment", "See details", purchaseFlow.crossDocValid.errorMessage || "Cross-doc validation failed")}>
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>}
                  </div>
                  {purchaseFlow.purposeValid.isValid && purchaseFlow.crossDocValid.isValid && <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Ready for Phase 9
                      </Badge>
                    </div>}
                </div>
              </div>}

            {/* 9. Refinance Flow Validations */}
            {refinanceFlow && <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Refinance Transaction Validation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Borrower/Owner Match</span>
                    {refinanceFlow.borrowerValid.isValid ? <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span> : <span className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer" onClick={() => openManualReview("Borrower Match Verification", `POS: ${data.posData.borrowerName}, Title Vested: ${data.titleCommitment.vestedOwner}`, data.cplDocument.borrowerName, refinanceFlow.borrowerValid.errorMessage || "Borrower mismatch")}>
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cross-Document Validation (CPL → Title → Loan Docs)</span>
                    {refinanceFlow.crossDocValid.isValid ? <span className="text-xs text-green-600 flex items-center gap-1">
                        Valid <CheckCircle2 className="h-3.5 w-3.5" />
                      </span> : <span className="text-xs text-amber-500 flex items-center gap-1 cursor-pointer" onClick={() => openManualReview("Cross-Document Validation", "Borrower, Address, Underwriter alignment", "See details", refinanceFlow.crossDocValid.errorMessage || "Cross-doc validation failed")}>
                        Review Required <AlertTriangle className="h-3.5 w-3.5" />
                      </span>}
                  </div>
                  {refinanceFlow.borrowerValid.isValid && refinanceFlow.crossDocValid.isValid && <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Ready for Phase 9
                      </Badge>
                    </div>}
                </div>
              </div>}

            <Separator />

            {/* Source Document */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Source Document</span>
              <Button size="sm" variant="outline" onClick={() => window.open(data.cplDocument.sourceFile, '_blank')}>
                <FileText className="h-4 w-4 mr-1" />
                View CPL
              </Button>
            </div>
          </CardContent>}
      </Card>

      {/* Purchase Validations */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('purchaseValidations')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Purchase Validations
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-medium">
                Transaction Type: Purchase
              </Badge>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.purchaseValidations ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.purchaseValidations && <CardContent>
            {/* Transaction Type Validation */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium flex items-center gap-2">
                  Transaction Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">CPL Purpose must match POS Loan Purpose for Purchase transactions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                {data.cplDocument.purpose === data.posData.loanPurpose ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle className="h-3 w-3" /> Passed
                  </Badge>
                ) : (
                  <Badge variant="warning" className="gap-1">
                    <AlertTriangle className="h-3 w-3" /> Review
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-r pr-6">
                    <p className="text-xs text-muted-foreground mb-1">CPL Extracted</p>
                    <p className="text-sm font-medium text-foreground">{data.cplDocument.purpose}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">POS Value</p>
                    <p className="text-sm font-medium text-foreground">{data.posData.loanPurpose}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Refinance Validations */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('refinanceValidations')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Refinance Validations
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.refinanceValidations ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.refinanceValidations && <CardContent>
            {/* Borrower/Owner Validation */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium flex items-center gap-2">
                  Borrower/Owner Match
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">Borrower/Owner in CPL must match POS Borrower & Title Vested Owner</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                {(() => {
                  const cplBorrower = data.cplDocument.borrowerName?.toLowerCase().trim();
                  const posBorrower = data.posData.borrowerName?.toLowerCase().trim();
                  const titleOwner = data.titleCommitment.vestedOwner?.toLowerCase().trim();
                  const isMatch = cplBorrower === posBorrower && cplBorrower === titleOwner;
                  return isMatch ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Passed
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <AlertTriangle className="h-3 w-3" /> Review
                    </Badge>
                  );
                })()}
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-6">
                  <div className="border-r pr-6">
                    <p className="text-xs text-muted-foreground mb-1">CPL Borrower</p>
                    <p className="text-sm font-medium text-foreground">{data.cplDocument.borrowerName}</p>
                  </div>
                  <div className="border-r pr-6">
                    <p className="text-xs text-muted-foreground mb-1">POS Borrower</p>
                    <p className="text-sm font-medium text-foreground">{data.posData.borrowerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Title Vested Owner</p>
                    <p className="text-sm font-medium text-foreground">{data.titleCommitment.vestedOwner}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>}
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
        {expandedCards.auditLog && <CardContent>
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
          </CardContent>}
      </Card>

      {/* Manual Review Modal */}
      <ManualReviewModal open={manualReviewOpen} onOpenChange={setManualReviewOpen} metricName={selectedCheck?.metric || ''} posValue={String(selectedCheck?.posValue || '')} aiValue={String(selectedCheck?.aiValue || '')} deviation={String(selectedCheck?.difference || '')} />
    </div>;
};