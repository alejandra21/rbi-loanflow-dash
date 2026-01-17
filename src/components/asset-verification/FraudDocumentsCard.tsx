import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, FileSearch, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { FraudDocumentAnalysis } from '@/types/assetVerification';
import { cn } from '@/lib/utils';

interface FraudDocumentsCardProps {
  fraudAnalysis: FraudDocumentAnalysis[];
  isExpanded: boolean;
  onToggle: () => void;
}

const FraudDocumentsCard = ({ fraudAnalysis, isExpanded, onToggle }: FraudDocumentsCardProps) => {
  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {score}
        </Badge>
      );
    } else if (score >= 60) {
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {score}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
          <XCircle className="h-3 w-3 mr-1" />
          {score}
        </Badge>
      );
    }
  };

  const allClear = fraudAnalysis.every(doc => doc.score >= 80);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-violet-500" />
                <span>Fraud Documents Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{fraudAnalysis.length} document{fraudAnalysis.length !== 1 ? 's' : ''}</Badge>
                {allClear ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />All Clear
                  </Badge>
                ) : (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    <AlertTriangle className="h-3 w-3 mr-1" />Review Needed
                  </Badge>
                )}
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {fraudAnalysis.map((doc, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-4 rounded-lg border",
                  doc.score >= 80 
                    ? "bg-emerald-500/5 border-emerald-500/20" 
                    : doc.score >= 60 
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-red-500/5 border-red-500/20"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">{doc.documentName}</p>
                    <p className="text-xs text-muted-foreground">Pages: {doc.pageNumbers}</p>
                  </div>
                  {getScoreBadge(doc.score)}
                </div>
                
                <div className="text-xs text-muted-foreground mb-2">
                  <span className="font-mono">{doc.uploadedDocUUID}</span>
                </div>
                
                {doc.reasonCodes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {doc.reasonCodes.map((code, codeIdx) => (
                      <Badge 
                        key={codeIdx} 
                        variant="outline" 
                        className="text-xs bg-background"
                      >
                        {code}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {doc.reasonCodes.length === 0 && doc.score >= 80 && (
                  <p className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
                    <CheckCircle2 className="h-3 w-3" />
                    No fraud indicators detected
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default FraudDocumentsCard;
