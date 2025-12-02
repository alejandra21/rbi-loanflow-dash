import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, DollarSign, AlertCircle, Info, Calculator, Scale, Bell } from "lucide-react";
import { useState } from "react";
import { DSCRCashFlowData } from "@/types/dscrCashFlow";
interface DSCRCashFlowTabProps {
  data: DSCRCashFlowData;
  phaseStatus: string;
  lastUpdated: string;
}
export const DSCRCashFlowTab = ({
  data,
  phaseStatus,
  lastUpdated
}: DSCRCashFlowTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    appraisalInputs: true,
    dscrCalculation: true,
    posComparison: true,
    leverageTier: true,
    aiDecision: true,
    downstreamNotifications: false,
    toleranceRules: false,
    auditLog: false
  });
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  const toggleLog = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pass":
      case "passed":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> AI Passed</Badge>;
      case "minor_deviation":
      case "reprice_needed":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Reprice Needed</Badge>;
      case "major_deviation":
      case "manual":
      case "manual_review":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Manual Review Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const getFlagBadge = (flag: 'none' | 'minor' | 'major') => {
    switch (flag) {
      case "none":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> None</Badge>;
      case "minor":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Minor</Badge>;
      case "major":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Major</Badge>;
      default:
        return <Badge variant="outline">{flag}</Badge>;
    }
  };
  const getDSCRBadgeVariant = (dscr: number): "success" | "warning" | "destructive" => {
    if (dscr >= 1.25) return "success";
    if (dscr >= 1.0) return "warning";
    return "destructive";
  };
  const getDSCRStatus = (dscr: number): string => {
    if (dscr >= 1.25) return "Excellent";
    if (dscr >= 1.0) return "Acceptable";
    return "Below Minimum";
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  return <div className="space-y-4">
      {/* Phase Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium">DSCR Cash Flow</h2>
          {getStatusBadge(phaseStatus)}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Appraisal Inputs & AI Rent Decision */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('appraisalInputs')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span>Appraisal Inputs & AI Rent Decision</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Validated</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.appraisalInputs ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.appraisalInputs && <CardContent className="space-y-6">
            {/* Appraisal PDF Inputs */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Appraisal PDF (AI Extracted Inputs)
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Occupancy</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={data.appraisalInput.occupancy === 'Occupied' ? 'default' : 'secondary'}>
                      {data.appraisalInput.occupancy}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Actual Lease Rent</p>
                  <p className="text-sm font-medium">
                    {data.appraisalInput.actualLeaseRent ? formatCurrency(data.appraisalInput.actualLeaseRent) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Market Rent</p>
                  <p className="text-sm font-medium">{formatCurrency(data.appraisalInput.marketRent)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Appraised Value</p>
                  <p className="text-sm font-medium">{formatCurrency(data.appraisalInput.appraisedValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Appraisal Date</p>
                  <p className="text-sm font-medium">{data.appraisalInput.appraisalDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">PDF Source</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-medium text-primary cursor-pointer hover:underline truncate">
                          {data.appraisalInput.pdfSource.split('/').pop()}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs break-all">{data.appraisalInput.pdfSource}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <Separator />

            {/* AI Rent Decision */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Rent Decision
              </h4>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Selected Rent</p>
                        <p className="text-sm font-bold text-primary">
                          {formatCurrency(data.rentDecision.selectedRent)}/mo
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Decision Rule</p>
                        <p className="text-sm">{data.rentDecision.decisionRule}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span>
                          {data.appraisalInput.occupancy === "Occupied" ? "Occupied property: Using lesser of lease rent or market rent" : "Vacant property: Using market rent only"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>}
      </Card>

      {/* DSCR Calculation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('dscrCalculation')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calculator className="h-4 w-4 text-primary" />
              </div>
              <span>DSCR Calculation</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Validated</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.dscrCalculation ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.dscrCalculation && <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2">Selected Rent</p>
                <p className="text-sm font-bold">
                  {formatCurrency(data.dscrCalculation.selectedRent)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per month</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2">POS Debt Service</p>
                <p className="text-sm font-bold">
                  {formatCurrency(data.dscrCalculation.posDebtService)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per month</p>
              </div>
              <div className="p-4 border rounded-lg bg-primary/10">
                <p className="text-xs text-muted-foreground mb-2">Calculated DSCR</p>
                <p className="text-sm font-bold text-primary">
                  {data.dscrCalculation.calculatedDSCR.toFixed(2)}
                </p>
                <Badge variant={getDSCRBadgeVariant(data.dscrCalculation.calculatedDSCR)} className="mt-2">
                  {getDSCRStatus(data.dscrCalculation.calculatedDSCR)}
                </Badge>
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded text-xs text-muted-foreground">
              <strong>Formula:</strong> DSCR = Selected Rent ÷ POS Debt Service
            </div>
          </CardContent>}
      </Card>

      {/* POS Comparison & Tolerance Analysis */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('posComparison')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Scale className="h-4 w-4 text-primary" />
              </div>
              <span>POS Comparison & Tolerance Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Validated</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.posComparison ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.posComparison && <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Metric</TableHead>
                  <TableHead className="text-xs">POS Value</TableHead>
                  <TableHead className="text-xs">AI Value</TableHead>
                  <TableHead className="text-xs">Difference</TableHead>
                  <TableHead className="text-xs">Tolerance</TableHead>
                  <TableHead className="text-xs">Flag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.comparisonMetrics.map((metric, index) => <TableRow key={index}>
                    <TableCell className="text-sm font-medium">{metric.metric}</TableCell>
                    <TableCell className="text-sm">{metric.posValue}</TableCell>
                    <TableCell className="text-sm">{metric.aiValue}</TableCell>
                    <TableCell className="text-sm">{metric.difference}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{metric.tolerance}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>{getFlagBadge(metric.flag)}</div>
                          </TooltipTrigger>
                          {metric.flagDetails && <TooltipContent>
                              <p className="text-xs max-w-xs">{metric.flagDetails}</p>
                            </TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>}
      </Card>

      {/* Leverage Tier Change */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('leverageTier')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span>Leverage Tier Change</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Validated</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.leverageTier ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.leverageTier && <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">POS Tier</p>
                <p className="text-sm font-medium">{data.tierChange.posTier}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">AI-Calculated Tier</p>
                <p className="text-sm font-medium">{data.tierChange.aiCalculatedTier}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Tier Changed?</p>
                <Badge variant={data.tierChange.tierChanged ? "destructive" : "success"} className="text-sm">
                  {data.tierChange.tierChanged ? "YES" : "NO"}
                </Badge>
              </div>
            </div>
            {data.tierChange.tierChanged && <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">Major Deviation: Manual Review Required</p>
                    <p className="text-xs text-muted-foreground mt-1">{data.tierChange.reason}</p>
                  </div>
                </div>
              </div>}
          </CardContent>}
      </Card>

      {/* AI Decision & Required Action */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('aiDecision')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <span>AI Decision & Required Action</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Validated</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.aiDecision ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.aiDecision && <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Outcome</p>
              {getStatusBadge(data.aiDecision.outcome)}
            </div>
            
            {data.aiDecision.reason && <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">{data.aiDecision.reason}</p>
              </div>}

            <p className="text-xs text-muted-foreground">
              {data.aiDecision.outcome === "pass" && "All values within tolerance. Ready to proceed."}
              {data.aiDecision.outcome === "minor_deviation" && "Minor deviations detected. AI will automatically reprice the loan."}
              {data.aiDecision.outcome === "major_deviation" && "Major deviations or tier changes detected. Manual underwriter review required."}
            </p>

            <Separator />

            <div className="flex gap-2">
              {data.aiDecision.action === 'auto_reprice' && <Button variant="default">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Reprice Loan in POS
                </Button>}
              {data.aiDecision.action === 'manual_review' && <Button variant="destructive">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Send to Manual Review
                </Button>}
              {data.aiDecision.action === 'proceed_phase_7' && <Button variant="default">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Proceed to Phase 7
                </Button>}
            </div>
          </CardContent>}
      </Card>

      {/* Downstream Notifications */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('downstreamNotifications')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <span>Downstream Notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Validated</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.downstreamNotifications ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.downstreamNotifications && <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-xs text-muted-foreground">POS Updated</span>
                <Badge variant={data.downstreamNotification.posUpdated ? "success" : "secondary"}>
                  {data.downstreamNotification.posUpdated ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-xs text-muted-foreground">Downstream Services Notified</span>
                <Badge variant={data.downstreamNotification.downstreamServicesNotified ? "success" : "secondary"}>
                  {data.downstreamNotification.downstreamServicesNotified ? "Yes" : "No"}
                </Badge>
              </div>
              {data.downstreamNotification.lastUpdateTimestamp && <div className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Last Update</p>
                  <p className="text-sm font-medium">{data.downstreamNotification.lastUpdateTimestamp}</p>
                </div>}
            </div>
          </CardContent>}
      </Card>

      {/* Tolerance Rules (Legend) */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('toleranceRules')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <span>Tolerance Rules (Legend)</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Reference</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.toleranceRules ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.toleranceRules && <CardContent>
            <div className="space-y-3">
              {data.toleranceRules.map((rule, index) => <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Badge variant={rule.deviationType === "minor" ? "warning" : "destructive"} className="text-xs">
                    {rule.deviationType === "minor" ? "Minor" : "Major"}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rule.metric}</p>
                    <p className="text-xs text-muted-foreground">{rule.threshold}</p>
                    <p className="text-xs text-muted-foreground mt-1">{rule.action}</p>
                  </div>
                </div>)}
            </div>
          </CardContent>}
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('auditLog')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Audit Log
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Reference</Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.auditLog ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.auditLog && <CardContent>
            <div className="space-y-3">
              {data.logs.map(log => <div key={log.id} className="border rounded-lg">
                  <div className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleLog(log.id)}>
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{log.action}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{log.timestamp}</p>
                          <p className="text-sm mt-1">{log.details}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-wrap justify-end">
                          <Badge variant="outline" className="text-xs">{log.tag}</Badge>
                          <Badge variant={log.status === "completed" ? "default" : log.status === "failed" ? "destructive" : "outline"} className="text-xs">
                            {log.status}
                          </Badge>
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedLogs[log.id] ? '' : '-rotate-90'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedLogs[log.id] && log.jsonData && <div className="px-3 pb-3 border-t bg-muted/20">
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