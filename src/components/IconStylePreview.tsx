import { CheckCircle2, Circle, Play, AlertTriangle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const IconStylePreview = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Status Icon Style Options</h2>
      
      {/* Option 1: Filled Icons with Glow */}
      <Card>
        <CardHeader>
          <CardTitle>Option 1: Filled Icons with Glow Effects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 fill-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <p className="text-xs mt-2">Success</p>
            </div>
            <div className="text-center">
              <Circle className="h-8 w-8 text-blue-500 fill-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <p className="text-xs mt-2">In Progress</p>
            </div>
            <div className="text-center">
              <Play className="h-8 w-8 text-primary fill-primary drop-shadow-[0_0_8px_rgba(147,51,234,0.5)]" />
              <p className="text-xs mt-2">Play</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              <p className="text-xs mt-2">Warning</p>
            </div>
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <p className="text-xs mt-2">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Option 2: Badge Style with Backgrounds */}
      <Card>
        <CardHeader>
          <CardTitle>Option 2: Badge Style with Colored Backgrounds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs mt-2">Success</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20">
                <Circle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs mt-2">In Progress</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs mt-2">Play</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="text-xs mt-2">Warning</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-xs mt-2">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Option 3: Gradient Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Option 3: Gradient with Border Ring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 ring-2 ring-green-300">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Success</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-blue-300">
                <Circle className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">In Progress</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 ring-2 ring-purple-300">
                <Play className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Play</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 ring-2 ring-yellow-300">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Warning</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 ring-2 ring-red-300">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Option 4: With Pulse Animation */}
      <Card>
        <CardHeader>
          <CardTitle>Option 4: With Pulse & Breathing Animation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping"></div>
                <CheckCircle2 className="relative h-8 w-8 text-green-500 fill-green-500" />
              </div>
              <p className="text-xs mt-2">Success</p>
            </div>
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-pulse"></div>
                <Circle className="relative h-8 w-8 text-blue-500 fill-blue-500" />
              </div>
              <p className="text-xs mt-2">In Progress</p>
            </div>
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse"></div>
                <Play className="relative h-8 w-8 text-primary fill-primary" />
              </div>
              <p className="text-xs mt-2">Play</p>
            </div>
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-full bg-yellow-500/30 animate-pulse"></div>
                <AlertTriangle className="relative h-8 w-8 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-xs mt-2">Warning</p>
            </div>
            <div className="text-center">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
                <XCircle className="relative h-8 w-8 text-red-500 fill-red-500" />
              </div>
              <p className="text-xs mt-2">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Option 5: Solid with Shadow */}
      <Card>
        <CardHeader>
          <CardTitle>Option 5: Solid Fill with Shadows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 shadow-lg shadow-green-500/50">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Success</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50">
                <Circle className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">In Progress</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-lg shadow-primary/50">
                <Play className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Play</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Warning</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-500 shadow-lg shadow-red-500/50">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs mt-2">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Option 6: Outlined with Hover Effect */}
      <Card>
        <CardHeader>
          <CardTitle>Option 6: Outlined with Hover Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-500 hover:scale-110 transition-transform cursor-pointer">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs mt-2">Success</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-500 hover:scale-110 transition-transform cursor-pointer">
                <Clock className="h-5 w-5 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <p className="text-xs mt-2">In Progress</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary hover:scale-110 transition-transform cursor-pointer">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs mt-2">Play</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-yellow-500 hover:scale-110 transition-transform cursor-pointer">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-xs mt-2">Warning</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 hover:scale-110 transition-transform cursor-pointer">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-xs mt-2">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};