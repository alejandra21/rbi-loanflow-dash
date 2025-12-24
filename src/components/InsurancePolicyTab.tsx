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
  FileText,
  User,
  Building2,
  MapPin,
  DollarSign,
  Shield,
  Droplets,
  Wind,
  Mountain,
  Home,
  FileCheck,
  HardHat,
  Hammer,
  Umbrella
} from 'lucide-react';
import { InsurancePolicyData, ValidationStatus, DSCRBridgeValidation, GUCValidation, FixFlipValidation, FloodInsuranceRequirements, MasterCondoInsuranceValidation, HO6InsuranceValidation, DocumentRequirementsValidation } from '@/types/insurancePolicy';


interface InsurancePolicyTabProps {
  phaseStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastUpdated?: string;
}

const InsurancePolicyTab = ({ phaseStatus, lastUpdated }: InsurancePolicyTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    documentRequirements: true,
    policyParsing: true,
    insuredName: true,
    lossPayee: true,
    mortgageeClause: true,
    propertyAddress: true,
    deductible: true,
    coInsurance: true,
    liability: true,
    windHail: true,
    flood: true,
    earthquake: true,
    occupancy: true,
    programSpecific: true,
    floodRequirements: true,
    masterCondo: true,
    ho6Insurance: true,
    logs: false,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Mock data
  const data: InsurancePolicyData = {
    transactionType: 'Purchase',
    state: 'FL',
    loanProgram: 'DSCR',
    propertyType: 'Condo',
    policyParsing: {
      insuredName: 'ABC Holdings LLC',
      propertyAddress: '123 Main Street, Miami, FL 33101',
      deductible: 5000,
      coverageLimit: 450000,
      endorsements: ['438BFU', 'Wind/Hail', 'Liability'],
      occupancy: 'Investment Property',
      policyType: 'Dwelling Fire Policy',
      policyNumber: 'DFP-2024-789456',
      effectiveDate: '2024-01-15',
      expirationDate: '2025-01-15',
      ocrConfidence: 94.5,
      status: 'pass',
      missingFields: [],
    },
    insuredNameMatch: {
      posEntityName: 'ABC Holdings LLC',
      policyInsuredName: 'ABC Holdings LLC',
      matchScore: 100,
      suffixMatch: true,
      status: 'pass',
      discrepancies: [],
    },
    lenderLossPayee: {
      extractedClause: 'RBI Private Lending, LLC ISAOA/ATIMA',
      expectedClause: 'RBI Private Lending, LLC ISAOA/ATIMA',
      hasISAOA: true,
      hasATIMA: true,
      correctLenderName: true,
      status: 'pass',
    },
    mortgageeClause: {
      endorsementType: 'Standard Mortgagee Clause',
      endorsementNumber: '438BFU',
      isPresent: true,
      isCorrect: true,
      status: 'pass',
      notes: 'Endorsement verified and matches requirements',
    },
    propertyAddressMatch: {
      sources: [
        { source: 'POS Property', address: '123 Main Street, Miami, FL 33101', matches: true },
        { source: 'Appraisal', address: '123 Main Street, Miami, FL 33101', matches: true },
        { source: 'Title Commitment', address: '123 Main Street, Miami, FL 33101', matches: true },
        { source: 'USPS', address: '123 Main St, Miami, FL 33101', matches: true },
      ],
      overallMatchScore: 98,
      status: 'pass',
      mismatches: [],
    },
    deductibleValidation: {
      deductibleAmount: 5000,
      coverageLimit: 450000,
      deductiblePercent: 1.11,
      maxAllowedPercent: 5,
      maxAllowedAmount: 10000,
      meetsLimit: true,
      status: 'pass',
    },
    coInsuranceValidation: {
      hasCoInsurance: false,
      detectedClauses: [],
      status: 'pass',
    },
    liabilityCoverage: {
      coverageAmount: 500000,
      minimumRequired: 300000,
      meetsRequirement: true,
      status: 'pass',
    },
    windHailCoverage: {
      isIncluded: true,
      exclusionDetected: false,
      coverageDetails: 'Wind and Hail coverage included with $2,500 deductible',
      status: 'pass',
    },
    floodInsurance: {
      femaFloodZone: 'AE',
      isRequired: true,
      hasCoverage: true,
      policyNumber: 'FL-2024-887654',
      status: 'pass',
    },
    earthquakeInsurance: {
      propertyState: 'FL',
      isRequired: false,
      hasEndorsement: false,
      status: 'pass',
    },
    occupancyValidation: {
      policyOccupancy: 'Investment Property',
      posOccupancy: 'Non-Owner Occupied',
      isNonOwnerOccupied: true,
      status: 'pass',
    },
    // DSCR/Bridge specific validation (shown for DSCR and Bridge programs)
    dscrBridgeValidation: {
      rcvCoverageLimit: 450000,
      loanAmount: 380000,
      replacementCostEstimate: 420000,
      rcvMeetsRequirement: true,
      rentLossCoverage: {
        hasRentLoss: true,
        monthsCovered: 6,
        minimumRequired: 6,
        detectedKeywords: ['Rent Loss', 'Loss of Rent'],
      },
      status: 'pass',
    },
    // Flood insurance requirements (when flood zone requires it)
    floodRequirements: {
      policyType: {
        isFEMA: true,
        isPrivateFlood: false,
        isAcceptable: true,
        detectedType: 'NFIP Standard Flood Insurance Policy',
      },
      coverageTerm: {
        termMonths: 12,
        minimumRequired: 12,
        meetsRequirement: true,
      },
      coverageAmount: {
        femaCoverage: 250000,
        femaMaximum: 250000,
        additionalCoverageRequired: 0,
        loanAmount: 380000,
        siteValue: 150000,
        totalCoverage: 250000,
        meetsRequirement: true,
      },
      status: 'pass',
    },
    // Master Condo Insurance (required for condos with HOA)
    masterCondoInsurance: {
      isRequired: true,
      propertyType: 'Condo',
      isHOAProperty: true,
      policyPresent: true,
      addressMatch: {
        fullAddress: '123 Main Street, Unit 405, Miami, FL 33101',
        unitNumber: '405',
        matches: true,
      },
      rbiMortgageeClause: {
        isPresent: true,
        isCorrect: true,
      },
      totalCoverage: 15000000,
      totalUnits: 120,
      status: 'pass',
    },
    // HO-6 Insurance (required for condos)
    ho6Insurance: {
      isRequired: true,
      propertyType: 'Condo',
      policyPresent: true,
      addressMatch: {
        fullAddress: '123 Main Street, Unit 405, Miami, FL 33101',
        unitNumber: '405',
        matches: true,
      },
      rbiMortgageeClause: {
        isPresent: true,
        isCorrect: true,
      },
      coverageAmount: {
        amount: 100000,
        aivValue: 450000,
        purchasePrice: 425000,
        minimumRequired: 85000,
        minimumPercentage: 20,
        meetsRequirement: true,
      },
      coverageTerm: {
        termMonths: 12,
        minimumRequired: 12,
        meetsRequirement: true,
      },
      status: 'pass',
    },
    // Document Requirements
    documentRequirements: {
      propertyType: 'Condo',
      loanProgram: 'DSCR',
      floodZone: 'AE',
      isHOAProperty: true,
      documents: [
        {
          documentType: 'Hazard Insurance Policy',
          posDocType: 'Hazard Insurance Policy',
          isRequired: true,
          requiredForPrograms: ['DSCR', 'Bridge'],
          condition: 'DP-3 Policy for Bridge/DSCR',
          isPresent: true,
          status: 'pass',
        },
        {
          documentType: 'Liability Insurance Policy',
          posDocType: 'Liability Insurance Policy',
          isRequired: true,
          condition: 'Required on every loan',
          isPresent: true,
          status: 'pass',
        },
        {
          documentType: 'Flood Insurance Policy',
          posDocType: 'Flood Insurance Policy',
          isRequired: true,
          condition: 'Required - Property in Flood Zone AE',
          isPresent: true,
          status: 'pass',
        },
        {
          documentType: 'HO-6 Insurance Policy',
          posDocType: 'HO6 Insurance Policy',
          isRequired: true,
          condition: 'Required - Property type is Condo',
          isPresent: true,
          status: 'pass',
        },
        {
          documentType: 'HOA Master Insurance',
          posDocType: 'Copy of HOA Master Insurance',
          isRequired: true,
          condition: 'Required - Condo with HOA',
          isPresent: true,
          status: 'pass',
        },
      ],
      overallStatus: 'pass',
    },
    overallStatus: 'pass',
    processedAt: '2024-01-15T10:30:00Z',
    processedBy: 'AI Insurance Validator v2.1',
  };

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
      <div className="p-5 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent rounded-xl border-l-4 border-blue-500">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-blue-500/15 rounded-lg shrink-0">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">Insurance Policy Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This phase automates parsing and verification of insurance policies, aligns parties and coverages with POS and third-party data, and routes exceptions for manual underwriting review.
            </p>
          </div>
        </div>
      </div>

      {/* OCR Extraction Status */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              OCR Extraction Status
            </CardTitle>
            <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />Readable
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Document Requirements */}
      {data.documentRequirements && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleCard('documentRequirements')}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                Required Documents by Loan Type
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Validates which insurance documents are required based on loan program, property type, and flood zone</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(data.documentRequirements.overallStatus)}
                {expandedCards.documentRequirements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
          {expandedCards.documentRequirements && (
            <CardContent className="pt-0">
              <div className="mb-4 flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">
                  <span className="text-muted-foreground mr-1">Loan:</span>
                  {data.documentRequirements.loanProgram}
                </Badge>
                <Badge variant="outline">
                  <span className="text-muted-foreground mr-1">Property:</span>
                  {data.documentRequirements.propertyType}
                </Badge>
                <Badge variant="outline">
                  <span className="text-muted-foreground mr-1">Flood Zone:</span>
                  {data.documentRequirements.floodZone}
                </Badge>
                {data.documentRequirements.isHOAProperty && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">HOA Property</Badge>
                )}
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>POS Doc Type</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.documentRequirements.documents.map((doc, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{doc.documentType}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{doc.posDocType}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{doc.condition || '—'}</TableCell>
                      <TableCell className="text-center">
                        {doc.isPresent ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                      <TableCell className="text-right">{getStatusBadge(doc.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      )}

      {/* 1. Policy Parsing */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('policyParsing')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Policy Parsing & OCR
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Upload policy and OCR key fields: insured name, property address, deductible, endorsements, coverage limits, occupancy, policy type</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.policyParsing.status)}
              {expandedCards.policyParsing ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.policyParsing && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Policy Number:</span>
                  <span className="font-medium">{data.policyParsing.policyNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Policy Type:</span>
                  <span className="font-medium">{data.policyParsing.policyType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Insured Name:</span>
                  <span className="font-medium">{data.policyParsing.insuredName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Occupancy:</span>
                  <span className="font-medium">{data.policyParsing.occupancy}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Coverage Limit:</span>
                  <span className="font-medium">{formatCurrency(data.policyParsing.coverageLimit)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Deductible:</span>
                  <span className="font-medium">{formatCurrency(data.policyParsing.deductible)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Effective Date:</span>
                  <span className="font-medium">{formatDate(data.policyParsing.effectiveDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Expiration Date:</span>
                  <span className="font-medium">{formatDate(data.policyParsing.expirationDate)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">Endorsements Detected:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.policyParsing.endorsements.map((endorsement, idx) => (
                  <Badge key={idx} variant="outline">{endorsement}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 2. Insured Name Match */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('insuredName')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Insured Name Match
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Borrower/Entity on POS matches Insured Name on policy. Check for exact legal name, including suffixes (LLC, Inc., etc.)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.insuredNameMatch.status)}
              {expandedCards.insuredName ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.insuredName && (
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">POS Entity Name</TableCell>
                  <TableCell className="font-medium">{data.insuredNameMatch.posEntityName}</TableCell>
                  <TableCell className="text-right">{getStatusIcon('pass')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">Policy Insured Name</TableCell>
                  <TableCell className="font-medium">{data.insuredNameMatch.policyInsuredName}</TableCell>
                  <TableCell className="text-right">{getStatusIcon('pass')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Match Score:</span>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">{data.insuredNameMatch.matchScore}%</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Suffix Match:</span>
                {data.insuredNameMatch.suffixMatch ? 
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 3. Lender Loss Payee */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('lossPayee')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Lender Loss Payee
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Loss payee lists: "RBI Private Lending, LLC ISAOA/ATIMA"</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.lenderLossPayee.status)}
              {expandedCards.lossPayee ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.lossPayee && (
          <CardContent className="pt-0">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Expected Clause:</span>
                <p className="font-medium mt-1 p-2 bg-muted/30 rounded">{data.lenderLossPayee.expectedClause}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Extracted Clause:</span>
                <p className="font-medium mt-1 p-2 bg-muted/30 rounded">{data.lenderLossPayee.extractedClause}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ISAOA:</span>
                  {data.lenderLossPayee.hasISAOA ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500">Present</Badge> : 
                    <Badge className="bg-red-500/10 text-red-500">Missing</Badge>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">ATIMA:</span>
                  {data.lenderLossPayee.hasATIMA ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500">Present</Badge> : 
                    <Badge className="bg-red-500/10 text-red-500">Missing</Badge>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Lender Name:</span>
                  {data.lenderLossPayee.correctLenderName ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500">Correct</Badge> : 
                    <Badge className="bg-red-500/10 text-red-500">Incorrect</Badge>
                  }
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 4. Mortgagee Clause Endorsement */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('mortgageeClause')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              Mortgagee Clause Endorsement
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Confirm the correct 438BFU mortgagee clause endorsement present</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.mortgageeClause.status)}
              {expandedCards.mortgageeClause ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.mortgageeClause && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Endorsement Type:</span>
                <span className="font-medium">{data.mortgageeClause.endorsementType}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Endorsement Number:</span>
                <Badge variant="outline" className="font-mono">{data.mortgageeClause.endorsementNumber}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Present:</span>
                {data.mortgageeClause.isPresent ? 
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Correct:</span>
                {data.mortgageeClause.isCorrect ? 
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
              </div>
            </div>
            {data.mortgageeClause.notes && (
              <p className="mt-3 text-sm text-muted-foreground italic">{data.mortgageeClause.notes}</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* 5. Property Address Match */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('propertyAddress')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Property Address Match
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Policy address matches POS → Appraisal → Title → USPS. Verify street, unit, city, county, state, ZIP</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.propertyAddressMatch.status)}
              {expandedCards.propertyAddress ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.propertyAddress && (
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.propertyAddressMatch.sources.map((source, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground">{source.source}</TableCell>
                    <TableCell className="font-medium">{source.address}</TableCell>
                    <TableCell className="text-right">
                      {source.matches ? 
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                        <XCircle className="h-4 w-4 text-red-500 inline" />
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Overall Match Score:</span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">{data.propertyAddressMatch.overallMatchScore}%</Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 6. Deductible Limits */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('deductible')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Deductible Limits
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Deductible ≤ 5% of coverage limit OR ≤ $10,000</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.deductibleValidation.status)}
              {expandedCards.deductible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.deductible && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Deductible Amount:</span>
                <span className="font-medium">{formatCurrency(data.deductibleValidation.deductibleAmount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Coverage Limit:</span>
                <span className="font-medium">{formatCurrency(data.deductibleValidation.coverageLimit)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Deductible %:</span>
                <span className="font-medium">{formatPercent(data.deductibleValidation.deductiblePercent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Max Allowed %:</span>
                <span className="font-medium">{formatPercent(data.deductibleValidation.maxAllowedPercent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Max Allowed Amount:</span>
                <span className="font-medium">{formatCurrency(data.deductibleValidation.maxAllowedAmount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Meets Limit:</span>
                {data.deductibleValidation.meetsLimit ? 
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 7. No Co-Insurance */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('coInsurance')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              No Co-Insurance
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Confirm NO co-insurance clause anywhere in the policy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.coInsuranceValidation.status)}
              {expandedCards.coInsurance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.coInsurance && (
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Co-Insurance Detected:</span>
              {data.coInsuranceValidation.hasCoInsurance ? 
                <Badge className="bg-red-500/10 text-red-500">Yes - Policy Failed</Badge> : 
                <Badge className="bg-emerald-500/10 text-emerald-500">No - Policy Passed</Badge>
              }
            </div>
            {data.coInsuranceValidation.detectedClauses.length > 0 && (
              <div className="mt-3">
                <span className="text-sm text-muted-foreground">Detected Clauses:</span>
                <ul className="mt-1 list-disc list-inside text-sm">
                  {data.coInsuranceValidation.detectedClauses.map((clause, idx) => (
                    <li key={idx}>{clause}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* 8. Liability Coverage */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('liability')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Liability Coverage
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Liability coverage ≥ $300,000</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.liabilityCoverage.status)}
              {expandedCards.liability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.liability && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Coverage Amount:</span>
                <span className="font-medium">{formatCurrency(data.liabilityCoverage.coverageAmount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Minimum Required:</span>
                <span className="font-medium">{formatCurrency(data.liabilityCoverage.minimumRequired)}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="text-muted-foreground">Meets Requirement:</span>
                {data.liabilityCoverage.meetsRequirement ? 
                  <Badge className="bg-emerald-500/10 text-emerald-500">Yes - Exceeds minimum by {formatCurrency(data.liabilityCoverage.coverageAmount - data.liabilityCoverage.minimumRequired)}</Badge> : 
                  <Badge className="bg-red-500/10 text-red-500">No - Below minimum</Badge>
                }
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 9. Wind/Hail Coverage */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('windHail')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              Wind/Hail Coverage
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Wind and hail coverage included</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.windHailCoverage.status)}
              {expandedCards.windHail ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.windHail && (
          <CardContent className="pt-0">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Coverage Included:</span>
                  {data.windHailCoverage.isIncluded ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge> : 
                    <Badge className="bg-red-500/10 text-red-500">No</Badge>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Exclusion Detected:</span>
                  {data.windHailCoverage.exclusionDetected ? 
                    <Badge className="bg-red-500/10 text-red-500">Yes</Badge> : 
                    <Badge className="bg-emerald-500/10 text-emerald-500">No</Badge>
                  }
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Coverage Details:</span>
                <p className="font-medium mt-1">{data.windHailCoverage.coverageDetails}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 10. Flood Insurance */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('flood')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              Flood Insurance
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">If the property is in FEMA Flood Zone A or AE, flood insurance is required</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.floodInsurance.status)}
              {expandedCards.flood ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.flood && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">FEMA Flood Zone:</span>
                <Badge variant="outline" className="font-mono">{data.floodInsurance.femaFloodZone}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Flood Insurance Required:</span>
                {data.floodInsurance.isRequired ? 
                  <Badge className="bg-amber-500/10 text-amber-500">Yes</Badge> : 
                  <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                }
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Has Coverage:</span>
                {data.floodInsurance.hasCoverage ? 
                  <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge> : 
                  <Badge className="bg-slate-500/10 text-slate-500">N/A</Badge>
                }
              </div>
              {data.floodInsurance.policyNumber && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Policy Number:</span>
                  <span className="font-medium">{data.floodInsurance.policyNumber}</span>
                </div>
              )}
            </div>

            {/* Flood Insurance Requirements - shown only when flood insurance is required */}
            {data.floodInsurance.isRequired && data.floodRequirements && (
              <div className="mt-6 space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    Flood Insurance Requirements
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-xs">FEMA or acceptable private flood. Min 12 months term. FEMA max $250K, additional coverage if loan exceeds</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  {getStatusBadge(data.floodRequirements.status)}
                </div>

                {/* Policy Type */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Policy Type</span>
                    {data.floodRequirements.policyType.isAcceptable ? 
                      <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Acceptable</Badge> :
                      <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Not Acceptable</Badge>
                    }
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Detected Type</span>
                      <span className="font-medium">{data.floodRequirements.policyType.detectedType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">FEMA/NFIP</span>
                      {data.floodRequirements.policyType.isFEMA ? 
                        <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge> :
                        <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                      }
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Private Flood</span>
                      {data.floodRequirements.policyType.isPrivateFlood ? 
                        <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge> :
                        <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                      }
                    </div>
                  </div>
                </div>

                {/* Coverage Term */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Coverage Term</span>
                    {data.floodRequirements.coverageTerm.meetsRequirement ? 
                      <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                      <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Policy Term</span>
                      <span className="font-medium">{data.floodRequirements.coverageTerm.termMonths} months</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Minimum Required</span>
                      <span className="font-medium">{data.floodRequirements.coverageTerm.minimumRequired} months</span>
                    </div>
                  </div>
                </div>

                {/* Coverage Amount */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Coverage Amount</span>
                    {data.floodRequirements.coverageAmount.meetsRequirement ? 
                      <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                      <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                    }
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">FEMA Coverage</span>
                      <span className="font-medium">{formatCurrency(data.floodRequirements.coverageAmount.femaCoverage)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">FEMA Maximum</span>
                      <span className="font-medium">{formatCurrency(data.floodRequirements.coverageAmount.femaMaximum)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Loan Amount</span>
                      <span className="font-medium">{formatCurrency(data.floodRequirements.coverageAmount.loanAmount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Site Value (Appraisal)</span>
                      <span className="font-medium">{formatCurrency(data.floodRequirements.coverageAmount.siteValue)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Total Coverage</span>
                      <span className="font-medium">{formatCurrency(data.floodRequirements.coverageAmount.totalCoverage)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Additional Required</span>
                      {data.floodRequirements.coverageAmount.additionalCoverageRequired > 0 ? 
                        <span className="font-medium text-amber-500">{formatCurrency(data.floodRequirements.coverageAmount.additionalCoverageRequired)}</span> :
                        <span className="font-medium text-emerald-500">None</span>
                      }
                    </div>
                  </div>
                  {data.floodRequirements.coverageAmount.additionalCoverageRequired > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-amber-500/10 rounded">
                      Formula: Loan Amount ({formatCurrency(data.floodRequirements.coverageAmount.loanAmount)}) - FEMA ({formatCurrency(data.floodRequirements.coverageAmount.femaCoverage)}) - Site Value ({formatCurrency(data.floodRequirements.coverageAmount.siteValue)}) = {formatCurrency(data.floodRequirements.coverageAmount.additionalCoverageRequired)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* 11. Earthquake Insurance */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('earthquake')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Mountain className="h-4 w-4 text-muted-foreground" />
              Earthquake Insurance (Hawaii Only)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">If the property is in HI, an earthquake endorsement is included</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.earthquakeInsurance.status)}
              {expandedCards.earthquake ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.earthquake && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Property State:</span>
                <Badge variant="outline">{data.earthquakeInsurance.propertyState}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Earthquake Insurance Required:</span>
                {data.earthquakeInsurance.isRequired ? 
                  <Badge className="bg-amber-500/10 text-amber-500">Yes (Hawaii)</Badge> : 
                  <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                }
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="text-muted-foreground">Has Endorsement:</span>
                {data.earthquakeInsurance.isRequired ? (
                  data.earthquakeInsurance.hasEndorsement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge> : 
                    <Badge className="bg-red-500/10 text-red-500">Missing - Required</Badge>
                ) : (
                  <Badge className="bg-slate-500/10 text-slate-500">N/A - Not Required</Badge>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 12. Occupancy Alignment */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('occupancy')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              Occupancy Alignment
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">Occupancy must be non-owner-occupied. Look for "Investment" or "Non‑owner" designation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.occupancyValidation.status)}
              {expandedCards.occupancy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.occupancy && (
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Occupancy Type</TableHead>
                  <TableHead className="text-right">Valid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">Policy</TableCell>
                  <TableCell className="font-medium">{data.occupancyValidation.policyOccupancy}</TableCell>
                  <TableCell className="text-right">
                    {data.occupancyValidation.isNonOwnerOccupied ? 
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                      <XCircle className="h-4 w-4 text-red-500 inline" />
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-muted-foreground">POS</TableCell>
                  <TableCell className="font-medium">{data.occupancyValidation.posOccupancy}</TableCell>
                  <TableCell className="text-right">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Master Condo Insurance (for condos) */}
      {data.propertyType === 'Condo' && data.masterCondoInsurance && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleCard('masterCondo')}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Master Condo Insurance Policy
                <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-xs">Condo</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Required if property is a condo and part of an HOA. Source: POS – Copy of HOA Master Insurance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(data.masterCondoInsurance.status)}
                {expandedCards.masterCondo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
          {expandedCards.masterCondo && (
            <CardContent className="pt-0 space-y-4">
              {/* Policy Presence */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Master Policy Present</span>
                  {data.masterCondoInsurance.policyPresent ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Correct Policy Type</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Missing Master Insurance</Badge>
                  }
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Validation</TableHead>
                      <TableHead>Logic</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Policy Present</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Policy is present in POS</TableCell>
                      <TableCell className="text-right">
                        {data.masterCondoInsurance.policyPresent ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Address Match</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        References address including unit number
                        <div className="text-xs mt-1">Unit: {data.masterCondoInsurance.addressMatch.unitNumber}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        {data.masterCondoInsurance.addressMatch.matches ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">RBI Mortgagee Clause</TableCell>
                      <TableCell className="text-sm text-muted-foreground">RBI listed as mortgagee</TableCell>
                      <TableCell className="text-right">
                        {data.masterCondoInsurance.rbiMortgageeClause.isPresent && data.masterCondoInsurance.rbiMortgageeClause.isCorrect ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Coverage Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Coverage:</span>
                  <span className="font-medium">{formatCurrency(data.masterCondoInsurance.totalCoverage)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Units:</span>
                  <span className="font-medium">{data.masterCondoInsurance.totalUnits} units</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Property Type:</span>
                  <Badge variant="outline">{data.masterCondoInsurance.propertyType}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">HOA Property:</span>
                  {data.masterCondoInsurance.isHOAProperty ? 
                    <Badge className="bg-blue-500/10 text-blue-500">Yes</Badge> :
                    <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                  }
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* HO-6 Insurance (for condos) */}
      {data.propertyType === 'Condo' && data.ho6Insurance && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleCard('ho6Insurance')}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                HO-6 Insurance Policy
                <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-xs">Condo</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Required if property type is a condo. Source: POS – HO6 Insurance Policy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(data.ho6Insurance.status)}
                {expandedCards.ho6Insurance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
          {expandedCards.ho6Insurance && (
            <CardContent className="pt-0 space-y-4">
              {/* HO-6 Policy Present */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">HO-6 Policy Present</span>
                  {data.ho6Insurance.policyPresent ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Correct Policy Type</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Missing HO-6 Insurance</Badge>
                  }
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Validation</TableHead>
                      <TableHead>Logic</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Policy Present</TableCell>
                      <TableCell className="text-sm text-muted-foreground">HO-6 policy is present in POS</TableCell>
                      <TableCell className="text-right">
                        {data.ho6Insurance.policyPresent ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Address Match</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        References address including unit number
                        <div className="text-xs mt-1">Unit: {data.ho6Insurance.addressMatch.unitNumber}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        {data.ho6Insurance.addressMatch.matches ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">RBI Mortgagee Clause</TableCell>
                      <TableCell className="text-sm text-muted-foreground">RBI listed as mortgagee</TableCell>
                      <TableCell className="text-right">
                        {data.ho6Insurance.rbiMortgageeClause.isPresent && data.ho6Insurance.rbiMortgageeClause.isCorrect ? 
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : 
                          <XCircle className="h-4 w-4 text-red-500 inline" />
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Coverage Amount Validation */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Coverage Amount</span>
                  {data.ho6Insurance.coverageAmount.meetsRequirement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Coverage Sufficient</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Insufficient Coverage</Badge>
                  }
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Coverage Amount</span>
                    <span className="font-medium">{formatCurrency(data.ho6Insurance.coverageAmount.amount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Minimum Required ({data.ho6Insurance.coverageAmount.minimumPercentage}% of AIV/PP)</span>
                    <span className="font-medium">{formatCurrency(data.ho6Insurance.coverageAmount.minimumRequired)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">AIV Value (Phase 5)</span>
                    <span className="font-medium">{formatCurrency(data.ho6Insurance.coverageAmount.aivValue)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Purchase Price (POS)</span>
                    <span className="font-medium">{formatCurrency(data.ho6Insurance.coverageAmount.purchasePrice)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 p-2 bg-background/50 rounded">
                  Requirement: Coverage ≥ {data.ho6Insurance.coverageAmount.minimumPercentage}% of AIV ({formatCurrency(data.ho6Insurance.coverageAmount.aivValue)}) or Purchase Price ({formatCurrency(data.ho6Insurance.coverageAmount.purchasePrice)})
                </p>
              </div>

              {/* Coverage Term Validation */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Coverage Term</span>
                  {data.ho6Insurance.coverageTerm.meetsRequirement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Term Sufficient</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Increase Policy Term</Badge>
                  }
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Policy Term</span>
                    <span className="font-medium">{data.ho6Insurance.coverageTerm.termMonths} months</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Minimum Required</span>
                    <span className="font-medium">{data.ho6Insurance.coverageTerm.minimumRequired} months</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* 13. Program-Specific Endorsements */}
      {(data.loanProgram === 'DSCR' || data.loanProgram === 'Bridge') && data.dscrBridgeValidation && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleCard('programSpecific')}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                DSCR / Bridge Additional Requirements
                <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-xs">{data.loanProgram}</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">RCV/Coverage ≥ Loan Amount OR Replacement Cost Estimate. Rent Loss Coverage: at least 6 months</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(data.dscrBridgeValidation.status)}
                {expandedCards.programSpecific ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
          {expandedCards.programSpecific && (
            <CardContent className="pt-0 space-y-4">
              {/* RCV Coverage Validation */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">RCV / Coverage Limit Validation</span>
                  {data.dscrBridgeValidation.rcvMeetsRequirement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">RCV/Coverage Limit</span>
                    <span className="font-medium">{formatCurrency(data.dscrBridgeValidation.rcvCoverageLimit)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Loan Amount (Phase 1)</span>
                    <span className="font-medium">{formatCurrency(data.dscrBridgeValidation.loanAmount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Replacement Cost Est. (Phase 5)</span>
                    <span className="font-medium">{formatCurrency(data.dscrBridgeValidation.replacementCostEstimate)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Requirement: RCV ≥ {formatCurrency(data.dscrBridgeValidation.loanAmount)} OR {formatCurrency(data.dscrBridgeValidation.replacementCostEstimate)}
                </p>
              </div>

              {/* Rent Loss Coverage */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Rent Loss Coverage</span>
                  {data.dscrBridgeValidation.rentLossCoverage.hasRentLoss && data.dscrBridgeValidation.rentLossCoverage.monthsCovered >= data.dscrBridgeValidation.rentLossCoverage.minimumRequired ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Coverage Present</span>
                    {data.dscrBridgeValidation.rentLossCoverage.hasRentLoss ? 
                      <span className="font-medium text-emerald-500">Yes</span> :
                      <span className="font-medium text-red-500">No</span>
                    }
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Months Covered</span>
                    <span className="font-medium">{data.dscrBridgeValidation.rentLossCoverage.monthsCovered} months (min: {data.dscrBridgeValidation.rentLossCoverage.minimumRequired})</span>
                  </div>
                </div>
                {data.dscrBridgeValidation.rentLossCoverage.detectedKeywords.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Detected Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.dscrBridgeValidation.rentLossCoverage.detectedKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Ground-Up Construction Requirements */}
      {data.loanProgram === 'Ground-Up Construction' && data.gucValidation && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleCard('programSpecific')}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <HardHat className="h-4 w-4 text-muted-foreground" />
                Ground-Up Construction Requirements
                <Badge className="bg-orange-600 hover:bg-orange-600 text-white text-xs">GUC</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">RCV ≥ Loan Amount OR Total Construction Budget. Workers' Comp required if labor performed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(data.gucValidation.status)}
                {expandedCards.programSpecific ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
          {expandedCards.programSpecific && (
            <CardContent className="pt-0 space-y-4">
              {/* RCV Coverage Validation */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">RCV / Coverage Limit Validation</span>
                  {data.gucValidation.rcvMeetsRequirement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">RCV/Coverage Limit</span>
                    <span className="font-medium">{formatCurrency(data.gucValidation.rcvCoverageLimit)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Loan Amount (Phase 1)</span>
                    <span className="font-medium">{formatCurrency(data.gucValidation.loanAmount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Construction Budget (Phase 5)</span>
                    <span className="font-medium">{formatCurrency(data.gucValidation.constructionBudget)}</span>
                  </div>
                </div>
              </div>

              {/* Workers' Comp */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Workers' Compensation</span>
                  {!data.gucValidation.workersComp.laborPerformed || data.gucValidation.workersComp.isListed ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Labor Performed</span>
                    <span className="font-medium">{data.gucValidation.workersComp.laborPerformed ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Workers' Comp Listed</span>
                    {data.gucValidation.workersComp.isListed ? 
                      <span className="font-medium text-emerald-500">Yes</span> :
                      <span className="font-medium text-red-500">No</span>
                    }
                  </div>
                </div>
                {data.gucValidation.workersComp.policyDetails && (
                  <p className="text-xs text-muted-foreground mt-2">{data.gucValidation.workersComp.policyDetails}</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Fix & Flip Requirements */}
      {data.loanProgram === 'Fix & Flip' && data.fixFlipValidation && (
        <Card>
          <CardHeader className="cursor-pointer" onClick={() => toggleCard('programSpecific')}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Hammer className="h-4 w-4 text-muted-foreground" />
                Fix & Flip Requirements
                <Badge className="bg-purple-600 hover:bg-purple-600 text-white text-xs">Fix & Flip</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-xs">Builder's Risk policy with HO-3 conversion. Coverage term must include rehab + disposition period</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusBadge(data.fixFlipValidation.status)}
                {expandedCards.programSpecific ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
          {expandedCards.programSpecific && (
            <CardContent className="pt-0 space-y-4">
              {/* Policy Type */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Policy Type</span>
                  {data.fixFlipValidation.policyType.isBuilderRisk && data.fixFlipValidation.policyType.hasHO3Conversion ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Detected Type</span>
                    <span className="font-medium">{data.fixFlipValidation.policyType.detectedPolicyType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Builder's Risk</span>
                    {data.fixFlipValidation.policyType.isBuilderRisk ? 
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                  </div>
                  <div>
                    <span className="text-muted-foreground block">HO-3 Conversion</span>
                    {data.fixFlipValidation.policyType.hasHO3Conversion ? 
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
                      <XCircle className="h-4 w-4 text-red-500" />
                    }
                  </div>
                </div>
              </div>

              {/* Coverage Term */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Coverage Term</span>
                  {data.fixFlipValidation.coverageTerm.meetsRequirement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Rehab Period</span>
                    <span className="font-medium">{data.fixFlipValidation.coverageTerm.rehabPeriodMonths} months</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Disposition Period</span>
                    <span className="font-medium">{data.fixFlipValidation.coverageTerm.dispositionPeriodMonths} months</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Total Required</span>
                    <span className="font-medium">{data.fixFlipValidation.coverageTerm.totalRequired} months</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Policy Term</span>
                    <span className="font-medium">{data.fixFlipValidation.coverageTerm.policyTermMonths} months</span>
                  </div>
                </div>
              </div>

              {/* RCV Validation */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">RCV Limit Validation</span>
                  {data.fixFlipValidation.rcvValidation.meetsRequirement ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">RCV Limit</span>
                    <span className="font-medium">{formatCurrency(data.fixFlipValidation.rcvValidation.rcvLimit)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Loan Amount</span>
                    <span className="font-medium">{formatCurrency(data.fixFlipValidation.rcvValidation.loanAmount)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Replacement Cost Est.</span>
                    <span className="font-medium">{formatCurrency(data.fixFlipValidation.rcvValidation.replacementCostEstimate)}</span>
                  </div>
                </div>
              </div>

              {/* Workers' Comp */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Workers' Compensation</span>
                  {!data.fixFlipValidation.workersComp.contractorLaborUsed || data.fixFlipValidation.workersComp.isListed ? 
                    <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Pass</Badge> :
                    <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" />Fail</Badge>
                  }
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Contractor Labor Used</span>
                    <span className="font-medium">{data.fixFlipValidation.workersComp.contractorLaborUsed ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Workers' Comp Listed</span>
                    {data.fixFlipValidation.workersComp.isListed ? 
                      <span className="font-medium text-emerald-500">Yes</span> :
                      <span className="font-medium text-red-500">No</span>
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}


      {/* Logs */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('logs')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Logs
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.logs ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.logs && (
          <CardContent>
            <div className="space-y-3">
              {/* Log Entry 1 */}
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">policy_parsing</Badge>
                      <span className="text-sm font-medium">Policy OCR Validation</span>
                      <span className="text-xs text-muted-foreground">{formatDate(data.processedAt)}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-3 border border-t-0 rounded-b-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Action:</p>
                        <p className="text-sm font-medium">Insurance Policy Parsed</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">User:</p>
                        <p className="text-sm font-medium">{data.processedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status:</p>
                        <p className="text-sm font-medium">completed</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Exception Tag:</p>
                        <p className="text-sm font-medium">insurance_policy</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">JSON Data:</p>
                      <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto">
{`{
  "policy_number": "${data.policyParsing.policyNumber}",
  "policy_type": "${data.policyParsing.policyType}",
  "ocr_confidence": ${data.policyParsing.ocrConfidence},
  "validation_result": "${data.policyParsing.status}"
}`}
                      </pre>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Log Entry 2 */}
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">coverage_validation</Badge>
                      <span className="text-sm font-medium">Coverage Validation Check</span>
                      <span className="text-xs text-muted-foreground">{formatDate(data.processedAt)}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-3 border border-t-0 rounded-b-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Action:</p>
                        <p className="text-sm font-medium">Coverage Limits Verified</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">User:</p>
                        <p className="text-sm font-medium">System</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status:</p>
                        <p className="text-sm font-medium">completed</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Exception Tag:</p>
                        <p className="text-sm font-medium">insurance_policy</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">JSON Data:</p>
                      <pre className="text-xs bg-muted/50 p-3 rounded-md overflow-x-auto">
{`{
  "checks_performed": 13,
  "passed": 13,
  "warnings": 0,
  "failed": 0
}`}
                      </pre>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        )}
      </Card>

    </div>
  );
};

export default InsurancePolicyTab;
