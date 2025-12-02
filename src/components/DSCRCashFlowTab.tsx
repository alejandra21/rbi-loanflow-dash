import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, DollarSign, AlertCircle, Info, Calculator, Scale } from "lucide-react";
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
    auditLog: false
  });
  const [showToleranceRules, setShowToleranceRules] = useState(false);
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
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /></Badge>;
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
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium">DSCR Underwriting</h2>
          {getStatusBadge(phaseStatus)}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* POS & Appraisal Inputs */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('appraisalInputs')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              POS & Appraisal Inputs
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.appraisalInputs ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.appraisalInputs && <CardContent className="space-y-6">
            {/* Borrower Credit Score */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Borrower Credit Score</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">From POS</p>
                  <p className="text-sm font-medium">{data.appraisalInput.borrowerCreditScorePOS}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">From Credit Bureau Feed</p>
                  <p className="text-sm font-medium">{data.appraisalInput.borrowerCreditScoreBureau}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* LOI Values from POS */}
            <div>
              <h4 className="text-sm font-semibold mb-3">LOI Values from POS</h4>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Loan Amount</p>
                  <p className="text-sm font-medium">{formatCurrency(data.appraisalInput.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Interest Rate</p>
                  <p className="text-sm font-medium">{data.appraisalInput.interestRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Term</p>
                  <p className="text-sm font-medium">{data.appraisalInput.term} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">As Is Value</p>
                  <p className="text-sm font-medium">{formatCurrency(data.appraisalInput.asIsValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">LTV</p>
                  <p className="text-sm font-medium">{data.appraisalInput.posLTV}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">LTC</p>
                  <p className="text-sm font-medium">{data.appraisalInput.posLTC}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Terms File Source</p>
                  <Button size="sm" variant="outline" onClick={() => window.open(data.appraisalInput.termsFileSource, '_blank')}>
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

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
                  <p className="text-xs text-muted-foreground mb-2">LTV</p>
                  <p className="text-sm font-medium">{data.appraisalInput.appraisalLTV}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">LTC</p>
                  <p className="text-sm font-medium">{data.appraisalInput.appraisalLTC}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">PDF Source</p>
                  <Button size="sm" variant="outline" onClick={() => window.open(data.appraisalInput.pdfSource, '_blank')}>
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
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
            <div className="flex items-center">
              <Calculator className="h-4 w-4 mr-2" />
              DSCR Calculation
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.dscrCalculation ? '' : '-rotate-90'}`} />
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
            <div className="flex items-center">
              <Scale className="h-4 w-4 mr-2" />
              POS Comparison & Tolerance Analysis
            </div>
            <div className="flex items-center space-x-2">
              {(() => {
                const hasMajor = data.comparisonMetrics.some(m => m.flag === 'major');
                const hasMinor = data.comparisonMetrics.some(m => m.flag === 'minor');
                if (hasMajor) {
                  return (
                    <Badge variant="destructive" className="inline-flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Major Flag
                    </Badge>
                  );
                }
                if (hasMinor) {
                  return (
                    <Badge variant="warning" className="inline-flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Minor Flag
                    </Badge>
                  );
                }
                return (
                  <Badge variant="success" className="inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Validated
                  </Badge>
                );
              })()}
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.posComparison ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.posComparison && <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-semibold">Metric</TableHead>
                  <TableHead className="text-sm font-semibold">POS Value</TableHead>
                  <TableHead className="text-sm font-semibold">AI Value</TableHead>
                  <TableHead className="text-sm font-semibold">Difference</TableHead>
                  <TableHead className="text-sm font-semibold">Tolerance</TableHead>
                  <TableHead className="text-sm font-semibold">Evaluation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.comparisonMetrics.map((metric, index) => <TableRow key={index}>
                    <TableCell className="text-sm font-medium">{metric.metric}</TableCell>
                    <TableCell className="text-xs">{metric.posValue}</TableCell>
                    <TableCell className="text-xs">{metric.aiValue}</TableCell>
                    <TableCell className="text-xs">{metric.difference}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {metric.tolerance === "0%" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help inline-flex items-center gap-1">
                                {metric.tolerance}
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Exact Match</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        metric.tolerance
                      )}
                    </TableCell>
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

            <Separator />

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowToleranceRules(!showToleranceRules)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Tolerance Rules (Legend)
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showToleranceRules ? '' : '-rotate-90'}`} />
              </Button>

              {showToleranceRules && (
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Deviation Type</TableHead>
                        <TableHead className="text-xs">Metric</TableHead>
                        <TableHead className="text-xs">Threshold</TableHead>
                        <TableHead className="text-xs">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.toleranceRules.map((rule, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge variant={rule.deviationType === "minor" ? "warning" : "destructive"} className="text-xs">
                              {rule.deviationType === "minor" ? "Minor" : "Major"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{rule.metric}</TableCell>
                          <TableCell className="text-sm">{rule.threshold}</TableCell>
                          <TableCell className="text-sm">{rule.action}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>}
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('auditLog')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Audit Log
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.auditLog ? '' : '-rotate-90'}`} />
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