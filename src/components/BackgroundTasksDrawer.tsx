import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  Loader2,
  ChevronRight,
  Trash2,
} from "lucide-react";

export type TaskStatus = "queued" | "running" | "completed" | "failed";

export interface BackgroundTask {
  id: string;
  name: string;
  type: "workflow" | "phase";
  status: TaskStatus;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  phaseDetails?: string;
}

interface BackgroundTasksDrawerProps {
  tasks: BackgroundTask[];
  onRetryTask?: (taskId: string) => void;
  onClearCompleted?: () => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "queued":
      return <Clock className="h-4 w-4 text-muted-foreground" />;
    case "running":
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />;
  }
};

const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case "queued":
      return (
        <Badge variant="outline" className="text-xs">
          Queued
        </Badge>
      );
    case "running":
      return (
        <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
          Running
        </Badge>
      );
    case "completed":
      return (
        <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="text-xs">
          Failed
        </Badge>
      );
  }
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDuration = (start: Date, end?: Date) => {
  const endTime = end || new Date();
  const diff = Math.floor((endTime.getTime() - start.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}m ${seconds}s`;
};

export const BackgroundTasksDrawer = ({
  tasks,
  onRetryTask,
  onClearCompleted,
}: BackgroundTasksDrawerProps) => {
  const [open, setOpen] = useState(false);

  const runningTasks = tasks.filter((t) => t.status === "running");
  const queuedTasks = tasks.filter((t) => t.status === "queued");
  const completedTasks = tasks.filter(
    (t) => t.status === "completed" || t.status === "failed"
  );

  const hasActiveTasks = runningTasks.length > 0 || queuedTasks.length > 0;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative gap-2"
        >
          <Activity className={hasActiveTasks ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
          Background Tasks
          {hasActiveTasks && (
            <Badge variant="default" className="ml-1 h-5 px-1.5 text-[10px]">
              {runningTasks.length + queuedTasks.length}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Workflow Executions
          </DrawerTitle>
          <DrawerDescription>
            Monitor background workflow and phase executions
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="px-4 h-[50vh] overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm">No workflow executions yet</p>
              <p className="text-xs mt-1">
                Tasks will appear here when you execute workflows
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {/* Active Tasks */}
              {(runningTasks.length > 0 || queuedTasks.length > 0) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Play className="h-3.5 w-3.5" />
                    Active ({runningTasks.length + queuedTasks.length})
                  </h4>
                  <div className="space-y-2">
                    {[...runningTasks, ...queuedTasks].map((task) => (
                      <div
                        key={task.id}
                        className="border rounded-lg p-3 bg-card space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="font-medium text-sm">
                              {task.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {task.type === "workflow" ? "Workflow" : "Phase"}
                            </Badge>
                          </div>
                          {getStatusBadge(task.status)}
                        </div>
                        {task.phaseDetails && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ChevronRight className="h-3 w-3" />
                            {task.phaseDetails}
                          </p>
                        )}
                        {task.status === "running" && (
                          <div className="space-y-1">
                            <Progress value={task.progress} className="h-1.5" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{task.progress}%</span>
                              <span>{formatDuration(task.startedAt)}</span>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Started at {formatTime(task.startedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completed ({completedTasks.length})
                    </h4>
                    {onClearCompleted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={onClearCompleted}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`border rounded-lg p-3 bg-card space-y-2 ${
                          task.status === "failed"
                            ? "border-destructive/30"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="font-medium text-sm">
                              {task.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {task.type === "workflow" ? "Workflow" : "Phase"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.status === "failed" && onRetryTask && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => onRetryTask(task.id)}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                              </Button>
                            )}
                            {getStatusBadge(task.status)}
                          </div>
                        </div>
                        {task.error && (
                          <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                            {task.error}
                          </p>
                        )}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Duration:{" "}
                            {formatDuration(task.startedAt, task.completedAt)}
                          </span>
                          <span>
                            Completed at{" "}
                            {task.completedAt && formatTime(task.completedAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
