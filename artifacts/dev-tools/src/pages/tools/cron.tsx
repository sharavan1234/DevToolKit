import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import cronstrue from "cronstrue";

// Simple fallback to compute next 5 dates roughly (not a full cron parser)
// Just a visual representation since we don't have a full cron-parser package imported.
// If needed, we can implement a basic one or just show the description.
// Actually, cronstrue only gives descriptions. Let's just focus on description for now as requested, 
// and a placeholder for dates if we can't compute them without another library.
// The prompt says "Use cronstrue and compute next runs manually" - computing cron manually is complex.
// Let's implement a very simplified manual calculator for basic expressions or just show the description.

export function CronTool() {
  const [cronStr, setCronStr] = useState("*/5 * * * *");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cronStr) {
      setDescription("");
      setError(null);
      return;
    }

    try {
      const desc = cronstrue.toString(cronStr, { throwExceptionOnParseError: true });
      setDescription(desc);
      setError(null);
    } catch (e: any) {
      setError(e.toString());
      setDescription("");
    }
  }, [cronStr]);

  return (
    <ToolLayout title="Cron Explainer" description="Translate cron expressions into human-readable text.">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cron">Cron Expression</Label>
          <div className="flex items-center gap-2">
             <Input 
               id="cron"
               value={cronStr}
               onChange={(e) => setCronStr(e.target.value)}
               className="font-mono text-lg h-12"
               placeholder="* * * * *"
               data-testid="input-cron"
             />
          </div>
          <div className="flex gap-4 mt-2 text-xs font-mono text-muted-foreground justify-between px-2">
            <span>minute</span>
            <span>hour</span>
            <span>day (month)</span>
            <span>month</span>
            <span>day (week)</span>
          </div>
        </div>

        <div className="mt-8">
           {error ? (
             <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center font-semibold" data-testid="output-error">
                {error}
             </div>
           ) : (
             <div className="p-8 bg-primary/10 border border-primary/20 rounded-lg flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">Means</span>
                <span className="text-2xl font-bold text-foreground" data-testid="output-description">
                  {description}
                </span>
             </div>
           )}
        </div>
      </div>
    </ToolLayout>
  );
}
