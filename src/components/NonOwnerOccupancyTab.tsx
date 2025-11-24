import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle, Home, FileText, MapPin, ExternalLink } from "lucide-react";
import { NonOwnerOccupancyResult, MatchStatus } from "@/types/nonOwnerOccupancy";

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
      return <AlertTriangle className="h-4 w-4" />;
    case 'NO MATCH':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

export const NonOwnerOccupancyTab = ({ data }: NonOwnerOccupancyTabProps) => {
  const allAddresses = [
    ...data.borrower_addresses,
    ...data.guarantor_addresses,
    ...data.tlo_addresses,
    ...data.credit_report_addresses,
    ...data.bank_statement_addresses,
    ...data.gov_id_addresses,
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Non-Owner Occupancy Verification
              </CardTitle>
              <CardDescription className="mt-2">
                Phase 4: Verifying that the subject property is not owner-occupied by any borrower, guarantor, or entity
              </CardDescription>
            </div>
            <Badge variant={data.status === 'pass' ? 'success' : data.status === 'warn' ? 'warning' : 'destructive'}>
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Transaction Type</p>
              <p className="font-medium">{data.transaction_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requires Manual Review</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{data.requires_manual_review ? 'Yes' : 'No'}</p>
                {data.requires_manual_review && (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Subject Property Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Original</p>
              <p className="font-medium">{data.property_address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Normalized</p>
              <p className="font-mono text-sm">{data.property_address_normalized}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Review Reasons */}
      {data.requires_manual_review && data.manual_review_reasons.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Manual Review Required:</p>
            <ul className="list-disc list-inside space-y-1">
              {data.manual_review_reasons.map((reason, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-medium">{reason.type}:</span> {reason.description}
                  {reason.sourceDocumentLink && (
                    <a
                      href={reason.sourceDocumentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      View Document <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Address Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address Comparison</CardTitle>
          <CardDescription>
            Comparing subject property against all borrower, guarantor, and third-party data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Source</TableHead>
                  <TableHead className="text-xs">Source Detail</TableHead>
                  <TableHead className="text-xs">Address</TableHead>
                  <TableHead className="text-xs">Normalized</TableHead>
                  <TableHead className="text-xs">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Match Score</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fuzzy match score (0-100). Score ≥90 triggers manual review.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-xs">Status</TableHead>
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
                      <TableCell className="text-sm">{addr.original}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {addr.normalized}
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
      </Card>

      {/* Refinance-Specific Checks */}
      {data.transaction_type === 'Refinance' && (
        <>
          <Separator />
          
          {/* Title Owner Check */}
          {data.title_owner_check && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Title Owner Verification
                </CardTitle>
                <CardDescription>
                  Verifying title owner matches borrower entity or guarantors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Title Owner</p>
                    <p className="font-medium">{data.title_owner_check.titleOwner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Title Owner Address</p>
                    <p className="font-medium">{data.title_owner_check.titleOwnerAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Borrower Entity</p>
                    <p className="font-medium">{data.title_owner_check.borrowerEntity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guarantors</p>
                    <p className="font-medium">{data.title_owner_check.guarantors.join(', ') || 'None'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  {data.title_owner_check.isMatch ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Status: </span>
                    {data.title_owner_check.isMatch ? 'Owner matches' : 'Owner mismatch - Manual Review Required'}
                  </p>
                </div>
                
                {data.title_owner_check.reason && (
                  <Alert>
                    <AlertDescription>{data.title_owner_check.reason}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Homestead Exemption Check */}
          {data.homestead_check && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Homestead Exemption Check
                </CardTitle>
                <CardDescription>
                  Checking for active homestead exemptions under borrower or guarantor names
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {data.homestead_check.hasHomestead ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Homestead Exemption: </span>
                    {data.homestead_check.hasHomestead ? 'Active - Manual Review Required' : 'None Found'}
                  </p>
                </div>
                
                {data.homestead_check.hasHomestead && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Exemption Holder</p>
                      <p className="font-medium">{data.homestead_check.exemptionHolder || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Exemption Date</p>
                      <p className="font-medium">{data.homestead_check.exemptionDate || 'N/A'}</p>
                    </div>
                  </div>
                )}
                
                {data.homestead_check.reason && (
                  <Alert variant={data.homestead_check.hasHomestead ? 'destructive' : 'default'}>
                    <AlertDescription>{data.homestead_check.reason}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Override Information */}
      {data.override_applied && (
        <Alert>
          <AlertDescription>
            <p className="font-semibold mb-1">Override Applied</p>
            <p className="text-sm">
              By: {data.override_by} on {new Date(data.override_at!).toLocaleString()}
            </p>
            {data.override_reason && (
              <p className="text-sm mt-1">Reason: {data.override_reason}</p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Validation Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.checks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-2">
                {check.ok ? (
                  <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{check.name}</p>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Execution Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Ran At</p>
              <p className="font-medium">{new Date(data.ran_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ran By</p>
              <p className="font-medium">{data.ran_by}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data Source</p>
              <p className="font-medium">{data.source}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
