import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/StatusBadge";
import { JsonViewer } from "@/components/JsonViewer";
import { ValidationSidePanel } from "@/components/ValidationSidePanel";
import { ExperienceTieringCopyTab } from "@/components/ExperienceTieringCopyTab";
import { mockLoans, Signatory } from "@/types/loan";
import type { TierLevel } from "@/types/experienceTiering";
import { ArrowLeft, Play, CheckSquare, Clock, User, Settings, AlertTriangle, CheckCircle, Building, Users, CreditCard, FileText, ChevronDown, Download, AlertCircle, XCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

export const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");
  const [activeTab, setActiveTab] = useState("eligibility");
  const [isPolling, setIsPolling] = useState(false);
  const [pollingProgress, setPollingProgress] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    entity: false,
    signatories: false,
    documents: false,
    auditLog: false,
    tierSummary: false,
    entityMatch: false,
    ownership: false,
    checks: false,
    discrepancies: false,
    manualValidation: false,
    phaseLog: false,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };
  
  const loan = mockLoans.find(l => l.id === id);
  
  if (!loan) {
    return (
      <div className="text-center py-8">
        <p>Loan not found</p>
        <Button onClick={() => navigate("/")}>Back to Loan List</Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    const phases = Object.values(loan.phases);
    const completed = phases.filter(p => p.status === 'passed').length;
    return (completed / phases.length) * 100;
  };

  const getCurrentPhase = () => {
    const phaseMap: { [key: string]: { phase: any; name: string } } = {
      borrowerEligibility: { phase: loan.phases.borrowerEligibility, name: "Borrower Eligibility" },
      experienceTiering: { phase: loan.phases.experienceTiering, name: "Experience Tiering" },
      creditReview: { phase: loan.phases.creditReview, name: "Credit Review" },
      nonOwnerOccupancy: { phase: loan.phases.nonOwnerOccupancy, name: "Non-Owner Occupancy Verification" },
      collateralReview: { phase: loan.phases.collateralReview, name: "Collateral Review" },
      dscrCashFlow: { phase: loan.phases.dscrCashFlow, name: "DSCR-Specific Cash Flow Review" },
      titleInsurance: { phase: loan.phases.titleInsurance, name: "Title Insurance Verification" },
      closingProtection: { phase: loan.phases.closingProtection, name: "Closing Protection Letter" },
      insurancePolicy: { phase: loan.phases.insurancePolicy, name: "Insurance Policy Review" },
      assetVerification: { phase: loan.phases.assetVerification, name: "Asset Verification" },
      finalApproval: { phase: loan.phases.finalApproval, name: "Final Approval" },
    };
    return phaseMap[activeTab] || phaseMap.borrowerEligibility;
  };

  const handlePollingAction = async (actionType: 'workflow' | 'phase') => {
    setIsPolling(true);
    setPollingProgress(0);
    
    // Random duration between 40-60 seconds
    const duration = Math.floor(Math.random() * (60000 - 40000) + 40000);
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPollingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsPolling(false);
        setPollingProgress(0);
      }
    }, 100);
  };

  const StatusTimeline = () => {
    const currentPhaseData = getCurrentPhase();
    
    return (
      <div className="mb-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Processing Timeline</span>
                <div className="flex items-center space-x-2">
                  <div className="w-64 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{Math.round(getProgressPercentage())}%</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loan.timeline.map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-medium">{event.phase}</span>
                    <Badge variant="outline" className="text-xs">{event.status}</Badge>
                    <span className="text-muted-foreground">{event.date}</span>
                    {event.status !== 'pending' && (
                      <span className="text-muted-foreground">by {event.user}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => handlePollingAction('workflow')}
                disabled={isPolling}
              >
                {isPolling ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Re-execute Workflow
                  </>
                )}
              </Button>
              {isPolling && (
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${pollingProgress}%` }}
                  />
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => handlePollingAction('phase')}
                disabled={isPolling}
              >
                {isPolling ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Re-execute Current Phase
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const EligibilityTab = ({ phase }: { phase: any }) => {
    // Helper function to get certificate validation rules based on loan type
    const getCertificateValidationRule = (loanType: string, documentIssueDate: string) => {
      const issueDate = new Date(documentIssueDate);
      const today = new Date();
      const daysSinceIssue = Math.floor((today.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const rules: Record<string, { maxDays: number; description: string }> = {
        'Bridge': { maxDays: 90, description: 'Certificate must be issued within 90 days for Bridge loans' },
        'DSCR': { maxDays: 180, description: 'Certificate must be issued within 180 days for DSCR loans' },
        'Construction': { maxDays: 60, description: 'Certificate must be issued within 60 days for Construction loans' },
        'Fix and Flip': { maxDays: 90, description: 'Certificate must be issued within 90 days for Fix and Flip loans' }
      };
      
      const rule = rules[loanType] || { maxDays: 180, description: 'Certificate must be issued within 180 days' };
      const isValid = daysSinceIssue <= rule.maxDays;
      
      return {
        ...rule,
        daysSinceIssue,
        isValid,
        status: isValid ? 'Valid' : 'Expired'
      };
    };

    const certificateRule = phase.eligibilityData ? 
      getCertificateValidationRule(loan.loanType, phase.eligibilityData.documentIssuedDate) : 
      null;

    const downloadEligibilityData = () => {
      const eligibilityData = {
        loanId: loan.id,
        applicantName: loan.applicantName,
        loanAmount: loan.loanAmount,
        loanType: loan.loanType,
        phase: 'Eligibility',
        status: phase.status,
        completedAt: phase.completedAt,
        entityValidations: {
          entityName: phase.eligibilityData.entityName,
          entityType: phase.eligibilityData.entityType,
          entityNameValid: phase.eligibilityData.entityNameValid,
          entityTypeValid: phase.eligibilityData.entityTypeValid,
          ein: phase.eligibilityData.ein,
          einValidated: phase.eligibilityData.einValidated
        },
        ownershipAndStructure: {
          signatories: phase.eligibilityData.signatories
        },
        certificateOfGoodStanding: {
          document: phase.eligibilityData.validationDocument,
          issuedDate: phase.eligibilityData.documentIssuedDate,
          validationRule: certificateRule
        },
        auditLog: phase.auditLog
      };

      const dataStr = JSON.stringify(eligibilityData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${loan.id}-eligibility-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Eligibility Check</span>
          <StatusBadge status={phase.status} />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={downloadEligibilityData}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {phase.eligibilityData && (
          <>
        {/* Entity Information */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('entity')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Entity Validations
              </div>
              <div className="flex items-center space-x-2">
                {phase.eligibilityData.entityNameValid && phase.eligibilityData.entityTypeValid && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Validated
                  </Badge>
                )}
                {(!phase.eligibilityData.entityNameValid || !phase.eligibilityData.entityTypeValid) && (
                  <Badge variant="destructive" className="inline-flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Requires Review
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.entity ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          {expandedCards.entity && (
            <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="font-medium text-base">{phase.eligibilityData.entityName}</p>
                {phase.eligibilityData.entityType && (
                  <p className="text-sm text-muted-foreground">Type: {phase.eligibilityData.entityType}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted/30 rounded space-y-1">
                  <p className="text-xs text-muted-foreground">Entity Name</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">
                      {phase.eligibilityData.entityNameValid ? "Valid" : "Invalid"}
                    </p>
                    {phase.eligibilityData.entityNameValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded space-y-1">
                  <p className="text-xs text-muted-foreground">Entity Type</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-sm">
                      {phase.eligibilityData.entityTypeValid ? "Valid" : "Invalid"}
                    </p>
                    {phase.eligibilityData.entityTypeValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded space-y-1">
                  <p className="text-xs text-muted-foreground">EIN</p>
                  <p className="font-medium text-sm">{phase.eligibilityData.ein}</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-xs">
                      {phase.eligibilityData.einValidated ? "Valid" : "Invalid"}
                    </p>
                    {phase.eligibilityData.einValidated ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {phase.eligibilityData.entityNameValidation && (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>View Validation Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="p-3 bg-muted/20 rounded text-sm space-y-3">
                    <div>
                      <p className="font-medium mb-2">Verification Summary:</p>
                      <p className="text-xs text-muted-foreground">
                        {phase.eligibilityData.entityNameValid && phase.eligibilityData.entityTypeValid 
                          ? "Both entity name and type validations passed successfully."
                          : !phase.eligibilityData.entityNameValid && !phase.eligibilityData.entityTypeValid
                          ? "Both entity name and type validations failed. Manual review required."
                          : !phase.eligibilityData.entityNameValid
                          ? "Entity name validation failed. Entity type is valid."
                          : "Entity type validation failed. Entity name is valid."
                        }
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <p><span className="text-muted-foreground">Provider:</span> {phase.eligibilityData.entityNameValidation.provider}</p>
                      <p><span className="text-muted-foreground">Date:</span> {new Date(phase.eligibilityData.entityNameValidation.validationDate).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Match Confidence:</span> {phase.eligibilityData.entityNameValidation.matchConfidence}%</p>
                      <div className="mt-2 p-2 bg-muted/30 rounded">
                        <p className="font-medium mb-1">API Response:</p>
                        <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(phase.eligibilityData.entityNameValidation.apiResponse, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
          )}
        </Card>

        {/* Signatories */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('signatories')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Ownership & Structure Review
              </div>
              <div className="flex items-center space-x-2">
                {phase.eligibilityData.signatories.every((s: Signatory) => 
                  s.idvDetails?.status === 'verified' && s.ssnVerification?.verified && s.citizenship === 'US' && !s.ofacFlag
                ) && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Validated
                  </Badge>
                )}
                {phase.eligibilityData.signatories.some((s: Signatory) => 
                  s.idvDetails?.status !== 'verified' || !s.ssnVerification?.verified || s.citizenship !== 'US' || s.ofacFlag
                ) && (
                  <Badge variant="destructive" className="inline-flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Requires Review
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.signatories ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          {expandedCards.signatories && (
            <CardContent>
            <div className="space-y-4">
              {phase.eligibilityData.signatories.map((signatory: Signatory, index: number) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{signatory.name}</h4>
                    <Badge variant="outline">{signatory.ownershipPercentage}% ownership</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Citizenship</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{signatory.citizenship}</p>
                        {signatory.citizenship !== 'US' && (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">DOB</p>
                      <p className="font-medium text-sm">{new Date(signatory.dob).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Credit Score</p>
                      <p className="font-medium text-sm flex items-center">
                        {signatory.creditScore}
                        <CreditCard className="h-4 w-4 ml-1" />
                      </p>
                    </div>

                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">OFAC Flag</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">
                          {signatory.ofacFlag ? 'Flagged' : 'Clear'}
                        </p>
                        {signatory.ofacFlag ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">ID Document</p>
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {signatory.idvDetails?.documentType} - {signatory.idvDetails?.documentNumber}
                        </p>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">ID Verification</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">
                          {signatory.idvDetails?.status === 'verified' ? 'Valid' : 'Invalid'}
                        </p>
                        {signatory.idvDetails?.status === 'verified' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">SSN</p>
                      <p className="font-medium text-sm">{signatory.ssn}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">SSN Verification</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">
                          {signatory.ssnVerification?.verified ? 'Valid' : 'Invalid'}
                        </p>
                        {signatory.ssnVerification?.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-between">
                        <span>View Validation Details</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <div className="p-3 bg-muted/20 rounded text-sm space-y-3">
                        {/* IDV Verification Details */}
                        {signatory.idvDetails && (
                          <div className="space-y-2">
                            <p className="font-medium">ID Verification Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="font-medium">{signatory.idvDetails.status}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Provider:</span>
                                <p className="font-medium">{signatory.idvDetails.provider}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Confidence:</span>
                                <p className="font-medium">{signatory.idvDetails.confidence}%</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Verified:</span>
                                <p className="font-medium">{new Date(signatory.idvDetails.verificationDate).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Credit Score Request Details */}
                        {signatory.creditScoreRequest && (
                          <div className="space-y-2 pt-3 border-t">
                            <p className="font-medium">Credit Score Request:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Provider:</span>
                                <p className="font-medium">{signatory.creditScoreRequest.provider}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="font-medium">{signatory.creditScoreRequest.status}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Request Date:</span>
                                <p className="font-medium">{new Date(signatory.creditScoreRequest.requestDate).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SSN Verification Details */}
                        {signatory.ssnVerification && (
                          <div className="space-y-2 pt-3 border-t">
                            <p className="font-medium">SSN Verification Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Provider:</span>
                                <p className="font-medium">{signatory.ssnVerification.provider}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="font-medium">{signatory.ssnVerification.verified ? 'Verified' : 'Failed'}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Verification Date:</span>
                                <p className="font-medium">{new Date(signatory.ssnVerification.verificationDate).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </div>
          </CardContent>
          )}
        </Card>

        {/* Validation Documents */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('documents')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Certificate of Good Standing Check
              </div>
              <div className="flex items-center space-x-2">
                {phase.eligibilityData.validationDocuments.length > 0 && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Validated
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.documents ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          {expandedCards.documents && (
            <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm text-muted-foreground">Document Issue Date:</span>
                <span className="font-medium">{phase.eligibilityData.documentIssuedDate}</span>
              </div>
              
              {/* Certificate Validation Rule */}
              {certificateRule && (
                <div className={`p-3 rounded border ${certificateRule.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start space-x-2">
                    {certificateRule.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">Certificate Age Validation</span>
                        <Badge variant={certificateRule.isValid ? 'default' : 'destructive'} className="text-xs">
                          {certificateRule.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{certificateRule.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-muted-foreground">Days since issue: <span className="font-medium">{certificateRule.daysSinceIssue}</span></span>
                        <span className="text-muted-foreground">Maximum allowed: <span className="font-medium">{certificateRule.maxDays} days</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {phase.eligibilityData.validationDocuments.map((doc: any, index: number) => (
                  <div key={index} className="p-3 bg-muted/20 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">{typeof doc === 'string' ? doc : doc.name}</span>
                    </div>
                    {typeof doc === 'object' && doc.proof && (
                      <div className="ml-6 space-y-1">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Verification Method:</span>
                          <p className="font-medium">{doc.verificationMethod}</p>
                        </div>
                        <div className="text-xs mt-2 p-2 bg-muted/30 rounded">
                          <span className="text-muted-foreground">Proof:</span>
                          <p className="mt-1">{doc.proof}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Eligibility Audit Log */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('auditLog')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Eligibility Phase Audit Log
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.auditLog ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.auditLog && (
            <CardContent>
            <div className="space-y-3">
              {/* Entity Validation */}
              {phase.eligibilityData.entityNameValidation && (
                <div className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Entity Name & Type Validation</span>
                      <Badge variant="outline" className="text-xs">API Validation</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(phase.eligibilityData.entityNameValidation.validationDate).toLocaleString()}</p>
                    <p className="text-xs mt-1">Validated via {phase.eligibilityData.entityNameValidation.provider} - Match confidence: {phase.eligibilityData.entityNameValidation.matchConfidence}%</p>
                  </div>
                </div>
              )}

              {/* IDV Verifications */}
              {phase.eligibilityData.signatories.map((signatory: Signatory, index: number) => (
                signatory.idvDetails && (
                  <div key={`idv-${index}`} className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">IDV Verification - {signatory.name}</span>
                        <Badge variant={signatory.idvDetails.status === 'verified' ? 'default' : 'destructive'} className="text-xs">
                          {signatory.idvDetails.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(signatory.idvDetails.verificationDate).toLocaleString()}</p>
                      <p className="text-xs mt-1">Verified {signatory.idvDetails.documentType} via {signatory.idvDetails.provider} - Confidence: {signatory.idvDetails.confidence}%</p>
                    </div>
                  </div>
                )
              ))}

              {/* Credit Score Requests */}
              {phase.eligibilityData.signatories.map((signatory: Signatory, index: number) => (
                signatory.creditScoreRequest && (
                  <div key={`credit-${index}`} className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Credit Score Request - {signatory.name}</span>
                        <Badge variant={signatory.creditScoreRequest.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {signatory.creditScoreRequest.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(signatory.creditScoreRequest.requestDate).toLocaleString()}</p>
                      <p className="text-xs mt-1">Credit score retrieved from {signatory.creditScoreRequest.provider} - Score: {signatory.creditScore}</p>
                    </div>
                  </div>
                )
              ))}

              {/* SSN Verifications for Signatories */}
              {phase.eligibilityData.signatories.map((signatory: Signatory, index: number) => (
                signatory.ssnVerification && (
                  <div key={`ssn-${index}`} className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">SSN Verification - {signatory.name}</span>
                        <Badge variant={signatory.ssnVerification.verified ? 'default' : 'destructive'} className="text-xs">
                          {signatory.ssnVerification.verified ? 'Verified' : 'Failed'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(signatory.ssnVerification.verificationDate).toLocaleString()}</p>
                      <p className="text-xs mt-1">SSN validated via {signatory.ssnVerification.provider} - Match: {signatory.ssnVerification.matchConfidence}%</p>
                    </div>
                  </div>
                )
              ))}

              {/* Entity EIN Verification */}
              {phase.eligibilityData.einVerification && (
                <div className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Entity EIN Verification</span>
                      <Badge variant={phase.eligibilityData.einVerification.status === 'verified' ? 'default' : 'destructive'} className="text-xs">
                        {phase.eligibilityData.einVerification.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(phase.eligibilityData.einVerification.verificationDate).toLocaleString()}</p>
                    <p className="text-xs mt-1">EIN {phase.eligibilityData.ein} verified via {phase.eligibilityData.einVerification.provider}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          )}
        </Card>
      </>
      )}

      {/* JSON Viewer */}
      {phase.rawOutput && (
        <JsonViewer data={phase.rawOutput} title="Raw Workflow Output" />
      )}
    </div>
    );
  };

  const ExperienceTieringTab = ({ phase }: { phase: any }) => {
    const data = phase.experienceTieringData;
    
    if (!data) {
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="font-medium">Experience Tiering</span>
            <StatusBadge status={phase.status} />
          </div>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm">No experience tiering data available.</p>
          </div>
        </div>
      );
    }

    const getTierColor = (tier: TierLevel | null): string => {
      if (!tier) return "";
      const colors: Record<TierLevel, string> = {
        'Platinum': 'bg-gradient-to-r from-slate-400 to-slate-600 text-white',
        'Gold': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
        'Silver': 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
        'Bronze': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
      };
      return colors[tier];
    };

    const downloadExperienceTieringData = () => {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${loan.id}-experience-tiering-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium">Experience Tiering Check</span>
            {data.assigned_tier && (
              <Badge className={`${getTierColor(data.assigned_tier)} px-3 py-1 text-sm font-semibold`}>
                {data.assigned_tier}
              </Badge>
            )}
            <StatusBadge status={phase.status} />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadExperienceTieringData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Status Summary */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('tierSummary')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tier Assignment & Evaluation
              </div>
              <div className="flex items-center space-x-2">
                {data.status === 'pass' && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Passed
                  </Badge>
                )}
                {data.status === 'warn' && (
                  <Badge variant="warning" className="inline-flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Manual Review
                  </Badge>
                )}
                {data.status === 'fail' && (
                  <Badge variant="destructive" className="inline-flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Failed
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.tierSummary ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          {expandedCards.tierSummary && (
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Evaluation Outcome</div>
                <div className="text-lg font-semibold text-foreground">{data.evaluation_outcome || 'N/A'}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{data.metrics.verified_exits_count}</div>
                  <div className="text-xs text-muted-foreground mt-1">Verified Exits</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${(data.metrics.verified_volume_usd / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Verified Volume</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{data.metrics.lookback_months}</div>
                  <div className="text-xs text-muted-foreground mt-1">Lookback (Months)</div>
                </div>
              </div>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>View Validation Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="p-3 bg-muted/20 rounded text-sm space-y-4">
                    <div>
                      <p className="font-medium mb-2">Tier Assignment Summary:</p>
                      <p className="text-xs text-muted-foreground">
                        The borrower has been assigned to the <strong>{data.assigned_tier}</strong> tier based on verified transaction history 
                        and comprehensive evaluation. Over the past {data.metrics.lookback_months} months, {data.metrics.verified_exits_count} exits 
                        have been verified with a total volume of ${(data.metrics.verified_volume_usd / 1000000).toFixed(2)}M USD.
                        {data.evaluation_outcome === 'Pass' && ' The evaluation passed all required criteria.'}
                        {data.evaluation_outcome === 'Manual Review' && ' Manual review is required for final approval.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                        <p className="text-lg font-bold text-foreground">{((data.confidence_score || 0) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Exposure Limit</p>
                        <p className="text-lg font-bold text-foreground">${((data.exposure_limit_usd || 0) / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Recommended LTC Cap</p>
                        <p className="text-lg font-bold text-foreground">{data.recommended_ltc_cap || 0}%</p>
                      </div>
                      <div className="p-2 bg-muted/30 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Recommended ARV Cap</p>
                        <p className="text-lg font-bold text-foreground">{data.recommended_arv_cap || 0}%</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted/30 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">Tiering & Product Type Rules</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">
                              {data.exception_flag ? 'Exception' : 'Compliant'}
                            </p>
                            {data.exception_flag ? (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-muted/30 rounded space-y-1">
                          <p className="text-xs text-muted-foreground">Contractor Validation</p>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-sm">
                              {data.exception_flag ? 'Required' : 'Not Required'}
                            </p>
                            {data.exception_flag ? (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      {data.exception_reason && (
                        <div className="mt-3 p-3 bg-muted/30 rounded">
                          <p className="text-xs text-muted-foreground mb-1">Exception Reason</p>
                          <p className="text-sm font-medium">{data.exception_reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Component Scores (Weighted)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between p-2 bg-muted/30 rounded text-xs">
                          <span className="text-muted-foreground">Borrower Experience (60%)</span>
                          <span className="font-semibold">{(data.metrics.borrower_experience_score || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded text-xs">
                          <span className="text-muted-foreground">Guarantor Record (20%)</span>
                          <span className="font-semibold">{(data.metrics.guarantor_record_score || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded text-xs">
                          <span className="text-muted-foreground">Liquidity Ratio (10%)</span>
                          <span className="font-semibold">{(data.metrics.liquidity_ratio || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded text-xs">
                          <span className="text-muted-foreground">Performance Record (10%)</span>
                          <span className="font-semibold">{(data.metrics.performance_record_score || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t space-y-1 text-xs">
                      <p><span className="text-muted-foreground">Evaluation Date:</span> {new Date(data.ran_at).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Loan Type:</span> {loan.loanType}</p>
                      <p><span className="text-muted-foreground">Evaluated By:</span> {data.ran_by}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          )}
        </Card>

        {/* Entity Matching */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('entityMatch')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Entity Matching
              </div>
              <div className="flex items-center space-x-2">
                {data.entity_match && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Matched
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.entityMatch ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          {expandedCards.entityMatch && (
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded space-y-1">
                  <p className="text-xs text-muted-foreground">Matched Entity</p>
                  <p className="font-medium text-sm">{data.entity_match?.entityName}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded space-y-1">
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <p className="font-medium text-sm">{data.entity_match?.confidence}%</p>
                </div>
                <div className="p-3 bg-muted/30 rounded space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground">Method</p>
                  <p className="font-medium text-sm">
                    {data.entity_match?.method === 'entity_search' ? 'Entity Search' : 'Property Search Fallback'}
                  </p>
                </div>
              </div>
              
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>View Validation Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="p-3 bg-muted/20 rounded text-sm space-y-3">
                    <div>
                      <p className="font-medium mb-2">Entity Search Summary:</p>
                      <p className="text-xs text-muted-foreground">
                        The entity matching process successfully identified "{data.entity_match?.entityName}" 
                        using {data.entity_match?.method === 'entity_search' ? 'direct entity search' : 'property search fallback method'} 
                        with a confidence score of {data.entity_match?.confidence}%.
                        {data.entity_match?.alternativesCount && ` ${data.entity_match.alternativesCount} alternative matches were found.`}
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <p><span className="text-muted-foreground">Provider:</span> PrequalDat</p>
                      <p><span className="text-muted-foreground">Date:</span> {new Date(data.ran_at).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Match Confidence:</span> {data.entity_match?.confidence}%</p>
                      <div className="mt-2 p-2 bg-muted/30 rounded">
                        <p className="font-medium mb-1">API Response:</p>
                        <pre className="text-xs overflow-auto max-h-40">{JSON.stringify({
                          entity_name: data.entity_match?.entityName,
                          confidence: data.entity_match?.confidence,
                          method: data.entity_match?.method,
                          status: 'matched'
                        }, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          )}
        </Card>

        {/* Ownership Verification */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('ownership')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Ownership Verification
              </div>
              <div className="flex items-center space-x-2">
                {data.ownership_verified ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-600 inline-flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="inline-flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Not Verified
                  </Badge>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.ownership ? '' : '-rotate-90'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          {expandedCards.ownership && (
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted/30 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Owner/Key Member Confirmed:</span>
                  <span className="font-medium text-sm text-foreground">
                    {data.ownership_verified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>View Validation Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="p-3 bg-muted/20 rounded text-sm space-y-3">
                    <div>
                      <p className="font-medium mb-2">Verification Summary:</p>
                      <p className="text-xs text-muted-foreground">
                        {data.ownership_verified 
                          ? 'Borrower/guarantor has been confirmed as a listed owner or key member through OpenCorporates verification. The ownership structure meets all requirements.'
                          : 'Ownership verification failed. The borrower/guarantor could not be confirmed as a listed owner or key member.'}
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <p><span className="text-muted-foreground">Provider:</span> PrequalDat (OpenCorporates)</p>
                      <p><span className="text-muted-foreground">Verification Date:</span> {new Date(data.ran_at).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Status:</span> {data.ownership_verified ? 'Verified' : 'Failed'}</p>
                      <div className="mt-2 p-2 bg-muted/30 rounded">
                        <p className="font-medium mb-1">API Response:</p>
                        <pre className="text-xs overflow-auto max-h-40">{JSON.stringify({
                          ownership_verified: data.ownership_verified,
                          entity: data.entity_match?.entityName,
                          verification_method: 'opencorporates_api',
                          status: data.ownership_verified ? 'confirmed' : 'not_confirmed'
                        }, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          )}
        </Card>

        {/* Validation Checks */}
        <Card>
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleCard('checks')}
          >
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Validation Checks
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.checks ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.checks && (
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {data.checks.map((check: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/20 rounded">
                    {check.ok ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground">{check.name.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-muted-foreground mt-1">{check.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    <span>View Validation Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="p-3 bg-muted/20 rounded text-sm space-y-3">
                    <div>
                      <p className="font-medium mb-2">Validation Check Summary:</p>
                      <p className="text-xs text-muted-foreground">
                        A comprehensive series of {data.checks.length} validation checks were performed to assess 
                        entity matching, ownership verification, exit history, and evaluation logic. 
                        {data.checks.every((c: any) => c.ok) 
                          ? ' All checks passed successfully.' 
                          : ` ${data.checks.filter((c: any) => !c.ok).length} check(s) failed and require attention.`}
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <p><span className="text-muted-foreground">Provider:</span> PrequalDat</p>
                      <p><span className="text-muted-foreground">Date:</span> {new Date(data.ran_at).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Total Checks:</span> {data.checks.length}</p>
                      <p><span className="text-muted-foreground">Passed:</span> {data.checks.filter((c: any) => c.ok).length}</p>
                      <p><span className="text-muted-foreground">Failed:</span> {data.checks.filter((c: any) => !c.ok).length}</p>
                      <div className="mt-2 p-2 bg-muted/30 rounded">
                        <p className="font-medium mb-1">Full Check Results:</p>
                        <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(data.checks, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          )}
        </Card>

        {/* Discrepancies */}
        {data.discrepancies && data.discrepancies.length > 0 && (
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleCard('discrepancies')}
            >
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Discrepancies
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="warning" className="inline-flex items-center gap-1">
                    {data.discrepancies.length} Found
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.discrepancies ? '' : '-rotate-90'}`} />
                </div>
              </CardTitle>
            </CardHeader>
            {expandedCards.discrepancies && (
              <CardContent>
                <div className="space-y-2">
                  {data.discrepancies.map((discrepancy: any, idx: number) => (
                    <div key={idx} className="p-3 bg-warning/10 border border-warning/20 rounded">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-muted-foreground uppercase">
                            {discrepancy.type.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-foreground mt-1">{discrepancy.message}</div>
                          {discrepancy.severity && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              Severity: {discrepancy.severity}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Manual Validation */}
        {data.manual_validation?.required && (
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleCard('manualValidation')}
            >
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Manual Validation Record</div>
                    <div className="text-xs text-muted-foreground font-normal">Review details and approval status</div>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.manualValidation ? '' : '-rotate-90'}`} />
              </CardTitle>
            </CardHeader>
            {expandedCards.manualValidation && (
              <CardContent>
                <div className="space-y-4">
                  {data.manual_validation.reason && (
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">Reason</Badge>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{data.manual_validation.reason}</p>
                    </div>
                  )}
                  
                  {data.manual_validation.comment && (
                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">Comment</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{data.manual_validation.comment}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {data.manual_validation.validatedBy && (
                      <div className="p-3 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Validated By</p>
                        <p className="text-sm font-semibold">{data.manual_validation.validatedBy}</p>
                      </div>
                    )}
                    {data.manual_validation.validatedAt && (
                      <div className="p-3 rounded-lg bg-background border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Validated At</p>
                        <p className="text-sm font-semibold">
                          {new Date(data.manual_validation.validatedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

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

  const PhaseTab = ({ phase, phaseName }: { phase: any, phaseName: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusBadge status={phase.status} />
          <span className="font-medium">{phaseName}</span>
          {phase.completedDate && (
            <span className="text-sm text-muted-foreground">
              Completed: {phase.completedDate}
            </span>
          )}
        </div>
      </div>

      {phase.notes && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Notes:</p>
          <p className="text-sm">{phase.notes}</p>
        </div>
      )}

      {/* Key-Value Data */}
      {phase.keyValueData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phase Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(phase.keyValueData).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                  <dd className="text-sm font-semibold">{String(value)}</dd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON Viewer */}
      {phase.rawOutput && (
        <JsonViewer data={phase.rawOutput} title="Raw Workflow Output" />
      )}

      {phase.conditions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conditions Checked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {phase.conditions.map((condition: any, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded">
                  <span className={condition.passed ? "text-green-600" : "text-red-600"}>
                    {condition.passed ? "✓" : "✗"}
                  </span>
                  <span className="text-sm">{condition.name}</span>
                  {condition.details && (
                    <span className="text-xs text-muted-foreground">- {condition.details}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to List
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{loan.id}</h1>
            <p className="text-muted-foreground">
              {loan.phases.borrowerEligibility.eligibilityData?.entityName || loan.applicantName} - {formatCurrency(loan.loanAmount)}
              <Badge variant="outline" className="ml-3">{loan.loanType}</Badge>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <StatusBadge status={loan.overallStatus} />
        </div>
      </div>

      <StatusTimeline />

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="borrowerEligibility" className="h-full" onValueChange={setActiveTab}>
            <TabsList className="flex w-full overflow-x-auto gap-2 p-2 h-auto flex-wrap">
              <TabsTrigger value="borrowerEligibility" className="relative text-sm px-4 py-2 flex-shrink-0">
                Borrower Eligibility
                {loan.phases.borrowerEligibility.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.borrowerEligibility.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.borrowerEligibility.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="experienceTiering" className="relative text-sm px-4 py-2 flex-shrink-0">
                Experience Tiering Legacy
                {loan.phases.experienceTiering.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.experienceTiering.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.experienceTiering.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="experienceTieringCopy" className="relative text-sm px-4 py-2 flex-shrink-0">
                Experience Tiering Copy
                {loan.phases.experienceTiering.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.experienceTiering.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.experienceTiering.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="creditReview" className="relative text-sm px-4 py-2 flex-shrink-0">
                Credit Review
                {loan.phases.creditReview.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.creditReview.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.creditReview.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="nonOwnerOccupancy" className="relative text-sm px-4 py-2 flex-shrink-0">
                Non-Owner Occupancy
                {loan.phases.nonOwnerOccupancy.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.nonOwnerOccupancy.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.nonOwnerOccupancy.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="collateralReview" className="relative text-sm px-4 py-2 flex-shrink-0">
                Collateral Review
                {loan.phases.collateralReview.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.collateralReview.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.collateralReview.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="dscrCashFlow" className="relative text-sm px-4 py-2 flex-shrink-0">
                DSCR Cash Flow
                {loan.phases.dscrCashFlow.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.dscrCashFlow.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.dscrCashFlow.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="titleInsurance" className="relative text-sm px-4 py-2 flex-shrink-0">
                Title Insurance
                {loan.phases.titleInsurance.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.titleInsurance.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.titleInsurance.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="closingProtection" className="relative text-sm px-4 py-2 flex-shrink-0">
                Closing Protection
                {loan.phases.closingProtection.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.closingProtection.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.closingProtection.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="insurancePolicy" className="relative text-sm px-4 py-2 flex-shrink-0">
                Insurance Policy
                {loan.phases.insurancePolicy.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.insurancePolicy.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.insurancePolicy.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="assetVerification" className="relative text-sm px-4 py-2 flex-shrink-0">
                Asset Verification
                {loan.phases.assetVerification.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.assetVerification.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.assetVerification.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="finalApproval" className="relative text-sm px-4 py-2 flex-shrink-0">
                Final Approval
                {loan.phases.finalApproval.status === 'failed' && (
                  <AlertCircle className="h-3 w-3 ml-1 text-destructive" />
                )}
                {loan.phases.finalApproval.status === 'manual' && (
                  <AlertTriangle className="h-3 w-3 ml-1 text-warning" />
                )}
                {loan.phases.finalApproval.status === 'passed' && (
                  <CheckCircle className="h-3 w-3 ml-1 text-success" />
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="borrowerEligibility" className="mt-0">
                <EligibilityTab phase={loan.phases.borrowerEligibility} />
              </TabsContent>
              
              <TabsContent value="experienceTiering" className="mt-0">
                <ExperienceTieringTab phase={loan.phases.experienceTiering} />
              </TabsContent>
              
              <TabsContent value="experienceTieringCopy" className="mt-0">
                <ExperienceTieringCopyTab phase={loan.phases.experienceTiering} />
              </TabsContent>
              
              <TabsContent value="creditReview" className="mt-0">
                <PhaseTab phase={loan.phases.creditReview} phaseName="Credit Review" />
              </TabsContent>
              
              <TabsContent value="nonOwnerOccupancy" className="mt-0">
                <PhaseTab phase={loan.phases.nonOwnerOccupancy} phaseName="Non-Owner Occupancy Verification" />
              </TabsContent>
              
              <TabsContent value="collateralReview" className="mt-0">
                <PhaseTab phase={loan.phases.collateralReview} phaseName="Collateral Review" />
              </TabsContent>
              
              <TabsContent value="dscrCashFlow" className="mt-0">
                <PhaseTab phase={loan.phases.dscrCashFlow} phaseName="DSCR-Specific Cash Flow Review" />
              </TabsContent>
              
              <TabsContent value="titleInsurance" className="mt-0">
                <PhaseTab phase={loan.phases.titleInsurance} phaseName="Title Insurance Verification" />
              </TabsContent>
              
              <TabsContent value="closingProtection" className="mt-0">
                <PhaseTab phase={loan.phases.closingProtection} phaseName="Closing Protection Letter" />
              </TabsContent>
              
              <TabsContent value="insurancePolicy" className="mt-0">
                <PhaseTab phase={loan.phases.insurancePolicy} phaseName="Insurance Policy Review" />
              </TabsContent>
              
              <TabsContent value="assetVerification" className="mt-0">
                <PhaseTab phase={loan.phases.assetVerification} phaseName="Asset Verification" />
              </TabsContent>
              
              <TabsContent value="finalApproval" className="mt-0">
                <PhaseTab phase={loan.phases.finalApproval} phaseName="Final Approval" />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <ValidationSidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        phaseName={currentPhase}
        loanId={loan.id}
      />
    </div>
  );
};