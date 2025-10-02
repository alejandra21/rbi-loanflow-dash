import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { PhaseStatus, OverallStatus } from "@/types/loan";

interface StatusBadgeProps {
  status: PhaseStatus | OverallStatus;
  size?: "sm" | "default";
}

const getStatusConfig = (status: PhaseStatus | OverallStatus) => {
  switch (status) {
    case 'passed':
      return { 
        icon: CheckCircle, 
        variant: 'success' as const, 
        label: '✓', 
        tooltip: 'Passed' 
      };
    case 'failed':
      return { 
        icon: XCircle, 
        variant: 'destructive' as const, 
        label: '✗', 
        tooltip: 'Failed' 
      };
    case 'manual':
      return { 
        icon: AlertTriangle, 
        variant: 'warning' as const, 
        label: '⚠', 
        tooltip: 'Manual validation needed' 
      };
    case 'pending':
      return { 
        icon: Clock, 
        variant: 'secondary' as const, 
        label: '○', 
        tooltip: 'Pending' 
      };
    case 'In Progress':
      return { 
        icon: Clock, 
        variant: 'secondary' as const, 
        label: 'In Progress' 
      };
    case 'Completed':
      return { 
        icon: CheckCircle, 
        variant: 'success' as const, 
        label: 'Completed' 
      };
    case 'Issues Found':
      return { 
        icon: XCircle, 
        variant: 'destructive' as const, 
        label: 'Issues Found' 
      };
    case 'Manual Review':
      return { 
        icon: AlertTriangle, 
        variant: 'warning' as const, 
        label: 'Manual Review' 
      };
    default:
      return { 
        icon: Clock, 
        variant: 'secondary' as const, 
        label: String(status), 
        tooltip: String(status) 
      };
  }
};

export const StatusBadge = ({ status, size = "default" }: StatusBadgeProps) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;
  
  return (
    <Badge 
      variant={config.variant} 
      className={`inline-flex items-center gap-1 ${size === 'sm' ? 'text-xs px-2 py-1' : ''}`}
      title={config.tooltip}
    >
      <IconComponent className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {status !== 'Manual Review' && config.label}
    </Badge>
  );
};

export const StatusIcon = ({ status }: { status: PhaseStatus }) => {
  const config = getStatusConfig(status);
  
  return (
    <span 
      className="text-lg cursor-help" 
      title={config.tooltip}
    >
      {config.label}
    </span>
  );
};