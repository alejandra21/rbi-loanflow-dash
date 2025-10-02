import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, StatusIcon } from "@/components/StatusBadge";
import { mockLoans, LoanApplication } from "@/types/loan";
import { Search, Filter, RotateCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const LoanList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const navigate = useNavigate();

  const filteredLoans = mockLoans.filter((loan) => {
    const matchesSearch = loan.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || loan.overallStatus === statusFilter;
    
    let matchesPhase = true;
    if (phaseFilter !== "all") {
      const phaseKey = phaseFilter as keyof LoanApplication['phases'];
      matchesPhase = loan.phases[phaseKey].status === 'manual' || loan.phases[phaseKey].status === 'failed';
    }
    
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRerunWorkflow = (e: React.MouseEvent, loanId: string) => {
    e.stopPropagation();
    toast({
      title: "Workflow Started",
      description: `Re-running validation workflow for loan ${loanId}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Loan Applications</span>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or loan ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Issues Found">Issues Found</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    <SelectItem value="eligibility">Eligibility Issues</SelectItem>
                    <SelectItem value="tiering">Tiering Issues</SelectItem>
                    <SelectItem value="occupancy">Occupancy Issues</SelectItem>
                    <SelectItem value="underwriting">Underwriting Issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Lendingwise ID</TableHead>
                <TableHead>Applicant Details</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Overall Status</TableHead>
                <TableHead className="text-center">Eligibility</TableHead>
                <TableHead className="text-center">Tiering</TableHead>
                <TableHead className="text-center">Occupancy</TableHead>
                <TableHead className="text-center">Underwriting</TableHead>
                <TableHead className="text-center">Funding</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow 
                  key={loan.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/loan/${loan.id}`)}
                >
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell className="font-medium">{loan.lendingwiseId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-xs text-muted-foreground">Company Name</div>
                      <div className="font-medium">{loan.applicantName}</div>
                      <div className="text-xs text-muted-foreground mt-1">Property Address</div>
                      <div className="text-sm">{loan.applicantAddress}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(loan.loanAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={loan.overallStatus} size="sm" />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={loan.phases.eligibility.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={loan.phases.tiering.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={loan.phases.occupancy.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={loan.phases.underwriting.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusIcon status={loan.phases.funding.status} />
                  </TableCell>
                  <TableCell>{loan.lastUpdated}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleRerunWorkflow(e, loan.id)}
                      className="gap-2"
                    >
                      <RotateCw className="h-4 w-4" />
                      Re-Execute
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLoans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No loans match your current filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};