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
    leverageTier: true,
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
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Validated
              </Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.appraisalInputs ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.appraisalInputs && <CardContent>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {/* Borrower Credit Score */}
              <div>
                <p className="text-sm text-muted-foreground">Borrower Credit Score (POS)</p>
                <p className="text-base font-semibold mt-1">{data.appraisalInput.borrowerCreditScorePOS}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Borrower Credit Score (Bureau)</p>
                <p className="text-base font-semibold mt-1">{data.appraisalInput.borrowerCreditScoreBureau}</p>
              </div>

              {/* LOI Values */}
              <div>
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(data.appraisalInput.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="text-base font-semibold mt-1">{data.appraisalInput.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="text-base font-semibold mt-1">{data.appraisalInput.term} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Terms File Source</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-1 h-8">
                        <FileText className="h-3.5 w-3.5 mr-2" />
                        {data.appraisalInput.termsFileSource.split('/').pop()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs break-all">{data.appraisalInput.termsFileSource}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Appraisal Values */}
              <div>
                <p className="text-sm text-muted-foreground">Occupancy</p>
                <Badge variant={data.appraisalInput.occupancy === 'Occupied' ? 'default' : 'secondary'} className="mt-1">
                  {data.appraisalInput.occupancy}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actual Lease Rent</p>
                <p className="text-base font-semibold mt-1">
                  {data.appraisalInput.actualLeaseRent ? formatCurrency(data.appraisalInput.actualLeaseRent) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Market Rent</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(data.appraisalInput.marketRent)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Appraised Value</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(data.appraisalInput.appraisedValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Appraisal Date</p>
                <p className="text-base font-semibold mt-1">{data.appraisalInput.appraisalDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PDF Source</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-1 h-8">
                        <FileText className="h-3.5 w-3.5 mr-2" />
                        {data.appraisalInput.pdfSource.split('/').pop()}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs break-all">{data.appraisalInput.pdfSource}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>


            <Separator className="my-6" />
            
            {/* AI Rent Decision */}
            <div>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Rent Decision
              </h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Rent</p>
                  <p className="text-base font-semibold mt-1 text-primary">
                    {formatCurrency(data.rentDecision.selectedRent)}/mo
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Decision Rule</p>
                  <p className="text-base font-semibold mt-1">{data.rentDecision.decisionRule}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded">
                <Info className="h-4 w-4" />
                <span>
                  {data.appraisalInput.occupancy === "Occupied" ? "Occupied property: Using lesser of lease rent or market rent" : "Vacant property: Using market rent only"}
                </span>
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
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Validated
              </Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.dscrCalculation ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.dscrCalculation && <CardContent>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Selected Rent</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(data.dscrCalculation.selectedRent)}<span className="text-sm text-muted-foreground ml-1">per month</span></p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">POS Debt Service</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(data.dscrCalculation.posDebtService)}<span className="text-sm text-muted-foreground ml-1">per month</span></p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calculated DSCR</p>
                <p className="text-base font-semibold mt-1 text-primary">{data.dscrCalculation.calculatedDSCR.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded text-xs text-muted-foreground mt-4">
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
              <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Validated
              </Badge>
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
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Leverage Tier Change
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Validated
              </Badge>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.leverageTier ? '' : '-rotate-90'}`} />
            </div>
          </CardTitle>
        </CardHeader>
        {expandedCards.leverageTier && <CardContent>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground">POS Tier</p>
                <p className="text-base font-semibold mt-1">{data.tierChange.posTier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI-Calculated Tier</p>
                <p className="text-base font-semibold mt-1">{data.tierChange.aiCalculatedTier}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tier Changed</p>
                <Badge variant={data.tierChange.tierChanged ? "destructive" : "success"} className="mt-1">
                  {data.tierChange.tierChanged ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            {data.tierChange.tierChanged && <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mt-4">
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


      {/* Tolerance Rules (Legend) */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('toleranceRules')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Tolerance Rules (Legend)
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.toleranceRules ? '' : '-rotate-90'}`} />
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