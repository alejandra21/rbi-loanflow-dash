import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface ReviewItem {
  name: string;
  reviewed: boolean;
  validatedBy?: string;
  validatedAt?: string;
}

interface ReviewStatusOverviewProps {
  phaseReview?: {
    reviewed: boolean;
    decision?: string;
    validatedBy?: string;
    validatedAt?: string;
  };
  subsections?: ReviewItem[];
}

export const ReviewStatusOverview = ({ phaseReview, subsections = [] }: ReviewStatusOverviewProps) => {
  const totalSections = subsections.length + (phaseReview ? 1 : 0);
  const reviewedCount = subsections.filter(s => s.reviewed).length + (phaseReview?.reviewed ? 1 : 0);
  const progress = totalSections > 0 ? (reviewedCount / totalSections) * 100 : 0;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Review Progress</CardTitle>
          <Badge 
            variant={progress === 100 ? "success" : progress > 0 ? "warning" : "secondary"}
            className="text-xs"
          >
            {reviewedCount}/{totalSections} Completed
          </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mt-2">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {phaseReview && (
          <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              {phaseReview.reviewed ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">Overall Phase Review</span>
            </div>
            {phaseReview.reviewed && phaseReview.decision && (
              <Badge variant="outline" className="text-xs">
                {phaseReview.decision}
              </Badge>
            )}
          </div>
        )}

        {subsections.length > 0 && (
          <>
            {phaseReview && <div className="border-t my-2" />}
            <div className="space-y-1">
              {subsections.map((section, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {section.reviewed ? (
                      <CheckCircle className="h-3.5 w-3.5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-xs text-muted-foreground truncate">{section.name}</span>
                  </div>
                  {section.reviewed && section.validatedBy && (
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      by {section.validatedBy}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {totalSections === 0 && (
          <div className="flex items-center gap-2 py-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">No review items yet</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
