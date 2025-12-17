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
  FileCheck
} from 'lucide-react';
import { InsurancePolicyData, ValidationStatus } from '@/types/insurancePolicy';


interface InsurancePolicyTabProps {
  phaseStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastUpdated?: string;
}

const InsurancePolicyTab = ({ phaseStatus, lastUpdated }: InsurancePolicyTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
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
    specialEndorsements: true,
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
      femaFloodZone: 'X',
      isRequired: false,
      hasCoverage: false,
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
    specialEndorsements: {
      loanProgram: 'DSCR',
      requiredEndorsements: [
        { endorsementName: 'Loss of Rents', isRequired: true, isPresent: true, status: 'pass' },
        { endorsementName: 'Ordinance or Law', isRequired: true, isPresent: true, status: 'pass' },
        { endorsementName: 'Replacement Cost', isRequired: true, isPresent: true, status: 'pass' },
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy Number:</span>
                  <span className="font-medium">{data.policyParsing.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy Type:</span>
                  <span className="font-medium">{data.policyParsing.policyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insured Name:</span>
                  <span className="font-medium">{data.policyParsing.insuredName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occupancy:</span>
                  <span className="font-medium">{data.policyParsing.occupancy}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coverage Limit:</span>
                  <span className="font-medium">{formatCurrency(data.policyParsing.coverageLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deductible:</span>
                  <span className="font-medium">{formatCurrency(data.policyParsing.deductible)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Effective Date:</span>
                  <span className="font-medium">{formatDate(data.policyParsing.effectiveDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiration Date:</span>
                  <span className="font-medium">{formatDate(data.policyParsing.expirationDate)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">OCR Confidence:</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${data.policyParsing.ocrConfidence}%` }}
                />
              </div>
              <span className="text-sm font-medium">{data.policyParsing.ocrConfidence}%</span>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Endorsement Type:</span>
                <span className="font-medium">{data.mortgageeClause.endorsementType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Endorsement Number:</span>
                <Badge variant="outline" className="font-mono">{data.mortgageeClause.endorsementNumber}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Present:</span>
                {data.mortgageeClause.isPresent ? 
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                  <XCircle className="h-4 w-4 text-red-500" />
                }
              </div>
              <div className="flex justify-between">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deductible Amount:</span>
                <span className="font-medium">{formatCurrency(data.deductibleValidation.deductibleAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coverage Limit:</span>
                <span className="font-medium">{formatCurrency(data.deductibleValidation.coverageLimit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deductible %:</span>
                <span className="font-medium">{formatPercent(data.deductibleValidation.deductiblePercent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Allowed %:</span>
                <span className="font-medium">{formatPercent(data.deductibleValidation.maxAllowedPercent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Allowed Amount:</span>
                <span className="font-medium">{formatCurrency(data.deductibleValidation.maxAllowedAmount)}</span>
              </div>
              <div className="flex justify-between">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coverage Amount:</span>
                <span className="font-medium">{formatCurrency(data.liabilityCoverage.coverageAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minimum Required:</span>
                <span className="font-medium">{formatCurrency(data.liabilityCoverage.minimumRequired)}</span>
              </div>
              <div className="flex justify-between col-span-2">
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">FEMA Flood Zone:</span>
                <Badge variant="outline" className="font-mono">{data.floodInsurance.femaFloodZone}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flood Insurance Required:</span>
                {data.floodInsurance.isRequired ? 
                  <Badge className="bg-amber-500/10 text-amber-500">Yes</Badge> : 
                  <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                }
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Has Coverage:</span>
                {data.floodInsurance.hasCoverage ? 
                  <Badge className="bg-emerald-500/10 text-emerald-500">Yes</Badge> : 
                  <Badge className="bg-slate-500/10 text-slate-500">N/A</Badge>
                }
              </div>
              {data.floodInsurance.policyNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy Number:</span>
                  <span className="font-medium">{data.floodInsurance.policyNumber}</span>
                </div>
              )}
            </div>
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property State:</span>
                <Badge variant="outline">{data.earthquakeInsurance.propertyState}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Earthquake Insurance Required:</span>
                {data.earthquakeInsurance.isRequired ? 
                  <Badge className="bg-amber-500/10 text-amber-500">Yes (Hawaii)</Badge> : 
                  <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                }
              </div>
              <div className="flex justify-between col-span-2">
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

      {/* 13. Special Endorsements */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleCard('specialEndorsements')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              Special Endorsements (Program-Specific)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">AI checks for required endorsements depending on the loan program</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(data.specialEndorsements.overallStatus)}
              {expandedCards.specialEndorsements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {expandedCards.specialEndorsements && (
          <CardContent className="pt-0">
            <div className="mb-3 text-sm">
              <span className="text-muted-foreground">Loan Program:</span>
              <Badge className="ml-2 bg-blue-600 hover:bg-blue-600 text-white">{data.specialEndorsements.loanProgram}</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endorsement</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.specialEndorsements.requiredEndorsements.map((endorsement, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{endorsement.endorsementName}</TableCell>
                    <TableCell>
                      {endorsement.isRequired ? 
                        <Badge className="bg-amber-500/10 text-amber-500">Yes</Badge> : 
                        <Badge className="bg-slate-500/10 text-slate-500">No</Badge>
                      }
                    </TableCell>
                    <TableCell>
                      {endorsement.isPresent ? 
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                    </TableCell>
                    <TableCell className="text-right">{getStatusBadge(endorsement.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

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
