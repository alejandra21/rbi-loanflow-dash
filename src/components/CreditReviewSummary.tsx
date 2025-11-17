import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle, AlertCircle, XCircle, ChevronDown, TrendingUp, ArrowRight, Info, AlertTriangle } from "lucide-react";

interface CreditReviewSummaryProps {
  expandedCards: Record<string, boolean>;
  toggleCard: (cardId: string) => void;
  overallStatus: string;
  numGuarantors: number;
  companyTier: string;
  loanProgram: string;
  tierChanged: boolean;
  previousTier: string;
  tierChangeReason: string;
  lowestFICO: number;
  productMin: number;
  verifiedProjects: number;
  ficoMeetsProductMin: boolean;
  ltc: number;
  ltv: number;
  loanLimit: number;
  closingDate: string;
}

export const CreditReviewSummary = ({
  expandedCards,
  toggleCard,
  overallStatus,
  numGuarantors,
  companyTier,
  loanProgram,
  tierChanged,
  previousTier,
  tierChangeReason,
  lowestFICO,
  productMin,
  verifiedProjects,
  ficoMeetsProductMin,
  ltc,
  ltv,
  loanLimit,
  closingDate
}: CreditReviewSummaryProps) => {
  
  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      'Platinum': 'bg-gradient-to-r from-slate-400 to-slate-600 text-white',
      'Gold': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      'Silver': 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      'Bronze': 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    };
    return colors[tier] || 'bg-muted';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
      case "verified":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>;
      case "warn":
      case "pending":
      case "review":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Warning</Badge>;
      case "fail":
      case "critical":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Fail</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('creditReviewSummary')}>
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Credit Review Summary
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(overallStatus)}
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.creditReviewSummary ? '' : '-rotate-90'}`} />
          </div>
        </CardTitle>
      </CardHeader>
      {expandedCards.creditReviewSummary && (
        <CardContent className="space-y-6">
          {/* Section 1: Borrower & Program */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Borrower & Program</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Number of Guarantors</p>
                <p className="text-lg font-bold">{numGuarantors}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Company Tier</p>
                <Badge className={`${getTierColor(companyTier)} text-sm font-semibold px-3 py-1`}>
                  {companyTier}
                </Badge>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Loan Program</p>
                <p className="text-lg font-bold">{loanProgram}</p>
              </div>
              {tierChanged && (
                <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Tier Change</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">{tierChangeReason}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getTierColor(previousTier)} text-xs font-semibold px-2 py-1`}>
                      {previousTier}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge className={`${getTierColor(companyTier)} text-xs font-semibold px-2 py-1`}>
                      {companyTier}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Section 2: Creditworthiness */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Creditworthiness</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Lowest Middle FICO</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {ficoMeetsProductMin 
                            ? `FICO ${lowestFICO} meets minimum requirement of ${productMin}`
                            : `FICO ${lowestFICO} below minimum requirement of ${productMin}`}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-primary">{lowestFICO}</p>
                  {ficoMeetsProductMin ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Product Min FICO</p>
                <p className="text-lg font-bold">{productMin}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Verified Projects</p>
                <p className="text-lg font-bold">{verifiedProjects}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Section 3: Exposure Eligibility */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Exposure Eligibility</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Closing Date</p>
                <p className="text-lg font-bold">{closingDate}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">LTC</p>
                <p className="text-lg font-bold">{ltc}%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">LTV</p>
                <p className="text-lg font-bold">{ltv}%</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Loan Limit</p>
                <p className="text-lg font-bold">${loanLimit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Matrix Snapshot Panel */}
          <Collapsible
            open={expandedCards.matrixSnapshot}
            onOpenChange={() => toggleCard('matrixSnapshot')}
          >
            <div className="space-y-3">
              <CollapsibleTrigger className="flex items-center gap-2 w-full">
                <h3 className="text-sm font-semibold text-muted-foreground">Matrix Snapshot</h3>
                <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.matrixSnapshot ? '' : '-rotate-90'}`} />
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Program</TableHead>
                        <TableHead>Min Projects</TableHead>
                        <TableHead>Max Projects</TableHead>
                        <TableHead>Min FICO</TableHead>
                        <TableHead>Max FICO</TableHead>
                        <TableHead>LTC</TableHead>
                        <TableHead>ARLTV</TableHead>
                        <TableHead>Max Loan Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{loanProgram}</TableCell>
                        <TableCell>{verifiedProjects}</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>{productMin}</TableCell>
                        <TableCell>699</TableCell>
                        <TableCell>{ltc}%</TableCell>
                        <TableCell>{ltv}%</TableCell>
                        <TableCell>${loanLimit.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  );
};
