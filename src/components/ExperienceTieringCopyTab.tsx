import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, Clock, TrendingUp, Building, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";
interface ExperienceTieringCopyTabProps {
  phase: any;
}
export const ExperienceTieringCopyTab = ({
  phase
}: ExperienceTieringCopyTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    overview: false,
    external: false,
    internal: false,
    contractor: false,
    confidence: false,
    enforcement: false,
    exceptions: false,
    phaseLog: false
  });
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [externalDataValidation, setExternalDataValidation] = useState({
    isValidated: false,
    validatedBy: "",
    validatedAt: ""
  });
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mock data for demonstration
  const tieringOverview = {
    tier: "Gold",
    confidenceScore: 0.87,
    exposureLimit: 5000000,
    maxLTC: 85,
    maxARV: 70,
    exceptionFlag: false,
    exceptionReason: "Tier Override"
  };
  const forecasaMetrics = {
    verifiedExits: 8,
    totalVolume: 2450000,
    avgSalePrice: 306250,
    managementExperience: {
      properties: 12,
      duration: "3.5 years"
    }
  };
  const trackRecordDoc = {
    fileName: "borrower_experience_2025Q1.pdf",
    uploadDate: "2025-10-28",
    fileSize: "2.4 MB"
  };
  const tierSummary = {
    tier: "Gold",
    confidenceScore: 0.87,
    riskGrade: "B+",
    exposureLimit: 5000000,
    maxLTC: 85,
    maxARV: 75
  };
  const borrowerInput = {
    entityName: "Summit Capital Holdings LLC",
    entityType: "Borrower",
    loanType: "Fix & Flip",
    guarantors: "John Doe, Jane Smith",
    inputIdentifier: "john.doe@summitcapital.com"
  };
  const experienceCriteria = {
    paidOffLoans: 12,
    totalVolume: 3450000,
    verifiedVolumeSource: "WhoDat / Forecasa",
    trackRecordVerified: true
  };
  const creditLiquidity = {
    fico: 710,
    liquidityRatio: 1.35,
    liquidityRatioMinRequired: 1.25,
    liquidityVerified: "verified"
  };
  const performanceBehavior = {
    defaults: 0,
    extensions: 2,
    performanceStatus: "meets"
  };
  const exposureCapLogic = {
    exposureLimit: 5000000,
    ltcCap: 85,
    arvCap: 70
  };
  const weightedMetrics = [{
    metric: "Verified Exits",
    source: "Forecasa + WhoDat",
    value: "8",
    target: "≥5",
    weight: "60%",
    contribution: "+0.52"
  }, {
    metric: "Liquidity Ratio",
    source: "LiquiDat",
    value: "1.35x",
    target: "≥1.25x",
    weight: "10%",
    contribution: "+0.09"
  }, {
    metric: "FICO",
    source: "WhoDat",
    value: "710",
    target: "≥680",
    weight: "10%",
    contribution: "+0.06"
  }, {
    metric: "Guarantor Exposure",
    source: "WhoDat",
    value: "$2.1MM",
    target: "≤$5MM",
    weight: "20%",
    contribution: "+0.20"
  }];
  const contractorData = {
    gcName: "BuildPro Construction LLC",
    projectType: "Heavy Rehab",
    completionRatio: 92,
    validationStatus: "verified"
  };
  const tierLogic = {
    version: "v2.3",
    timestamp: "2025-10-31 14:21",
    confidenceScore: 0.87
  };
  const confidenceBreakdown = [{
    metric: "Verified Exits",
    weight: "0.60",
    contribution: "+0.52"
  }, {
    metric: "Liquidity Ratio",
    weight: "0.10",
    contribution: "+0.09"
  }, {
    metric: "Guarantor Exposure",
    weight: "0.20",
    contribution: "+0.20"
  }, {
    metric: "Performance",
    weight: "0.10",
    contribution: "+0.06"
  }];
  const productEnforcement = [{
    product: "Fix & Flip (Borrower-Funded)",
    allowedTiers: "Gold+",
    logic: "Tier < Gold → Block",
    status: "pass"
  }, {
    product: "Ground-Up Construction",
    allowedTiers: "Gold+",
    logic: "Tier < Gold → Exception",
    status: "warn"
  }, {
    product: "DSCR",
    allowedTiers: "All",
    logic: "LiquiDat < 1.0 → Conditional Approval",
    status: "pass"
  }];
  const exceptions = [{
    exception: "TrackRecord_Mismatch",
    tags: ["forecasa_validation", "document_check"],
    link: "/logs/track-record-001"
  }, {
    exception: "LiquiDat_BelowThreshold",
    tags: ["liquidity_check", "threshold_validation"],
    link: "/logs/liquiDat-002"
  }, {
    exception: "Contractor_NotVerified",
    tags: ["contractor_validation", "buildcheck"],
    link: "/logs/contractor-003"
  }];
  const phaseLogData = [{
    id: "log-001",
    tag: "cogs",
    timestamp: "31/10/2025, 16:17:09",
    description: "COGS Issued Date vs. Actual Closing Date Rule",
    exceptionTag: "retool_date_comparator",
    exceptionType: null,
    status: "completed",
    jsonData: {
      is_valid: true,
      loan_type: "Bridge Loan",
      days_to_compare: 180,
      cogs_issued_date: "2025-08-13",
      actual_closing_date: "2025-10-31"
    }
  }, {
    id: "log-002",
    tag: "forecasa",
    timestamp: "31/10/2025, 16:15:22",
    description: "External Data Validation Check",
    exceptionTag: "data_verification",
    exceptionType: "TrackRecord_Mismatch",
    status: "completed",
    jsonData: {
      verified_exits: 8,
      total_volume: 2450000,
      confidence: 0.87,
      source: "Forecasa API"
    }
  }, {
    id: "log-003",
    tag: "liquiDat",
    timestamp: "31/10/2025, 16:14:05",
    description: "Liquidity Ratio Calculation",
    exceptionTag: "liquidity_check",
    exceptionType: "LiquiDat_BelowThreshold",
    status: "warning",
    jsonData: {
      liquidity_ratio: 1.35,
      min_required: 1.25,
      meets_threshold: true
    }
  }, {
    id: "log-004",
    tag: "contractor",
    timestamp: "31/10/2025, 16:12:33",
    description: "Contractor Validation Process",
    exceptionTag: "contractor_validation",
    exceptionType: "Contractor_NotVerified",
    status: "warning",
    jsonData: {
      gc_name: "BuildPro Construction LLC",
      validation_source: "BuildCheckPro",
      verified: false,
      reason: "Pending verification"
    }
  }];
  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      'Platinum': 'bg-gradient-to-r from-slate-400 to-slate-600 text-white',
      'Gold': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'Silver': 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      'Bronze': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    };
    return colors[tier] || '';
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
      case "sent":
      case "verified":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>;
      case "warn":
      case "pending":
      case "review":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Pending</Badge>;
      case "fail":
      case "escalated":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <Badge variant="destructive">{severity}</Badge>;
      case "medium":
        return <Badge variant="warning">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Helper to get overall status for sections
  const getTieringEvaluationStatus = () => {
    return tieringOverview.exceptionFlag ? 'warn' : 'pass';
  };
  const getTieringRulesStatus = () => {
    const filteredItems = productEnforcement.filter(item => item.product.includes(borrowerInput.loanType));
    const hasWarnings = filteredItems.some(item => item.status === 'warn');
    const hasFails = filteredItems.some(item => item.status === 'fail');
    if (hasFails) return 'fail';
    if (hasWarnings) return 'warn';
    return 'pass';
  };
  const getContractorValidationStatus = () => {
    return contractorData.validationStatus;
  };
  const getExceptionsStatus = () => {
    return exceptions.length > 0 ? 'warn' : 'pass';
  };
  const toggleLog = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };
  const handleValidateExternalData = () => {
    setExternalDataValidation({
      isValidated: true,
      validatedBy: "Operations Team",
      validatedAt: new Date().toLocaleString()
    });
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Experience Tiering Check (Redesigned)</span>
          <StatusBadge status={phase.status} />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>


      {/* Section 2: Tiering & Product Type Rules */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('enforcement')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tiering & Product Type Rules
              {getStatusBadge(getTieringRulesStatus())}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.enforcement ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.enforcement && <CardContent>
                <div className="mb-3 p-2 bg-muted/30 rounded text-sm">
                  <span className="text-muted-foreground">Filtered by Product Type: </span>
                  <span className="font-medium">{borrowerInput.loanType}</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Type</TableHead>
                      <TableHead>Allowed Tiers</TableHead>
                      <TableHead>Enforcement Logic</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productEnforcement.filter(item => item.product.includes(borrowerInput.loanType)).map((item, idx) => <TableRow key={idx}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell><Badge variant="outline">{item.allowedTiers}</Badge></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.logic}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                        </TableRow>)}
                  </TableBody>
                </Table>
          </CardContent>}
      </Card>

      {/* Section 3: Contractor Validation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('contractor')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Contractor Validation
              {getStatusBadge(getContractorValidationStatus())}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.contractor ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.contractor && <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">GC Name</p>
                <p className="font-medium">{contractorData.gcName}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Validation Status</p>
                {getStatusBadge(contractorData.validationStatus)}
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* Section 5: External Data */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('external')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              External Data (Forecasa & Track Record)
              {externalDataValidation.isValidated ? getStatusBadge('verified') : <Badge variant="warning" className="gap-1">
                  <AlertTriangle className="h-3 w-3" /> Review
                </Badge>}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.external ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.external && <CardContent className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Forecasa Metrics</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">Verified Exits (36mo)</p>
                        <p className="text-2xl font-bold">{forecasaMetrics.verifiedExits}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">Total Volume</p>
                        <p className="text-2xl font-bold">{formatCurrency(forecasaMetrics.totalVolume)}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">Avg Sale Price</p>
                        <p className="text-lg font-semibold">{formatCurrency(forecasaMetrics.avgSalePrice)}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded space-y-1">
                        <p className="text-xs text-muted-foreground">Management Experience</p>
                        <p className="text-sm font-medium">{forecasaMetrics.managementExperience.properties} properties • {forecasaMetrics.managementExperience.duration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Track Record Document</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">File Name</span>
                        <span className="text-sm font-medium">{trackRecordDoc.fileName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Upload Date</span>
                        <span className="text-sm font-medium">{trackRecordDoc.uploadDate}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      <Download className="h-4 w-4" />
                      Download Document
                    </Button>
                    <p className="text-xs text-muted-foreground italic">
                      Note: No automatic comparison — data shown for manual Ops review only.
                    </p>
                  </div>
                </div>

                {/* Manual Validation */}
                <div className="p-4 border-2 rounded-lg bg-muted/20 space-y-3">
                  <p className="text-sm font-medium">Manual Validation</p>
                  {externalDataValidation.isValidated ? <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm text-success font-medium">Data Validated</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Validated by: <span className="font-medium">{externalDataValidation.validatedBy}</span></p>
                        <p>Validated at: <span className="font-medium">{externalDataValidation.validatedAt}</span></p>
                      </div>
                    </div> : <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        This data requires manual validation by operations team.
                      </p>
                      <Button onClick={handleValidateExternalData} size="sm" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Mark as Validated
                      </Button>
                    </div>}
                </div>
          </CardContent>}
      </Card>

      {/* Section 2: Internal Data */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('internal')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Internal Data (WhoDat / LiquiDat / AI Engine)
              {getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.internal ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.internal && <CardContent className="space-y-6">
                {/* Tier Summary - Highlighted */}
                <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5 space-y-3">
                  <p className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tier Summary
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-background rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Tier</p>
                      <Badge className={getTierColor(tierSummary.tier)}>{tierSummary.tier}</Badge>
                    </div>
                    <div className="p-3 bg-background rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Confidence Score</p>
                      <p className="text-xl font-bold">{tierSummary.confidenceScore}</p>
                    </div>
                    <div className="p-3 bg-background rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Exception Flag</p>
                      <Badge variant={tieringOverview.exceptionFlag ? 'warning' : 'success'}>
                        {tieringOverview.exceptionFlag ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="p-3 bg-background rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Exposure Limit</p>
                      <p className="text-lg font-semibold">{formatCurrency(tierSummary.exposureLimit)}</p>
                    </div>
                    <div className="p-3 bg-background rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Recommended LTC</p>
                      <p className="text-lg font-semibold">{tierSummary.maxLTC}%</p>
                    </div>
                    <div className="p-3 bg-background rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Recommended ARV</p>
                      <p className="text-lg font-semibold">{tierSummary.maxARV}%</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Borrower Input Summary */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Borrower Input Summary</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Entity Name</p>
                      <p className="font-medium">{borrowerInput.entityName}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Entity Type</p>
                      <p className="font-medium">{borrowerInput.entityType}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Loan Type</p>
                      <p className="font-medium">{borrowerInput.loanType}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Guarantors</p>
                      <p className="font-medium">{borrowerInput.guarantors}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground">Input Identifier</p>
                      <p className="font-medium">{borrowerInput.inputIdentifier}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Experience Criteria */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Experience Criteria</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Paid-off Loans</p>
                      <p className="text-xl font-bold">{experienceCriteria.paidOffLoans}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Total Volume</p>
                      <p className="text-xl font-bold">{formatCurrency(experienceCriteria.totalVolume)}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Credit & Liquidity */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Credit & Liquidity</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">FICO (Guarantor)</p>
                      <p className="text-xl font-bold">{creditLiquidity.fico}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Liquidity Ratio</p>
                      <p className="text-xl font-bold">{creditLiquidity.liquidityRatio}x</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Liquidity Ratio Minimum Required</p>
                      <p className="font-medium">{creditLiquidity.liquidityRatioMinRequired}x</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Performance Behavior */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Performance Behavior</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Defaults (lifetime)</p>
                      <p className="text-xl font-bold">{performanceBehavior.defaults}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Extensions (last 12 months)</p>
                      <p className="text-xl font-bold">{performanceBehavior.extensions}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Exposure Cap Logic */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Exposure Cap Logic</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Exposure Limit</p>
                      <p className="text-lg font-semibold">{formatCurrency(exposureCapLogic.exposureLimit)}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">% LTC (Loan-to-Cost Cap)</p>
                      <p className="text-xl font-bold">{exposureCapLogic.ltcCap}%</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">% ARV (After-Repair-Value Cap)</p>
                      <p className="text-xl font-bold">{exposureCapLogic.arvCap}%</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tier Matrix Reference Table */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Tier Matrix Reference Table (read-only)</p>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">Tier</TableHead>
                          <TableHead className="font-semibold">Experience Criteria</TableHead>
                          <TableHead className="font-semibold">Volume / Track Record</TableHead>
                          <TableHead className="font-semibold">Credit / Liquidity</TableHead>
                          <TableHead className="font-semibold">Performance Behavior</TableHead>
                          <TableHead className="font-semibold">Exposure Cap Logic</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Badge className={getTierColor('Platinum')}>Platinum</Badge>
                          </TableCell>
                          <TableCell className="text-sm">≥10 exits or ≥$5MM volume</TableCell>
                          <TableCell className="text-sm">≥$5MM verified</TableCell>
                          <TableCell className="text-sm">Min 700 FICO, ≥1.50x LiquiDat</TableCell>
                          <TableCell className="text-sm">No defaults, ≤1 extension</TableCell>
                          <TableCell className="text-sm">Up to $10MM; 90% LTC / 75% ARV</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Badge className={getTierColor('Gold')}>Gold</Badge>
                          </TableCell>
                          <TableCell className="text-sm">5–9 exits or $2MM–$4.9MM</TableCell>
                          <TableCell className="text-sm">≥$2MM verified</TableCell>
                          <TableCell className="text-sm">Min 680 FICO, ≥1.25x LiquiDat</TableCell>
                          <TableCell className="text-sm">≤1 extension, no defaults</TableCell>
                          <TableCell className="text-sm">Up to $5MM; 85% LTC / 70% ARV</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Badge className={getTierColor('Silver')}>Silver</Badge>
                          </TableCell>
                          <TableCell className="text-sm">2–4 exits or $500K–$1.9MM</TableCell>
                          <TableCell className="text-sm">≥$500K verified</TableCell>
                          <TableCell className="text-sm">Min 660 FICO, ≥1.10x LiquiDat</TableCell>
                          <TableCell className="text-sm">≤1 extension, no defaults</TableCell>
                          <TableCell className="text-sm">Up to $2MM; 80% LTC / 65% ARV</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Badge className={getTierColor('Bronze')}>Bronze</Badge>
                          </TableCell>
                          <TableCell className="text-sm">0–1 exit</TableCell>
                          <TableCell className="text-sm">Limited data</TableCell>
                          <TableCell className="text-sm">Min 640 FICO, ≥1.00x LiquiDat</TableCell>
                          <TableCell className="text-sm">No defaults</TableCell>
                          <TableCell className="text-sm">Up to $1MM; 75% LTC / 60% ARV</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
          </CardContent>}
      </Card>

      {/* Section 6: Confidence Formula */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('confidence')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="h-4 w-4 mr-2" />
              Confidence Formula
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.confidence ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.confidence && <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium">TierLogic Engine</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Engine Version</p>
                      <p className="font-medium">{tierLogic.version}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Last Calculation</p>
                      <p className="font-medium">{tierLogic.timestamp}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Confidence Score</p>
                      <p className="text-xl font-bold">{tierLogic.confidenceScore}</p>
                    </div>
                    <Progress value={tierLogic.confidenceScore * 100} className="h-3" />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Confidence Breakdown</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead className="text-right">Contribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {confidenceBreakdown.map((item, idx) => <TableRow key={idx}>
                          <TableCell className="font-medium">{item.metric}</TableCell>
                          <TableCell><Badge variant="outline">{item.weight}</Badge></TableCell>
                          <TableCell className="text-right text-success font-semibold">{item.contribution}</TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground mt-4">
                    Formula: Σ(weight × normalized metric), threshold = 0.75
                  </p>
                </div>
          </CardContent>}
      </Card>

      {/* Phase Log */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('phaseLog')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Experience Tiering Phase Log
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.phaseLog ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.phaseLog && <CardContent>
            <div className="space-y-3">
              {phaseLogData.map(log => <div key={log.id} className="border rounded-lg">
                  <div className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleLog(log.id)}>
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{log.tag}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{log.timestamp}</p>
                          <p className="text-sm mt-1">{log.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-wrap justify-end">
                          <Badge variant="outline" className="text-xs">
                            {log.exceptionTag}
                          </Badge>
                          {log.exceptionType && <Badge variant="destructive" className="text-xs font-semibold px-2.5 py-1">
                              {log.exceptionType}
                            </Badge>}
                          <Badge variant={log.status === 'completed' ? 'default' : log.status === 'warning' ? 'warning' : 'outline'} className="text-xs">
                            {log.status}
                          </Badge>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedLogs[log.id] ? '' : '-rotate-90'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedLogs[log.id] && <div className="px-3 pb-3 border-t bg-muted/20">
                      <pre className="text-xs overflow-x-auto p-3 bg-background rounded mt-2">
                        {JSON.stringify(log.jsonData, null, 2)}
                      </pre>
                    </div>}
                </div>)}
            </div>
          </CardContent>}
      </Card>
    </div>;
};