import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Shield, 
  FileCheck, 
  Scale, 
  Users, 
  Lock, 
  ChevronDown, 
  Download,
  Building,
  CreditCard,
  Home,
  FileText,
  AlertCircle,
  Database,
  Gavel,
  ClipboardCheck,
  ArrowRight,
  User,
  Calendar
} from "lucide-react";
import { 
  FinalApprovalData, 
  PhaseOutcome, 
  Exception, 
  RiskSummary, 
  ApprovalCondition,
  AuditTrailEntry,
  getDecisionColor,
  getRiskCategoryLabel,
  getAuthorityLabel,
  RiskCategory,
  FinalDecision
} from "@/types/finalApproval";

interface FinalApprovalTabProps {
  phaseStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastUpdated?: string;
}

// Mock data for demonstration
const mockFinalApprovalData: FinalApprovalData = {
  phaseOutcomes: [
    { phaseName: 'Borrower Eligibility', phaseNumber: 1, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-10', issues: [], isHardStop: false },
    { phaseName: 'Experience Tiering', phaseNumber: 2, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-12', issues: [], isHardStop: false },
    { phaseName: 'Credit Review', phaseNumber: 3, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-13', issues: [], isHardStop: false },
    { phaseName: 'Non-Owner Occupancy', phaseNumber: 4, status: 'pass', riskCategory: 'fraud_aml', completedAt: '2024-01-13', issues: [], isHardStop: false },
    { phaseName: 'Collateral Review', phaseNumber: 5, status: 'pass', riskCategory: 'collateral', completedAt: '2024-01-14', issues: [], isHardStop: false },
    { phaseName: 'DSCR Cash Flow', phaseNumber: 6, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-14', issues: [], isHardStop: false },
    { phaseName: 'Title Insurance', phaseNumber: 7, status: 'pass', riskCategory: 'legal_title', completedAt: '2024-01-15', issues: [], isHardStop: false },
    { phaseName: 'Closing Protection', phaseNumber: 8, status: 'manual_review', riskCategory: 'legal_title', completedAt: '2024-01-15', issues: ['CPL coverage amount variance detected'], isHardStop: false },
    { phaseName: 'Insurance Policy', phaseNumber: 9, status: 'pass', riskCategory: 'insurance', completedAt: '2024-01-15', issues: [], isHardStop: false },
    { phaseName: 'Asset Verification', phaseNumber: 10, status: 'pass', riskCategory: 'operational', completedAt: '2024-01-16', issues: [], isHardStop: false },
  ],
  
  riskSummary: [
    { category: 'credit', categoryLabel: 'Credit Risk', totalChecks: 15, passedChecks: 15, failedChecks: 0, reviewChecks: 0, hardStops: 0, status: 'pass' },
    { category: 'collateral', categoryLabel: 'Collateral Risk', totalChecks: 8, passedChecks: 8, failedChecks: 0, reviewChecks: 0, hardStops: 0, status: 'pass' },
    { category: 'legal_title', categoryLabel: 'Legal/Title Risk', totalChecks: 12, passedChecks: 11, failedChecks: 0, reviewChecks: 1, hardStops: 0, status: 'review' },
    { category: 'insurance', categoryLabel: 'Insurance Risk', totalChecks: 10, passedChecks: 10, failedChecks: 0, reviewChecks: 0, hardStops: 0, status: 'pass' },
    { category: 'fraud_aml', categoryLabel: 'Fraud/AML Risk', totalChecks: 6, passedChecks: 6, failedChecks: 0, reviewChecks: 0, hardStops: 0, status: 'pass' },
    { category: 'operational', categoryLabel: 'Operational/Data Integrity', totalChecks: 20, passedChecks: 20, failedChecks: 0, reviewChecks: 0, hardStops: 0, status: 'pass' },
  ],
  totalHardStops: 0,
  hasUnresolvedHardStops: false,
  
  exceptions: [
    {
      id: 'EXC-001',
      phaseName: 'Closing Protection',
      phaseNumber: 8,
      description: 'CPL coverage amount is $495,000 vs loan amount of $500,000 (1% variance)',
      severity: 'low',
      riskCategory: 'legal_title',
      compensatingFactors: ['Variance within 2% tolerance', 'Title company confirmed coverage will be adjusted at closing'],
      status: 'approved',
      approvedBy: 'Sarah Johnson',
      approvedAt: '2024-01-16T09:30:00Z',
      notes: 'Approved with condition to obtain updated CPL prior to funding'
    }
  ],
  totalExceptions: 1,
  approvedExceptions: 1,
  pendingExceptions: 0,
  deniedExceptions: 0,
  
  authorityRouting: {
    requiredAuthority: 'underwriter',
    authorityLabel: 'Underwriter',
    reason: 'Standard loan with 1 approved exception, within underwriter delegation limits',
    delegationChain: [
      { level: 'automated', name: 'AI Validation Engine', approved: true, approvedAt: '2024-01-16T08:00:00Z' },
      { level: 'underwriter', name: 'Sarah Johnson', approved: true, approvedAt: '2024-01-16T10:30:00Z' },
    ]
  },
  
  finalDecision: 'approved_with_conditions',
  decisionLabel: 'Approved with Conditions',
  decisionTimestamp: '2024-01-16T10:30:00Z',
  decisionBy: 'Sarah Johnson',
  
  conditions: [
    {
      id: 'COND-001',
      description: 'Obtain updated Closing Protection Letter with coverage amount matching loan amount ($500,000)',
      category: 'prior_to_funding',
      status: 'pending',
      dueDate: '2024-01-20'
    },
    {
      id: 'COND-002',
      description: 'Verify flood insurance policy effective date aligns with closing date',
      category: 'prior_to_closing',
      status: 'satisfied',
      satisfiedAt: '2024-01-16T11:00:00Z',
      satisfiedBy: 'Insurance Team'
    }
  ],
  
  approvalMemo: {
    generatedAt: '2024-01-16T10:35:00Z',
    generatedBy: 'System',
    loanId: 'LOA-2024-001',
    borrowerName: 'Tech Corp Ltd',
    loanAmount: 500000,
    loanType: 'DSCR',
    decision: 'approved_with_conditions',
    decisionRationale: 'Loan meets all credit, collateral, and operational requirements. One minor exception related to CPL coverage variance has been approved with compensating factors. Conditions have been established to ensure full compliance prior to funding.',
    riskSummary: 'Overall risk profile: LOW. All phases passed with one minor exception requiring documentation correction. No hard stops or critical issues identified.',
    exceptionsApproved: 1,
    conditionsCount: 2,
    approvalChain: [
      { role: 'AI Validation', name: 'System', decision: 'Recommend Approval', timestamp: '2024-01-16T08:00:00Z' },
      { role: 'Underwriter', name: 'Sarah Johnson', decision: 'Approved with Conditions', timestamp: '2024-01-16T10:30:00Z' }
    ]
  },
  
  auditTrail: [
    { id: 'AUD-001', timestamp: '2024-01-16T08:00:00Z', action: 'Phase 11 Initiated', performedBy: 'System', details: 'Final Approval phase started - consolidating results from phases 1-10' },
    { id: 'AUD-002', timestamp: '2024-01-16T08:01:00Z', action: 'Risk Aggregation Complete', performedBy: 'System', details: 'Consolidated 71 validation checks across 6 risk categories' },
    { id: 'AUD-003', timestamp: '2024-01-16T08:02:00Z', action: 'Exception Identified', performedBy: 'System', details: 'CPL coverage variance exception flagged for review (EXC-001)' },
    { id: 'AUD-004', timestamp: '2024-01-16T09:30:00Z', action: 'Exception Approved', performedBy: 'Sarah Johnson', details: 'Exception EXC-001 approved with compensating factors' },
    { id: 'AUD-005', timestamp: '2024-01-16T10:30:00Z', action: 'Final Decision Rendered', performedBy: 'Sarah Johnson', details: 'Loan approved with conditions' },
    { id: 'AUD-006', timestamp: '2024-01-16T10:31:00Z', action: 'Data Fields Locked', performedBy: 'System', details: 'Loan amount, interest rate, and key terms locked post-approval', fieldLocked: 'loanAmount, interestRate, loanTerm' },
    { id: 'AUD-007', timestamp: '2024-01-16T10:35:00Z', action: 'Approval Memo Generated', performedBy: 'System', details: 'Final approval memo generated and stored' },
  ],
  
  lockedFields: ['loanAmount', 'interestRate', 'loanTerm', 'propertyAddress', 'borrowerEntity'],
  
  processedAt: '2024-01-16T10:35:00Z',
  processedBy: 'Sarah Johnson',
  overallStatus: 'pass'
};

const getRiskCategoryIcon = (category: RiskCategory) => {
  switch (category) {
    case 'credit':
      return <CreditCard className="h-4 w-4" />;
    case 'collateral':
      return <Home className="h-4 w-4" />;
    case 'legal_title':
      return <Gavel className="h-4 w-4" />;
    case 'insurance':
      return <Shield className="h-4 w-4" />;
    case 'fraud_aml':
      return <AlertCircle className="h-4 w-4" />;
    case 'operational':
      return <Database className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusIcon = (status: 'pass' | 'fail' | 'manual_review' | 'pending' | 'review') => {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'fail':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'manual_review':
    case 'review':
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getDecisionIcon = (decision: FinalDecision) => {
  switch (decision) {
    case 'approved':
      return <CheckCircle2 className="h-6 w-6 text-green-600" />;
    case 'approved_with_conditions':
      return <ClipboardCheck className="h-6 w-6 text-amber-600" />;
    case 'suspended':
      return <Clock className="h-6 w-6 text-blue-600" />;
    case 'declined':
      return <XCircle className="h-6 w-6 text-red-600" />;
    default:
      return <Clock className="h-6 w-6 text-muted-foreground" />;
  }
};

const FinalApprovalTab: React.FC<FinalApprovalTabProps> = ({ phaseStatus, lastUpdated }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    phaseOutcomes: true,
    riskSummary: true,
    exceptions: true,
    authority: false,
    conditions: true,
    auditTrail: false,
    memo: false
  });

  const data = mockFinalApprovalData;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalChecks = data.riskSummary.reduce((acc, r) => acc + r.totalChecks, 0);
  const passedChecks = data.riskSummary.reduce((acc, r) => acc + r.passedChecks, 0);
  const passRate = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Final Decision */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <StatusBadge status={phaseStatus === 'completed' ? 'passed' : phaseStatus === 'failed' ? 'failed' : 'pending'} />
          <div>
            <h2 className="text-xl font-semibold">Phase 11: Final Approval</h2>
            <p className="text-sm text-muted-foreground">
              Consolidates all risk data and produces the final credit decision
            </p>
          </div>
        </div>
        {lastUpdated && (
          <span className="text-xs text-muted-foreground">
            Last updated: {formatDate(lastUpdated)}
          </span>
        )}
      </div>

      {/* Final Decision Banner */}
      <Card className={`border-2 ${data.finalDecision === 'approved' ? 'border-green-200 bg-green-50/50' : data.finalDecision === 'approved_with_conditions' ? 'border-amber-200 bg-amber-50/50' : data.finalDecision === 'declined' ? 'border-red-200 bg-red-50/50' : 'border-blue-200 bg-blue-50/50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getDecisionIcon(data.finalDecision)}
              <div>
                <h3 className="text-2xl font-bold">{data.decisionLabel}</h3>
                <p className="text-sm text-muted-foreground">
                  Decision by {data.decisionBy} on {formatDate(data.decisionTimestamp)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={getDecisionColor(data.finalDecision)}>
                {data.finalDecision.replace(/_/g, ' ').toUpperCase()}
              </Badge>
              {data.hasUnresolvedHardStops && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  HARD STOP
                </Badge>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{passedChecks}</p>
              <p className="text-xs text-muted-foreground">Checks Passed</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold">{totalChecks}</p>
              <p className="text-xs text-muted-foreground">Total Checks</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-amber-600">{data.totalExceptions}</p>
              <p className="text-xs text-muted-foreground">Exceptions</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-blue-600">{data.conditions.length}</p>
              <p className="text-xs text-muted-foreground">Conditions</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-red-600">{data.totalHardStops}</p>
              <p className="text-xs text-muted-foreground">Hard Stops</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Outcomes Summary */}
      <Card>
        <Collapsible open={expandedSections.phaseOutcomes} onOpenChange={() => toggleSection('phaseOutcomes')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Phase Outcomes (1-10)
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {data.phaseOutcomes.filter(p => p.status === 'pass').length}/{data.phaseOutcomes.length} Passed
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.phaseOutcomes ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                {data.phaseOutcomes.map((phase) => (
                  <div 
                    key={phase.phaseNumber} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      phase.status === 'pass' ? 'bg-green-50/50 border-green-100' :
                      phase.status === 'fail' ? 'bg-red-50/50 border-red-100' :
                      phase.status === 'manual_review' ? 'bg-amber-50/50 border-amber-100' :
                      'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-xs font-medium border">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{phase.phaseName}</p>
                        {phase.issues.length > 0 && (
                          <p className="text-xs text-muted-foreground">{phase.issues[0]}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {phase.isHardStop && (
                        <Badge variant="destructive" className="text-xs">Hard Stop</Badge>
                      )}
                      {getStatusIcon(phase.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Risk Summary by Category */}
      <Card>
        <Collapsible open={expandedSections.riskSummary} onOpenChange={() => toggleSection('riskSummary')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk Consolidation by Category
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{passRate}% Pass Rate</Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.riskSummary ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {data.riskSummary.map((risk) => (
                <div key={risk.category} className="p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getRiskCategoryIcon(risk.category)}
                      <span className="font-medium">{risk.categoryLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {risk.hardStops > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {risk.hardStops} Hard Stop{risk.hardStops > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {getStatusIcon(risk.status)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Validation Progress</span>
                      <span className="font-medium">{risk.passedChecks}/{risk.totalChecks} checks passed</span>
                    </div>
                    <Progress value={(risk.passedChecks / risk.totalChecks) * 100} className="h-2" />
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Passed: {risk.passedChecks}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Failed: {risk.failedChecks}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        Review: {risk.reviewChecks}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Exceptions Management */}
      <Card>
        <Collapsible open={expandedSections.exceptions} onOpenChange={() => toggleSection('exceptions')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Exception Management
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={data.pendingExceptions > 0 ? 'destructive' : 'secondary'}>
                    {data.approvedExceptions}/{data.totalExceptions} Approved
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.exceptions ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {data.exceptions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No exceptions identified</p>
                </div>
              ) : (
                data.exceptions.map((exception) => (
                  <div 
                    key={exception.id} 
                    className={`p-4 rounded-lg border ${
                      exception.status === 'approved' ? 'border-green-200 bg-green-50/30' :
                      exception.status === 'denied' ? 'border-red-200 bg-red-50/30' :
                      exception.status === 'waived' ? 'border-blue-200 bg-blue-50/30' :
                      'border-amber-200 bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="text-xs">
                          {exception.id}
                        </Badge>
                        <div>
                          <p className="font-medium">{exception.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Phase {exception.phaseNumber}: {exception.phaseName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            exception.severity === 'critical' ? 'destructive' :
                            exception.severity === 'high' ? 'destructive' :
                            exception.severity === 'medium' ? 'default' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {exception.severity.toUpperCase()}
                        </Badge>
                        <Badge 
                          variant={
                            exception.status === 'approved' ? 'default' :
                            exception.status === 'denied' ? 'destructive' :
                            'outline'
                          }
                          className={exception.status === 'approved' ? 'bg-green-600' : ''}
                        >
                          {exception.status.charAt(0).toUpperCase() + exception.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    {exception.compensatingFactors && exception.compensatingFactors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Compensating Factors:</p>
                        <ul className="text-sm space-y-1">
                          {exception.compensatingFactors.map((factor, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {exception.approvedBy && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {exception.approvedBy}
                        </span>
                        {exception.approvedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(exception.approvedAt)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Approval Authority */}
      <Card>
        <Collapsible open={expandedSections.authority} onOpenChange={() => toggleSection('authority')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Approval Authority & Delegation
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {data.authorityRouting.authorityLabel}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.authority ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-sm font-medium mb-1">Required Authority Level</p>
                <p className="text-lg font-bold">{data.authorityRouting.authorityLabel}</p>
                <p className="text-sm text-muted-foreground mt-2">{data.authorityRouting.reason}</p>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium">Approval Chain</p>
                <div className="flex items-center gap-2">
                  {data.authorityRouting.delegationChain.map((step, idx) => (
                    <React.Fragment key={step.level}>
                      <div className={`flex items-center gap-2 p-3 rounded-lg border ${step.approved ? 'bg-green-50/50 border-green-200' : 'bg-muted/30'}`}>
                        {step.approved ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{getAuthorityLabel(step.level)}</p>
                          <p className="text-xs text-muted-foreground">{step.name}</p>
                        </div>
                      </div>
                      {idx < data.authorityRouting.delegationChain.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Conditions (for conditional approval) */}
      {data.conditions.length > 0 && (
        <Card>
          <Collapsible open={expandedSections.conditions} onOpenChange={() => toggleSection('conditions')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Approval Conditions
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={data.conditions.some(c => c.status === 'pending') ? 'destructive' : 'default'} className={data.conditions.every(c => c.status === 'satisfied') ? 'bg-green-600' : ''}>
                      {data.conditions.filter(c => c.status === 'satisfied').length}/{data.conditions.length} Satisfied
                    </Badge>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.conditions ? '' : '-rotate-90'}`} />
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {data.conditions.map((condition) => (
                  <div 
                    key={condition.id} 
                    className={`p-4 rounded-lg border ${
                      condition.status === 'satisfied' ? 'border-green-200 bg-green-50/30' :
                      condition.status === 'waived' ? 'border-blue-200 bg-blue-50/30' :
                      'border-amber-200 bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {condition.status === 'satisfied' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : condition.status === 'waived' ? (
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{condition.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {condition.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            {condition.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(condition.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {condition.satisfiedBy && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {condition.satisfiedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          condition.status === 'satisfied' ? 'default' :
                          condition.status === 'waived' ? 'secondary' :
                          'outline'
                        }
                        className={condition.status === 'satisfied' ? 'bg-green-600' : ''}
                      >
                        {condition.status.charAt(0).toUpperCase() + condition.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Audit Trail */}
      <Card>
        <Collapsible open={expandedSections.auditTrail} onOpenChange={() => toggleSection('auditTrail')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Audit Trail
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{data.auditTrail.length} entries</Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.auditTrail ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {data.auditTrail.map((entry, idx) => (
                  <div 
                    key={entry.id} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {idx < data.auditTrail.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{entry.action}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.performedBy}
                        </span>
                        {entry.fieldLocked && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <Lock className="h-3 w-3" />
                            Fields locked: {entry.fieldLocked}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Approval Memo */}
      <Card>
        <Collapsible open={expandedSections.memo} onOpenChange={() => toggleSection('memo')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Approval Memo
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7" onClick={(e) => {
                    e.stopPropagation();
                    // Download memo logic here
                  }}>
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.memo ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="p-4 rounded-lg border bg-muted/20">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Loan ID</p>
                    <p className="font-medium">{data.approvalMemo.loanId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Borrower</p>
                    <p className="font-medium">{data.approvalMemo.borrowerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Amount</p>
                    <p className="font-medium">${data.approvalMemo.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Type</p>
                    <p className="font-medium">{data.approvalMemo.loanType}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Decision</p>
                    <Badge className={getDecisionColor(data.approvalMemo.decision)}>
                      {data.approvalMemo.decision.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Decision Rationale</p>
                    <p className="text-sm">{data.approvalMemo.decisionRationale}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Risk Summary</p>
                    <p className="text-sm">{data.approvalMemo.riskSummary}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Exceptions Approved</p>
                      <p className="font-bold text-lg">{data.approvalMemo.exceptionsApproved}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conditions</p>
                      <p className="font-bold text-lg">{data.approvalMemo.conditionsCount}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Approval Chain</p>
                  <div className="space-y-2">
                    {data.approvalMemo.approvalChain.map((approval, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-background border">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{approval.name}</p>
                            <p className="text-xs text-muted-foreground">{approval.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{approval.decision}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(approval.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Generated: {formatDate(data.approvalMemo.generatedAt)}</span>
                <span>By: {data.approvalMemo.generatedBy}</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Locked Fields Notice */}
      {data.lockedFields.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-sm">Post-Approval Field Locks</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The following fields have been locked and cannot be modified without executive override:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.lockedFields.map((field) => (
                    <Badge key={field} variant="outline" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinalApprovalTab;
