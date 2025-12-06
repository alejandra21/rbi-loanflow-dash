import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface StepperPhase {
  id: string;
  name: string;
  shortName: string;
  status: "passed" | "failed" | "manual" | "pending" | "in_progress";
  date?: string;
  user?: string;
}

interface CompactStepperProps {
  phases: StepperPhase[];
  onPhaseClick?: (phaseId: string) => void;
  activePhaseId?: string;
}

const getStatusIcon = (status: StepperPhase["status"], size: "sm" | "md" = "sm") => {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  
  switch (status) {
    case "passed":
      return <CheckCircle2 className={cn(sizeClass, "text-green-600")} />;
    case "failed":
      return <XCircle className={cn(sizeClass, "text-destructive")} />;
    case "manual":
      return <AlertTriangle className={cn(sizeClass, "text-yellow-600")} />;
    case "in_progress":
      return <Clock className={cn(sizeClass, "text-primary animate-pulse")} />;
    case "pending":
    default:
      return <Clock className={cn(sizeClass, "text-muted-foreground")} />;
  }
};

const getStatusColor = (status: StepperPhase["status"]) => {
  switch (status) {
    case "passed":
      return "bg-green-600";
    case "failed":
      return "bg-destructive";
    case "manual":
      return "bg-yellow-500";
    case "in_progress":
      return "bg-primary";
    case "pending":
    default:
      return "bg-muted-foreground/30";
  }
};

const getStatusBadgeVariant = (status: StepperPhase["status"]) => {
  switch (status) {
    case "passed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "manual":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "pending":
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const CompactStepper = ({
  phases,
  onPhaseClick,
  activePhaseId,
}: CompactStepperProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = phases.filter(p => p.status === "passed").length;
  const failedCount = phases.filter(p => p.status === "failed").length;
  const manualCount = phases.filter(p => p.status === "manual").length;

  return (
    <div className="space-y-4">
      {/* Compact Horizontal Stepper */}
      <div className="flex items-center gap-1">
        <TooltipProvider delayDuration={200}>
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onPhaseClick?.(phase.id)}
                    className={cn(
                      "relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
                      "hover:scale-110 hover:ring-2 hover:ring-primary/20",
                      activePhaseId === phase.id && "ring-2 ring-primary",
                      getStatusColor(phase.status)
                    )}
                  >
                    <span className="text-white text-xs font-medium">
                      {index + 1}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{phase.name}</p>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(phase.status)}
                      <span className="text-xs capitalize">{phase.status.replace("_", " ")}</span>
                    </div>
                    {phase.date && (
                      <p className="text-xs text-muted-foreground">{phase.date}</p>
                    )}
                    {phase.user && (
                      <p className="text-xs text-muted-foreground">by {phase.user}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
              
              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-3 transition-colors",
                    phases[index + 1].status !== "pending"
                      ? getStatusColor(phase.status)
                      : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          ))}
        </TooltipProvider>

        {/* Summary badges */}
        <div className="ml-4 flex items-center gap-2">
          {completedCount > 0 && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {completedCount} passed
            </Badge>
          )}
          {manualCount > 0 && (
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              {manualCount} manual
            </Badge>
          )}
          {failedCount > 0 && (
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {failedCount} failed
            </Badge>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground">
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Details
              </>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="animate-accordion-down">
          <div className="mt-3 grid grid-cols-2 gap-2">
            {phases.map((phase, index) => (
              <button
                key={phase.id}
                onClick={() => onPhaseClick?.(phase.id)}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-left transition-colors",
                  "hover:bg-muted/50",
                  activePhaseId === phase.id && "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-medium",
                    getStatusColor(phase.status)
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{phase.shortName}</p>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(phase.status, "sm")}
                    <Badge className={cn("text-[10px] px-1.5 py-0", getStatusBadgeVariant(phase.status))}>
                      {phase.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
