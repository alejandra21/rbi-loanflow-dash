import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Play, CheckCircle, AlertTriangle, XCircle, Clock, FileText } from "lucide-react";
import { mockLoans } from "@/types/loan";
import type { ExperienceTieringResult, TierLevel, ValidationStatus, ManualValidation } from "@/types/experienceTiering";

const ExperienceTiering = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [selectedLoanId, setSelectedLoanId] = useState<string>(
    searchParams.get("loan_id") || mockLoans[0]?.id || ""
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExperienceTieringResult | null>(null);
  const [manualValidationOpen, setManualValidationOpen] = useState(false);
  const [manualReason, setManualReason] = useState<ManualValidation['reason']>();
  const [manualComment, setManualComment] = useState("");

  const selectedLoan = mockLoans.find(l => l.id === selectedLoanId);

  const handleLoanChange = (loanId: string) => {
    setSelectedLoanId(loanId);
    setSearchParams({ loan_id: loanId });
    setResult(null);
  };

  const getTierColor = (tier: TierLevel | null): string => {
    if (!tier) return "secondary";
    const colors: Record<TierLevel, string> = {
      'Platinum': 'bg-gradient-to-r from-slate-400 to-slate-600 text-white',
      'Gold': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'Silver': 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      'Bronze': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    };
    return colors[tier];
  };

  const getStatusIcon = (status: ValidationStatus) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warn': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'fail': return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const calculateTier = (exits: number, volume: number): TierLevel => {
    if (exits >= 10 || volume >= 5000000) return 'Platinum';
    if (exits >= 5 || volume >= 2000000) return 'Gold';
    if (exits >= 2 || volume >= 500000) return 'Silver';
    return 'Bronze';
  };

  const evaluateLoanType = (loanType: string, exits: number, volume: number, rehabCost?: number, totalCost?: number): { outcome: string; tier: TierLevel | null } => {
    const tier = calculateTier(exits, volume);
    
    if (loanType === 'Fix and Flip') {
      if (rehabCost && rehabCost > 250000) {
        return { outcome: 'Pass', tier };
      } else if (rehabCost && rehabCost <= 250000) {
        return { outcome: 'Manual Review', tier };
      } else if (exits > 0 && volume > 0) {
        return { outcome: 'Pass', tier };
      }
      return { outcome: 'Manual Review', tier: null };
    }
    
    if (loanType === 'Construction') {
      if (exits >= 1 && volume > 0) {
        return { outcome: 'Pass', tier };
      }
      if (rehabCost && totalCost && rehabCost > 250000 && Math.abs(rehabCost - totalCost) < totalCost * 0.2) {
        return { outcome: 'Pass', tier };
      }
      return { outcome: 'Manual Review', tier: null };
    }
    
    if (loanType === 'DSCR') {
      if (exits >= 2 || volume >= 500000) {
        return { outcome: 'Pass', tier };
      }
      return { outcome: 'Manual Review', tier: null };
    }
    
    return { outcome: 'Manual Review', tier: null };
  };

  const runWorkflow = async () => {
    if (!selectedLoan) return;
    
    setIsRunning(true);
    
    try {
      // Simulate API calls with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - in production, this would come from POS and PrequalDat APIs
      const mockExits = Math.floor(Math.random() * 15);
      const mockVolume = Math.floor(Math.random() * 8000000);
      const rehabCost = selectedLoan.loanType === 'Fix and Flip' ? 300000 : undefined;
      
      const evaluation = evaluateLoanType(selectedLoan.loanType, mockExits, mockVolume, rehabCost, selectedLoan.loanAmount);
      
      const mockResult: ExperienceTieringResult = {
        loan_id: selectedLoan.id,
        stage_code: 'experienceTiering',
        status: evaluation.outcome === 'Pass' ? 'pass' : evaluation.outcome === 'Fail' ? 'fail' : 'warn',
        assigned_tier: evaluation.tier,
        metrics: {
          verified_exits_count: mockExits,
          verified_volume_usd: mockVolume,
          lookback_months: 36
        },
        checks: [
          {
            name: 'entity_match',
            ok: true,
            detail: `Matched entity "${selectedLoan.applicantName}" with 95% confidence via entity search`
          },
          {
            name: 'ownership_verification',
            ok: true,
            detail: 'Borrower confirmed as key member through OpenCorporates verification'
          },
          {
            name: 'exit_verification',
            ok: mockExits > 0,
            detail: `Verified ${mockExits} exits totaling $${mockVolume.toLocaleString()} in last 36 months`
          },
          {
            name: 'evaluation_logic',
            ok: evaluation.outcome === 'Pass',
            detail: `${evaluation.outcome}: ${selectedLoan.loanType} evaluation completed`
          }
        ],
        discrepancies: mockExits < 5 ? [
          {
            type: 'date_mismatch',
            message: 'Sale date differs by 30 days on 123 Main St',
            severity: 'low'
          }
        ] : [],
        manual_validation: {
          required: evaluation.outcome === 'Manual Review'
        },
        ran_at: new Date().toISOString(),
        ran_by: 'Grace S.',
        source: 'PrequalDat',
        entity_match: {
          entityName: selectedLoan.applicantName,
          confidence: 95,
          method: 'entity_search'
        },
        ownership_verified: true,
        evaluation_outcome: evaluation.outcome as any
      };
      
      setResult(mockResult);
      
      toast({
        title: "Workflow Complete",
        description: `Experience Tiering validation completed for ${selectedLoan.id}`
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to run Experience Tiering workflow",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleManualValidation = () => {
    if (!manualReason || !manualComment) {
      toast({
        title: "Validation Required",
        description: "Please provide both reason and comment",
        variant: "destructive"
      });
      return;
    }

    if (result) {
      setResult({
        ...result,
        status: 'warn',
        manual_validation: {
          required: true,
          reason: manualReason,
          comment: manualComment,
          validatedBy: 'Grace S.',
          validatedAt: new Date().toISOString()
        }
      });
    }

    toast({
      title: "Manual Validation Recorded",
      description: "Validation reason and comment saved successfully"
    });
    
    setManualValidationOpen(false);
    setManualReason(undefined);
    setManualComment("");
  };

  const postResultsToTracker = () => {
    // In production, this would POST to the backend
    toast({
      title: "Results Posted",
      description: "Experience Tiering results updated in main tracker",
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Experience Tiering</h1>
          <p className="text-muted-foreground mt-1">Phase 2 - Validate borrower experience and assign tier</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1 max-w-md">
              <Label className="text-sm font-medium mb-2 block">Select Loan</Label>
              <Select value={selectedLoanId} onValueChange={handleLoanChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockLoans.map(loan => (
                    <SelectItem key={loan.id} value={loan.id}>
                      {loan.id} - {loan.applicantName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {result && (
              <div className="flex flex-col items-start gap-1">
                <Label className="text-sm font-medium">Assigned Tier</Label>
                {result.assigned_tier ? (
                  <Badge className={getTierColor(result.assigned_tier)}>
                    {result.assigned_tier}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Assigned</Badge>
                )}
              </div>
            )}

            {result && (
              <div className="flex flex-col items-start gap-1">
                <Label className="text-sm font-medium">Last Run</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(result.ran_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={runWorkflow} 
              disabled={isRunning || !selectedLoanId}
              size="default"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Experience Tiering
                </>
              )}
            </Button>

            <Sheet open={manualValidationOpen} onOpenChange={setManualValidationOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Validate Manually
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Manual Validation</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div>
                    <Label className="mb-2 block">Reason</Label>
                    <Select value={manualReason} onValueChange={(v) => setManualReason(v as ManualValidation['reason'])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Data discrepancy">Data discrepancy</SelectItem>
                        <SelectItem value="Insufficient evidence">Insufficient evidence</SelectItem>
                        <SelectItem value="Edge case">Edge case</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Comment</Label>
                    <Textarea
                      value={manualComment}
                      onChange={(e) => setManualComment(e.target.value)}
                      placeholder="Provide detailed explanation..."
                      rows={6}
                    />
                  </div>

                  <Button onClick={handleManualValidation} className="w-full">
                    Save Manual Validation
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {!result && !isRunning && (
          <Alert>
            <AlertDescription>
              Select a loan and click "Run Experience Tiering" to execute the validation workflow.
            </AlertDescription>
          </Alert>
        )}

        {isRunning && (
          <Alert>
            <Clock className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Running Experience Tiering workflow: Matching entity, verifying ownership, checking exits...
            </AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="font-semibold text-foreground">
                  {result.status === 'pass' ? 'Validation Passed' : result.status === 'warn' ? 'Manual Review Required' : 'Validation Failed'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Outcome: {result.evaluation_outcome || 'N/A'} • Assigned Tier: {result.assigned_tier || 'None'}
                </div>
              </div>
            </div>

            {/* Entity Matching */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Entity Matching
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Matched Entity:</span>
                  <span className="font-medium text-foreground">{result.entity_match?.entityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-medium text-foreground">{result.entity_match?.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method:</span>
                  <span className="font-medium text-foreground">
                    {result.entity_match?.method === 'entity_search' ? 'Entity Search' : 'Property Search Fallback'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Ownership Verification */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                {result.ownership_verified ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
                Ownership Verification
              </h3>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner/Key Member Confirmed:</span>
                  <span className="font-medium text-foreground">
                    {result.ownership_verified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Exit Verification */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Exit Verification Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{result.metrics.verified_exits_count}</div>
                  <div className="text-xs text-muted-foreground mt-1">Verified Exits</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ${(result.metrics.verified_volume_usd / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Verified Volume</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{result.metrics.lookback_months}</div>
                  <div className="text-xs text-muted-foreground mt-1">Lookback (Months)</div>
                </div>
              </div>
            </Card>

            {/* Evaluation Logic Result */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Evaluation Logic Result</h3>
              <div className="space-y-2">
                {result.checks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/20 rounded">
                    {check.ok ? (
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground capitalize">
                        {check.name.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm text-muted-foreground break-words">{check.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Discrepancies */}
            {result.discrepancies.length > 0 && (
              <Accordion type="single" collapsible className="border rounded-lg">
                <AccordionItem value="discrepancies" className="border-0">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <span className="font-semibold">
                        Discrepancies ({result.discrepancies.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {result.discrepancies.map((disc, idx) => (
                        <Alert key={idx} variant={disc.severity === 'high' ? 'destructive' : 'default'}>
                          <AlertDescription>
                            <span className="font-medium capitalize">{disc.type.replace(/_/g, ' ')}: </span>
                            {disc.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Manual Validation Info */}
            {result.manual_validation.required && result.manual_validation.comment && (
              <Card className="p-4 border-warning bg-warning/5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-warning" />
                  Manual Validation Record
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reason: </span>
                    <span className="font-medium text-foreground">{result.manual_validation.reason}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Comment: </span>
                    <span className="text-foreground">{result.manual_validation.comment}</span>
                  </div>
                  {result.manual_validation.validatedBy && (
                    <div>
                      <span className="text-muted-foreground">Validated by: </span>
                      <span className="font-medium text-foreground">{result.manual_validation.validatedBy}</span>
                      <span className="text-muted-foreground"> at </span>
                      <span className="text-foreground">
                        {new Date(result.manual_validation.validatedAt!).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Post Results Button */}
            <div className="flex justify-end">
              <Button onClick={postResultsToTracker} size="lg">
                Post Results to Main Tracker
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ExperienceTiering;
