import { useState } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, fromUnixTime, getUnixTime } from "date-fns";

type Direction = "ts-to-date" | "date-to-ts";

function parseTimestamp(ts: string): { localTime: string; utcTime: string; relative: string } | null {
  if (!ts.trim()) return null;
  const num = parseInt(ts.trim(), 10);
  if (isNaN(num)) return null;

  let seconds = num;
  if (ts.trim().length > 11) {
    seconds = Math.floor(num / 1000);
  }

  const d = fromUnixTime(seconds);
  const localTime = format(d, "yyyy-MM-dd HH:mm:ss (xxx)");
  const utcTime = d.toUTCString();

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.round(Math.abs(diffMs) / 1000);
  const isFuture = diffMs < 0;
  let relative = "";
  if (diffSec < 60) relative = `${diffSec} seconds ${isFuture ? "from now" : "ago"}`;
  else if (diffSec < 3600) relative = `${Math.round(diffSec / 60)} minutes ${isFuture ? "from now" : "ago"}`;
  else if (diffSec < 86400) relative = `${Math.round(diffSec / 3600)} hours ${isFuture ? "from now" : "ago"}`;
  else relative = `${Math.round(diffSec / 86400)} days ${isFuture ? "from now" : "ago"}`;

  return { localTime, utcTime, relative };
}

function parseDateToTs(dateStr: string): { seconds: string; milliseconds: string } | null {
  if (!dateStr.trim()) return null;
  const d = new Date(dateStr.trim());
  if (isNaN(d.getTime())) return null;
  const seconds = getUnixTime(d).toString();
  const milliseconds = d.getTime().toString();
  return { seconds, milliseconds };
}

export function TimestampTool() {
  const [direction, setDirection] = useState<Direction>("ts-to-date");

  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString().slice(0, 19));
  const [tsError, setTsError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleNow = () => {
    setTimestamp(Math.floor(Date.now() / 1000).toString());
    setDateInput(new Date().toISOString().slice(0, 19));
    setTsError(null);
    setDateError(null);
  };

  const tsResult = (() => {
    try {
      const r = parseTimestamp(timestamp);
      setTsError(null);
      return r;
    } catch {
      setTsError("Invalid timestamp");
      return null;
    }
  })();

  const dateResult = (() => {
    try {
      const r = parseDateToTs(dateInput);
      setDateError(null);
      return r;
    } catch {
      setDateError("Invalid date");
      return null;
    }
  })();

  const tsResultSafe = parseTimestamp(timestamp);
  const dateResultSafe = parseDateToTs(dateInput);

  return (
    <ToolLayout title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates in both directions.">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1 w-fit">
          <button
            onClick={() => setDirection("ts-to-date")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${direction === "ts-to-date" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            data-testid="button-direction-ts-to-date"
          >
            Timestamp → Date
          </button>
          <button
            onClick={() => setDirection("date-to-ts")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${direction === "date-to-ts" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            data-testid="button-direction-date-to-ts"
          >
            Date → Timestamp
          </button>
        </div>

        <div className="flex items-end gap-3">
          {direction === "ts-to-date" ? (
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="timestamp">Unix Timestamp (seconds or ms)</Label>
              <Input
                id="timestamp"
                value={timestamp}
                onChange={(e) => { setTimestamp(e.target.value); setTsError(null); }}
                className="font-mono text-lg"
                placeholder="1700000000"
                data-testid="input-timestamp"
              />
              {tsError && <span className="text-sm text-destructive">{tsError}</span>}
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="date-input">Date / Time (ISO 8601 or any parseable format)</Label>
              <Input
                id="date-input"
                value={dateInput}
                onChange={(e) => { setDateInput(e.target.value); setDateError(null); }}
                className="font-mono text-lg"
                placeholder="2024-01-15T12:00:00"
                data-testid="input-date"
              />
              {dateError && <span className="text-sm text-destructive">{dateError}</span>}
            </div>
          )}
          <Button onClick={handleNow} variant="secondary" data-testid="button-now">Now</Button>
        </div>

        {direction === "ts-to-date" ? (
          tsResultSafe ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-card border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Local Time</Label>
                  <div className="font-mono text-lg text-primary mt-1" data-testid="output-local">{tsResultSafe.localTime}</div>
                </div>
                <CopyButton text={tsResultSafe.localTime} className="h-7 text-xs px-2 mt-1 shrink-0" />
              </div>
              <div className="bg-card border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UTC Time</Label>
                  <div className="font-mono text-lg text-chart-2 mt-1" data-testid="output-utc">{tsResultSafe.utcTime}</div>
                </div>
                <CopyButton text={tsResultSafe.utcTime} className="h-7 text-xs px-2 mt-1 shrink-0" />
              </div>
              <div className="bg-card border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Relative</Label>
                  <div className="font-mono text-lg text-chart-3 mt-1" data-testid="output-relative">{tsResultSafe.relative}</div>
                </div>
                <CopyButton text={tsResultSafe.relative} className="h-7 text-xs px-2 mt-1 shrink-0" />
              </div>
            </div>
          ) : (
            timestamp ? (
              <div className="p-4 text-destructive font-semibold bg-destructive/10 rounded-md border border-destructive/20 text-center">
                Invalid timestamp
              </div>
            ) : null
          )
        ) : (
          dateResultSafe ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-card border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unix Timestamp (seconds)</Label>
                  <div className="font-mono text-2xl text-primary mt-1" data-testid="output-unix-seconds">{dateResultSafe.seconds}</div>
                </div>
                <CopyButton text={dateResultSafe.seconds} className="h-7 text-xs px-2 mt-1 shrink-0" />
              </div>
              <div className="bg-card border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unix Timestamp (milliseconds)</Label>
                  <div className="font-mono text-2xl text-chart-2 mt-1" data-testid="output-unix-ms">{dateResultSafe.milliseconds}</div>
                </div>
                <CopyButton text={dateResultSafe.milliseconds} className="h-7 text-xs px-2 mt-1 shrink-0" />
              </div>
            </div>
          ) : (
            dateInput ? (
              <div className="p-4 text-destructive font-semibold bg-destructive/10 rounded-md border border-destructive/20 text-center">
                Invalid date — try ISO format: 2024-01-15T12:00:00
              </div>
            ) : null
          )
        )}
      </div>
    </ToolLayout>
  );
}
