import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ManualReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricName: string;
  posValue: string | number;
  aiValue: string | number;
  deviation: string | number;
}

const decisions = [
  { value: "approve", label: "Approve" },
  { value: "approve_conditions", label: "Approve with Conditions" },
  { value: "reject", label: "Reject" },
  { value: "escalate", label: "Escalate" },
];

export function ManualReviewModal({
  open,
  onOpenChange,
  metricName,
  posValue,
  aiValue,
  deviation,
}: ManualReviewModalProps) {
  const [decision, setDecision] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!decision) {
      toast({
        title: "Decision Required",
        description: "Please select a decision before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Review Submitted",
      description: `${metricName} has been marked as "${decisions.find(d => d.value === decision)?.label}".`,
    });
    
    setIsSubmitting(false);
    setDecision("");
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manual Review - {metricName}</DialogTitle>
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
              <p className="font-medium text-destructive">{deviation}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decision">Decision</Label>
            <Select value={decision} onValueChange={setDecision}>
              <SelectTrigger id="decision">
                <SelectValue placeholder="Select a decision" />
              </SelectTrigger>
              <SelectContent>
                {decisions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Add notes or justification for this decision..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
