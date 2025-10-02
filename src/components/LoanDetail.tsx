import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { JsonViewer } from "@/components/JsonViewer";
import { ValidationSidePanel } from "@/components/ValidationSidePanel";
import { mockLoans, Signatory } from "@/types/loan";
import { ArrowLeft, Play, CheckSquare, Clock, User, Settings, AlertTriangle, CheckCircle, Building, Users, CreditCard, FileText } from "lucide-react";
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
              Entity Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
              <div>
                <p className="font-medium">{phase.eligibilityData.entityName}</p>
                <p className="text-sm text-muted-foreground">Entity Name</p>
              </div>
              <div className="flex items-center space-x-2">
                {phase.eligibilityData.entityNameValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <Badge variant={phase.eligibilityData.entityNameValid ? "default" : "destructive"}>
                  {phase.eligibilityData.entityNameValid ? "Valid" : "Requires Review"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div>
                  <p className="font-medium">{phase.eligibilityData.ein}</p>
                  <p className="text-sm text-muted-foreground">EIN</p>
                </div>
                <div className="flex items-center space-x-2">
                  {phase.eligibilityData.einValidated ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <Badge variant={phase.eligibilityData.einValidated ? "default" : "destructive"}>
                    {phase.eligibilityData.einValidated ? "Validated" : "Requires Review"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded">
                <div>
                  <p className="font-medium">
                    {phase.eligibilityData.entityActive && phase.eligibilityData.entityInGoodStanding 
                      ? "Active & Good Standing" 
                      : "Issues Found"}
                  </p>
                  <p className="text-sm text-muted-foreground">Entity Status</p>
                </div>
                <div className="flex items-center space-x-2">
                  {phase.eligibilityData.entityActive && phase.eligibilityData.entityInGoodStanding ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                  <Badge variant={phase.eligibilityData.entityActive && phase.eligibilityData.entityInGoodStanding ? "default" : "destructive"}>
                    {phase.eligibilityData.entityActive && phase.eligibilityData.entityInGoodStanding ? "Verified" : "Requires Review"}
                  </Badge>
                </div>
              </div>
            </div>
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
            <div className="space-y-3">
              {phase.eligibilityData.signatories.map((signatory: Signatory, index: number) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{signatory.name}</h4>
                    <div className="flex items-center space-x-2">
                      {signatory.foreignNational && (
                        <Badge variant="destructive" className="text-xs">Foreign National - Review Required</Badge>
                      )}
                      <Badge variant="outline">{signatory.ownershipPercentage}% ownership</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Citizenship:</span>
                      <p className="font-medium">{signatory.citizenship}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ID:</span>
                      <p className="font-medium">{signatory.id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Credit Score:</span>
                      <p className="font-medium flex items-center">
                        {signatory.creditScore}
                        <CreditCard className="h-4 w-4 ml-1" />
                      </p>
                    </div>
                  </div>
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
              <div className="space-y-2">
                {phase.eligibilityData.validationDocuments.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-muted/20 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{doc}</span>
                  </div>
                ))}
              </div>
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