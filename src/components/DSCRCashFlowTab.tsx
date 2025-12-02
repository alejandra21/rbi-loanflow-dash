import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, DollarSign, AlertCircle, Info } from "lucide-react";
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
    appraisal: true,
    dscr: true,
    comparison: true,
    tierChange: true,
    decision: true,
    downstream: false,
    rules: false,
    logs: false
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
  const getDSCRBadge = (dscr: number) => {
    if (dscr >= 1.25) {
      return <Badge variant="success" className="gap-1 text-base font-bold">{dscr.toFixed(2)}</Badge>;
    } else if (dscr >= 1.0) {
      return <Badge variant="warning" className="gap-1 text-base font-bold">{dscr.toFixed(2)}</Badge>;
    } else {
      return <Badge variant="destructive" className="gap-1 text-base font-bold">{dscr.toFixed(2)}</Badge>;
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
  return <div className="space-y-4">
      {/* Phase Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">DSCR Underwriting</h2>
          {getStatusBadge(phaseStatus)}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Appraisal Inputs & AI Rent Decision */}
      <Collapsible open={expandedCards.appraisal} onOpenChange={() => toggleCard('appraisal')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Appraisal Inputs & AI Rent Decision</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Validated
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.appraisal ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-6">
                {/* Appraisal PDF Inputs */}
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Appraisal PDF (AI Extracted Inputs)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Occupancy</label>
                      <div className="flex items-center gap-2">
                        <Badge variant={data.appraisalInput.occupancy === 'Occupied' ? 'success' : 'secondary'}>
                          {data.appraisalInput.occupancy}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Actual Lease Rent</label>
                      <p className="font-medium">
                        {data.appraisalInput.actualLeaseRent ? formatCurrency(data.appraisalInput.actualLeaseRent) : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Market Rent</label>
                      <p className="font-medium">{formatCurrency(data.appraisalInput.marketRent)}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Appraised Value</label>
                      <p className="font-medium">{formatCurrency(data.appraisalInput.appraisedValue)}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Appraisal Date</label>
                      <p className="font-medium">{data.appraisalInput.appraisalDate}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">PDF Source</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="font-medium text-sm text-primary cursor-pointer hover:underline truncate">
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
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    AI Rent Decision
                  </h4>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Selected Rent:</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(data.rentDecision.selectedRent)}</span>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Decision Rule</label>
                      <p className="text-sm">{data.rentDecision.decisionRule}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* DSCR Calculation */}
      <Collapsible open={expandedCards.dscr} onOpenChange={() => toggleCard('dscr')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5" />
              <h3 className="text-lg font-semibold">DSCR Calculation</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Validated
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.dscr ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Selected Rent</label>
                    <p className="text-lg font-bold">{formatCurrency(data.dscrCalculation.selectedRent)}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">POS Debt Service</label>
                    <p className="text-lg font-bold">{formatCurrency(data.dscrCalculation.posDebtService)}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Calculated DSCR</label>
                    <div className="flex items-center gap-2">
                      {getDSCRBadge(data.dscrCalculation.calculatedDSCR)}
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded text-xs text-muted-foreground">
                  <strong>Formula:</strong> DSCR = Selected Rent ÷ POS Debt Service
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* POS Comparison Table */}
      <Collapsible open={expandedCards.comparison} onOpenChange={() => toggleCard('comparison')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              <h3 className="text-lg font-semibold">POS Comparison & Tolerance Analysis</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Validated
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.comparison ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>POS Value</TableHead>
                    <TableHead>AI Value</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Tolerance</TableHead>
                    <TableHead>Flag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.comparisonMetrics.map((metric, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{metric.metric}</TableCell>
                      <TableCell>{metric.posValue}</TableCell>
                      <TableCell>{metric.aiValue}</TableCell>
                      <TableCell>{metric.difference}</TableCell>
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
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Leverage Tier Change Panel */}
      <Collapsible open={expandedCards.tierChange} onOpenChange={() => toggleCard('tierChange')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Leverage Tier Change</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Validated
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.tierChange ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">POS Tier</label>
                    <Badge variant="outline" className="text-sm">{data.tierChange.posTier}</Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">AI Calculated Tier</label>
                    <Badge variant="outline" className="text-sm">{data.tierChange.aiCalculatedTier}</Badge>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Tier Changed?</label>
                    <Badge variant={data.tierChange.tierChanged ? "destructive" : "success"}>
                      {data.tierChange.tierChanged ? "YES" : "NO"}
                    </Badge>
                  </div>
                </div>
                {data.tierChange.tierChanged && <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm text-destructive">Major Deviation: Manual Review Required</p>
                        <p className="text-sm text-muted-foreground mt-1">{data.tierChange.reason}</p>
                      </div>
                    </div>
                  </div>}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* AI Decision & Required Action */}
      <Collapsible open={expandedCards.decision} onOpenChange={() => toggleCard('decision')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <h3 className="text-lg font-semibold">AI Decision & Required Action</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Validated
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.decision ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Outcome</label>
                  {getStatusBadge(data.aiDecision.outcome)}
                </div>
                
                {data.aiDecision.reason && <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm">{data.aiDecision.reason}</p>
                  </div>}

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
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Downstream Notifications */}
      <Collapsible open={expandedCards.downstream} onOpenChange={() => toggleCard('downstream')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Downstream Notifications</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" /> Validated
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.downstream ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">POS Updated</label>
                  <Badge variant={data.downstreamNotification.posUpdated ? "success" : "secondary"}>
                    {data.downstreamNotification.posUpdated ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Downstream Services Notified</label>
                  <Badge variant={data.downstreamNotification.downstreamServicesNotified ? "success" : "secondary"}>
                    {data.downstreamNotification.downstreamServicesNotified ? "Yes" : "No"}
                  </Badge>
                </div>
                {data.downstreamNotification.lastUpdateTimestamp && <div className="space-y-1 col-span-2">
                    <label className="text-xs text-muted-foreground">Last Update</label>
                    <p className="text-sm">{data.downstreamNotification.lastUpdateTimestamp}</p>
                  </div>}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Tolerance Rules */}
      <Collapsible open={expandedCards.rules} onOpenChange={() => toggleCard('rules')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Tolerance Rules (Legend)</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Info className="h-3 w-3" /> Reference
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.rules ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Deviation Type</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.toleranceRules.map((rule, index) => <TableRow key={index}>
                      <TableCell className="font-medium">{rule.metric}</TableCell>
                      <TableCell>{rule.threshold}</TableCell>
                      <TableCell>
                        <Badge variant={rule.deviationType === 'minor' ? 'warning' : 'destructive'}>
                          {rule.deviationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{rule.action}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Audit Log */}
      <Collapsible open={expandedCards.logs} onOpenChange={() => toggleCard('logs')}>
        <Card>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Audit Log</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <FileText className="h-3 w-3" /> {data.logs.length} Entries
              </Badge>
              <ChevronDown className={`h-5 w-5 transition-transform ${expandedCards.logs ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-2">
                {data.logs.map(log => <Collapsible key={log.id} open={expandedLogs[log.id]} onOpenChange={() => toggleLog(log.id)}>
                    <Card className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <CollapsibleTrigger className="flex items-start justify-between w-full hover:opacity-70 transition-opacity">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {log.tag}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {log.timestamp}
                              </span>
                              <Badge variant={log.status === "completed" ? "success" : log.status === "failed" ? "destructive" : "secondary"}>
                                {log.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.details}
                            </p>
                          </div>
                          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${expandedLogs[log.id] ? "rotate-180" : ""}`} />
                        </CollapsibleTrigger>
                        {log.jsonData && <CollapsibleContent>
                            <Separator className="my-3" />
                            <div className="bg-muted/50 p-3 rounded text-xs font-mono">
                              <pre className="whitespace-pre-wrap break-all">
                                {JSON.stringify(log.jsonData, null, 2)}
                              </pre>
                            </div>
                          </CollapsibleContent>}
                      </CardContent>
                    </Card>
                  </Collapsible>)}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>;
};