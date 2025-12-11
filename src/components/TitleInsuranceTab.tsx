import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, Shield, MapPin, DollarSign, Calendar, User, Building, Info, AlertCircle, Clock, Link2, Users, Scale, FileCheck, History } from "lucide-react";
import { useState } from "react";
import { TitleInsuranceData, LienItem, ChainOfTitleItem, EntityInfo, AffiliationMatch } from "@/types/titleInsurance";
import { ManualReviewModal } from "./ManualReviewModal";
interface TitleInsuranceTabProps {
  phaseStatus: string;
  lastUpdated: string;
}
export const TitleInsuranceTab = ({
  phaseStatus,
  lastUpdated
}: TitleInsuranceTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    ownershipVerification: true,
    lienEncumbrance: true,
    affiliatedEntities: true,
    commitmentAmount: true,
    altaPolicy: true,
    chainOfTitle: true,
    isaoaReconciliation: true,
    purchaseContract: true
  });
  const [expandedLiens, setExpandedLiens] = useState<Record<string, boolean>>({});
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
  const toggleLien = (lienId: string) => {
    setExpandedLiens(prev => ({
      ...prev,
      [lienId]: !prev[lienId]
    }));
  };
  const openManualReview = (metric: string, posValue: string, aiValue: string, difference: string) => {
    setSelectedCheck({
      metric,
      posValue,
      aiValue,
      difference
    });
    setManualReviewOpen(true);
  };

  // Mock data
  const data: TitleInsuranceData = {
    transactionType: 'Purchase',
    ownershipMatch: {
      transactionType: 'Purchase',
      sellerName: 'ABC Holdings LLC',
      vestedOwner: 'ABC Holdings, LLC',
      matchScore: 96,
      status: 'pass'
    },
    lienItems: [{
      id: 'lien-1',
      scheduleBText: 'Deed of Trust recorded January 15, 2023, Document No. 2023-001234, in favor of First National Bank in the original amount of $450,000.00',
      detectedLienType: 'Mortgage',
      rbiClassification: 'Voluntary Financial Lien',
      autoTagApplied: 'Standard Mortgage',
      expectedParty: 'ABC Holdings LLC',
      actualParty: 'ABC Holdings LLC',
      partyMatchResult: 'Expected Party',
      underwritingActionRequired: 'Verify payoff at closing',
      result: 'Requires Payoff',
      confidenceScore: 94
    }, {
      id: 'lien-2',
      scheduleBText: 'Easement for utilities recorded May 2, 2018, Book 1234, Page 567',
      detectedLienType: 'Easement',
      rbiClassification: 'Non-Financial Restriction',
      autoTagApplied: 'Utility Easement',
      expectedParty: 'N/A',
      actualParty: 'City Water Authority',
      partyMatchResult: 'Expected Party',
      underwritingActionRequired: 'None - standard utility easement',
      result: 'Passed',
      confidenceScore: 98
    }, {
      id: 'lien-3',
      scheduleBText: 'Mechanics Lien filed by XYZ Construction, recorded August 10, 2024, in the amount of $25,000',
      detectedLienType: 'Claim of Lien',
      rbiClassification: 'Involuntary Lien',
      autoTagApplied: 'Construction Lien',
      expectedParty: 'ABC Holdings LLC',
      actualParty: 'Unknown Third Party',
      partyMatchResult: 'Unexpected Party',
      underwritingActionRequired: 'Manual review required - unexpected lienholder',
      result: 'Manual Review',
      confidenceScore: 87
    }],
    affiliatedEntities: {
      vestedOwner: {
        entityName: 'ABC Holdings, LLC',
        registeredAgent: 'Corporate Agents Inc.',
        address: '123 Main St, Suite 100, Austin, TX 78701',
        entityType: 'LLC'
      },
      seller: {
        entityName: 'ABC Holdings LLC',
        registeredAgent: 'Corporate Agents Inc.',
        address: '123 Main St, Suite 100, Austin, TX 78701',
        entityType: 'LLC'
      },
      borrower: {
        entityName: 'John Smith',
        address: '456 Oak Ave, Dallas, TX 75201',
        entityType: 'Individual'
      },
      guarantors: [{
        entityName: 'John Smith',
        address: '456 Oak Ave, Dallas, TX 75201',
        entityType: 'Individual'
      }],
      lienholderParties: [{
        entityName: 'First National Bank',
        address: '789 Financial Blvd, Houston, TX 77001',
        entityType: 'Corporation'
      }],
      affiliationDetections: [{
        entityA: 'ABC Holdings, LLC',
        entityB: 'ABC Holdings LLC',
        matchTypeDetected: 'Name similarity',
        similarityScore: 96,
        result: 'Passed'
      }],
      overallStatus: 'pass'
    },
    commitmentAmount: {
      titleCommitmentAmount: 525000,
      posLoanAmount: 500000,
      difference: -25000,
      differencePercent: -4.76,
      matchScore: 100,
      result: 'pass'
    },
    altaPolicyReview: {
      policyType: {
        extractedType: 'ALTA 8.1-2019',
        businessRule: 'Must be ALTA form for non-Texas properties',
        result: 'pass'
      },
      lossPayee: {
        extractedClause: 'RBI Private Lending, LLC ISAOA/ATIMA',
        businessRule: 'RBI Private Lending, LLC ISAOA/ATIMA',
        matchScore: 100,
        result: 'pass'
      }
    },
    chainOfTitle: [{
      id: 'cot-1',
      itemType: 'Owner History',
      ocrExtractedData: 'Property owned by Smith Family Trust from 2015-2020',
      autoTag: 'green',
      underwritingActionRequired: 'None',
      result: 'Pass',
      date: '2015-03-15'
    }, {
      id: 'cot-2',
      itemType: 'Warranty Deed',
      ocrExtractedData: 'Warranty Deed from Smith Family Trust to ABC Holdings LLC recorded March 2020',
      autoTag: 'green',
      underwritingActionRequired: 'None',
      result: 'Pass',
      date: '2020-03-22'
    }, {
      id: 'cot-3',
      itemType: 'Recent Transfer 3–12 Months',
      ocrExtractedData: 'Transfer from ABC Holdings LLC to current vested owner recorded 8 months ago',
      autoTag: 'yellow',
      underwritingActionRequired: 'Review transfer documentation',
      result: 'Manual Review',
      date: '2024-04-10'
    }],
    isaoaReconciliation: {
      sources: [{
        source: 'Title Commitment',
        extractedName: 'RBI Private Lending, LLC ISAOA/ATIMA',
        matches: true
      }, {
        source: 'ALTA Policy',
        extractedName: 'RBI Private Lending, LLC ISAOA/ATIMA',
        matches: true
      }, {
        source: 'CPL',
        extractedName: 'RBI Private Lending, LLC ISAOA/ATIMA',
        matches: true
      }],
      businessRule: 'RBI Private Lending, LLC ISAOA/ATIMA',
      matchScore: 100,
      result: 'pass'
    },
    purchaseContractReconciliation: {
      sellerNameMatch: {
        contractValue: 'ABC Holdings LLC',
        titleValue: 'ABC Holdings, LLC',
        matchScore: 96,
        result: 'pass'
      },
      buyerNameMatch: {
        contractValue: 'John Smith',
        posValue: 'John Smith',
        matchScore: 100,
        result: 'pass'
      },
      propertyAddressMatch: {
        contractValue: '123 Main St, Austin, TX 78701',
        matchScore: 100,
        result: 'pass'
      },
      purchasePriceConfirmation: {
        contractValue: 625000,
        matchScore: 100,
        result: 'pass'
      },
      closingDate: {
        contractValue: '2024-12-15',
        matchScore: 100,
        result: 'pass'
      }
    },
    overallStatus: 'review',
    processedAt: '2024-12-10T14:30:00Z',
    processedBy: 'System'
  };
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pass":
      case "passed":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>;
      case "warn":
      case "warning":
      case "review":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Review</Badge>;
      case "fail":
      case "failed":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const getAutoTagColor = (tag: 'green' | 'yellow' | 'red') => {
    switch (tag) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
    }
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
  const renderEntityCard = (entity: EntityInfo, title: string) => <div className="p-4 bg-muted/20 rounded-lg space-y-2">
      <p className="text-xs text-muted-foreground font-medium">{title}</p>
      <p className="text-sm font-semibold">{entity.entityName}</p>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p><span className="font-medium">Type:</span> {entity.entityType}</p>
        <p><span className="font-medium">Address:</span> {entity.address}</p>
        {entity.registeredAgent && <p><span className="font-medium">Registered Agent:</span> {entity.registeredAgent}</p>}
      </div>
    </div>;
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Title Insurance</span>
          {getStatusBadge(phaseStatus)}
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Section 1: Ownership Verification */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('ownershipVerification')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Ownership Verification
              {getStatusBadge(data.ownershipMatch.status)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.ownershipVerification ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.ownershipVerification && <CardContent className="space-y-4">
            {/* Transaction Type Subsection */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium flex items-center gap-1">
                  Transaction Type
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">Transaction type from POS determines ownership validation logic</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" /> Passed
                </Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">{data.transactionType}</Badge>
                </div>
              </div>
            </div>

            {/* Ownership Match Subsection */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium flex items-center gap-1">
                  Ownership Match
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="font-medium mb-1">Validation Rule:</p>
                        <p className="text-xs">
                          {data.transactionType === 'Purchase' ? 'For Purchase: Seller Name (Purchase Contract) must match Vested Owner (Schedule A)' : 'For Refinance: Borrower/Guarantor must match Vested Owner'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                {getStatusBadge(data.ownershipMatch.status)}
              </div>
              <div className="grid grid-cols-2 divide-x">
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    {data.transactionType === 'Purchase' ? 'Seller Name (Purchase Contract)' : 'Borrower/Guarantor (POS)'}
                  </p>
                  <p className="text-sm font-medium">
                    {data.transactionType === 'Purchase' ? data.ownershipMatch.sellerName : data.ownershipMatch.borrowerName}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Vested Owner (Title Commitment - Schedule A)</p>
                  <p className="text-sm font-medium">{data.ownershipMatch.vestedOwner}</p>
                </div>
              </div>
              <div className="px-4 py-3 bg-muted/10 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Match Score</span>
                  <span className="text-sm font-semibold text-green-600">{data.ownershipMatch.matchScore}%</span>
                </div>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Section 2: Lien & Encumbrance Verification */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('lienEncumbrance')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Lien & Encumbrance Verification
              {data.lienItems.some(l => l.result === 'Manual Review') ? <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Review</Badge> : <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.lienEncumbrance ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.lienEncumbrance && <CardContent className="space-y-3">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Schedule B Item</TableHead>
                    <TableHead className="text-xs">Lien Type</TableHead>
                    <TableHead className="text-xs">RBI Classification</TableHead>
                    <TableHead className="text-xs">Auto-Tag</TableHead>
                    <TableHead className="text-xs">Party Match</TableHead>
                    <TableHead className="text-xs">Action Required</TableHead>
                    <TableHead className="text-xs">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.lienItems.map(lien => <Collapsible key={lien.id} open={expandedLiens[lien.id]} onOpenChange={() => toggleLien(lien.id)}>
                      <TableRow className="cursor-pointer hover:bg-muted/20">
                        <TableCell className="text-xs max-w-[200px]">
                          <CollapsibleTrigger className="flex items-center gap-1 text-left">
                            <ChevronDown className={`h-3 w-3 flex-shrink-0 transition-transform ${expandedLiens[lien.id] ? '' : '-rotate-90'}`} />
                            <span className="truncate">{lien.scheduleBText.substring(0, 50)}...</span>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className="text-xs">{lien.detectedLienType}</TableCell>
                        <TableCell className="text-xs">{lien.rbiClassification}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {lien.autoTagApplied}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={lien.partyMatchResult === 'Expected Party' ? 'outline' : 'destructive'} className="text-xs">
                            {lien.partyMatchResult}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate">{lien.underwritingActionRequired}</TableCell>
                        <TableCell>
                          {lien.result === 'Passed' && <Badge variant="success" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>}
                          {lien.result === 'Requires Payoff' && <Badge variant="outline" className="text-xs gap-1 bg-blue-50 text-blue-700 border-blue-200"><DollarSign className="h-3 w-3" /> Payoff</Badge>}
                          {lien.result === 'Manual Review' && <Badge variant="warning" className="text-xs gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview('Lien Review', lien.expectedParty, lien.actualParty, lien.underwritingActionRequired)}>
                              <AlertTriangle className="h-3 w-3" /> Review
                            </Badge>}
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow className="bg-muted/10">
                          <TableCell colSpan={7} className="p-4">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">Full OCR Text:</p>
                              <p className="text-xs bg-muted/20 p-3 rounded">{lien.scheduleBText}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="text-muted-foreground">Confidence Score: <span className="font-semibold text-foreground">{lien.confidenceScore}%</span></span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </Collapsible>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>}
      </Card>

      {/* Section 3: Affiliated Entities Check */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('affiliatedEntities')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Affiliated Entities Check
              {getStatusBadge(data.affiliatedEntities.overallStatus)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.affiliatedEntities ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.affiliatedEntities && <CardContent className="space-y-4">
            {/* Entity Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {renderEntityCard(data.affiliatedEntities.vestedOwner, 'Vested Owner (Title)')}
              {data.affiliatedEntities.seller && renderEntityCard(data.affiliatedEntities.seller, 'Seller (Contract)')}
              {renderEntityCard(data.affiliatedEntities.borrower, 'Borrower (POS)')}
              {data.affiliatedEntities.guarantors.map((g, i) => renderEntityCard(g, `Guarantor ${i + 1}`))}
              {data.affiliatedEntities.lienholderParties.map((l, i) => renderEntityCard(l, `Lienholder ${i + 1}`))}
            </div>

            <Separator />

            {/* Affiliation Detection Table */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Affiliation Detection Results</h4>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs">Entity A</TableHead>
                      <TableHead className="text-xs">Entity B</TableHead>
                      <TableHead className="text-xs">Match Type Detected</TableHead>
                      <TableHead className="text-xs">Similarity Score</TableHead>
                      <TableHead className="text-xs">Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.affiliatedEntities.affiliationDetections.length > 0 ? data.affiliatedEntities.affiliationDetections.map((match, idx) => <TableRow key={idx}>
                          <TableCell className="text-xs font-medium">{match.entityA}</TableCell>
                          <TableCell className="text-xs font-medium">{match.entityB}</TableCell>
                          <TableCell className="text-xs">{match.matchTypeDetected}</TableCell>
                          <TableCell className="text-xs font-semibold">{match.similarityScore}%</TableCell>
                          <TableCell>
                            {match.result === 'Passed' ? <Badge variant="success" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge> : <Badge variant="warning" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Flagged</Badge>}
                          </TableCell>
                        </TableRow>) : <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                          No affiliations detected
                        </TableCell>
                      </TableRow>}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Section 4: Commitment Amount Validation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('commitmentAmount')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Commitment Amount Validation
              {getStatusBadge(data.commitmentAmount.result)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.commitmentAmount ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.commitmentAmount && <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 divide-x">
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Title Commitment Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(data.commitmentAmount.titleCommitmentAmount)}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">POS Loan Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(data.commitmentAmount.posLoanAmount)}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Difference</p>
                  <p className={`text-lg font-bold ${data.commitmentAmount.difference < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.commitmentAmount.difference)} ({data.commitmentAmount.differencePercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 bg-muted/10 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Match Score</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-green-600">{data.commitmentAmount.matchScore}%</span>
                  {getStatusBadge(data.commitmentAmount.result)}
                </div>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Section 5: ALTA Policy Review */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('altaPolicy')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              ALTA Policy Review
              {getStatusBadge(data.altaPolicyReview.policyType.result === 'pass' && data.altaPolicyReview.lossPayee.result === 'pass' ? 'pass' : 'review')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.altaPolicy ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.altaPolicy && <CardContent className="space-y-4">
            {/* Policy Type Validation */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium">Policy Type Validation</span>
                {getStatusBadge(data.altaPolicyReview.policyType.result)}
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Extracted Policy Type</p>
                    <p className="text-sm font-medium">{data.altaPolicyReview.policyType.extractedType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Business Rule</p>
                    <p className="text-sm font-medium">{data.altaPolicyReview.policyType.businessRule}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loss Payee Validation */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium">Loss Payee Validation</span>
                {getStatusBadge(data.altaPolicyReview.lossPayee.result)}
              </div>
              <div className="grid grid-cols-2 divide-x">
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">OCR Extracted Lender Clause</p>
                  <p className="text-sm font-medium">{data.altaPolicyReview.lossPayee.extractedClause}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Business Rule</p>
                  <p className="text-sm font-medium">{data.altaPolicyReview.lossPayee.businessRule}</p>
                </div>
              </div>
              <div className="px-4 py-3 bg-muted/10 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Match Score</span>
                  <span className="text-sm font-semibold text-green-600">{data.altaPolicyReview.lossPayee.matchScore}%</span>
                </div>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Section 6: 24-Month Chain of Title Review */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('chainOfTitle')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              24-Month Chain of Title Review
              {data.chainOfTitle.some(c => c.result === 'Manual Review') ? <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Review</Badge> : <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.chainOfTitle ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.chainOfTitle && <CardContent>
            <div className="space-y-3">
              {data.chainOfTitle.map((item, index) => <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.date && formatDate(item.date)}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getAutoTagColor(item.autoTag)}`}>
                        {item.itemType}
                      </Badge>
                    </div>
                    {item.result === 'Pass' ? <Badge variant="success" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge> : <Badge variant="warning" className="text-xs gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview('Chain of Title', item.itemType, item.ocrExtractedData, item.underwritingActionRequired)}>
                          <AlertTriangle className="h-3 w-3" /> Manual Review
                        </Badge>}
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">OCR Extracted Data:</p>
                    <p className="text-sm">{item.ocrExtractedData}</p>
                    {item.underwritingActionRequired !== 'None' && <p className="text-xs text-amber-600">
                        <span className="font-medium">Action Required:</span> {item.underwritingActionRequired}
                      </p>}
                  </div>
                </div>)}
            </div>
          </CardContent>}
      </Card>

      {/* Section 7: ISAOA/ATIMA Reconciliation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('isaoaReconciliation')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              ISAOA/ATIMA Reconciliation
              {getStatusBadge(data.isaoaReconciliation.result)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.isaoaReconciliation ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.isaoaReconciliation && <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="rounded-lg border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs">Source Document</TableHead>
                      <TableHead className="text-xs">Extracted Insured Lender Name</TableHead>
                      <TableHead className="text-xs">Match</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.isaoaReconciliation.sources.map((source, idx) => <TableRow key={idx}>
                        <TableCell className="text-xs font-medium">{source.source}</TableCell>
                        <TableCell className="text-xs">{source.extractedName}</TableCell>
                        <TableCell>
                          {source.matches ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
              <div className="px-4 py-3 bg-muted/10 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Business Rule</span>
                  <span className="text-xs font-medium">{data.isaoaReconciliation.businessRule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Match Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-600">{data.isaoaReconciliation.matchScore}%</span>
                    {getStatusBadge(data.isaoaReconciliation.result)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Section 8: Purchase Contract Reconciliation (Conditional) */}
      {data.transactionType === 'Purchase' && data.purchaseContractReconciliation && <Card>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('purchaseContract')}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Purchase Contract Reconciliation
                {getStatusBadge('pass')}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.purchaseContract ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.purchaseContract && <CardContent className="space-y-3">
              {/* Seller Name Match */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium">Seller Name Match</span>
                  {getStatusBadge(data.purchaseContractReconciliation.sellerNameMatch.result)}
                </div>
                <div className="grid grid-cols-3 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Contract</p>
                    <p className="text-sm font-medium">{data.purchaseContractReconciliation.sellerNameMatch.contractValue}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Title</p>
                    <p className="text-sm font-medium">{data.purchaseContractReconciliation.sellerNameMatch.titleValue}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <p className="text-sm font-semibold text-green-600">{data.purchaseContractReconciliation.sellerNameMatch.matchScore}%</p>
                  </div>
                </div>
              </div>

              {/* Buyer Name Match */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium">Buyer Name Match</span>
                  {getStatusBadge(data.purchaseContractReconciliation.buyerNameMatch.result)}
                </div>
                <div className="grid grid-cols-3 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Contract</p>
                    <p className="text-sm font-medium">{data.purchaseContractReconciliation.buyerNameMatch.contractValue}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">POS</p>
                    <p className="text-sm font-medium">{data.purchaseContractReconciliation.buyerNameMatch.posValue}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <p className="text-sm font-semibold text-green-600">{data.purchaseContractReconciliation.buyerNameMatch.matchScore}%</p>
                  </div>
                </div>
              </div>

              {/* Property Address Match */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium">Property Address Match</span>
                  {getStatusBadge(data.purchaseContractReconciliation.propertyAddressMatch.result)}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
                    <p className="text-sm font-medium">{data.purchaseContractReconciliation.propertyAddressMatch.contractValue}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <p className="text-sm font-semibold text-green-600">{data.purchaseContractReconciliation.propertyAddressMatch.matchScore}%</p>
                  </div>
                </div>
              </div>

              {/* Purchase Price Confirmation */}
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                  <span className="text-sm font-medium">Purchase Price Confirmation</span>
                  {getStatusBadge(data.purchaseContractReconciliation.purchasePriceConfirmation.result)}
                </div>
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Contract Price</p>
                    <p className="text-lg font-bold">{formatCurrency(data.purchaseContractReconciliation.purchasePriceConfirmation.contractValue)}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <p className="text-sm font-semibold text-green-600">{data.purchaseContractReconciliation.purchasePriceConfirmation.matchScore}%</p>
                  </div>
                </div>
              </div>

              {/* Closing Date (Optional) */}
              {data.purchaseContractReconciliation.closingDate && <div className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                    <span className="text-sm font-medium">Closing Date</span>
                    {getStatusBadge(data.purchaseContractReconciliation.closingDate.result)}
                  </div>
                  <div className="grid grid-cols-2 divide-x">
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Contract Closing Date</p>
                      <p className="text-sm font-medium">{formatDate(data.purchaseContractReconciliation.closingDate.contractValue)}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                      <p className="text-sm font-semibold text-green-600">{data.purchaseContractReconciliation.closingDate.matchScore}%</p>
                    </div>
                  </div>
                </div>}
            </CardContent>}
        </Card>}

      {/* Manual Review Modal */}
      {selectedCheck && <ManualReviewModal open={manualReviewOpen} onOpenChange={setManualReviewOpen} metricName={String(selectedCheck.metric)} posValue={selectedCheck.posValue} aiValue={selectedCheck.aiValue} deviation={selectedCheck.difference} />}
    </div>;
};