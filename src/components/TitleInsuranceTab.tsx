import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight, FileText, Shield, MapPin, DollarSign, Calendar, User, Building, Info, AlertCircle, Clock, Link2, Users, Scale, FileCheck, History, Square, Check, FileWarning, Landmark, Home, ScrollText, Ban, BookOpen } from "lucide-react";
import { useState } from "react";
import { TitleInsuranceData, LienItem, ChainOfTitleItem, EntityInfo, AffiliationMatch, LienCategory, AffiliationCategory } from "@/types/titleInsurance";
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
  const [expandedLienCategories, setExpandedLienCategories] = useState<Record<string, boolean>>({
    'Mortgage / Deed of Trust': false,
    'Judgment': false,
    'Tax Lien (IRS, State, County)': false,
    'Tax Certificate': false,
    'HOA Lien': false,
    'UCC Filing': false,
    'Easement': false,
    'Restrictions / CCRs / Code Enforcement': false,
    'Claim of Lien': false
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
  const toggleLien = (lienId: string) => {
    setExpandedLiens(prev => ({
      ...prev,
      [lienId]: !prev[lienId]
    }));
  };
  const toggleLienCategory = (category: string) => {
    setExpandedLienCategories(prev => ({
      ...prev,
      [category]: !prev[category]
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
    lienItems: [
      // Mortgage / Deed of Trust
      {
        id: 'lien-1',
        scheduleBTitle: 'Deed of Trust recorded January 15, 2023',
        scheduleBText: 'Deed of Trust recorded January 15, 2023, Book 5093, Page 472, executed by John Doe to First Finance Bank.',
        detectedLienType: 'Mortgage',
        lienCategory: 'Mortgage / Deed of Trust',
        rbiClassification: 'Voluntary Financial Lien',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'John Doe',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Verify payoff amount',
        result: 'Manual Review',
        confidenceScore: 94
      },
      {
        id: 'lien-2',
        scheduleBTitle: 'Mortgage recorded August 3, 2024',
        scheduleBText: 'Mortgage recorded August 3, 2024, Book 5412, Page 118, executed by John Doe to Second Bank Corp.',
        detectedLienType: 'Mortgage',
        lienCategory: 'Mortgage / Deed of Trust',
        rbiClassification: 'Voluntary Financial Lien',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'John Doe',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Verify payoff amount',
        result: 'Manual Review',
        confidenceScore: 92
      },
      // Judgment
      {
        id: 'lien-3',
        scheduleBTitle: 'Judgment Lien - Case #2024-CV-1234',
        scheduleBText: 'Judgment Lien recorded February 10, 2024, Book 5501, Page 312, creditor ABC Collections vs John Doe.',
        detectedLienType: 'Judgment',
        lienCategory: 'Judgment',
        rbiClassification: 'Involuntary Financial Lien',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'ABC Collections',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Obtain proof of non-attachment OR payoff/release',
        result: 'Manual Review',
        confidenceScore: 91
      },
      // Tax Lien (IRS, State, County)
      {
        id: 'lien-4',
        scheduleBTitle: 'IRS Tax Lien recorded December 5, 2023',
        scheduleBText: 'Federal Tax Lien recorded December 5, 2023, Book 5601, Page 245, for unpaid taxes in the amount of $15,432.',
        detectedLienType: 'Tax Lien',
        lienCategory: 'Tax Lien (IRS, State, County)',
        rbiClassification: 'Super-Priority Lien',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'Internal Revenue Service',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Require full resolution/payoff before closing',
        result: 'Manual Review',
        confidenceScore: 95
      },
      // Tax Certificate
      {
        id: 'lien-5',
        scheduleBTitle: 'Tax Certificate #TC-2023-5678',
        scheduleBText: 'Tax Certificate recorded July 15, 2023, Book 5320, Page 89, for delinquent property taxes.',
        detectedLienType: 'Tax Certificate',
        lienCategory: 'Tax Certificate',
        rbiClassification: 'Priority Lien',
        autoTagApplied: 'Review',
        expectedParty: 'Property Owner',
        actualParty: 'County Tax Collector',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Require full resolution/payoff before or at closing',
        result: 'Manual Review',
        confidenceScore: 93
      },
      // HOA Lien
      {
        id: 'lien-6',
        scheduleBTitle: 'HOA Assessment Lien recorded March 2024',
        scheduleBText: 'HOA Assessment Lien recorded March 18, 2024, Book 5580, Page 201, for past due assessments totaling $2,450.',
        detectedLienType: 'HOA Lien',
        lienCategory: 'HOA Lien',
        rbiClassification: 'Statutory Lien',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'Sunset Hills HOA',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Obtain dues letter + confirm no super-priority exposure',
        result: 'Manual Review',
        confidenceScore: 94
      },
      // UCC Filing
      {
        id: 'lien-7',
        scheduleBTitle: 'UCC-1 Financing Statement',
        scheduleBText: 'UCC-1 Financing Statement filed April 5, 2022, File #2022-1234567, secured party Equipment Finance Co.',
        detectedLienType: 'UCC',
        lienCategory: 'UCC Filing',
        rbiClassification: 'Fixture or Personal Property Encumbrance',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'Equipment Finance Co.',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Determine if fixture; obtain termination if fixture',
        result: 'Manual Review',
        confidenceScore: 88
      },
      // Easement
      {
        id: 'lien-8',
        scheduleBTitle: 'Utility easement recorded May 22, 2018',
        scheduleBText: 'Utility easement recorded May 22, 2018, Book 4331, Page 310, granting access rights to Utility Co.',
        detectedLienType: 'Easement',
        lienCategory: 'Easement',
        rbiClassification: 'Non-Financial Property Right',
        autoTagApplied: 'Passed',
        expectedParty: 'N/A',
        actualParty: 'Utility Co.',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Confirm no impact on rehab, access, or construction',
        result: 'Passed',
        confidenceScore: 98
      },
      // Restrictions / CCRs / Code Enforcement
      {
        id: 'lien-9',
        scheduleBTitle: 'CC&Rs recorded September 12, 2010',
        scheduleBText: 'Declaration of Covenants, Conditions, and Restrictions recorded September 12, 2010, Book 3892, Page 501.',
        detectedLienType: 'Restriction',
        lienCategory: 'Restrictions / CCRs / Code Enforcement',
        rbiClassification: 'Use Restrictions / Non-Financial',
        autoTagApplied: 'Passed',
        expectedParty: 'N/A',
        actualParty: 'Homeowners Association',
        partyMatchResult: 'Expected Party',
        underwritingActionRequired: 'Verify no conflict with zoning, STR rules, or planned use',
        result: 'Passed',
        confidenceScore: 99
      },
      // Claim of Lien
      {
        id: 'lien-10',
        scheduleBTitle: 'Mechanics Lien filed by XYZ Construction',
        scheduleBText: 'Claim of Lien filed by XYZ Construction LLC on March 1, 2025 for unpaid improvements, recorded Book 5781, Page 922.',
        detectedLienType: 'Claim of Lien',
        lienCategory: 'Claim of Lien',
        rbiClassification: 'Financial or Statutory Lien',
        autoTagApplied: 'Review',
        expectedParty: 'John Doe',
        actualParty: 'XYZ Construction LLC',
        partyMatchResult: 'Unexpected Party',
        underwritingActionRequired: 'Must be satisfied; obtain payoff/release',
        result: 'Manual Review',
        confidenceScore: 87
      }
    ],
    affiliatedEntities: {
      vestedOwner: {
        entityName: 'ABC Holdings, LLC',
        registeredAgent: 'Corporate Agents Inc.',
        address: '123 Main St, Suite 100, Austin, TX 78701',
        entityType: 'LLC'
      },
      assignor: {
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
      guarantors: [
        {
          entityName: 'John Smith',
          address: '456 Oak Ave, Dallas, TX 75201',
          entityType: 'Individual'
        },
        {
          entityName: 'Jane Smith',
          address: '456 Oak Ave, Dallas, TX 75201',
          entityType: 'Individual'
        }
      ],
      lienholderParties: [{
        entityName: 'First National Bank',
        address: '789 Financial Blvd, Houston, TX 77001',
        entityType: 'Corporation'
      }],
      affiliationDetections: [
        // Name Detection
        {
          entityA: 'ABC Holdings, LLC',
          entityB: 'ABC Holdings LLC',
          category: 'Name',
          matchTypeDetected: 'Name similarity (punctuation variance)',
          similarityScore: 96,
          result: 'Passed'
        },
        {
          entityA: 'John Smith',
          entityB: 'John Smith',
          category: 'Name',
          matchTypeDetected: 'Exact match',
          similarityScore: 100,
          result: 'Passed'
        },
        // Entity Detection
        {
          entityA: 'ABC Holdings, LLC',
          entityB: 'ABC Holdings LLC',
          category: 'Entity',
          matchTypeDetected: 'LLC variation detected',
          similarityScore: 98,
          result: 'Passed'
        },
        // Mail Address Detection
        {
          entityA: 'ABC Holdings, LLC',
          entityB: 'ABC Holdings LLC',
          category: 'Mail Address',
          matchTypeDetected: 'Same address: 123 Main St, Suite 100, Austin, TX 78701',
          similarityScore: 100,
          result: 'Passed'
        },
        {
          entityA: 'John Smith',
          entityB: 'Jane Smith',
          category: 'Mail Address',
          matchTypeDetected: 'Same address: 456 Oak Ave, Dallas, TX 75201',
          similarityScore: 100,
          result: 'Flagged'
        },
        // Registered Agent Detection
        {
          entityA: 'ABC Holdings, LLC',
          entityB: 'ABC Holdings LLC',
          category: 'Registered Agent',
          matchTypeDetected: 'Same agent: Corporate Agents Inc.',
          similarityScore: 100,
          result: 'Passed'
        },
        // Known Affiliates
        {
          entityA: 'John Smith',
          entityB: 'Jane Smith',
          category: 'Known Affiliates',
          matchTypeDetected: 'Guarantors on same loan',
          similarityScore: 100,
          result: 'Passed'
        }
      ],
      overallStatus: 'pass'
    },
    commitmentAmount: {
      titleCommitmentAmount: 500000,
      posLoanAmount: 500000,
      difference: 0,
      differencePercent: 0,
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
    chainOfTitle: [
      {
        id: 'cot-1',
        itemType: 'Owner History',
        rbiClassification: 'Historical Ownership Data',
        ocrExtractedData: 'Property owned by Smith Family Trust from 2015-2020',
        autoTag: 'Owner History – Review Completed',
        underwritingActionRequired: 'Verify chain of title for completeness and anomalies',
        result: 'Manual Review',
        date: '2015-03-15'
      },
      {
        id: 'cot-2',
        itemType: 'Transfer',
        rbiClassification: 'Property Transfer Event',
        ocrExtractedData: 'Transfer from Smith Family Trust to ABC Holdings LLC recorded March 2020',
        autoTag: 'Ownership Change – Review Required',
        underwritingActionRequired: 'Confirm validity of transfer; check for prior liens or encumbrances',
        result: 'Manual Review',
        date: '2020-03-22'
      },
      {
        id: 'cot-3',
        itemType: 'Warranty Deed',
        rbiClassification: 'Transfer Instrument',
        ocrExtractedData: 'Warranty Deed from ABC Holdings LLC to XYZ Investments LLC recorded June 2022',
        autoTag: 'Warranty Deed – Confirm Full Title Guarantee',
        underwritingActionRequired: 'Ensure grantor had full title and no encumbrance conflicts',
        result: 'Manual Review',
        date: '2022-06-15'
      },
      {
        id: 'cot-4',
        itemType: 'Quitclaim',
        rbiClassification: 'Transfer Instrument',
        ocrExtractedData: 'Quitclaim Deed from XYZ Investments LLC to current vested owner recorded January 2024',
        autoTag: 'Quitclaim – Verify Beneficiary & Liability',
        underwritingActionRequired: 'Confirm no hidden liens or ownership conflicts',
        result: 'Manual Review',
        date: '2024-01-10'
      },
      {
        id: 'cot-5',
        itemType: 'New Lien Recorded',
        rbiClassification: 'Financial Encumbrance',
        ocrExtractedData: 'New mortgage lien recorded February 2024, Book 5412, Page 118',
        autoTag: 'New Lien Detected – Exception Required',
        underwritingActionRequired: 'Determine payoff requirement; assess encumbrance risk',
        result: 'Manual Review',
        date: '2024-02-05'
      },
      {
        id: 'cot-6',
        itemType: 'Release Not Filed',
        rbiClassification: 'Outstanding Encumbrance',
        ocrExtractedData: 'Prior mortgage from 2019 shows no release of lien on record',
        autoTag: 'Release Missing – Follow-Up Required',
        underwritingActionRequired: 'Verify lien satisfaction; ensure title is free from stale liens',
        result: 'Manual Review',
        date: '2019-08-20'
      },
      {
        id: 'cot-7',
        itemType: 'Flip 0-12 Months',
        rbiClassification: 'Red-Flag / Risk Alert',
        ocrExtractedData: 'Property was transferred 4 months ago and is now being resold',
        autoTag: 'Rapid Flip – Risk Review',
        underwritingActionRequired: 'Evaluate marketability, rehab history, borrower experience',
        result: 'Manual Review',
        date: '2024-08-10'
      },
      {
        id: 'cot-8',
        itemType: 'Related Party Transfer',
        rbiClassification: 'Related Party Transfer',
        ocrExtractedData: 'Transfer between ABC Holdings LLC and ABC Investments LLC (common ownership)',
        autoTag: 'Related Party Transfer – Review Required',
        underwritingActionRequired: 'Assess non-arm\'s length transaction risk; check hidden liens',
        result: 'Manual Review',
        date: '2024-03-15'
      },
      {
        id: 'cot-9',
        itemType: 'Unexpected New Lien (<90 Days)',
        rbiClassification: 'Red-Flag / New Risk',
        ocrExtractedData: 'Mechanics lien filed 45 days ago by XYZ Construction LLC',
        autoTag: 'Unexpected Lien – Immediate Review',
        underwritingActionRequired: 'Verify payoff, confirm priority, assess risk exposure',
        result: 'Manual Review',
        date: '2024-10-28'
      },
      {
        id: 'cot-10',
        itemType: 'Ownership Transfer 3-12 Months',
        rbiClassification: 'Red-Flag / Risk Alert',
        ocrExtractedData: 'Transfer from previous owner occurred 8 months ago',
        autoTag: 'Recent Transfer – Review Required',
        underwritingActionRequired: 'Investigate reason for transfer; evaluate flip or related-party risk',
        result: 'Manual Review',
        date: '2024-04-10'
      },
      {
        id: 'cot-11',
        itemType: 'Sudden Ownership Change',
        rbiClassification: 'Red-Flag / Risk Alert',
        ocrExtractedData: 'Rapid succession of 3 ownership changes within 6 months detected',
        autoTag: 'Sudden Ownership Change – Review Required',
        underwritingActionRequired: 'Investigate rapid ownership change; assess flip or fraud risk',
        result: 'Manual Review',
        date: '2024-05-20'
      }
    ],
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
  const getChainOfTitleItemColor = (result: 'Pass' | 'Manual Review') => {
    switch (result) {
      case 'Pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Manual Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
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
              Ownership & Amount Validation
              {getStatusBadge(data.ownershipMatch.status)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.ownershipVerification ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.ownershipVerification && <CardContent className="space-y-4">
            {/* Download Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Purchase Contract
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Title Commitment
              </Button>
            </div>

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

            {/* Amount Validation Subsection */}
            <div className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium flex items-center gap-1">
                  Amount Validation
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="font-medium mb-1">Validation Rule:</p>
                        <p className="text-xs">Title Commitment Amount must match POS Loan Amount exactly</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                {data.commitmentAmount.difference === 0 ? (
                  <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>
                )}
              </div>
              <div className="grid grid-cols-2 divide-x">
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Title Commitment Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(data.commitmentAmount.titleCommitmentAmount)}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">POS Loan Amount</p>
                  <p className="text-lg font-bold">{formatCurrency(data.commitmentAmount.posLoanAmount)}</p>
                </div>
              </div>
              {data.commitmentAmount.difference !== 0 && (
                <div className="px-4 py-3 bg-red-50 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Difference</span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(data.commitmentAmount.difference)} ({data.commitmentAmount.differencePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
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
          {/* Download Button */}
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Title Commitment
            </Button>
          </div>
          {/* Category Subsections */}
          {([
            { category: 'Mortgage / Deed of Trust' as LienCategory, icon: Landmark },
            { category: 'Judgment' as LienCategory, icon: Scale },
            { category: 'Tax Lien (IRS, State, County)' as LienCategory, icon: FileWarning },
            { category: 'Tax Certificate' as LienCategory, icon: FileText },
            { category: 'HOA Lien' as LienCategory, icon: Home },
            { category: 'UCC Filing' as LienCategory, icon: ScrollText },
            { category: 'Easement' as LienCategory, icon: MapPin },
            { category: 'Restrictions / CCRs / Code Enforcement' as LienCategory, icon: BookOpen },
            { category: 'Claim of Lien' as LienCategory, icon: Ban },
          ]).map(({ category, icon: CategoryIcon }) => {
            const categoryLiens = data.lienItems.filter(l => l.lienCategory === category);
            const hasReviewItems = categoryLiens.some(l => l.result === 'Manual Review');
            const categoryStatus = categoryLiens.length === 0 ? 'empty' : hasReviewItems ? 'review' : 'passed';
            
            return (
              <div key={category} className="border rounded-lg overflow-hidden">
                {/* Category Header */}
                <div 
                  className="flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => toggleLienCategory(category)}
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{category}</span>
                    {categoryLiens.length > 0 && (
                      <span className="text-xs text-muted-foreground">({categoryLiens.length})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {categoryStatus === 'empty' ? (
                      <Badge variant="outline" className="text-xs">No items</Badge>
                    ) : categoryStatus === 'review' ? (
                      <Badge variant="warning" className="gap-1 text-xs">
                        <AlertTriangle className="h-3 w-3" /> Review
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1 text-xs">
                        <CheckCircle className="h-3 w-3" /> Passed
                      </Badge>
                    )}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedLienCategories[category] ? '' : '-rotate-90'}`} />
                  </div>
                </div>

                {/* Category Content */}
                {expandedLienCategories[category] && (
                  <div className="border-t">
                    {categoryLiens.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No items found in this category
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/10">
                            <TableHead className="text-xs font-semibold">Schedule B Item</TableHead>
                            <TableHead className="text-xs font-semibold w-[180px]">RBI Classification</TableHead>
                            <TableHead className="text-xs font-semibold w-[200px]">Underwriting Action</TableHead>
                            <TableHead className="text-xs font-semibold w-[100px] text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryLiens.map(lien => (
                            <>
                              <TableRow 
                                key={lien.id} 
                                className="hover:bg-muted/20 cursor-pointer"
                                onClick={() => toggleLien(lien.id)}
                              >
                                <TableCell className="py-3">
                                  <div className="flex items-center gap-2">
                                    {expandedLiens[lien.id] ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                    <span className="text-sm">{lien.scheduleBTitle || lien.scheduleBText.substring(0, 50)}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge variant="outline" className="text-xs font-medium bg-slate-50 text-slate-600 border-slate-200 rounded-full px-3">
                                    {lien.rbiClassification}
                                  </Badge>
                                </TableCell>
                                <TableCell className="py-3">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="text-xs text-muted-foreground truncate block max-w-[180px]">
                                          {lien.underwritingActionRequired.length > 30 
                                            ? lien.underwritingActionRequired.substring(0, 30) + '…' 
                                            : lien.underwritingActionRequired}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{lien.underwritingActionRequired}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                  {lien.result === 'Passed' && (
                                    <Badge className="text-xs font-medium gap-1 bg-green-500 hover:bg-green-500 text-white rounded-full px-3">
                                      <CheckCircle className="h-3 w-3" /> Passed
                                    </Badge>
                                  )}
                                  {lien.result === 'Requires Payoff' && (
                                    <Badge className="text-xs font-medium gap-1 bg-blue-500 hover:bg-blue-500 text-white rounded-full px-3">
                                      <DollarSign className="h-3 w-3" /> Payoff
                                    </Badge>
                                  )}
                                  {lien.result === 'Manual Review' && (
                                    <Badge 
                                      className="text-xs font-medium gap-1 bg-amber-500 hover:bg-amber-400 text-white rounded-full px-3 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openManualReview('Lien Review', lien.expectedParty, lien.actualParty, lien.underwritingActionRequired);
                                      }}
                                    >
                                      <AlertTriangle className="h-3 w-3" /> Review
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                              {expandedLiens[lien.id] && (
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                  <TableCell colSpan={4} className="py-3 px-4">
                                    <div className="flex items-start gap-2 ml-6">
                                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                      <div className="space-y-1">
                                        <span className="text-xs font-medium text-muted-foreground">Extracted OCR Text:</span>
                                        <div className="bg-background border rounded-md p-3">
                                          <p className="text-sm text-foreground leading-relaxed">{lien.scheduleBText}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
        {expandedCards.affiliatedEntities && <CardContent className="space-y-6">
            {/* Title Commitment Subsection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary border border-dashed border-primary/40 rounded px-2 py-1 w-fit">Title Commitment</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {renderEntityCard(data.affiliatedEntities.vestedOwner, 'Vested Owner')}
                {data.affiliatedEntities.assignor && renderEntityCard(data.affiliatedEntities.assignor, 'Assignor')}
                {data.affiliatedEntities.lienholderParties.map((l, i) => renderEntityCard(l, `Lienholder ${i + 1}`))}
              </div>
            </div>

            {/* POS Subsection */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary border border-dashed border-primary/40 rounded px-2 py-1 w-fit">POS</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {renderEntityCard(data.affiliatedEntities.borrower, 'Borrower')}
                {data.affiliatedEntities.guarantors.map((g, i) => renderEntityCard(g, `Guarantor ${i + 1}`))}
              </div>
            </div>

            {/* Contract Subsection */}
            {data.affiliatedEntities.seller && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-primary border border-dashed border-primary/40 rounded px-2 py-1 w-fit">Contract</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {renderEntityCard(data.affiliatedEntities.seller, 'Seller')}
                </div>
              </div>
            )}

            <Separator />

            {/* Affiliation Detection Tables by Category */}
            <div className="space-y-4">
              {([
                { category: 'Name' as AffiliationCategory, label: 'Name Detection Results', description: 'Name matches and variations' },
                { category: 'Entity' as AffiliationCategory, label: 'Entity Detection Results (how can we do this?)', description: 'LLC/Corp/Entity variations' },
                { category: 'Mail Address' as AffiliationCategory, label: 'Mail Address Detection Results', description: 'Shared address matches' },
                { category: 'Registered Agent' as AffiliationCategory, label: 'Registered Agent Detection Results (how can we do this?)', description: 'Shared agent matches' },
                { category: 'Known Affiliates' as AffiliationCategory, label: 'Known Affiliates (how can we do this?)', description: 'Pre-identified relationships' },
              ]).map(({ category, label, description }) => {
                const categoryMatches = data.affiliatedEntities.affiliationDetections.filter(m => m.category === category);
                const hasFlagged = categoryMatches.some(m => m.result === 'Flagged');
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
                        {categoryMatches.length > 0 && (
                          hasFlagged ? (
                            <Badge variant="warning" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Flagged</Badge>
                          ) : (
                            <Badge variant="success" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>
                          )
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{description}</span>
                    </div>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="text-xs">Entity A</TableHead>
                            <TableHead className="text-xs">Entity B</TableHead>
                            <TableHead className="text-xs">Match Type Detected</TableHead>
                            <TableHead className="text-xs w-[100px]">Similarity</TableHead>
                            <TableHead className="text-xs w-[100px] text-right">Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryMatches.length > 0 ? categoryMatches.map((match, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="text-xs font-medium">{match.entityA}</TableCell>
                              <TableCell className="text-xs font-medium">{match.entityB}</TableCell>
                              <TableCell className="text-xs">{match.matchTypeDetected}</TableCell>
                              <TableCell className="text-xs font-semibold">{match.similarityScore}%</TableCell>
                              <TableCell className="text-right">
                                {match.result === 'Passed' ? (
                                  <Badge variant="success" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>
                                ) : (
                                  <Badge variant="warning" className="text-xs gap-1"><AlertTriangle className="h-3 w-3" /> Flagged</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-3">
                                No matches detected
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
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
            {/* Download Button */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download ALTA Policy
              </Button>
            </div>

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
                    <p className="text-sm font-medium">ALTA 8.1-2019</p>
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
                      <Badge variant="outline" className={`text-xs ${getChainOfTitleItemColor(item.result)}`}>
                        {item.itemType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({item.rbiClassification})</span>
                    </div>
                    {item.result === 'Pass' ? <Badge variant="success" className="text-xs gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge> : <Badge variant="warning" className="text-xs gap-1 cursor-pointer hover:opacity-80" onClick={() => openManualReview('Chain of Title', item.itemType, item.ocrExtractedData, item.underwritingActionRequired)}>
                          <AlertTriangle className="h-3 w-3" /> Manual Review
                        </Badge>}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Auto-Tag (AI)</p>
                      <Badge variant="outline" className="text-xs">{item.autoTag}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">OCR Extracted Data</p>
                      <p className="text-sm">{item.ocrExtractedData}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Underwriting Action</p>
                      <p className="text-xs text-amber-700 font-medium">{item.underwritingActionRequired}</p>
                    </div>
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