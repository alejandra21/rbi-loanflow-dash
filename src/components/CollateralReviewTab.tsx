import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText,
  Building, TrendingUp, DollarSign, AlertCircle, Info, Calculator,
  MapPin, Camera, Clock, Home, Hammer, BarChart3, Shield, Flag,
  Activity, Scale
} from "lucide-react";
import { useState } from "react";
import type {
  CollateralReviewData,
  EngineCheck,
  RedFlag,
  ConfidenceTier,
  CheckStatus
} from "@/types/collateralReview";

interface CollateralReviewTabProps {
  data: CollateralReviewData;
  phaseStatus: string;
  lastUpdated: string;
}

// Mock data for demonstration
const mockCollateralReviewData: CollateralReviewData = {
  loanId: "LOA-2024-001",
  stageCode: "collateralReview",
  status: "pass",
  productType: "DSCR",
  transactionType: "Refinance",

  appraisalCompleteness: {
    appraiserLicenseValid: true,
    appraiserLicenseState: "FL",
    appraiserLicenseExpiry: "2025-12-31",
    signaturePresent: true,
    signatureType: "digital",
    effectiveDate: "2024-01-05",
    effectiveDateDays: 45,
    effectiveDateStatus: "pass",
    propertyTypeMatch: true,
    propertyTypePOS: "Single Family Residence",
    propertyTypeAppraisal: "Single Family Residence",
    interiorPhotosPresent: true,
    exteriorPhotosPresent: true,
    uadFieldsComplete: true,
    checks: [
      { name: "Appraiser License Valid", source: "Appraisal", status: "pass", value: "Active", notes: "State verification complete" },
      { name: "Signature Present", source: "Appraisal", status: "pass", value: "Digital", notes: "Valid digital signature" },
      { name: "Effective Date ≤120 days", source: "Appraisal", status: "pass", value: "45 days", threshold: "≤120 days" },
      { name: "Property Type Match", source: "POS + Appraisal", status: "pass", value: "SFR", notes: "Match confirmed" },
      { name: "Interior Photos Present", source: "Appraisal", status: "pass", notes: "OCR detection confirmed" },
      { name: "Exterior Photos Present", source: "Appraisal", status: "pass", notes: "OCR detection confirmed" },
      { name: "UAD Fields Complete", source: "Appraisal", status: "pass", notes: "All standardized fields present" }
    ]
  },

  subjectProperty: {
    addressNormalized: true,
    addressPOS: "456 Investment Ave, Miami, FL 33101",
    addressAppraisal: "456 Investment Ave, Miami, FL 33101",
    addressUSPS: "456 INVESTMENT AVE, MIAMI FL 33101-1234",
    glaVariance: 3.2,
    glaVarianceStatus: "pass",
    glaPOS: 2100,
    glaAppraisal: 2168,
    roomCount: 8,
    roomCountMatch: true,
    unitCount: 1,
    unitCountMatch: true,
    conditionRating: "C3",
    qualityRating: "Q3",
    photosConsistent: true,
    checks: [
      { name: "Address Normalized", source: "USPS Geocode", status: "pass", notes: "Geocode validation complete" },
      { name: "GLA ±10%", source: "Appraisal / OCR", status: "pass", value: "3.2%", threshold: "≤10%" },
      { name: "Room Count Match", source: "Appraisal", status: "pass", value: "8 rooms" },
      { name: "Unit Count Match", source: "Appraisal", status: "pass", value: "1 unit" },
      { name: "Condition Rating (C/Q)", source: "Appraisal", status: "pass", value: "C3/Q3" },
      { name: "Photos Consistent", source: "Appraisal OCR", status: "pass", notes: "Interior & exterior verified" }
    ]
  },

  compConfidence: {
    comparables: [
      { compId: "C1", address: "420 Ocean Dr, Miami, FL", saleDate: "2023-11-15", monthsOld: 3, salePrice: 485000, distance: 0.4, grossAdjustmentPercent: 8, netAdjustmentPercent: 5, recencyScore: 100, distanceScore: 100, adjustmentScore: 100, condition: "C3" },
      { compId: "C2", address: "512 Palm Ave, Miami, FL", saleDate: "2023-09-20", monthsOld: 5, salePrice: 510000, distance: 0.8, grossAdjustmentPercent: 12, netAdjustmentPercent: 8, recencyScore: 85, distanceScore: 85, adjustmentScore: 85, condition: "C3" },
      { compId: "C3", address: "389 Bay St, Miami, FL", saleDate: "2023-07-10", monthsOld: 8, salePrice: 475000, distance: 1.2, grossAdjustmentPercent: 18, netAdjustmentPercent: 12, recencyScore: 70, distanceScore: 65, adjustmentScore: 65, condition: "C4" }
    ],
    recencyScoreAvg: 85,
    distanceScoreAvg: 83,
    adjustmentScoreAvg: 83,
    compConfidenceScore: 84,
    formula: "(85 × 0.40) + (83 × 0.30) + (83 × 0.30) = 84",
    checks: [
      { name: "Recency Score", source: "Comp Grid", status: "pass", value: 85, threshold: "0-100" },
      { name: "Distance Score", source: "Comp Grid", status: "pass", value: 83, threshold: "0-100" },
      { name: "Adjustment Score", source: "Net/Gross Adj", status: "pass", value: 83, threshold: "0-100" },
      { name: "Final Comp Confidence", source: "Calculated", status: "pass", value: 84, notes: "Acceptable w/ review" }
    ]
  },

  marketStability: {
    priceTrend: "stable",
    priceTrendScore: 70,
    supplyLevel: 4.5,
    supplyLevelScore: 70,
    daysOnMarket: 42,
    daysOnMarketScore: 70,
    saleConcessionPressure: "occasional",
    saleConcessionScore: 70,
    listingStagnationApplied: false,
    marketStabilityBase: 70,
    marketStabilityAdjusted: 70,
    formula: "(70 × 0.35) + (70 × 0.25) + (70 × 0.20) + (70 × 0.20) = 70",
    checks: [
      { name: "Price Trend", source: "1004MC", status: "pass", value: "Stable", notes: "Score: 70" },
      { name: "Supply Level", source: "1004MC", status: "pass", value: "4.5 months", notes: "Balanced market" },
      { name: "Days on Market", source: "Comp Grid", status: "pass", value: "42 days", notes: "Within acceptable range" },
      { name: "Sale Concessions", source: "Appraisal", status: "pass", value: "Occasional", notes: "Minimal pressure" },
      { name: "Listing Stagnation", source: "MLS", status: "pass", value: "Not Applied", notes: "No 180+ day history" }
    ]
  },

  rentalConfidence: {
    leaseStatus: "valid",
    leaseRent: 2800,
    appraisalMarketRent: 3000,
    baseRent: 2800,
    rentVariance: -6.7,
    rentVarianceStatus: "pass",
    rentCompsConsistent: true,
    appraiserSupportsRent: true,
    rentConfidenceScore: 100,
    finalRent: 2800,
    decisionRule: "Lease valid, variance within 10%, using lease rent",
    checks: [
      { name: "Valid Executed Lease", source: "POS", status: "pass", value: "40 pts", notes: "Lease validated" },
      { name: "Rent Variance ≤10%", source: "Calculated", status: "pass", value: "-6.7%", threshold: "≤10%" },
      { name: "Rent Comps Consistent", source: "Appraisal", status: "pass", value: "20 pts" },
      { name: "Appraiser Supports Rent", source: "Appraisal", status: "pass", value: "10 pts" }
    ]
  },

  avmReconciliation: {
    appraisalValue: 485000,
    avmValue: 478000,
    avmSource: "Clear Capital",
    zhviValue: 492000,
    avmVariance: -1.4,
    avmVarianceStatus: "pass",
    avmTrendSupportsARV: true,
    checks: [
      { name: "AVM Matches Appraisal ±5%", source: "Clear Capital", status: "pass", value: "-1.4%", threshold: "±5%" },
      { name: "ZHVI Matches Appraisal ±5%", source: "Zillow", status: "pass", value: "+1.4%", threshold: "±5%" },
      { name: "AVM Trend Supports Value", source: "AVM/ZHVI", status: "pass", notes: "Stable/rising trend" }
    ]
  },

  riskScoring: {
    redFlags: [
      { flagId: "RF-001", category: "comparable_sales", trigger: "One comp older than 6 months", severity: "low", engineSource: "Engine 3", impactsScore: false, routesToManualReview: false, details: "Comp C3 is 8 months old" }
    ],
    highSeverityCount: 0,
    mediumSeverityCount: 0,
    lowSeverityCount: 1,
    totalFlagCount: 1,
    riskProbability: 12,
    confidenceDegradation: 2,
    routingRecommendation: "normal"
  },

  output: {
    finalARV: 485000,
    finalAIV: 485000,
    confidenceMultiplier: 0.76,
    rentalConfidenceScore: 100,
    compConfidenceScore: 84,
    marketStabilityScore: 70,
    confidenceTier: "Acceptable w/ review",
    manualReviewRequired: false
  },

  logs: [
    { id: "log-1", timestamp: "2024-01-15T10:00:00Z", tag: "INIT", description: "Phase 5 initiated", action: "PHASE_START", user: "AI Underwriting System", status: "Success", jsonData: { productType: "DSCR", transactionType: "Refinance" } },
    { id: "log-2", timestamp: "2024-01-15T10:00:30Z", tag: "ENGINE_1", description: "Appraisal completeness validated", action: "APPRAISAL_CHECK", user: "AI Underwriting System", status: "Pass", jsonData: { checksCompleted: 7, checksPassed: 7 } },
    { id: "log-3", timestamp: "2024-01-15T10:01:00Z", tag: "ENGINE_2", description: "Subject property analysis complete", action: "PROPERTY_CHECK", user: "AI Underwriting System", status: "Pass", jsonData: { glaVariance: "3.2%" } },
    { id: "log-4", timestamp: "2024-01-15T10:01:30Z", tag: "ENGINE_3", description: "Comp confidence calculated", action: "COMP_ANALYSIS", user: "AI Underwriting System", status: "Pass", jsonData: { compConfidenceScore: 84 } },
    { id: "log-5", timestamp: "2024-01-15T10:02:00Z", tag: "ENGINE_4", description: "Market stability assessed", action: "MARKET_ANALYSIS", user: "AI Underwriting System", status: "Pass", jsonData: { marketStabilityScore: 70 } },
    { id: "log-6", timestamp: "2024-01-15T10:02:30Z", tag: "ENGINE_5", description: "Rental confidence validated", action: "RENTAL_CHECK", user: "AI Underwriting System", status: "Pass", jsonData: { rentConfidenceScore: 100 } },
    { id: "log-7", timestamp: "2024-01-15T10:03:00Z", tag: "ENGINE_7", description: "AVM reconciliation complete", action: "AVM_CHECK", user: "AI Underwriting System", status: "Pass", jsonData: { avmVariance: "-1.4%" } },
    { id: "log-8", timestamp: "2024-01-15T10:03:30Z", tag: "ENGINE_8", description: "Risk scoring complete", action: "RISK_SCORE", user: "AI Underwriting System", status: "Pass", jsonData: { totalFlags: 1, highSeverity: 0 } },
    { id: "log-9", timestamp: "2024-01-15T10:04:00Z", tag: "COMPLETE", description: "Phase 5 completed - Acceptable w/ review", action: "PHASE_END", user: "AI Underwriting System", status: "Pass", jsonData: { confidenceTier: "Acceptable w/ review", manualReviewRequired: false } }
  ],

  ranAt: "2024-01-15T10:04:00Z",
  ranBy: "AI Underwriting System",
  source: "Appraisal + POS + BCP + AVM APIs"
};

export const CollateralReviewTab = ({
  phaseStatus,
  lastUpdated
}: CollateralReviewTabProps) => {
  const data = mockCollateralReviewData;

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    appraisalCompleteness: true,
    subjectProperty: false,
    compConfidence: true,
    marketStability: false,
    rentalConfidence: false,
    constructionFeasibility: false,
    avmReconciliation: false,
    riskScoring: true,
    auditLog: false
  });

  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const toggleLog = (logId: string) => {
    setExpandedLogs(prev => ({ ...prev, [logId]: !prev[logId] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pass":
      case "passed":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Passed</Badge>;
      case "flag":
      case "review":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Review</Badge>;
      case "fail":
      case "failed":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCheckStatusBadge = (status: CheckStatus) => {
    switch (status) {
      case "pass":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>;
      case "flag":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Flag</Badge>;
      case "fail":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Fail</Badge>;
      case "review":
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" /> Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getConfidenceTierBadge = (tier: ConfidenceTier) => {
    switch (tier) {
      case "Strong Collateral":
        return <Badge variant="success" className="gap-1"><Shield className="h-3 w-3" /> Strong Collateral</Badge>;
      case "Acceptable w/ review":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Acceptable w/ Review</Badge>;
      case "Elevated Risk":
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Elevated Risk</Badge>;
      case "High Risk":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> High Risk</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreProgressColor = (score: number): string => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-amber-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EngineChecksTable = ({ checks }: { checks: EngineCheck[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Check</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Threshold</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checks.map((check, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{check.name}</TableCell>
            <TableCell className="text-muted-foreground">{check.source}</TableCell>
            <TableCell>{check.value ?? "-"}</TableCell>
            <TableCell className="text-muted-foreground">{check.threshold ?? "-"}</TableCell>
            <TableCell>{getCheckStatusBadge(check.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-4">
      {/* Phase Introduction */}
      <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent rounded-xl border-l-4 border-emerald-500">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-emerald-500/15 rounded-lg shrink-0">
            <Building className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">Collateral Review & Appraisal Feasibility</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This phase validates appraisal data, comparable sales, market conditions, and rental/construction feasibility using 8 scoring engines. It produces confidence scores, risk flags, and routing recommendations for underwriting decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Phase Header with Output Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium">Collateral Review</h2>
          {getStatusBadge(phaseStatus)}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Confidence & Score Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 border rounded-lg bg-muted/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Confidence Tier</p>
              {getConfidenceTierBadge(data.output.confidenceTier)}
            </div>
            <div className="p-4 border rounded-lg bg-muted/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Comp Confidence</p>
              <p className={`text-2xl font-bold ${getScoreColor(data.output.compConfidenceScore)}`}>
                {data.output.compConfidenceScore}
              </p>
              <Progress 
                value={data.output.compConfidenceScore} 
                className="h-1.5 mt-2" 
              />
            </div>
            <div className="p-4 border rounded-lg bg-muted/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Market Stability</p>
              <p className={`text-2xl font-bold ${getScoreColor(data.output.marketStabilityScore)}`}>
                {data.output.marketStabilityScore}
              </p>
              <Progress 
                value={data.output.marketStabilityScore} 
                className="h-1.5 mt-2" 
              />
            </div>
            {data.output.rentalConfidenceScore !== undefined && (
              <div className="p-4 border rounded-lg bg-muted/20 text-center">
                <p className="text-xs text-muted-foreground mb-1">Rental Confidence</p>
                <p className={`text-2xl font-bold ${getScoreColor(data.output.rentalConfidenceScore)}`}>
                  {data.output.rentalConfidenceScore}
                </p>
                <Progress 
                  value={data.output.rentalConfidenceScore} 
                  className="h-1.5 mt-2" 
                />
              </div>
            )}
            <div className="p-4 border rounded-lg bg-muted/20 text-center">
              <p className="text-xs text-muted-foreground mb-1">Final ARV</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(data.output.finalARV)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engine 1: Appraisal Completeness */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('appraisalCompleteness')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Engine 1: Appraisal Completeness
              {getStatusBadge("pass")}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.appraisalCompleteness ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.appraisalCompleteness && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Appraiser License</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Valid ({data.appraisalCompleteness.appraiserLicenseState})</span>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Signature</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium capitalize">{data.appraisalCompleteness.signatureType}</span>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Effective Date</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{data.appraisalCompleteness.effectiveDateDays} days old</span>
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Photos</p>
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Int + Ext</span>
                </div>
              </div>
            </div>
            <EngineChecksTable checks={data.appraisalCompleteness.checks} />
          </CardContent>
        )}
      </Card>

      {/* Engine 2: Subject Property Analysis */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('subjectProperty')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Engine 2: Subject Property Analysis
              {getStatusBadge("pass")}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.subjectProperty ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.subjectProperty && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">POS Address</p>
                <p className="text-sm font-medium">{data.subjectProperty.addressPOS}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Appraisal Address</p>
                <p className="text-sm font-medium">{data.subjectProperty.addressAppraisal}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">GLA Variance</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{data.subjectProperty.glaVariance}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">POS: {data.subjectProperty.glaPOS} | Appr: {data.subjectProperty.glaAppraisal}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Condition/Quality</p>
                <span className="text-sm font-medium">{data.subjectProperty.conditionRating}/{data.subjectProperty.qualityRating}</span>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Room Count</p>
                <span className="text-sm font-medium">{data.subjectProperty.roomCount}</span>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Unit Count</p>
                <span className="text-sm font-medium">{data.subjectProperty.unitCount}</span>
              </div>
            </div>
            <EngineChecksTable checks={data.subjectProperty.checks} />
          </CardContent>
        )}
      </Card>

      {/* Engine 3: Comp Confidence */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('compConfidence')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Engine 3: Comparable Sales / Comp Confidence
              <Badge variant="outline" className={getScoreColor(data.compConfidence.compConfidenceScore)}>
                Score: {data.compConfidence.compConfidenceScore}
              </Badge>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.compConfidence ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.compConfidence && (
          <CardContent className="space-y-4">
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Recency Score (40%)</p>
                <p className={`text-xl font-bold ${getScoreColor(data.compConfidence.recencyScoreAvg)}`}>
                  {data.compConfidence.recencyScoreAvg}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Distance Score (30%)</p>
                <p className={`text-xl font-bold ${getScoreColor(data.compConfidence.distanceScoreAvg)}`}>
                  {data.compConfidence.distanceScoreAvg}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Adjustment Score (30%)</p>
                <p className={`text-xl font-bold ${getScoreColor(data.compConfidence.adjustmentScoreAvg)}`}>
                  {data.compConfidence.adjustmentScoreAvg}
                </p>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Formula</p>
              <code className="text-sm">{data.compConfidence.formula}</code>
            </div>

            {/* Comparables Table */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Comparable Sales</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comp</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Gross Adj %</TableHead>
                    <TableHead>Scores (R/D/A)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.compConfidence.comparables.map((comp) => (
                    <TableRow key={comp.compId}>
                      <TableCell className="font-medium">{comp.compId}</TableCell>
                      <TableCell>{comp.address}</TableCell>
                      <TableCell>{formatCurrency(comp.salePrice)}</TableCell>
                      <TableCell>{comp.monthsOld} mo</TableCell>
                      <TableCell>{comp.distance} mi</TableCell>
                      <TableCell>{comp.grossAdjustmentPercent}%</TableCell>
                      <TableCell>
                        <span className={getScoreColor(comp.recencyScore)}>{comp.recencyScore}</span> / 
                        <span className={getScoreColor(comp.distanceScore)}>{comp.distanceScore}</span> / 
                        <span className={getScoreColor(comp.adjustmentScore)}>{comp.adjustmentScore}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Engine 4: Market Stability */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('marketStability')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Engine 4: Market Stability
              <Badge variant="outline" className={getScoreColor(data.marketStability.marketStabilityAdjusted)}>
                Score: {data.marketStability.marketStabilityAdjusted}
              </Badge>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.marketStability ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.marketStability && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Price Trend (35%)</p>
                <p className="text-sm font-medium capitalize">{data.marketStability.priceTrend.replace('_', ' ')}</p>
                <p className={`text-lg font-bold ${getScoreColor(data.marketStability.priceTrendScore)}`}>
                  {data.marketStability.priceTrendScore}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Supply Level (25%)</p>
                <p className="text-sm font-medium">{data.marketStability.supplyLevel} months</p>
                <p className={`text-lg font-bold ${getScoreColor(data.marketStability.supplyLevelScore)}`}>
                  {data.marketStability.supplyLevelScore}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Days on Market (20%)</p>
                <p className="text-sm font-medium">{data.marketStability.daysOnMarket} days</p>
                <p className={`text-lg font-bold ${getScoreColor(data.marketStability.daysOnMarketScore)}`}>
                  {data.marketStability.daysOnMarketScore}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Concessions (20%)</p>
                <p className="text-sm font-medium capitalize">{data.marketStability.saleConcessionPressure}</p>
                <p className={`text-lg font-bold ${getScoreColor(data.marketStability.saleConcessionScore)}`}>
                  {data.marketStability.saleConcessionScore}
                </p>
              </div>
            </div>

            {data.marketStability.listingStagnationApplied && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm">Listing Stagnation Modifier Applied: -20 points (MS-LIST-180)</span>
              </div>
            )}

            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Formula</p>
              <code className="text-sm">{data.marketStability.formula}</code>
            </div>

            <EngineChecksTable checks={data.marketStability.checks} />
          </CardContent>
        )}
      </Card>

      {/* Engine 5: Rental / DSCR Confidence (conditional) */}
      {data.rentalConfidence && (
        <Card>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('rentalConfidence')}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Engine 5: Rental / DSCR Confidence
                <Badge variant="outline" className={getScoreColor(data.rentalConfidence.rentConfidenceScore)}>
                  Score: {data.rentalConfidence.rentConfidenceScore}
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.rentalConfidence ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.rentalConfidence && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Lease Status</p>
                  <Badge variant={data.rentalConfidence.leaseStatus === 'valid' ? 'success' : 'secondary'} className="capitalize">
                    {data.rentalConfidence.leaseStatus}
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Lease Rent</p>
                  <p className="text-lg font-bold">{data.rentalConfidence.leaseRent ? formatCurrency(data.rentalConfidence.leaseRent) : 'N/A'}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Appraisal Market Rent</p>
                  <p className="text-lg font-bold">{formatCurrency(data.rentalConfidence.appraisalMarketRent)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Rent Variance</p>
                  <p className={`text-lg font-bold ${Math.abs(data.rentalConfidence.rentVariance) <= 10 ? 'text-green-600' : 'text-amber-600'}`}>
                    {data.rentalConfidence.rentVariance}%
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Final Rent Selection</span>
                </div>
                <p className="text-xl font-bold text-primary">{formatCurrency(data.rentalConfidence.finalRent)}/mo</p>
                <p className="text-sm text-muted-foreground mt-1">{data.rentalConfidence.decisionRule}</p>
              </div>

              <EngineChecksTable checks={data.rentalConfidence.checks} />
            </CardContent>
          )}
        </Card>
      )}

      {/* Engine 6: Construction Feasibility (conditional - FNF/GUC only) */}
      {data.constructionFeasibility && (
        <Card>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('constructionFeasibility')}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hammer className="h-4 w-4" />
                Engine 6: Construction Feasibility
                <Badge variant="outline" className={getScoreColor(data.constructionFeasibility.feasibilityScore)}>
                  Score: {data.constructionFeasibility.feasibilityScore}
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.constructionFeasibility ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.constructionFeasibility && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">AIV</p>
                  <p className="text-lg font-bold">{formatCurrency(data.constructionFeasibility.aiv)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">ARV</p>
                  <p className="text-lg font-bold">{formatCurrency(data.constructionFeasibility.arv)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Rehab Budget</p>
                  <p className="text-lg font-bold">{formatCurrency(data.constructionFeasibility.rehabBudget)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">ARV Support Ratio</p>
                  <p className={`text-lg font-bold ${data.constructionFeasibility.arvSupportRatio <= 85 ? 'text-green-600' : data.constructionFeasibility.arvSupportRatio <= 92 ? 'text-amber-600' : 'text-red-600'}`}>
                    {data.constructionFeasibility.arvSupportRatio}%
                  </p>
                </div>
              </div>
              <EngineChecksTable checks={data.constructionFeasibility.checks} />
            </CardContent>
          )}
        </Card>
      )}

      {/* Engine 7: AVM Reconciliation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('avmReconciliation')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Engine 7: AVM / Multi-Valuation Reconciliation
              {getCheckStatusBadge(data.avmReconciliation.avmVarianceStatus)}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.avmReconciliation ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.avmReconciliation && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Appraisal Value</p>
                <p className="text-lg font-bold">{formatCurrency(data.avmReconciliation.appraisalValue)}</p>
              </div>
              {data.avmReconciliation.avmValue && (
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">AVM ({data.avmReconciliation.avmSource})</p>
                  <p className="text-lg font-bold">{formatCurrency(data.avmReconciliation.avmValue)}</p>
                </div>
              )}
              {data.avmReconciliation.zhviValue && (
                <div className="p-4 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">ZHVI (Zillow)</p>
                  <p className="text-lg font-bold">{formatCurrency(data.avmReconciliation.zhviValue)}</p>
                </div>
              )}
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">AVM Variance</p>
                <p className={`text-lg font-bold ${Math.abs(data.avmReconciliation.avmVariance || 0) <= 5 ? 'text-green-600' : 'text-amber-600'}`}>
                  {data.avmReconciliation.avmVariance}%
                </p>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">AVM is used for reconciliation only; never as primary value</span>
            </div>

            <EngineChecksTable checks={data.avmReconciliation.checks} />
          </CardContent>
        )}
      </Card>

      {/* Engine 8: Risk Flags */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('riskScoring')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Engine 8: Red Flag / Risk Scoring
              <Badge variant="outline">
                {data.riskScoring.totalFlagCount} Flag{data.riskScoring.totalFlagCount !== 1 ? 's' : ''}
              </Badge>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.riskScoring ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.riskScoring && (
          <CardContent className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">High Severity</p>
                <p className={`text-2xl font-bold ${data.riskScoring.highSeverityCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {data.riskScoring.highSeverityCount}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Medium Severity</p>
                <p className={`text-2xl font-bold ${data.riskScoring.mediumSeverityCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {data.riskScoring.mediumSeverityCount}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Low Severity</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {data.riskScoring.lowSeverityCount}
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Risk Probability</p>
                <p className={`text-2xl font-bold ${data.riskScoring.riskProbability <= 20 ? 'text-green-600' : data.riskScoring.riskProbability <= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {data.riskScoring.riskProbability}%
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Routing</p>
                <Badge variant="secondary" className="capitalize">
                  {data.riskScoring.routingRecommendation.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Red Flags Table */}
            {data.riskScoring.redFlags.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flag ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Engine</TableHead>
                    <TableHead>Manual Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.riskScoring.redFlags.map((flag) => (
                    <TableRow key={flag.flagId}>
                      <TableCell className="font-medium">{flag.flagId}</TableCell>
                      <TableCell className="capitalize">{flag.category.replace(/_/g, ' ')}</TableCell>
                      <TableCell>{flag.trigger}</TableCell>
                      <TableCell>{getSeverityBadge(flag.severity)}</TableCell>
                      <TableCell>{flag.engineSource}</TableCell>
                      <TableCell>
                        {flag.routesToManualReview ? (
                          <Badge variant="destructive">Yes</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center bg-green-500/5 border border-green-500/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-700">No high or medium severity flags detected</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('auditLog')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Phase Logs
              <Badge variant="secondary">{data.logs.length}</Badge>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.auditLog ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.auditLog && (
          <CardContent>
            <div className="space-y-2">
              {data.logs.map((log) => (
                <div key={log.id} className="border rounded-lg">
                  <div
                    className="p-3 flex items-center justify-between cursor-pointer hover:bg-muted/30"
                    onClick={() => toggleLog(log.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{log.tag}</Badge>
                      <span className="text-sm">{log.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                      <Badge variant={log.status.toLowerCase() === 'pass' || log.status.toLowerCase() === 'success' ? 'success' : 'secondary'}>
                        {log.status}
                      </Badge>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedLogs[log.id] ? '' : '-rotate-90'}`} />
                    </div>
                  </div>
                  {expandedLogs[log.id] && log.jsonData && (
                    <div className="px-3 pb-3">
                      <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.jsonData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CollateralReviewTab;
