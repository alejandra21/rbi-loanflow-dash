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
import { mockLoans, Signatory } from "@/types/loan";
import { ArrowLeft, Play, CheckSquare, Clock, User, Settings, AlertTriangle, CheckCircle, Building, Users, CreditCard, FileText, ChevronDown, Download } from "lucide-react";
import { useState } from "react";

export const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");
  const [activeTab, setActiveTab] = useState("eligibility");
  
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
      eligibility: { phase: loan.phases.eligibility, name: "Eligibility Check" },
      tiering: { phase: loan.phases.tiering, name: "Credit Tiering" },
      occupancy: { phase: loan.phases.occupancy, name: "Occupancy Verification" },
      underwriting: { phase: loan.phases.underwriting, name: "Underwriting Review" },
    };
    return phaseMap[activeTab] || phaseMap.eligibility;
  };

  const StatusTimeline = () => {
    const currentPhaseData = getCurrentPhase();
    
    return (
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
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
                  <span className="text-muted-foreground">by {event.user}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Play className="h-4 w-4 mr-2" />
              Re-execute Workflow
            </Button>
            
            {currentPhaseData.phase.status === 'manual' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setCurrentPhase(currentPhaseData.name);
                  setSidePanelOpen(true);
                }}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Manual Validation
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const EligibilityTab = ({ phase }: { phase: any }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusBadge status={phase.status} />
          <span className="font-medium">Eligibility Check</span>
          {phase.completedDate && (
            <span className="text-sm text-muted-foreground">
              Completed: {phase.completedDate}
            </span>
          )}
        </div>
      </div>

      {phase.eligibilityData && (
          <>
        {/* Entity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Entity Name & Type Validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-base">{phase.eligibilityData.entityName}</p>
                  {phase.eligibilityData.entityType && (
                    <p className="text-sm text-muted-foreground">Type: {phase.eligibilityData.entityType}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {phase.eligibilityData.entityNameValid && phase.eligibilityData.entityTypeValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <Badge variant={phase.eligibilityData.entityNameValid && phase.eligibilityData.entityTypeValid ? "default" : "destructive"}>
                    {phase.eligibilityData.entityNameValid && phase.eligibilityData.entityTypeValid ? "Valid" : "Requires Review"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
        </Card>

        {/* Signatories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Signatories
            </CardTitle>
          </CardHeader>
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
                      <p className="font-medium text-sm">{signatory.citizenship}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Credit Score</p>
                      <p className="font-medium text-sm flex items-center">
                        {signatory.creditScore}
                        <CreditCard className="h-4 w-4 ml-1" />
                      </p>
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
                      <p className="text-xs text-muted-foreground">EIN Number</p>
                      <p className="font-medium text-sm">{phase.eligibilityData.ein}</p>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">EIN Verification</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">
                          {signatory.einVerification?.verified ? 'Valid' : 'Invalid'}
                        </p>
                        {signatory.einVerification?.verified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-muted/20 rounded space-y-1">
                      <p className="text-xs text-muted-foreground">Ownership %</p>
                      <p className="font-medium text-sm">{signatory.ownershipPercentage}%</p>
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

                        {/* EIN Verification Details */}
                        {signatory.einVerification && (
                          <div className="space-y-2 pt-3 border-t">
                            <p className="font-medium">EIN Verification Details:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Provider:</span>
                                <p className="font-medium">{signatory.einVerification.provider}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="font-medium">{signatory.einVerification.verified ? 'Verified' : 'Failed'}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Verification Date:</span>
                                <p className="font-medium">{new Date(signatory.einVerification.verificationDate).toLocaleString()}</p>
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
        </Card>

        {/* Validation Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Validation Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <span className="text-sm text-muted-foreground">Document Issue Date:</span>
                <span className="font-medium">{phase.eligibilityData.documentIssuedDate}</span>
              </div>
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
        </Card>

        {/* Eligibility Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Eligibility Phase Audit Log
            </CardTitle>
          </CardHeader>
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

              {/* EIN Verifications for Signatories */}
              {phase.eligibilityData.signatories.map((signatory: Signatory, index: number) => (
                signatory.einVerification && (
                  <div key={`ein-${index}`} className="flex items-start space-x-3 p-3 bg-muted/20 rounded text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">EIN Verification - {signatory.name}</span>
                        <Badge variant={signatory.einVerification.verified ? 'default' : 'destructive'} className="text-xs">
                          {signatory.einVerification.verified ? 'Verified' : 'Failed'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(signatory.einVerification.verificationDate).toLocaleString()}</p>
                      <p className="text-xs mt-1">EIN validated via {signatory.einVerification.provider} - Match: {signatory.einVerification.matchConfidence}%</p>
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
        </Card>
      </>
      )}

      {/* JSON Viewer */}
      {phase.rawOutput && (
        <JsonViewer data={phase.rawOutput} title="Raw Workflow Output" />
      )}
    </div>
  );

  const PhaseTab = ({ phase, phaseName }: { phase: any, phaseName: string }) => (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Left Column - Data */}
      <div className="col-span-2 space-y-4">
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

      {/* Right Column - Actions */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Play className="h-4 w-4 mr-2" />
              Re-execute Workflow
            </Button>
            
            {phase.status === 'manual' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => {
                  setCurrentPhase(phaseName);
                  setSidePanelOpen(true);
                }}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Manual Validation
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              View History
            </Button>
          </CardContent>
        </Card>

        {/* Phase-specific quick info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <StatusBadge status={phase.status} size="sm" />
            </div>
            {phase.completedDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed:</span>
                <span>{phase.completedDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time:</span>
              <span>2.3s</span>
            </div>
          </CardContent>
        </Card>
      </div>
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
            <p className="text-muted-foreground">{loan.applicantName} - {formatCurrency(loan.loanAmount)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <StatusBadge status={loan.overallStatus} />
          {loan.assignedReviewer && (
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4" />
              <span>Assigned to: {loan.assignedReviewer}</span>
            </div>
          )}
        </div>
      </div>

      <StatusTimeline />

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="eligibility" className="h-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="tiering">Tiering</TabsTrigger>
              <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              <TabsTrigger value="underwriting">Underwriting</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="eligibility" className="mt-0">
                <EligibilityTab phase={loan.phases.eligibility} />
              </TabsContent>
              
              <TabsContent value="tiering" className="mt-0">
                <PhaseTab phase={loan.phases.tiering} phaseName="Credit Tiering" />
              </TabsContent>
              
              <TabsContent value="occupancy" className="mt-0">
                <PhaseTab phase={loan.phases.occupancy} phaseName="Occupancy Verification" />
              </TabsContent>
              
              <TabsContent value="underwriting" className="mt-0">
                <PhaseTab phase={loan.phases.underwriting} phaseName="Underwriting Review" />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loan.auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{entry.user}</TableCell>
                  <TableCell className="text-sm">{entry.action}</TableCell>
                  <TableCell className="text-sm">{entry.phase}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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