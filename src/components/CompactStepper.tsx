import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
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

const getStatusIcon = (status: StepperPhase["status"]) => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
    case "failed":
      return <XCircle className="h-3.5 w-3.5 text-destructive" />;
    case "manual":
      return <AlertTriangle className="h-3.5 w-3.5 text-yellow-600" />;
    case "in_progress":
      return <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />;
    case "pending":
    default:
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  }
};

const getStepStyles = (status: StepperPhase["status"], isActive: boolean) => {
  const baseStyles = "relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 text-[11px] font-semibold border-2";
  
  const statusStyles = {
    passed: "bg-green-500/10 border-green-500 text-green-700 dark:text-green-400",
    failed: "bg-destructive/10 border-destructive text-destructive",
    manual: "bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400",
    in_progress: "bg-primary/10 border-primary text-primary",
    pending: "bg-muted/50 border-muted-foreground/20 text-muted-foreground",
  };

  const activeStyles = isActive ? "ring-2 ring-offset-2 ring-primary/50" : "";
  const hoverStyles = "hover:scale-105 hover:shadow-sm";

  return cn(baseStyles, statusStyles[status], activeStyles, hoverStyles);
};

const getConnectorColor = (currentStatus: StepperPhase["status"], nextStatus: StepperPhase["status"]) => {
  if (currentStatus === "passed" && nextStatus !== "pending") {
    return "bg-green-400";
  }
  if (currentStatus === "passed") {
    return "bg-gradient-to-r from-green-400 to-muted-foreground/20";
  }
  return "bg-muted-foreground/20";
};

export const CompactStepper = ({
  phases,
  onPhaseClick,
  activePhaseId,
}: CompactStepperProps) => {
  return (
    <div className="flex items-center">
      <TooltipProvider delayDuration={150}>
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onPhaseClick?.(phase.id)}
                  className={getStepStyles(phase.status, activePhaseId === phase.id)}
                >
                  {index + 1}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                <div className="space-y-1.5">
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
                  "h-[2px] w-4 mx-0.5 rounded-full transition-colors",
                  getConnectorColor(phase.status, phases[index + 1].status)
                )}
              />
            )}
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
};
