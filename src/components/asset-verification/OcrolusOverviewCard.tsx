import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Database, CheckCircle2, XCircle } from 'lucide-react';
import { OcrolusOverviewData } from '@/types/assetVerification';

interface OcrolusOverviewCardProps {
  ocrolusData: OcrolusOverviewData;
  authenticityPass: boolean;
  authenticityScore?: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const OcrolusOverviewCard = ({ 
  ocrolusData, 
  authenticityPass, 
  authenticityScore,
  isExpanded, 
  onToggle 
}: OcrolusOverviewCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return 'N/A';
    return value.toFixed(2);
  };

  const overviewFields = [
    { label: 'Average Daily Balance', value: formatCurrency(ocrolusData.averageDailyBalance) },
    { label: 'Average Deposit Count', value: ocrolusData.averageDepositCount.toString() },
    { label: 'Average Monthly Expense', value: formatCurrency(ocrolusData.averageMonthlyExpense) },
    { label: 'Average Monthly Revenue', value: formatCurrency(ocrolusData.averageMonthlyRevenue) },
    { label: 'Debt Coverage Ratio', value: formatNumber(ocrolusData.debtCoverageRatio) },
    { label: 'Min Score Available', value: ocrolusData.minScoreAvailable.toString() },
    { label: 'Total Expense', value: formatCurrency(ocrolusData.totalExpense) },
    { label: 'Total Loan Payments', value: formatCurrency(ocrolusData.totalLoanPayments) },
    { label: 'Total Loan Proceeds', value: formatCurrency(ocrolusData.totalLoanProceeds) },
    { label: 'Total NSF Fee Count', value: ocrolusData.totalNSFFeeCount.toString() },
    { label: 'Total Revenue', value: formatCurrency(ocrolusData.totalRevenue) },
  ];

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-violet-500" />
                <span>Ocrolus Overview Information</span>
              </div>
              <div className="flex items-center gap-2">
                {authenticityPass ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Authenticity Pass
                    {authenticityScore && <span className="ml-1">({authenticityScore}%)</span>}
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                    <XCircle className="h-3 w-3 mr-1" />
                    Authenticity Failed
                  </Badge>
                )}
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overviewFields.map((field) => (
                  <TableRow key={field.label}>
                    <TableCell className="text-muted-foreground">{field.label}</TableCell>
                    <TableCell className="font-medium">{field.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default OcrolusOverviewCard;
