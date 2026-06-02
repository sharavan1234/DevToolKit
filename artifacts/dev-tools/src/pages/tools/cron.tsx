import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import cronstrue from "cronstrue";

function getNextCronRuns(cronStr: string, count: number): Date[] {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minutePart, hourPart, domPart, monthPart, dowPart] = parts;

  function matchesPart(value: number, part: string, min: number, max: number): boolean {
    if (part === "*") return true;
    if (part.startsWith("*/")) {
      const step = parseInt(part.slice(2), 10);
      return (value - min) % step === 0;
    }
    const options = part.split(",");
    for (const option of options) {
      if (option.includes("-")) {
        const [lo, hi] = option.split("-").map(Number);
        if (value >= lo && value <= hi) return true;
      } else {
        if (parseInt(option, 10) === value) return true;
      }
    }
    return false;
  }

  const results: Date[] = [];
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);

  const limit = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 366);
  const cursor = new Date(now);

  while (results.length < count && cursor < limit) {
    const minute = cursor.getMinutes();
    const hour = cursor.getHours();
    const dom = cursor.getDate();
    const month = cursor.getMonth() + 1;
    const dow = cursor.getDay();

    if (
      matchesPart(month, monthPart, 1, 12) &&
      matchesPart(dom, domPart, 1, 31) &&
      matchesPart(dow, dowPart, 0, 6) &&
      matchesPart(hour, hourPart, 0, 23) &&
      matchesPart(minute, minutePart, 0, 59)
    ) {
      results.push(new Date(cursor));
    }

    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return results;
}

const EXAMPLES = [
  { label: "Every 5 min", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily midnight", value: "0 0 * * *" },
  { label: "Weekdays 9am", value: "0 9 * * 1-5" },
  { label: "Every Sunday", value: "0 0 * * 0" },
];

export function CronTool() {
  const [cronStr, setCronStr] = useState("*/5 * * * *");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<Date[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cronStr.trim()) {
      setDescription("");
      setNextRuns([]);
      setError(null);
      return;
    }

    try {
      const desc = cronstrue.toString(cronStr, { throwExceptionOnParseError: true });
      setDescription(desc);
      setNextRuns(getNextCronRuns(cronStr, 5));
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setDescription("");
      setNextRuns([]);
    }
  }, [cronStr]);

  const formatRunDate = (d: Date) =>
    d.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <ToolLayout title="Cron Explainer" description="Translate cron expressions into human-readable text and see upcoming run times.">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cron">Cron Expression</Label>
          <Input
            id="cron"
            value={cronStr}
            onChange={(e) => setCronStr(e.target.value)}
            className="font-mono text-lg h-12"
            placeholder="* * * * *"
            data-testid="input-cron"
          />
          <div className="flex gap-4 mt-1 text-xs font-mono text-muted-foreground justify-between px-1">
            <span>minute</span>
            <span>hour</span>
            <span>day (month)</span>
            <span>month</span>
            <span>day (week)</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.value}
                onClick={() => setCronStr(ex.value)}
                className="px-3 py-1 text-xs font-mono rounded-md bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground border border-border transition-colors"
                data-testid={`button-example-${ex.label.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div
            className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center font-semibold"
            data-testid="output-error"
          >
            {error}
          </div>
        ) : (
          <>
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg flex flex-col items-center justify-center text-center shadow-sm gap-2">
              <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">Means</span>
              <span className="text-xl font-bold text-foreground" data-testid="output-description">
                {description}
              </span>
              <CopyButton text={description} className="h-7 text-xs px-3 mt-1" />
            </div>

            {nextRuns.length > 0 && (
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-semibold">Next 5 Run Times</Label>
                <div className="bg-card border rounded-lg overflow-hidden divide-y divide-border" data-testid="output-next-runs">
                  {nextRuns.map((run, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      data-testid={`output-run-${i + 1}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground w-5 text-right">#{i + 1}</span>
                        <span className="font-mono text-sm text-foreground">{formatRunDate(run)}</span>
                      </div>
                      <CopyButton text={formatRunDate(run)} className="h-6 text-xs px-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
