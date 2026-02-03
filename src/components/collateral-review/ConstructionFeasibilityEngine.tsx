import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, AlertTriangle, XCircle, ChevronDown, Info,
  Hammer, Clock, FileCheck, DollarSign, Users, Calendar,
  Shield, ArrowRight
} from "lucide-react";
import type { ConstructionFeasibilityData, EngineCheck, CheckStatus } from "@/types/collateralReview";

interface ConstructionFeasibilityEngineProps {
  data: ConstructionFeasibilityData;
  expanded: boolean;
  onToggle: () => void;
  transactionType: 'Purchase' | 'Refinance';
}

export const ConstructionFeasibilityEngine = ({
  data,
  expanded,
  onToggle,
  transactionType
}: ConstructionFeasibilityEngineProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 65) return "text-amber-600";
    return "text-red-600";
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
        return <Badge variant="secondary" className="gap-1"><AlertTriangle className="h-3 w-3" /> Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScopeMatchBadge = (status: 'full_match' | 'partial_match' | 'mismatch') => {
    switch (status) {
      case 'full_match':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Full Match</Badge>;
      case 'partial_match':
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Partial Match</Badge>;
      case 'mismatch':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Mismatch</Badge>;
    }
  };

  const getScopeResultBadge = (result: 'Continue' | 'REVIEW' | 'FAIL') => {
    switch (result) {
      case 'Continue':
        return <Badge variant="success">Continue</Badge>;
      case 'REVIEW':
        return <Badge variant="warning">REVIEW</Badge>;
      case 'FAIL':
        return <Badge variant="destructive">FAIL</Badge>;
    }
  };

  const getARVInterpretationBadge = (interpretation: 'Strong' | 'Acceptable' | 'Weak ARV') => {
    switch (interpretation) {
      case 'Strong':
        return <Badge variant="success">Strong</Badge>;
      case 'Acceptable':
        return <Badge variant="warning">Acceptable</Badge>;
      case 'Weak ARV':
        return <Badge variant="destructive">Weak ARV</Badge>;
    }
  };

  const getContractorStatusBadge = (status: 'Recommended' | 'Recommended w/ Max' | 'Not Recommended') => {
    switch (status) {
      case 'Recommended':
        return <Badge variant="success">Recommended</Badge>;
      case 'Recommended w/ Max':
        return <Badge variant="warning">Recommended w/ Max</Badge>;
      case 'Not Recommended':
        return <Badge variant="destructive">Not Recommended</Badge>;
    }
  };

  const getTimelineResultBadge = (result: 'Pass' | 'Review' | 'High Risk') => {
    switch (result) {
      case 'Pass':
        return <Badge variant="success">Pass</Badge>;
      case 'Review':
        return <Badge variant="warning">Review</Badge>;
      case 'High Risk':
        return <Badge variant="destructive">High Risk</Badge>;
    }
  };

  const getFeasibilityResultBadge = (result: 'Feasible' | 'Review' | 'Not Feasible') => {
    switch (result) {
      case 'Feasible':
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Feasible</Badge>;
      case 'Review':
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Review</Badge>;
      case 'Not Feasible':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Not Feasible</Badge>;
    }
  };

  const getGaugeColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 65) return "text-amber-500";
    return "text-red-500";
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

  const SectionHeader = ({ number, title, icon: Icon }: { number: number; title: string; icon: React.ElementType }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
        {number}
      </div>
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-semibold">{title}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onToggle}>
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="h-4 w-4" />
            Engine 6: Construction Feasibility
            <Badge variant="outline">{data.productType}</Badge>
            <Badge variant="outline" className={getScoreColor(data.feasibilityScore)}>
              Score: {data.feasibilityScore}
            </Badge>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? '' : '-rotate-90'}`} />
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-6">
          {/* Header Summary */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {data.productType === 'FNF' ? 'Fix & Flip' : 'Ground-Up Construction'}
              </Badge>
              {getFeasibilityResultBadge(data.feasibilityResult)}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Feasibility Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(data.feasibilityScore)}`}>
                {data.feasibilityScore}
              </p>
            </div>
          </div>

          {/* Section 1: Appraisal Scope Assumption Review */}
          <div className="space-y-3">
            <SectionHeader number={1} title="Appraisal Scope Assumption Review" icon={FileCheck} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-muted/10">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Appraiser Assumed Scope</p>
                <ul className="space-y-1.5">
                  {data.scopeAssumptionReview.appraiserAssumedItems.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-muted/10">
                <p className="text-xs text-muted-foreground mb-2 font-medium">POS Budget Scope</p>
                <ul className="space-y-1.5">
                  {data.scopeAssumptionReview.posBudgetItems.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
              <span className="text-sm text-muted-foreground">Scope Match:</span>
              {getScopeMatchBadge(data.scopeAssumptionReview.scopeMatchStatus)}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              {getScopeResultBadge(data.scopeAssumptionReview.scopeResult)}
            </div>
          </div>

          <Separator />

          {/* Section 2: AIV/ARV Value Logic Check */}
          <div className="space-y-3">
            <SectionHeader number={2} title="AIV/ARV Value Logic Check" icon={DollarSign} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">AIV (As-Is)</p>
                <p className="text-lg font-bold">{formatCurrency(data.aiv)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Rehab Budget</p>
                <p className="text-lg font-bold">{formatCurrency(data.rehabBudget)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">ARV (After Repair)</p>
                <p className="text-lg font-bold">{formatCurrency(data.arv)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">ARV Support Ratio</p>
                <div className="flex items-center justify-center gap-2">
                  <p className={`text-lg font-bold ${data.arvSupportRatio <= 85 ? 'text-green-600' : data.arvSupportRatio <= 92 ? 'text-amber-600' : 'text-red-600'}`}>
                    {data.arvSupportRatio}%
                  </p>
                  {getARVInterpretationBadge(data.arvSupportInterpretation)}
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <code className="text-xs">Formula: (AIV + Rehab) ÷ ARV = ({formatCurrency(data.aiv)} + {formatCurrency(data.rehabBudget)}) ÷ {formatCurrency(data.arv)} = {data.arvSupportRatio}%</code>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> ≤85% Strong</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 86-92% Acceptable</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> &gt;92% Weak</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 3: Comparable Sales Feasibility */}
          <div className="space-y-3">
            <SectionHeader number={3} title="Comparable Sales Feasibility (ARV Comps)" icon={Shield} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Net Adjustments (Avg)</TableCell>
                  <TableCell>{data.arvCompsFeasibility.netAdjustmentAvg}%</TableCell>
                  <TableCell className="text-muted-foreground">≤{data.arvCompsFeasibility.netAdjustmentThreshold}%</TableCell>
                  <TableCell>
                    {data.arvCompsFeasibility.netAdjustmentAvg <= data.arvCompsFeasibility.netAdjustmentThreshold ? (
                      <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Fail</Badge>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gross Adjustments (Avg)</TableCell>
                  <TableCell>{data.arvCompsFeasibility.grossAdjustmentAvg}%</TableCell>
                  <TableCell className="text-muted-foreground">≤{data.arvCompsFeasibility.grossAdjustmentThreshold}%</TableCell>
                  <TableCell>
                    {data.arvCompsFeasibility.grossAdjustmentAvg <= data.arvCompsFeasibility.grossAdjustmentThreshold ? (
                      <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Fail</Badge>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Comp Condition Supports ARV</TableCell>
                  <TableCell>{data.arvCompsFeasibility.compConditionSupportsARV ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-muted-foreground">Required</TableCell>
                  <TableCell>
                    {data.arvCompsFeasibility.compConditionSupportsARV ? (
                      <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Fail</Badge>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Comp Sale Dates</TableCell>
                  <TableCell>{data.arvCompsFeasibility.compSaleDatesWithin6Months ? '≤6 months' : '>6 months'}</TableCell>
                  <TableCell className="text-muted-foreground">≤6 months</TableCell>
                  <TableCell>
                    {data.arvCompsFeasibility.compSaleDatesWithin6Months ? (
                      <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Flag</Badge>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Section 4: POS Budget → BCP Cost Validation */}
          <div className="space-y-3">
            <SectionHeader number={4} title="POS Budget → BCP Cost Validation" icon={DollarSign} />
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">POS Budget</p>
                <p className="text-lg font-bold">{formatCurrency(data.posBudget)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">BCP Estimate</p>
                <p className="text-lg font-bold">{formatCurrency(data.bcpEstimate)}</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">Budget Variance</p>
                <div className="flex items-center justify-center gap-2">
                  <p className={`text-lg font-bold ${data.budgetVariance <= 10 ? 'text-green-600' : data.budgetVariance <= 15 ? 'text-amber-600' : 'text-red-600'}`}>
                    {data.budgetVariance}%
                  </p>
                  {data.budgetVarianceResult === 'Pass' && <Badge variant="success">Pass</Badge>}
                  {data.budgetVarianceResult === 'Review' && <Badge variant="warning">Review</Badge>}
                  {data.budgetVarianceResult === 'Fail' && <Badge variant="destructive">Fail</Badge>}
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> ≤10% Pass</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 11-15% Review</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> &gt;15% Fail</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 5: Contractor Feasibility (BCP) */}
          <div className="space-y-3">
            <SectionHeader number={5} title="Contractor Feasibility (BCP)" icon={Users} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">BCP Result</p>
                {getContractorStatusBadge(data.contractorStatus)}
              </div>
              {data.bcpMaxSupported && (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Max Supported</p>
                  <p className="text-lg font-bold">{formatCurrency(data.bcpMaxSupported)}</p>
                </div>
              )}
              {data.tradeCoverage && (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Trade Coverage</p>
                  <p className="text-lg font-bold">{data.tradeCoverage}</p>
                </div>
              )}
              {data.experienceScore !== undefined && (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Experience Score</p>
                  <p className={`text-lg font-bold ${getScoreColor(data.experienceScore)}`}>{data.experienceScore}</p>
                </div>
              )}
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Contractor Score</p>
                <p className={`text-lg font-bold ${getScoreColor(data.contractorScore)}`}>{data.contractorScore}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 6: Timeline vs Appraisal Assumptions */}
          <div className="space-y-3">
            <SectionHeader number={6} title="Timeline vs Appraisal Assumptions" icon={Calendar} />
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">BCP Timeline</p>
                <p className="text-lg font-bold">{data.bcpTimelineMonths} months</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Appraisal Estimate</p>
                <p className="text-lg font-bold">{data.appraisalTimelineMonths} months</p>
              </div>
              <div className="p-4 border rounded-lg text-center bg-muted/20">
                <p className="text-xs text-muted-foreground mb-1">Timeline Score</p>
                <div className="flex items-center justify-center gap-2">
                  <p className={`text-lg font-bold ${getScoreColor(data.timelineScore)}`}>{data.timelineScore}</p>
                  {getTimelineResultBadge(data.timelineResult)}
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <code className="text-xs">Formula: 100 - (|{data.bcpTimelineMonths} - {data.appraisalTimelineMonths}| × 10) = {data.timelineScore}</code>
              </div>
            </div>
          </div>

          {/* Section 7: Permit & Jurisdiction Validation (Refinance only) */}
          {transactionType === 'Refinance' && data.permitValidation && (
            <>
              <Separator />
              <div className="space-y-3">
                <SectionHeader number={7} title="Permit & Jurisdiction Validation" icon={Shield} />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Check</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Permit Active</TableCell>
                      <TableCell>
                        {data.permitValidation.permitActive ? (
                          <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Active</Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Inactive</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Address Match</TableCell>
                      <TableCell>
                        {data.permitValidation.permitAddressMatch ? (
                          <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Match</Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Mismatch</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Contractor Match</TableCell>
                      <TableCell>
                        {data.permitValidation.permitContractorMatch ? (
                          <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Match</Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Mismatch</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Scope Match</TableCell>
                      <TableCell>
                        {data.permitValidation.permitScopeMatch ? (
                          <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Match</Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Mismatch</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          <Separator />

          {/* Section 8: Final Feasibility Score with Circular Gauge */}
          <div className="space-y-3">
            <SectionHeader number={8} title="Final Feasibility Score" icon={Hammer} />
            <div className="p-6 rounded-lg border bg-gradient-to-r from-muted/30 to-muted/10">
              <div className="flex items-center gap-8">
                {/* Circular Gauge */}
                <div className="relative shrink-0">
                  <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(data.feasibilityScore / 100) * 264} 264`}
                      className={getGaugeColor(data.feasibilityScore)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(data.feasibilityScore)}`}>
                      {data.feasibilityScore}
                    </span>
                    <span className="text-xs text-muted-foreground">Score</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {data.productType === 'FNF' ? 'Fix & Flip' : 'Ground-Up Construction'}
                    </Badge>
                    {getFeasibilityResultBadge(data.feasibilityResult)}
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-xs font-mono">
                    {data.formula}
                  </div>
                  {/* Threshold Bar */}
                  <div className="space-y-1">
                    <div className="relative h-2 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-400">
                      <div 
                        className="absolute w-3 h-3 bg-background border-2 border-foreground rounded-full -top-0.5 transform -translate-x-1/2 shadow-sm"
                        style={{ left: `${data.feasibilityScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>&lt;65 Not Feasible</span>
                      <span>65-79 Review</span>
                      <span>≥80 Feasible</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Engine Checks Table */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Engine Checks</p>
            <EngineChecksTable checks={data.checks} />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ConstructionFeasibilityEngine;
