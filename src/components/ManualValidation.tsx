import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatusIcon } from "@/components/StatusBadge";
import { mockLoans } from "@/types/loan";
import { Eye, AlertTriangle } from "lucide-react";

export const ManualValidation = () => {
  const navigate = useNavigate();

  // Filter loans that need manual validation or have errors
  const manualValidationLoans = mockLoans.filter(loan => 
    Object.values(loan.phases).some(phase => phase.status === 'manual' || phase.status === 'failed')
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getManualPhases = (loan: any) => {
    return Object.entries(loan.phases)
      .filter(([_, phase]: [string, any]) => phase.status === 'manual' || phase.status === 'failed')
      .map(([key, _]) => key);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Manual Validation Required</span>
              <span className="text-sm text-muted-foreground">
                ({manualValidationLoans.length} items)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Phases Requiring Validation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manualValidationLoans.map((loan) => {
                const manualPhases = getManualPhases(loan);
                const daysSinceUpdate = Math.floor(
                  (new Date().getTime() - new Date(loan.lastUpdated).getTime()) / (1000 * 3600 * 24)
                );
                
                return (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{loan.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{loan.applicantName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(loan.loanAmount)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {manualPhases.map((phase) => (
                          <span 
                            key={phase}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-warning/50 text-warning-foreground font-medium"
                          >
                            {phase.charAt(0).toUpperCase() + phase.slice(1)}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/loan/${loan.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {manualValidationLoans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No loans requiring manual validation
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};