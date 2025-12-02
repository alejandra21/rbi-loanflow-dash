import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface RepricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricName: string;
  posValue: string | number;
  aiValue: string | number;
  deviation: string | number;
  loanId?: string;
}

type RepricingStatus = "idle" | "loading" | "success" | "error";

export function RepricingModal({
  open,
  onOpenChange,
  metricName,
  posValue,
  aiValue,
  deviation,
  loanId = "LOA-2024-001",
}: RepricingModalProps) {
  const [status, setStatus] = useState<RepricingStatus>("idle");
  const [result, setResult] = useState<{ newRate?: string; message?: string } | null>(null);
  const { toast } = useToast();

  const handleReprice = async () => {
    setStatus("loading");
    setResult(null);

    try {
      // Simulated API call - replace with actual API endpoint
      // const response = await fetch('https://api.example.com/reprice', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     loanId,
      //     metric: metricName,
      //     posValue,
      //     aiValue,
      //     deviation,
      //   }),
      // });
      
      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulated success response
      const mockResult = {
        newRate: "7.25%",
        message: `Repricing successful. Rate adjusted based on ${metricName} deviation.`,
      };
      
      setResult(mockResult);
      setStatus("success");
      
      toast({
        title: "Repricing Complete",
        description: mockResult.message,
      });
    } catch (error) {
      setStatus("error");
      setResult({ message: "Failed to connect to repricing service. Please try again." });
      
      toast({
        title: "Repricing Failed",
        description: "Unable to complete repricing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Auto-Reprice - {metricName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg text-sm">
            <div>
              <p className="text-muted-foreground">POS Value</p>
              <p className="font-medium">{posValue}</p>
            </div>
            <div>
              <p className="text-muted-foreground">AI Value</p>
              <p className="font-medium">{aiValue}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Deviation</p>
              <p className="font-medium text-warning">{deviation}</p>
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-3">
            <p className="text-sm text-muted-foreground">
              This will trigger an automatic repricing calculation based on the {metricName} deviation. 
              The new pricing will be applied to the loan.
            </p>

            {status === "loading" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Calculating new pricing...</span>
              </div>
            )}

            {status === "success" && result && (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">
                    New Rate: {result.newRate}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-500">{result.message}</p>
                </div>
              </div>
            )}

            {status === "error" && result && (
              <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-500">{result.message}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {status === "success" ? "Close" : "Cancel"}
          </Button>
          {status !== "success" && (
            <Button onClick={handleReprice} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Run Repricing"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
