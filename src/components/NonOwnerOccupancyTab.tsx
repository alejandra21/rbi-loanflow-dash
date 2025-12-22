import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle, Home, FileText, MapPin, ChevronDown, Download, XCircle, Info } from "lucide-react";
import { NonOwnerOccupancyResult, MatchStatus } from "@/types/nonOwnerOccupancy";
import { useState } from "react";

interface NonOwnerOccupancyTabProps {
  data: NonOwnerOccupancyResult;
}

const getMatchStatusColor = (status: MatchStatus) => {
  switch (status) {
    case 'MATCH':
      return 'destructive';
    case 'PARTIAL MATCH':
      return 'warning';
    case 'NO MATCH':
      return 'success';
    default:
      return 'secondary';
  }
};

const getMatchStatusIcon = (status: MatchStatus) => {
  switch (status) {
    case 'MATCH':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'NO MATCH':
      return <CheckCircle className="h-4 w-4 text-success" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-warning" />;
  }
};

export const NonOwnerOccupancyTab = ({ data }: NonOwnerOccupancyTabProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    overview: true,
    property: false,
    addresses: false,
    refinanceChecks: false,
    override: false,
    logs: false,
    execution: false
  });

  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const toggleLog = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" /> Pass</Badge>;
      case "warn":
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" /> Warning</Badge>;
      case "fail":
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Manual Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const allAddresses = [
    ...data.borrower_addresses,
    ...data.guarantor_addresses,
    ...data.tlo_addresses,
    ...data.credit_report_addresses,
    ...data.bank_statement_addresses,
    ...data.gov_id_addresses,
  ];

  return (
    <div className="space-y-4">
      {/* Phase Introduction */}
      <div className="p-5 bg-gradient-to-r from-rose-500/10 via-rose-400/5 to-transparent rounded-xl border-l-4 border-rose-500">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-rose-500/15 rounded-lg shrink-0">
            <Home className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">Phase Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This phase verifies non-owner occupancy status by comparing property addresses against borrower and guarantor addresses from multiple sources including TLO, credit reports, bank statements, and government IDs to detect potential owner-occupancy fraud.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium">Non-Owner Occupancy Check</span>
          {getStatusBadge(data.status)}
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('overview')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Overview
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.overview ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.overview && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Overall Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {data.status === 'pass' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : data.status === 'fail' ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <span className="text-lg font-bold">
                    {data.status === 'pass' ? 'Pass' : 
                     data.status === 'fail' ? 'Manual Review' : 
                     'Warning'}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Transaction Type</p>
                <p className="text-lg font-bold">{data.transaction_type}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Manual Review Required</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">{data.requires_manual_review ? 'Yes' : 'No'}</p>
                  {data.requires_manual_review && (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                </div>
              </div>
            </div>

            {data.requires_manual_review && data.manual_review_reasons.length > 0 && (
              <>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Manual Review Reasons</h3>
                  <div className="space-y-2">
                    {data.manual_review_reasons.map((reason, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{reason.type}: </span>
                          <span className="text-sm">{reason.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>

      {/* Subject Property Address */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('property')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Subject Property Address
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.property ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.property && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Original Address</p>
                <p className="font-medium">{data.property_address}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Normalized Address</p>
                <p className="font-mono text-sm">{data.property_address_normalized}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Address Comparison */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('addresses')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Address Comparison
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.addresses ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.addresses && (
          <CardContent>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Source Detail</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-help">Match Score</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Fuzzy match score (0-100). Score ≥90 triggers manual review.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAddresses.map((addr, idx) => {
                    const matchResult = data.address_matches.find(
                      m => m.address.normalized === addr.normalized
                    );
                    const matchStatus = matchResult?.matchStatus || 'NO MATCH';
                    const matchScore = addr.matchScore || 0;

                    return (
                      <TableRow
                        key={idx}
                        className={matchStatus === 'MATCH' ? 'bg-destructive/10' : ''}
                      >
                        <TableCell className="font-medium capitalize">
                          {addr.source.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {addr.sourceDetail || '-'}
                        </TableCell>
                        <TableCell className="text-sm max-w-md">
                          <div className="space-y-0.5">
                            <div>{addr.original}</div>
                            <div className="text-xs font-mono text-muted-foreground">{addr.normalized}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={matchScore >= 90 ? 'destructive' : matchScore >= 70 ? 'warning' : 'secondary'}
                          >
                            {matchScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMatchStatusIcon(matchStatus)}
                            <Badge variant={getMatchStatusColor(matchStatus)}>
                              {matchStatus}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Refinance Specific Checks */}
      {data.transaction_type === 'Refinance' && (data.title_owner_check || data.homestead_check) && (
        <Card>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('refinanceChecks')}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Refinance-Specific Checks
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.refinanceChecks ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.refinanceChecks && (
            <CardContent className="space-y-4">
              {/* Title Owner Check */}
              {data.title_owner_check && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">Title Owner Verification</h3>
                    {data.title_owner_check.isMatch ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> Pass
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" /> Fail
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">Title Owner</p>
                      <p className="font-medium">{data.title_owner_check.titleOwner}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">Borrower Entity</p>
                      <p className="font-medium">{data.title_owner_check.borrowerEntity}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">Guarantors</p>
                      <p className="font-medium">{data.title_owner_check.guarantors.join(', ') || 'None'}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">Match Result</p>
                      <div className="flex items-center gap-2">
                        {data.title_owner_check.isMatch ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="font-medium">
                          {data.title_owner_check.isMatch ? 'Matches' : 'Mismatch'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {data.title_owner_check.reason && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm">{data.title_owner_check.reason}</p>
                    </div>
                  )}
                </div>
              )}

              {data.title_owner_check && data.homestead_check && (
                <Separator className="bg-border/50" />
              )}

              {/* Homestead Exemption Check */}
              {data.homestead_check && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground">Homestead Exemption Check</h3>
                    {data.homestead_check.hasHomestead ? (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="h-3 w-3" /> None
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                      <p className="text-xs text-muted-foreground">Homestead Exemption Active</p>
                      <div className="flex items-center gap-2">
                        {data.homestead_check.hasHomestead ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        <span className="font-medium">
                          {data.homestead_check.hasHomestead ? 'Yes - Review Required' : 'No'}
                        </span>
                      </div>
                    </div>
                    {data.homestead_check.hasHomestead && data.homestead_check.exemptionHolder && (
                      <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                        <p className="text-xs text-muted-foreground">Exemption Holder</p>
                        <p className="font-medium">{data.homestead_check.exemptionHolder}</p>
                      </div>
                    )}
                  </div>
                  {data.homestead_check.reason && (
                    <div className={`p-3 rounded-lg ${data.homestead_check.hasHomestead ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/30'}`}>
                      <p className="text-sm">{data.homestead_check.reason}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Override Information */}
      {data.override_applied && (
        <Card>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('override')}>
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Override Applied
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.override ? '' : '-rotate-90'}`} />
            </CardTitle>
          </CardHeader>
          {expandedCards.override && (
            <CardContent>
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Override By</p>
                    <p className="font-medium mt-1">{data.override_by}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Override Date</p>
                    <p className="font-medium mt-1">{data.override_at ? new Date(data.override_at).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
                {data.override_reason && (
                  <>
                    <Separator className="bg-border/50" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Reason</p>
                      <p className="text-sm">{data.override_reason}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Logs */}
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
          <CardContent className="space-y-3">
            {data.logs && data.logs.length > 0 ? (
              data.logs.map((log) => (
                <div key={log.id} className="border rounded-lg">
                  <div
                    className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleLog(log.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="outline" className="text-xs">
                          {log.tag}
                        </Badge>
                        <span className="text-sm font-medium">{log.description}</span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedLogs[log.id] ? '' : '-rotate-90'}`}
                      />
                    </div>
                  </div>

                  {expandedLogs[log.id] && (
                    <div className="p-3 bg-muted/20 border-t space-y-2">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Action:</span>
                          <span className="ml-2 font-medium">{log.action}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">User:</span>
                          <span className="ml-2 font-medium">{log.user}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span className="ml-2 font-medium">{log.status}</span>
                        </div>
                        {log.exceptionTag && (
                          <div>
                            <span className="text-muted-foreground">Exception Tag:</span>
                            <span className="ml-2 font-medium">{log.exceptionTag}</span>
                          </div>
                        )}
                      </div>
                      {log.jsonData && (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">JSON Data:</p>
                          <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                            {JSON.stringify(log.jsonData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No logs available</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* Execution Details */}
      <Card>
        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => toggleCard('execution')}>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Execution Details
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedCards.execution ? '' : '-rotate-90'}`} />
          </CardTitle>
        </CardHeader>
        {expandedCards.execution && (
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Ran At</p>
                <p className="font-medium">{new Date(data.ran_at).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Ran By</p>
                <p className="font-medium">{data.ran_by}</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">Data Source</p>
                <p className="font-medium">{data.source}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
