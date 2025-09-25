import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { mockLoans } from "@/types/loan";
import { ArrowLeft, Play, CheckSquare, Clock, User } from "lucide-react";
import { useState } from "react";

export const LoanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validationNotes, setValidationNotes] = useState("");
  
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    const phases = Object.values(loan.phases);
    const completed = phases.filter(p => p.status === 'passed').length;
    return (completed / phases.length) * 100;
  };

  const StatusTimeline = () => (
    <Card className="mb-6">
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
  );

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
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Re-execute
          </Button>
          {phase.status === 'manual' && (
            <Button variant="outline" size="sm">
              <CheckSquare className="h-4 w-4 mr-1" />
              Validate
            </Button>
          )}
        </div>
      </div>

      {phase.notes && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Notes:</p>
          <p className="text-sm">{phase.notes}</p>
        </div>
      )}

      {phase.conditions && (
        <div className="space-y-2">
          <p className="font-medium">Conditions Checked:</p>
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
      )}

      {phase.status === 'manual' && (
        <div className="space-y-3 pt-4 border-t">
          <p className="font-medium">Manual Validation</p>
          <Textarea
            placeholder="Add validation notes..."
            value={validationNotes}
            onChange={(e) => setValidationNotes(e.target.value)}
            rows={3}
          />
          <div className="flex space-x-2">
            <Button size="sm" variant="default">
              <CheckSquare className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="destructive">
              Reject
            </Button>
            <Button size="sm" variant="outline">
              Request More Info
            </Button>
          </div>
        </div>
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
          <Tabs defaultValue="eligibility">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="tiering">Tiering</TabsTrigger>
              <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
              <TabsTrigger value="underwriting">Underwriting</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="eligibility">
                <PhaseTab phase={loan.phases.eligibility} phaseName="Eligibility Check" />
              </TabsContent>
              
              <TabsContent value="tiering">
                <PhaseTab phase={loan.phases.tiering} phaseName="Credit Tiering" />
              </TabsContent>
              
              <TabsContent value="occupancy">
                <PhaseTab phase={loan.phases.occupancy} phaseName="Occupancy Verification" />
              </TabsContent>
              
              <TabsContent value="underwriting">
                <PhaseTab phase={loan.phases.underwriting} phaseName="Underwriting Review" />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};