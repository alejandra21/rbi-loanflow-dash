import { Building2, CheckCircle2, AlertCircle, Clock, FileX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ValidationStatus, BankStatementData } from '@/types/assetVerification';

interface BankStatementTabsProps {
  statements: BankStatementData[];
  activeStatementId: string;
  onSelectStatement: (statementId: string) => void;
}

const BankStatementTabs = ({ statements, activeStatementId, onSelectStatement }: BankStatementTabsProps) => {
  const getStatusIndicator = (status: ValidationStatus) => {
    switch (status) {
      case 'pass':
        return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
      case 'fail':
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'review':
        return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case 'pending':
        return <div className="w-2 h-2 rounded-full bg-slate-400" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Bank Statements</h3>
        <Badge variant="secondary" className="text-xs">
          {statements.length} Statement{statements.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-lg flex-wrap">
        {statements.map((statement) => (
          <button
            key={statement.statementId}
            onClick={() => onSelectStatement(statement.statementId)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-all duration-200",
              "border border-transparent",
              activeStatementId === statement.statementId
                ? "bg-background shadow-sm border-border"
                : "hover:bg-background/60"
            )}
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-md",
                activeStatementId === statement.statementId
                  ? "bg-violet-500/10"
                  : "bg-muted/50"
              )}>
                <Building2 className={cn(
                  "h-4 w-4",
                  activeStatementId === statement.statementId
                    ? "text-violet-500"
                    : "text-muted-foreground"
                )} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium",
                    activeStatementId === statement.statementId
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}>
                    {statement.accountHolderName}
                  </span>
                  {getStatusIndicator(statement.verificationStatus)}
                </div>
                <span className="text-xs text-muted-foreground">
                  .... {statement.maskedAccountNumber}
                </span>
              </div>
            </div>
            
            {!statement.documentUrl && (
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
                <FileX className="h-3 w-3 mr-1" />
                No Doc
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BankStatementTabs;
