import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, CheckCircle, AlertTriangle, XCircle, ChevronDown, FileText, TrendingUp, Shield, AlertCircleIcon } from "lucide-react";
import { useState } from "react";

interface CreditReviewTabProps {
  phase: any;
}

export const CreditReviewTab = ({ phase }: CreditReviewTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    creditPull: false,
    utilization: false,
    latePayment: false,
    tlo: false,
    lexisNexis: false,
    flagDat: false,
    logs: false
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
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

  // Mock data for Credit Pull & FICO
  const creditPullData = {
    borrower: {
      name: "John Doe",
      fico: 720,
      pullDate: "2025-11-01",
      bureau: "Experian",
      status: "pass"
    },
    coBorrower: {
      name: "Jane Smith",
      fico: 695,
      pullDate: "2025-11-01",
      bureau: "Experian",
      status: "pass"
    }
  };

  // Mock data for Credit Utilization
  const utilizationData = [
    { account: "Chase Sapphire", limit: 15000, balance: 3200, utilization: 21.3, status: "pass" },
    { account: "Amex Gold", limit: 25000, balance: 8500, utilization: 34.0, status: "warn" },
    { account: "Citi Double Cash", limit: 10000, balance: 1200, utilization: 12.0, status: "pass" },
  ];

  // Mock data for Late Payments
  const latePaymentData = [
    { date: "2024-08-15", creditor: "Wells Fargo", daysLate: 30, amount: 450, status: "warn" },
    { date: "2024-03-22", creditor: "Chase", daysLate: 15, amount: 220, status: "pass" },
  ];

  // Mock data for TLO Review
  const tloData = {
    addressHistory: [
      { address: "123 Main St, Austin TX", period: "2020-Present", verified: true },
      { address: "456 Oak Ave, Dallas TX", period: "2017-2020", verified: true },
    ],
    employmentHistory: [
      { employer: "Tech Corp", position: "Senior Developer", period: "2019-Present", verified: true },
    ],
    status: "pass"
  };

  // Mock data for LexisNexis
  const lexisNexisData = {
    matchStatus: "clear", // "clear" or "match"
    exactNameMatch: false,
    mScore: 85, // M=100 means exact match
    reportDate: "2025-10-15",
    closeDate: "2025-11-10", // Loan close date for comparison
    status: "pass"
  };

  // Calculate if report is older than 60 days from close date
  const reportAge = Math.floor(
    (new Date(lexisNexisData.closeDate).getTime() - new Date(lexisNexisData.reportDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const isReportStale = reportAge > 60;

  // Mock data for FlagDat
  const flagDatData = {
    watchlistCheck: false, // false = no match, true = match found
    blacklistCheck: false, // false = no match, true = match found
    status: "pass",
    lastChecked: "2025-11-10"
  };

  // Mock logs data
  const logsData = [
    {
      timestamp: "2025-11-10 14:23:15",
      action: "Credit Pull Initiated",
      user: "System",
      status: "completed"
    },
    {
      timestamp: "2025-11-10 14:25:42",
      action: "TLO Verification",
      user: "System",
      status: "completed"
    },
    {
      timestamp: "2025-11-10 14:28:10",
      action: "LexisNexis Check",
      user: "System",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Credit Review</span>
          <StatusBadge status={phase.status} />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Section 1: Credit Pull & FICO */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('creditPull')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Credit Pull & FICO
              {getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.creditPull ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.creditPull && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Borrower */}
              <div className="p-4 border rounded-lg space-y-3">
                <p className="text-sm font-semibold">Primary Borrower</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{creditPullData.borrower.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">FICO Score</span>
                    <span className="text-lg font-bold text-primary">{creditPullData.borrower.fico}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Bureau</span>
                    <span className="text-sm">{creditPullData.borrower.bureau}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Pull Date</span>
                    <span className="text-sm">{creditPullData.borrower.pullDate}</span>
                  </div>
                </div>
              </div>

              {/* Co-Borrower */}
              <div className="p-4 border rounded-lg space-y-3">
                <p className="text-sm font-semibold">Co-Borrower</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{creditPullData.coBorrower.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">FICO Score</span>
                    <span className="text-lg font-bold text-primary">{creditPullData.coBorrower.fico}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Bureau</span>
                    <span className="text-sm">{creditPullData.coBorrower.bureau}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Pull Date</span>
                    <span className="text-sm">{creditPullData.coBorrower.pullDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 2: Credit Utilization Analysis */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('utilization')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Credit Utilization Analysis
              {getStatusBadge('warn')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.utilization ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.utilization && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Credit Limit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Utilization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utilizationData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.account}</TableCell>
                    <TableCell className="text-right">${item.limit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.balance.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">{item.utilization}%</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 p-3 bg-muted/30 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Utilization</span>
                <span className="text-lg font-bold">25.4%</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 3: Late Payment History Evaluation */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('latePayment')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              Late Payment History Evaluation
              {getStatusBadge('warn')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.latePayment ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.latePayment && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Creditor</TableHead>
                  <TableHead className="text-right">Days Late</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latePaymentData.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="font-medium">{item.creditor}</TableCell>
                    <TableCell className="text-right">{item.daysLate}</TableCell>
                    <TableCell className="text-right">${item.amount}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 p-3 bg-muted/30 rounded space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Late Payments (24 months)</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most Recent</span>
                <span className="font-semibold">6 months ago</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 4: TLO Review */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('tlo')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              TLO Review
              {getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.tlo ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.tlo && (
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-3">Address History</p>
              <div className="space-y-2">
                {tloData.addressHistory.map((addr, idx) => (
                  <div key={idx} className="flex justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">{addr.address}</p>
                      <p className="text-xs text-muted-foreground">{addr.period}</p>
                    </div>
                    {addr.verified && <CheckCircle className="h-4 w-4 text-success" />}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold mb-3">Employment History</p>
              <div className="space-y-2">
                {tloData.employmentHistory.map((emp, idx) => (
                  <div key={idx} className="flex justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">{emp.employer}</p>
                      <p className="text-xs text-muted-foreground">{emp.position} • {emp.period}</p>
                    </div>
                    {emp.verified && <CheckCircle className="h-4 w-4 text-success" />}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Section 5: LexisNexis */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('lexisNexis')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              LexisNexis
              {lexisNexisData.matchStatus === "match" || isReportStale ? getStatusBadge('fail') : getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.lexisNexis ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.lexisNexis && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Match Status</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {lexisNexisData.matchStatus === "match" ? "Match/Hit" : "Clear"}
                  </p>
                  {lexisNexisData.matchStatus === "match" ? (
                    <Badge variant="destructive">Match Found</Badge>
                  ) : (
                    <Badge variant="success">Clear</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">M Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{lexisNexisData.mScore}</p>
                  {lexisNexisData.mScore === 100 && lexisNexisData.exactNameMatch && (
                    <Badge variant="destructive">Exact Match</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="text-sm font-medium">{lexisNexisData.reportDate}</p>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Report Age</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{reportAge} days</p>
                  {isReportStale && (
                    <Badge variant="destructive">Stale</Badge>
                  )}
                </div>
              </div>
            </div>

            {(lexisNexisData.matchStatus === "match" && lexisNexisData.exactNameMatch && lexisNexisData.mScore === 100) ? (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">⚠ Exact Name Match (M=100) - Manual Review: KYC required</p>
              </div>
            ) : isReportStale ? (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">🔴 Report is {">"}60 days old - Manual Review required</p>
              </div>
            ) : (
              <div className="p-3 bg-success/10 border border-success/20 rounded">
                <p className="text-sm font-medium text-success">✓ Clear - Continue workflow</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Section 6: FlagDat */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('flagDat')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              FlagDat
              {getStatusBadge('pass')}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.flagDat ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.flagDat && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">WatchList Check</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {flagDatData.watchlistCheck ? "True" : "False"}
                  </p>
                  {flagDatData.watchlistCheck ? (
                    <Badge variant="destructive">Match Found</Badge>
                  ) : (
                    <Badge variant="success">No Match</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">BlackList Check</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">
                    {flagDatData.blacklistCheck ? "True" : "False"}
                  </p>
                  {flagDatData.blacklistCheck ? (
                    <Badge variant="destructive">Match Found</Badge>
                  ) : (
                    <Badge variant="success">No Match</Badge>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded space-y-2">
                <p className="text-xs text-muted-foreground">Last Checked</p>
                <p className="text-sm font-medium">{flagDatData.lastChecked}</p>
              </div>
            </div>
            {(flagDatData.watchlistCheck || flagDatData.blacklistCheck) ? (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded">
                <p className="text-sm font-medium text-destructive">⚠ Match found - Manual Review by Underwriting/Credit Analyst required</p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded">
                <p className="text-sm font-medium text-success">✓ No match - Continue workflow</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Section 7: Logs */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('logs')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.logs ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.logs && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsData.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="success">{log.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
