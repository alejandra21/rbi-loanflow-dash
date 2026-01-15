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
  Calendar,
  ShieldCheck,
  ShieldX,
  Zap,
  RefreshCw,
  Flag,
  ListChecks,
  Ban,
  Target,
  GitBranch,
  AlertOctagon
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
  getPhaseStateLabel,
  getClearToCloseLabel,
  RiskCategory,
  FinalDecision,
  PhaseTerminalState,
  HardStop,
  CompensatingFactor,
  CrossRiskReconciliation,
  LockedFieldEntry,
  ClearToCloseGate
} from "@/types/finalApproval";

interface FinalApprovalTabProps {
  phaseStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  lastUpdated?: string;
}

// Enhanced Mock data based on PDF business rules
const mockFinalApprovalData: FinalApprovalData = {
  crossPhaseInputs: [
    { dataField: 'Borrower Entity & Ownership', sourcePhase: 1, sourceSystem: 'POS', notes: 'Entity name (not guarantor)', value: 'Tech Corp Ltd' },
    { dataField: 'Loan Purpose', sourcePhase: 1, sourceSystem: 'POS', notes: 'Purchase vs Refinance', value: 'Purchase' },
    { dataField: 'Loan Program', sourcePhase: 1, sourceSystem: 'POS', notes: 'DSCR, Bridge, Fix and Flip', value: 'DSCR' },
    { dataField: 'Credit Metrics (FICO)', sourcePhase: 2, sourceSystem: 'Credit / AI admin', notes: 'Final AI-calculated values', value: 720 },
    { dataField: 'DSCR', sourcePhase: 6, sourceSystem: 'AI admin', notes: 'Final AI-calculated values', value: 1.25 },
    { dataField: 'Liquidity & Assets', sourcePhase: 3, sourceSystem: 'Ocrolus / OCR', notes: 'Ocrolus + OCR verified', value: '$125,000' },
    { dataField: 'Experience & Tier', sourcePhase: 4, sourceSystem: 'POS / AI Tier', notes: 'Tier-based authority', value: 'Tier 2' },
    { dataField: 'Collateral Value', sourcePhase: 5, sourceSystem: 'Appraisal AI', notes: 'Requirements being drafted', value: '$650,000' },
    { dataField: 'Title Status', sourcePhase: 7, sourceSystem: 'Title OCR', notes: 'Ownership + lien validation', value: 'Clear' },
    { dataField: 'CPL Status', sourcePhase: 8, sourceSystem: 'CPL OCR', notes: 'Fraud detection in wiring', value: 'Valid' },
    { dataField: 'Insurance Status', sourcePhase: 9, sourceSystem: 'Insurance OCR', notes: 'Coverage validation', value: 'Active' },
  ],
  
  phaseCompletionGate: {
    allPhasesExecuted: true,
    phasesNotRun: [],
    phasesWithoutTerminalState: [],
    hardStopGate: false,
    gateResult: 'proceed',
    gateMessage: 'All phases 1-10 have executed with terminal states. Proceeding to decision synthesis.'
  },
  
  phaseOutcomes: [
    { phaseName: 'Borrower Eligibility', phaseNumber: 1, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-10', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Experience Tiering', phaseNumber: 2, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-12', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Credit Review', phaseNumber: 3, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-13', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Non-Owner Occupancy', phaseNumber: 4, status: 'pass', riskCategory: 'fraud_aml', completedAt: '2024-01-13', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Collateral Review', phaseNumber: 5, status: 'pass', riskCategory: 'collateral', completedAt: '2024-01-14', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'DSCR Cash Flow', phaseNumber: 6, status: 'pass', riskCategory: 'credit', completedAt: '2024-01-14', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Title Insurance', phaseNumber: 7, status: 'pass', riskCategory: 'legal_title', completedAt: '2024-01-15', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Closing Protection', phaseNumber: 8, status: 'pass_with_exception', riskCategory: 'legal_title', completedAt: '2024-01-15', issues: ['CPL coverage amount variance detected'], isHardStop: false, exceptionCount: 1, hardExceptionCount: 0, softExceptionCount: 1 },
    { phaseName: 'Insurance Policy', phaseNumber: 9, status: 'pass', riskCategory: 'insurance', completedAt: '2024-01-15', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
    { phaseName: 'Asset Verification', phaseNumber: 10, status: 'pass', riskCategory: 'operational', completedAt: '2024-01-16', issues: [], isHardStop: false, exceptionCount: 0, hardExceptionCount: 0, softExceptionCount: 0 },
  ],
  
  riskSummary: [
    { category: 'credit', categoryLabel: 'Credit Risk', totalChecks: 15, passedChecks: 15, failedChecks: 0, reviewChecks: 0, hardStops: 0, softExceptions: 0, hardExceptions: 0, status: 'pass' },
    { category: 'collateral', categoryLabel: 'Collateral Risk', totalChecks: 8, passedChecks: 8, failedChecks: 0, reviewChecks: 0, hardStops: 0, softExceptions: 0, hardExceptions: 0, status: 'pass' },
    { category: 'legal_title', categoryLabel: 'Legal/Title Risk', totalChecks: 12, passedChecks: 11, failedChecks: 0, reviewChecks: 1, hardStops: 0, softExceptions: 1, hardExceptions: 0, status: 'review' },
    { category: 'insurance', categoryLabel: 'Insurance Risk', totalChecks: 10, passedChecks: 10, failedChecks: 0, reviewChecks: 0, hardStops: 0, softExceptions: 0, hardExceptions: 0, status: 'pass' },
    { category: 'fraud_aml', categoryLabel: 'Fraud/AML Risk', totalChecks: 6, passedChecks: 6, failedChecks: 0, reviewChecks: 0, hardStops: 0, softExceptions: 0, hardExceptions: 0, status: 'pass' },
    { category: 'operational', categoryLabel: 'Operational/Data Integrity', totalChecks: 20, passedChecks: 20, failedChecks: 0, reviewChecks: 0, hardStops: 0, softExceptions: 0, hardExceptions: 0, status: 'pass' },
  ],
  totalHardStops: 0,
  hasUnresolvedHardStops: false,
  hardStops: [],
  
  exceptions: [
    {
      id: 'EXC-001',
      originPhase: 8,
      phaseName: 'Closing Protection',
      riskCategory: 'legal_title',
      policyRuleId: 'CPL-001',
      severity: 'soft',
      isCurable: true,
      isCompensatorAllowed: true,
      description: 'CPL coverage amount is $495,000 vs loan amount of $500,000 (1% variance)',
      compensatingFactors: [
        { id: 'CF-001', type: 'other', description: 'Variance within 2% tolerance', isAllowedByPolicy: true, isSufficient: true },
        { id: 'CF-002', type: 'other', description: 'Title company confirmed coverage will be adjusted at closing', isAllowedByPolicy: true, isSufficient: true }
      ],
      appliedCompensators: ['Variance within 2% tolerance', 'Title company confirmed coverage will be adjusted at closing'],
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
  hardExceptions: 0,
  softExceptions: 1,
  
  permittedCompensators: [
    { id: 'PC-001', type: 'lower_ltv', description: 'Lower LTV (current: 76.9%)', isAllowedByPolicy: true, isSufficient: true, value: '76.9%', minimumRequired: '80%' },
    { id: 'PC-002', type: 'higher_dscr', description: 'Higher DSCR (current: 1.25)', isAllowedByPolicy: true, isSufficient: true, value: 1.25, minimumRequired: 1.0 },
    { id: 'PC-003', type: 'excess_liquidity', description: 'Excess Liquidity ($125,000)', isAllowedByPolicy: true, isSufficient: true, value: '$125,000', minimumRequired: '$50,000' },
    { id: 'PC-004', type: 'proven_experience', description: 'Proven Borrower Experience (Tier 2)', isAllowedByPolicy: true, isSufficient: true, value: 'Tier 2' },
  ],
  
  crossRiskReconciliation: {
    isConsistent: true,
    inconsistencies: [],
    requiresManualReview: false,
    reconciliationStatus: 'pass'
  },
  
  authorityRouting: {
    requiredAuthority: 'underwriter',
    authorityLabel: 'Underwriter',
    reason: 'Standard loan with 1 approved soft exception, within underwriter delegation limits (≤2 soft exceptions)',
    exceptionCount: 1,
    hardExceptionCount: 0,
    softExceptionCount: 1,
    canAIAutoApprove: false,
    nonDelegableItems: [],
    delegationChain: [
      { level: 'automated', name: 'AI Validation Engine', approved: true, approvedAt: '2024-01-16T08:00:00Z', decision: 'Recommend Approval' },
      { level: 'underwriter', name: 'Sarah Johnson', approved: true, approvedAt: '2024-01-16T10:30:00Z', decision: 'Approved with Conditions' },
    ],
    authorityMatrix: [
      { riskProfile: 'No Exceptions', exceptionRange: '0', requiredApproval: 'automated', canAIApprove: true, restrictions: [] },
      { riskProfile: '≤2 SOFT Exceptions', exceptionRange: '1-2 soft', requiredApproval: 'underwriter', canAIApprove: false, restrictions: [] },
      { riskProfile: 'Multiple Exceptions', exceptionRange: '>2 soft', requiredApproval: 'credit_committee', canAIApprove: false, restrictions: [] },
      { riskProfile: 'Policy Override', exceptionRange: 'Any', requiredApproval: 'executive', canAIApprove: false, restrictions: ['Fraud exceptions', 'Title defects', 'Authority stacking prohibited'] },
    ]
  },
  
  manualDecisionRecord: {
    decision: 'approved_with_conditions',
    rationale: 'Loan meets all credit, collateral, and operational requirements. One minor soft exception related to CPL coverage variance has been approved with valid compensating factors.',
    compensatingFactorsSelected: ['Variance within 2% tolerance', 'Title company confirmed coverage adjustment'],
    policyCitation: 'CPL-001: Coverage variance within 2% is acceptable with documented cure commitment',
    approverIdentity: 'Sarah Johnson',
    approverRole: 'underwriter',
    timestamp: '2024-01-16T10:30:00Z',
    isValid: true,
    missingFields: []
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
      dueDate: '2024-01-20',
      isMeasurable: true,
      isVerifiable: true,
      responsiblePhase: 8,
      blocksCloseToClose: true
    },
    {
      id: 'COND-002',
      description: 'Verify flood insurance policy effective date aligns with closing date',
      category: 'prior_to_closing',
      status: 'satisfied',
      satisfiedAt: '2024-01-16T11:00:00Z',
      satisfiedBy: 'Insurance Team',
      isMeasurable: true,
      isVerifiable: true,
      responsiblePhase: 9,
      blocksCloseToClose: false
    }
  ],
  
  remediationRequests: [],
  
  lockedFields: [
    { fieldName: 'loanAmount', displayName: 'Loan Amount', value: 500000, lockedAt: '2024-01-16T10:31:00Z', lockedBy: 'System', requiresExecutiveOverride: true, changeTriggersReUnderwrite: true, reUnderwriteFromPhase: 5 },
    { fieldName: 'borrowerEntity', displayName: 'Borrower Entity', value: 'Tech Corp Ltd', lockedAt: '2024-01-16T10:31:00Z', lockedBy: 'System', requiresExecutiveOverride: true, changeTriggersReUnderwrite: true, reUnderwriteFromPhase: 1 },
    { fieldName: 'propertyAddress', displayName: 'Property Address', value: '123 Main St, Los Angeles, CA 90001', lockedAt: '2024-01-16T10:31:00Z', lockedBy: 'System', requiresExecutiveOverride: true, changeTriggersReUnderwrite: true, reUnderwriteFromPhase: 5 },
    { fieldName: 'appraisedValue', displayName: 'Appraised Value', value: 650000, lockedAt: '2024-01-16T10:31:00Z', lockedBy: 'System', requiresExecutiveOverride: true, changeTriggersReUnderwrite: true, reUnderwriteFromPhase: 5 },
    { fieldName: 'insuranceCoverage', displayName: 'Insurance Coverage', value: 650000, lockedAt: '2024-01-16T10:31:00Z', lockedBy: 'System', requiresExecutiveOverride: true, changeTriggersReUnderwrite: true, reUnderwriteFromPhase: 9 },
  ],
  
  approvalMemo: {
    generatedAt: '2024-01-16T10:35:00Z',
    generatedBy: 'System',
    loanId: 'LOA-2024-001',
    borrowerName: 'Tech Corp Ltd',
    borrowerEntity: 'Tech Corp Ltd',
    loanAmount: 500000,
    loanType: 'DSCR',
    loanPurpose: 'Purchase',
    propertyAddress: '123 Main St, Los Angeles, CA 90001',
    decision: 'approved_with_conditions',
    decisionRationale: 'Loan meets all credit, collateral, and operational requirements. One minor exception related to CPL coverage variance has been approved with compensating factors. Conditions have been established to ensure full compliance prior to funding.',
    riskSummary: 'Overall risk profile: LOW. All phases passed with one minor exception requiring documentation correction. No hard stops or critical issues identified.',
    phaseResults: [
      { phase: 1, name: 'Borrower Eligibility', result: 'PASS' },
      { phase: 2, name: 'Experience Tiering', result: 'PASS' },
      { phase: 3, name: 'Credit Review', result: 'PASS' },
      { phase: 4, name: 'Non-Owner Occupancy', result: 'PASS' },
      { phase: 5, name: 'Collateral Review', result: 'PASS' },
      { phase: 6, name: 'DSCR Cash Flow', result: 'PASS' },
      { phase: 7, name: 'Title Insurance', result: 'PASS' },
      { phase: 8, name: 'Closing Protection', result: 'PASS WITH EXCEPTION' },
      { phase: 9, name: 'Insurance Policy', result: 'PASS' },
      { phase: 10, name: 'Asset Verification', result: 'PASS' },
    ],
    exceptionsApproved: 1,
    exceptionLog: [{ id: 'EXC-001', description: 'CPL coverage variance (1%)', status: 'Approved' }],
    compensatingFactors: ['Variance within 2% tolerance', 'Title company confirmed coverage adjustment'],
    conditionsCount: 2,
    conditionsToFunding: ['Obtain updated CPL with correct coverage amount'],
    approvalChain: [
      { role: 'AI Validation', name: 'System', decision: 'Recommend Approval', timestamp: '2024-01-16T08:00:00Z' },
      { role: 'Underwriter', name: 'Sarah Johnson', decision: 'Approved with Conditions', timestamp: '2024-01-16T10:30:00Z' }
    ],
    version: '1.0',
    isImmutable: true
  },
  
  clearToCloseGate: {
    finalState: 'approved_with_conditions',
    allConditionsMet: false,
    pendingConditions: 1,
    status: 'pending',
    eligibleForPhase12: false,
    gateMessage: 'Approved with conditions - 1 condition pending. Clear to Close will be eligible once all conditions are satisfied.',
    lastEvaluatedAt: '2024-01-16T10:35:00Z'
  },
  
  auditTrail: [
    { id: 'AUD-001', timestamp: '2024-01-16T08:00:00Z', action: 'Phase 11 Initiated', performedBy: 'System', details: 'Final Approval phase started - consolidating results from phases 1-10', isImmutable: true, step: '11.1' },
    { id: 'AUD-002', timestamp: '2024-01-16T08:01:00Z', action: 'Phase Completion Gate Passed', performedBy: 'System', details: 'All 10 phases have executed with terminal states', isImmutable: true, step: '11.1' },
    { id: 'AUD-003', timestamp: '2024-01-16T08:02:00Z', action: 'Exception Aggregation Complete', performedBy: 'System', details: 'Consolidated 1 exception across 6 risk categories', isImmutable: true, step: '11.2' },
    { id: 'AUD-004', timestamp: '2024-01-16T08:03:00Z', action: 'Hard Stop Check Passed', performedBy: 'System', details: 'No unresolved hard stops detected', isImmutable: true, step: '11.3' },
    { id: 'AUD-005', timestamp: '2024-01-16T08:04:00Z', action: 'Compensating Factor Evaluated', performedBy: 'System', details: 'Exception EXC-001: Compensators allowed and sufficient', isImmutable: true, step: '11.4' },
    { id: 'AUD-006', timestamp: '2024-01-16T08:05:00Z', action: 'Authority Routing Determined', performedBy: 'System', details: '1 soft exception - Underwriter approval required', isImmutable: true, step: '11.5' },
    { id: 'AUD-007', timestamp: '2024-01-16T09:30:00Z', action: 'Exception Approved', performedBy: 'Sarah Johnson', details: 'Exception EXC-001 approved with compensating factors', isImmutable: true, step: '11.4' },
    { id: 'AUD-008', timestamp: '2024-01-16T10:28:00Z', action: 'Cross-Risk Reconciliation Passed', performedBy: 'System', details: 'No inconsistencies detected across risk categories', isImmutable: true, step: '11.7' },
    { id: 'AUD-009', timestamp: '2024-01-16T10:30:00Z', action: 'Manual Decision Captured', performedBy: 'Sarah Johnson', details: 'Decision: Approved with Conditions. All required fields present.', isImmutable: true, step: '11.6' },
    { id: 'AUD-010', timestamp: '2024-01-16T10:30:00Z', action: 'Final Decision Rendered', performedBy: 'Sarah Johnson', details: 'Loan approved with conditions', isImmutable: true, step: '11.8' },
    { id: 'AUD-011', timestamp: '2024-01-16T10:31:00Z', action: 'Conditions Registered', performedBy: 'System', details: '2 conditions registered (1 prior to funding, 1 prior to closing)', isImmutable: true, step: '11.9' },
    { id: 'AUD-012', timestamp: '2024-01-16T10:32:00Z', action: 'Data Fields Locked', performedBy: 'System', details: 'Loan amount, borrower entity, property address, appraised value, insurance coverage locked', fieldLocked: 'loanAmount, borrowerEntity, propertyAddress, appraisedValue, insuranceCoverage', isImmutable: true, step: '11.11' },
    { id: 'AUD-013', timestamp: '2024-01-16T10:35:00Z', action: 'Approval Memo Generated', performedBy: 'System', details: 'Final approval memo generated and stored (version 1.0)', isImmutable: true, step: '11.12' },
    { id: 'AUD-014', timestamp: '2024-01-16T10:35:00Z', action: 'Clear-to-Close Gate Evaluated', performedBy: 'System', details: 'Status: Pending - 1 condition outstanding', isImmutable: true, step: '11.13' },
  ],
  
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

const getPhaseStatusIcon = (status: PhaseTerminalState) => {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'pass_with_exception':
      return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    case 'manual_review_required':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'fail':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'not_run':
      return <Ban className="h-4 w-4 text-muted-foreground" />;
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
    crossPhaseInputs: false,
    phaseCompletionGate: false,
    phaseOutcomes: true,
    riskSummary: true,
    hardStops: false,
    exceptions: true,
    compensatingFactors: false,
    crossRiskReconciliation: false,
    authority: true,
    conditions: true,
    clearToClose: true,
    lockedFields: false,
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
            <h2 className="text-xl font-semibold">Phase 11: Final Approval & Exception Management</h2>
            <p className="text-sm text-muted-foreground">
              Consolidates all risk data, manages exceptions, and produces the final credit decision
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
                  <AlertOctagon className="h-3 w-3 mr-1" />
                  HARD STOP
                </Badge>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-6 gap-3 mt-6">
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{passedChecks}</p>
              <p className="text-xs text-muted-foreground">Checks Passed</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold">{totalChecks}</p>
              <p className="text-xs text-muted-foreground">Total Checks</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-amber-600">{data.softExceptions}</p>
              <p className="text-xs text-muted-foreground">Soft Exceptions</p>
            </div>
            <div className="text-center p-3 bg-background rounded-lg border">
              <p className="text-2xl font-bold text-red-600">{data.hardExceptions}</p>
              <p className="text-xs text-muted-foreground">Hard Exceptions</p>
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

      {/* Cross-Phase Inputs (Step 11 Dependencies) */}
      <Card>
        <Collapsible open={expandedSections.crossPhaseInputs} onOpenChange={() => toggleSection('crossPhaseInputs')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Cross-Phase Input Dependencies
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{data.crossPhaseInputs.length} Sources</Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.crossPhaseInputs ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">Input Data</th>
                      <th className="text-left py-2 px-3 font-medium">Source Phase</th>
                      <th className="text-left py-2 px-3 font-medium">Source System</th>
                      <th className="text-left py-2 px-3 font-medium">Value</th>
                      <th className="text-left py-2 px-3 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.crossPhaseInputs.map((input, idx) => (
                      <tr key={idx} className="border-b last:border-b-0 hover:bg-muted/30">
                        <td className="py-2 px-3 font-medium">{input.dataField}</td>
                        <td className="py-2 px-3">
                          <Badge variant="outline" className="text-xs">Phase {input.sourcePhase}</Badge>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{input.sourceSystem}</td>
                        <td className="py-2 px-3 font-mono text-xs">{String(input.value)}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{input.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Phase Completion Gate (Step 11.1) */}
      <Card className={data.phaseCompletionGate.gateResult === 'proceed' ? 'border-green-200' : 'border-red-200'}>
        <Collapsible open={expandedSections.phaseCompletionGate} onOpenChange={() => toggleSection('phaseCompletionGate')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {data.phaseCompletionGate.gateResult === 'proceed' ? (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <ShieldX className="h-4 w-4 text-red-600" />
                  )}
                  Step 11.1: Global Phase Completion Gate
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={data.phaseCompletionGate.gateResult === 'proceed' ? 'default' : 'destructive'} 
                         className={data.phaseCompletionGate.gateResult === 'proceed' ? 'bg-green-600' : ''}>
                    {data.phaseCompletionGate.gateResult === 'proceed' ? 'PASSED' : data.phaseCompletionGate.gateResult.toUpperCase().replace('_', ' ')}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.phaseCompletionGate ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border">
                <p className="text-sm">{data.phaseCompletionGate.gateMessage}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg border bg-background">
                  <p className="text-xs text-muted-foreground mb-1">All Phases Executed</p>
                  <div className="flex items-center gap-2">
                    {data.phaseCompletionGate.allPhasesExecuted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{data.phaseCompletionGate.allPhasesExecuted ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border bg-background">
                  <p className="text-xs text-muted-foreground mb-1">Phases Not Run</p>
                  <span className="font-medium">
                    {data.phaseCompletionGate.phasesNotRun.length === 0 ? 'None' : data.phaseCompletionGate.phasesNotRun.join(', ')}
                  </span>
                </div>
                <div className="p-3 rounded-lg border bg-background">
                  <p className="text-xs text-muted-foreground mb-1">Missing Terminal State</p>
                  <span className="font-medium">
                    {data.phaseCompletionGate.phasesWithoutTerminalState.length === 0 ? 'None' : data.phaseCompletionGate.phasesWithoutTerminalState.join(', ')}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Decision Logic</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Any phase NOT RUN</span>
                    <Badge variant="destructive" className="text-xs">HARD STOP – Suspend</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Any phase FAIL (non-curable)</span>
                    <Badge variant="destructive" className="text-xs">DECLINE</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Any phase MANUAL REVIEW REQUIRED</span>
                    <Badge variant="outline" className="text-xs">Route to Step 11.4</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
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
                    {data.phaseOutcomes.filter(p => p.status === 'pass' || p.status === 'pass_with_exception').length}/{data.phaseOutcomes.length} Passed
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
                      phase.status === 'pass_with_exception' ? 'bg-amber-50/50 border-amber-100' :
                      phase.status === 'fail' ? 'bg-red-50/50 border-red-100' :
                      phase.status === 'manual_review_required' ? 'bg-blue-50/50 border-blue-100' :
                      'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-xs font-medium border">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{phase.phaseName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{getPhaseStateLabel(phase.status)}</Badge>
                          {phase.exceptionCount > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {phase.softExceptionCount} soft, {phase.hardExceptionCount} hard
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {phase.isHardStop && (
                        <Badge variant="destructive" className="text-xs">Hard Stop</Badge>
                      )}
                      {getPhaseStatusIcon(phase.status)}
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
                      {risk.hardExceptions > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {risk.hardExceptions} Hard
                        </Badge>
                      )}
                      {risk.softExceptions > 0 && (
                        <Badge className="text-xs bg-amber-600">
                          {risk.softExceptions} Soft
                        </Badge>
                      )}
                      {risk.status === 'pass' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : risk.status === 'fail' ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
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

      {/* Hard Stops (Step 11.3) */}
      <Card className={data.hardStops.length > 0 ? 'border-red-200' : ''}>
        <Collapsible open={expandedSections.hardStops} onOpenChange={() => toggleSection('hardStops')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4" />
                  Step 11.3: Hard Stop Enforcement
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={data.hardStops.length === 0 ? 'default' : 'destructive'} 
                         className={data.hardStops.length === 0 ? 'bg-green-600' : ''}>
                    {data.hardStops.length === 0 ? 'No Hard Stops' : `${data.hardStops.length} Hard Stops`}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.hardStops ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {data.hardStops.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No hard stops detected. Approval may proceed.</p>
                </div>
              ) : (
                data.hardStops.map((hardStop) => (
                  <div key={hardStop.id} className="p-4 rounded-lg border border-red-200 bg-red-50/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{hardStop.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Phase {hardStop.sourcePhase} • Detected: {formatDate(hardStop.detectedAt)}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {hardStop.isOverrideable ? 'Overrideable' : 'Non-Overrideable'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Non-Overrideable Hard Stops (AI Cannot Approve)</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Borrower identity mismatch</li>
                  <li>• Fraud indicators (Phase 10)</li>
                  <li>• Title ownership unresolved</li>
                  <li>• Missing CPL or Insurance</li>
                  <li>• Appraisal manipulation or invalid value</li>
                  <li>• Insurance RCV below policy minimum</li>
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Exceptions Management (Step 11.2) */}
      <Card>
        <Collapsible open={expandedSections.exceptions} onOpenChange={() => toggleSection('exceptions')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Step 11.2: Exception Aggregation & Management
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
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Phase {exception.originPhase}: {exception.phaseName}</span>
                            <span>•</span>
                            <span>Policy: {exception.policyRuleId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={exception.severity === 'hard' ? 'destructive' : 'default'}
                          className={exception.severity === 'soft' ? 'bg-amber-600' : ''}
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
                    
                    <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                      <div className="p-2 rounded bg-background border">
                        <p className="text-muted-foreground">Curable</p>
                        <p className="font-medium">{exception.isCurable ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="p-2 rounded bg-background border">
                        <p className="text-muted-foreground">Compensator Allowed</p>
                        <p className="font-medium">{exception.isCompensatorAllowed ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="p-2 rounded bg-background border">
                        <p className="text-muted-foreground">Risk Category</p>
                        <p className="font-medium">{getRiskCategoryLabel(exception.riskCategory)}</p>
                      </div>
                    </div>
                    
                    {exception.compensatingFactors && exception.compensatingFactors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Compensating Factors (Step 11.4):</p>
                        <ul className="text-sm space-y-1">
                          {exception.compensatingFactors.map((factor) => (
                            <li key={factor.id} className="flex items-center gap-2">
                              {factor.isSufficient ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                              <span>{factor.description}</span>
                              <Badge variant="outline" className="text-xs ml-auto">
                                {factor.isAllowedByPolicy ? 'Policy Allowed' : 'Not Allowed'}
                              </Badge>
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
                        {exception.notes && (
                          <span className="italic">{exception.notes}</span>
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

      {/* Compensating Factors (Step 11.4) */}
      <Card>
        <Collapsible open={expandedSections.compensatingFactors} onOpenChange={() => toggleSection('compensatingFactors')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Step 11.4: Compensating Factor Evaluation
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {data.permittedCompensators.filter(c => c.isSufficient).length}/{data.permittedCompensators.length} Sufficient
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.compensatingFactors ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {data.permittedCompensators.map((comp) => (
                  <div key={comp.id} className={`p-3 rounded-lg border ${comp.isSufficient ? 'bg-green-50/30 border-green-200' : 'bg-amber-50/30 border-amber-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{comp.description}</span>
                      {comp.isSufficient ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {comp.value && <span>Value: <strong>{String(comp.value)}</strong></span>}
                      {comp.minimumRequired && <span>Min Required: {String(comp.minimumRequired)}</span>}
                    </div>
                    <Badge variant="outline" className="text-xs mt-2">
                      {comp.isAllowedByPolicy ? 'Policy Allowed' : 'Not Allowed by Policy'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Permitted Compensators</p>
                <ul className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <li>• Lower LTV</li>
                  <li>• Higher DSCR</li>
                  <li>• Excess liquidity</li>
                  <li>• Additional guarantor</li>
                  <li>• Proven borrower experience</li>
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Cross-Risk Reconciliation (Step 11.7) */}
      <Card className={data.crossRiskReconciliation.requiresManualReview ? 'border-amber-200' : ''}>
        <Collapsible open={expandedSections.crossRiskReconciliation} onOpenChange={() => toggleSection('crossRiskReconciliation')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Step 11.7: Cross-Risk Reconciliation
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={data.crossRiskReconciliation.isConsistent ? 'default' : 'destructive'}
                         className={data.crossRiskReconciliation.isConsistent ? 'bg-green-600' : ''}>
                    {data.crossRiskReconciliation.reconciliationStatus.toUpperCase().replace('_', ' ')}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.crossRiskReconciliation ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {data.crossRiskReconciliation.isConsistent ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>All risk dimensions are internally consistent. No contradictions detected.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.crossRiskReconciliation.inconsistencies.map((inc, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-amber-200 bg-amber-50/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getRiskCategoryLabel(inc.category1)}</Badge>
                          <ArrowRight className="h-3 w-3" />
                          <Badge variant="outline">{getRiskCategoryLabel(inc.category2)}</Badge>
                        </div>
                        <Badge variant={inc.severity === 'high' ? 'destructive' : 'default'}>
                          {inc.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm">{inc.description}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Validation Rule</p>
                <p className="text-xs text-muted-foreground">
                  AI confirms Credit, Collateral, Liquidity, Legal, Insurance, Fraud risk outputs are internally consistent. 
                  Contradictions (e.g., high risk score with auto-approve) route to Manual Review.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Approval Authority (Step 11.5) */}
      <Card>
        <Collapsible open={expandedSections.authority} onOpenChange={() => toggleSection('authority')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Step 11.5: Approval Authority Routing
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
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="p-2 rounded bg-background border text-center">
                    <p className="text-xs text-muted-foreground">Total Exceptions</p>
                    <p className="font-bold">{data.authorityRouting.exceptionCount}</p>
                  </div>
                  <div className="p-2 rounded bg-background border text-center">
                    <p className="text-xs text-muted-foreground">Soft Exceptions</p>
                    <p className="font-bold text-amber-600">{data.authorityRouting.softExceptionCount}</p>
                  </div>
                  <div className="p-2 rounded bg-background border text-center">
                    <p className="text-xs text-muted-foreground">Hard Exceptions</p>
                    <p className="font-bold text-red-600">{data.authorityRouting.hardExceptionCount}</p>
                  </div>
                </div>
              </div>
              
              {/* Authority Matrix */}
              <div className="p-4 rounded-lg border bg-muted/20">
                <p className="text-sm font-medium mb-3">Authority Matrix</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Risk Profile</th>
                        <th className="text-left py-2 px-2">Exception Range</th>
                        <th className="text-left py-2 px-2">Required Approval</th>
                        <th className="text-left py-2 px-2">AI Can Approve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.authorityRouting.authorityMatrix.map((entry, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="py-2 px-2 font-medium">{entry.riskProfile}</td>
                          <td className="py-2 px-2">{entry.exceptionRange}</td>
                          <td className="py-2 px-2">
                            <Badge variant="outline" className="text-xs">{getAuthorityLabel(entry.requiredApproval)}</Badge>
                          </td>
                          <td className="py-2 px-2">
                            {entry.canAIApprove ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium">Approval Chain</p>
                <div className="flex items-center gap-2 flex-wrap">
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
                          {step.decision && (
                            <p className="text-xs text-green-600">{step.decision}</p>
                          )}
                        </div>
                      </div>
                      {idx < data.authorityRouting.delegationChain.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {data.authorityRouting.nonDelegableItems.length > 0 && (
                <div className="p-3 rounded-lg border border-red-200 bg-red-50/30">
                  <p className="text-xs font-medium text-red-800 mb-2">Non-Delegable Items (AI Cannot Approve)</p>
                  <ul className="space-y-1 text-xs text-red-700">
                    {data.authorityRouting.nonDelegableItems.map((item, idx) => (
                      <li key={idx}>• {item.description} - Requires: {getAuthorityLabel(item.minimumAuthority)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Conditions (Step 11.9) */}
      {data.conditions.length > 0 && (
        <Card>
          <Collapsible open={expandedSections.conditions} onOpenChange={() => toggleSection('conditions')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Step 11.9: Conditional Approval Engine
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
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {condition.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                            {condition.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(condition.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            {condition.responsiblePhase && (
                              <span>Responsible: Phase {condition.responsiblePhase}</span>
                            )}
                            {condition.blocksCloseToClose && (
                              <Badge variant="destructive" className="text-xs">Blocks CTC</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <Badge variant="outline" className={condition.isMeasurable ? 'border-green-300' : 'border-red-300'}>
                              {condition.isMeasurable ? '✓' : '✗'} Measurable
                            </Badge>
                            <Badge variant="outline" className={condition.isVerifiable ? 'border-green-300' : 'border-red-300'}>
                              {condition.isVerifiable ? '✓' : '✗'} Verifiable
                            </Badge>
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
                <div className="p-3 rounded-lg border bg-muted/20">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Condition Rules</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Conditions must be Measurable and Verifiable</li>
                    <li>• Conditions must be assigned to a responsible phase</li>
                    <li>• Unmet conditions block Clear to Close</li>
                  </ul>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Clear-to-Close Gate (Step 11.13) */}
      <Card className={data.clearToCloseGate.eligibleForPhase12 ? 'border-green-200' : 'border-amber-200'}>
        <Collapsible open={expandedSections.clearToClose} onOpenChange={() => toggleSection('clearToClose')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Step 11.13: Clear-to-Close Eligibility Gate
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={data.clearToCloseGate.eligibleForPhase12 ? 'default' : 'secondary'}
                         className={data.clearToCloseGate.eligibleForPhase12 ? 'bg-green-600' : ''}>
                    {getClearToCloseLabel(data.clearToCloseGate.status)}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.clearToClose ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className={`p-4 rounded-lg border ${data.clearToCloseGate.eligibleForPhase12 ? 'bg-green-50/30 border-green-200' : 'bg-amber-50/30 border-amber-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {data.clearToCloseGate.eligibleForPhase12 ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <Clock className="h-6 w-6 text-amber-600" />
                  )}
                  <div>
                    <p className="font-bold text-lg">{getClearToCloseLabel(data.clearToCloseGate.status)}</p>
                    <p className="text-sm text-muted-foreground">{data.clearToCloseGate.gateMessage}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded bg-background border text-center">
                    <p className="text-xs text-muted-foreground">Final State</p>
                    <Badge variant="outline" className={getDecisionColor(data.clearToCloseGate.finalState)}>
                      {data.clearToCloseGate.finalState.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="p-2 rounded bg-background border text-center">
                    <p className="text-xs text-muted-foreground">Pending Conditions</p>
                    <p className="font-bold text-amber-600">{data.clearToCloseGate.pendingConditions}</p>
                  </div>
                  <div className="p-2 rounded bg-background border text-center">
                    <p className="text-xs text-muted-foreground">All Conditions Met</p>
                    <p className="font-bold">{data.clearToCloseGate.allConditionsMet ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-muted/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Clear-to-Close Logic</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Final State</th>
                        <th className="text-left py-2 px-2">Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-2">APPROVED</td>
                        <td className="py-2 px-2"><Badge className="bg-green-600 text-xs">Eligible for Phase 12</Badge></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">APPROVED WITH CONDITIONS (met)</td>
                        <td className="py-2 px-2"><Badge className="bg-green-600 text-xs">Eligible</Badge></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-2">SUSPENDED</td>
                        <td className="py-2 px-2"><Badge variant="secondary" className="text-xs">Not eligible</Badge></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2">DECLINED</td>
                        <td className="py-2 px-2"><Badge variant="destructive" className="text-xs">File closed</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Locked Fields (Step 11.11) */}
      {data.lockedFields.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <Collapsible open={expandedSections.lockedFields} onOpenChange={() => toggleSection('lockedFields')}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-amber-100/50 transition-colors">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-600" />
                    Step 11.11: Final Data Lock
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-300">
                      {data.lockedFields.length} Fields Locked
                    </Badge>
                    <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.lockedFields ? '' : '-rotate-90'}`} />
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-muted-foreground">
                  The following fields have been locked post-approval. Any change triggers automatic re-underwrite.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {data.lockedFields.map((field) => (
                    <div key={field.fieldName} className="flex items-center justify-between p-3 rounded-lg border bg-background">
                      <div className="flex items-center gap-3">
                        <Lock className="h-4 w-4 text-amber-600" />
                        <div>
                          <p className="font-medium text-sm">{field.displayName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{String(field.value)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {field.changeTriggersReUnderwrite && (
                          <Badge variant="outline" className="text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Re-UW from Phase {field.reUnderwriteFromPhase}
                          </Badge>
                        )}
                        {field.requiresExecutiveOverride && (
                          <Badge variant="destructive" className="text-xs">Executive Override</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  <ListChecks className="h-4 w-4" />
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
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{entry.action}</span>
                          {entry.step && (
                            <Badge variant="outline" className="text-xs">Step {entry.step}</Badge>
                          )}
                          {entry.isImmutable && (
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
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

      {/* Approval Memo (Step 11.12) */}
      <Card>
        <Collapsible open={expandedSections.memo} onOpenChange={() => toggleSection('memo')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Step 11.12: Approval Memo
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
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">Loan Approval Memo</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">v{data.approvalMemo.version}</Badge>
                    {data.approvalMemo.isImmutable && (
                      <Badge variant="secondary">
                        <Lock className="h-3 w-3 mr-1" />
                        Immutable
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Loan ID</p>
                    <p className="font-medium">{data.approvalMemo.loanId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Borrower Entity</p>
                    <p className="font-medium">{data.approvalMemo.borrowerEntity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Amount</p>
                    <p className="font-medium">${data.approvalMemo.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Type / Purpose</p>
                    <p className="font-medium">{data.approvalMemo.loanType} - {data.approvalMemo.loanPurpose}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Property Address</p>
                    <p className="font-medium">{data.approvalMemo.propertyAddress}</p>
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
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Phase-by-Phase Results</p>
                    <div className="grid grid-cols-2 gap-2">
                      {data.approvalMemo.phaseResults.map((pr) => (
                        <div key={pr.phase} className="flex items-center justify-between text-xs p-2 rounded bg-background border">
                          <span>Phase {pr.phase}: {pr.name}</span>
                          <Badge variant="outline" className="text-xs">{pr.result}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {data.approvalMemo.exceptionLog.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Exception Log</p>
                      <ul className="text-sm space-y-1">
                        {data.approvalMemo.exceptionLog.map((ex) => (
                          <li key={ex.id} className="flex items-center justify-between">
                            <span>{ex.id}: {ex.description}</span>
                            <Badge variant="outline" className="text-xs">{ex.status}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {data.approvalMemo.compensatingFactors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Compensating Factors</p>
                      <ul className="text-sm">
                        {data.approvalMemo.compensatingFactors.map((cf, idx) => (
                          <li key={idx}>• {cf}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {data.approvalMemo.conditionsToFunding.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Conditions to Funding</p>
                      <ul className="text-sm">
                        {data.approvalMemo.conditionsToFunding.map((ctf, idx) => (
                          <li key={idx}>• {ctf}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Approval Chain (Signatures)</p>
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
    </div>
  );
};

export default FinalApprovalTab;
