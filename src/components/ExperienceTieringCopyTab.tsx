import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, Clock, TrendingUp, Building, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";

interface ExperienceTieringCopyTabProps {
  phase: any;
}

export const ExperienceTieringCopyTab = ({ phase }: ExperienceTieringCopyTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    overview: false,
    external: false,
    internal: false,
    contractor: false,
    confidence: false,
    enforcement: false,
    exceptions: false,
    phaseLog: false,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
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
    managementExperience: { properties: 12, duration: "3.5 years" }
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

  const weightedMetrics = [
    { metric: "Verified Exits", source: "Forecasa + WhoDat", value: "8", target: "≥5", weight: "60%", contribution: "+0.52" },
    { metric: "Liquidity Ratio", source: "LiquiDat", value: "1.35x", target: "≥1.25x", weight: "10%", contribution: "+0.09" },
    { metric: "FICO", source: "WhoDat", value: "710", target: "≥680", weight: "10%", contribution: "+0.06" },
    { metric: "Guarantor Exposure", source: "WhoDat", value: "$2.1MM", target: "≤$5MM", weight: "20%", contribution: "+0.20" }
  ];

  const contractorData = {
    gcName: "BuildPro Construction LLC",
    projectType: "Heavy Rehab",
    completionRatio: 92,
    validationStatus: "verified"
  };

  const tierLogic = {
    version: "v2.3",
    timestamp: "2025-10-31 14:21",
    confidenceScore: 87
  };

  const confidenceBreakdown = [
    { metric: "Verified Exits", weight: "60%", contribution: "+0.52" },
    { metric: "Liquidity Ratio", weight: "10%", contribution: "+0.09" },
    { metric: "Guarantor Exposure", weight: "20%", contribution: "+0.20" },
    { metric: "Performance", weight: "10%", contribution: "+0.06" }
  ];

  const productEnforcement = [
    { product: "Fix & Flip (Borrower-Funded)", allowedTiers: "Gold+", logic: "Tier < Gold → Block", status: "pass" },
    { product: "Ground-Up Construction", allowedTiers: "Gold+", logic: "Tier < Gold → Exception", status: "warn" },
    { product: "DSCR", allowedTiers: "All", logic: "LiquiDat < 1.0 → Conditional Approval", status: "pass" }
  ];

  const exceptions = [
    { exception: "TrackRecord_Mismatch", source: "Forecasa vs Document", severity: "high", owner: "UW Manager", sla: "48h", status: "pending" },
    { exception: "LiquiDat_BelowThreshold", source: "LiquiDat API", severity: "medium", owner: "Credit", sla: "24h", status: "review" },
    { exception: "Contractor_NotVerified", source: "BuildCheckPro", severity: "medium", owner: "Ops", sla: "48h", status: "pending" },
    { exception: "AI_Output_Failed", source: "TierLogic Engine", severity: "critical", owner: "Tech", sla: "4h", status: "escalated" }
  ];

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Experience Tiering Check (Redesigned)</span>
          <StatusBadge status={phase.status} />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Tiering Evaluation Overview */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('overview')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tiering Evaluation Overview
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.overview ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.overview && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Tier</p>
                <Badge className={getTierColor(tieringOverview.tier)}>{tieringOverview.tier}</Badge>
              </div>
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Tier Confidence Score</p>
                <p className="text-xl font-bold">{tieringOverview.confidenceScore}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Exposure Limit</p>
                <p className="text-lg font-semibold">{formatCurrency(tieringOverview.exposureLimit)}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Recommended Max LTC</p>
                <p className="text-lg font-semibold">{tieringOverview.maxLTC}%</p>
              </div>
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Recommended Max ARV</p>
                <p className="text-lg font-semibold">{tieringOverview.maxARV}%</p>
              </div>
              <div className="p-3 bg-muted/30 rounded space-y-1">
                <p className="text-xs text-muted-foreground">Exception Flag</p>
                <Badge variant={tieringOverview.exceptionFlag ? 'warning' : 'success'}>
                  {tieringOverview.exceptionFlag ? 'Yes' : 'No'}
                </Badge>
              </div>
              {tieringOverview.exceptionFlag && (
                <div className="p-3 bg-muted/30 rounded space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground">Exception Reason</p>
                  <p className="text-sm font-medium">{tieringOverview.exceptionReason}</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 1: External Data */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('external')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              External Data (Forecasa & Track Record)
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.external ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.external && (
              <CardContent className="space-y-4">
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
          </CardContent>
        )}
      </Card>

      {/* Section 2: Internal Data */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('internal')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Internal Data (WhoDat / LiquiDat / AI Engine)
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.internal ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.internal && (
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Tier Summary</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Tier</p>
                      <Badge variant="default" className="text-lg px-3 py-1">{tierSummary.tier}</Badge>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Confidence Score</p>
                      <p className="text-xl font-bold">{tierSummary.confidenceScore}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Risk Grade</p>
                      <p className="text-xl font-bold">{tierSummary.riskGrade}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Exposure Limit</p>
                      <p className="text-lg font-semibold">{formatCurrency(tierSummary.exposureLimit)}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Max LTC</p>
                      <p className="text-lg font-semibold">{tierSummary.maxLTC}%</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Max ARV</p>
                      <p className="text-lg font-semibold">{tierSummary.maxARV}%</p>
                    </div>
                  </div>
                </div>
          </CardContent>
        )}
      </Card>

      {/* Section 3: Contractor Validation */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('contractor')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Contractor Validation
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.contractor ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.contractor && (
          <CardContent>
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
          </CardContent>
        )}
      </Card>

      {/* Section 4: AI Confidence */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('confidence')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <CheckSquare className="h-4 w-4 mr-2" />
              AI Confidence & Explainability
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.confidence ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.confidence && (
              <CardContent className="space-y-4">
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
                      <p className="text-xl font-bold">{tierLogic.confidenceScore}%</p>
                    </div>
                    <Progress value={tierLogic.confidenceScore} className="h-3" />
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
                      {confidenceBreakdown.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.metric}</TableCell>
                          <TableCell><Badge variant="outline">{item.weight}</Badge></TableCell>
                          <TableCell className="text-right text-success font-semibold">{item.contribution}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <p className="text-xs text-muted-foreground mt-4">
                    Formula: Σ(weight × normalized metric), threshold = 0.75
                  </p>
                </div>
          </CardContent>
        )}
      </Card>

      {/* Section 5: Product Enforcement */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('enforcement')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Product Enforcement
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.enforcement ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.enforcement && (
              <CardContent>
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
                    {productEnforcement.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell><Badge variant="outline">{item.allowedTiers}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.logic}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
          </CardContent>
        )}
      </Card>

      {/* Section 6: Exceptions */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('exceptions')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Exceptions & Tag Manager
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.exceptions ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.exceptions && (
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exception</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exceptions.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.exception}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.source}</TableCell>
                        <TableCell>{getSeverityBadge(item.severity)}</TableCell>
                        <TableCell className="text-sm">{item.owner}</TableCell>
                        <TableCell className="text-sm">{item.sla}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
          </CardContent>
        )}
      </Card>

      {/* Phase Log */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => toggleCard('phaseLog')}
        >
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Experience Tiering Phase Log
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.phaseLog ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.phaseLog && (
          <CardContent>
            <div className="space-y-3">
              {phase.auditLog && phase.auditLog.length > 0 ? (
                phase.auditLog.map((entry: any) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{entry.action}</span>
                        {entry.decision && (
                          <Badge 
                            variant={
                              entry.decision === 'approved' ? 'default' : 
                              entry.decision === 'rejected' ? 'destructive' : 
                              'outline'
                            }
                            className="text-xs"
                          >
                            {entry.decision}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                      <p className="text-xs mt-1">{entry.details} - by {entry.user}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-muted/20 rounded text-center text-sm text-muted-foreground">
                  No phase log entries available
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
