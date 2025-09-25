import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, StatusIcon } from "@/components/StatusBadge";
import { mockLoans } from "@/types/loan";
import { UserCheck, Eye, AlertTriangle } from "lucide-react";

export const ManualValidation = () => {
  const navigate = useNavigate();
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Filter loans that need manual validation
  const manualValidationLoans = mockLoans.filter(loan => 
    Object.values(loan.phases).some(phase => phase.status === 'manual')
  );

  const filteredLoans = manualValidationLoans.filter(loan => {
    if (assigneeFilter === "all") return true;
    if (assigneeFilter === "unassigned") return !loan.assignedReviewer;
    return loan.assignedReviewer === assigneeFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getManualPhases = (loan: any) => {
    return Object.entries(loan.phases)
      .filter(([_, phase]: [string, any]) => phase.status === 'manual')
      .map(([key, _]) => key);
  };

  const reviewers = ['Priya Sharma', 'Rahul Gupta', 'Anjali Singh', 'Vikram Patel'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <span>Manual Validation Required</span>
              <span className="text-sm text-muted-foreground">
                ({filteredLoans.length} items)
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {reviewers.map((reviewer) => (
                    <SelectItem key={reviewer} value={reviewer}>{reviewer}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <TableHead>Assigned Reviewer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => {
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
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-warning/20 text-warning-foreground"
                          >
                            {phase.charAt(0).toUpperCase() + phase.slice(1)}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {loan.assignedReviewer ? (
                        <div className="flex items-center space-x-1">
                          <UserCheck className="h-4 w-4" />
                          <span className="text-sm">{loan.assignedReviewer}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {daysSinceUpdate > 3 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-destructive/20 text-destructive-foreground">
                          High
                        </span>
                      ) : daysSinceUpdate > 1 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-warning/20 text-warning-foreground">
                          Medium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-success/20 text-success-foreground">
                          Normal
                        </span>
                      )}
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
                        
                        {!loan.assignedReviewer && (
                          <Select>
                            <SelectTrigger asChild>
                              <Button variant="outline" size="sm">
                                <UserCheck className="h-4 w-4 mr-1" />
                                Assign
                              </Button>
                            </SelectTrigger>
                            <SelectContent>
                              {reviewers.map((reviewer) => (
                                <SelectItem key={reviewer} value={reviewer}>
                                  {reviewer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredLoans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No loans requiring manual validation
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};