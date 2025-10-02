import { Badge } from "@/components/ui/badge";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaClock } from "react-icons/fa";
import { PhaseStatus, OverallStatus } from "@/types/loan";

interface StatusBadgeProps {
  status: PhaseStatus | OverallStatus;
  size?: "sm" | "default";
}

const getStatusConfig = (status: PhaseStatus | OverallStatus) => {
  switch (status) {
    case 'passed':
      return { 
        icon: FaCheckCircle, 
        variant: 'success' as const, 
        label: '✓', 
        tooltip: 'Passed' 
      };
    case 'failed':
      return { 
        icon: FaTimesCircle, 
        variant: 'destructive' as const, 
        label: '✗', 
        tooltip: 'Failed' 
      };
    case 'manual':
      return { 
        icon: FaExclamationTriangle, 
        variant: 'warning' as const, 
        label: 'Review', 
        tooltip: 'Manual validation needed' 
      };
    case 'pending':
      return { 
        icon: FaClock, 
        variant: 'secondary' as const, 
        label: '○', 
        tooltip: 'Pending' 
      };
    case 'In Progress':
      return { 
        icon: FaClock, 
        variant: 'secondary' as const, 
        label: 'In Progress' 
      };
    case 'Completed':
      return { 
        icon: FaCheckCircle, 
        variant: 'success' as const, 
        label: 'Completed' 
      };
    case 'Issues Found':
      return { 
        icon: FaTimesCircle, 
        variant: 'destructive' as const, 
        label: 'Errors' 
      };
    case 'Manual Review':
      return { 
        icon: FaExclamationTriangle, 
        variant: 'warning' as const, 
        label: 'Review' 
      };
    default:
      return { 
        icon: FaClock, 
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
      className={`inline-flex items-center justify-center gap-1 ${size === 'sm' ? 'text-xs px-2 py-1' : ''}`}
      title={config.tooltip}
    >
      <IconComponent className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </Badge>
  );
};

export const StatusIcon = ({ status }: { status: PhaseStatus }) => {
  const config = getStatusConfig(status);
  const IconComponent = config.icon;
  
  const getBackgroundColor = () => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20';
      case 'failed':
        return 'bg-red-500/20';
      case 'manual':
        return 'bg-yellow-500/20';
      case 'pending':
        return 'bg-blue-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };
  
  const getIconColor = () => {
    switch (status) {
      case 'passed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'manual':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'pending':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  return (
    <div className="inline-flex items-center justify-center" title={config.tooltip}>
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getBackgroundColor()}`}>
        <IconComponent className={`h-5 w-5 ${getIconColor()}`} />
      </div>
    </div>
  );
};