import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, fromUnixTime } from "date-fns";

export function TimestampTool() {
  const [timestamp, setTimestamp] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [localTime, setLocalTime] = useState("");
  const [utcTime, setUtcTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!timestamp) {
      setLocalTime("");
      setUtcTime("");
      setError(null);
      return;
    }

    try {
      let ts = parseInt(timestamp, 10);
      if (isNaN(ts)) throw new Error("Invalid number");

      // auto-detect ms vs seconds
      if (timestamp.length > 11) {
         ts = Math.floor(ts / 1000);
      }

      const d = fromUnixTime(ts);
      setLocalTime(format(d, "yyyy-MM-dd HH:mm:ss (XXX)"));
      setUtcTime(d.toUTCString());
      setError(null);
    } catch (e) {
      setError("Invalid timestamp");
      setLocalTime("");
      setUtcTime("");
    }
  }, [timestamp]);

  const handleNow = () => setTimestamp(Math.floor(Date.now() / 1000).toString());

  return (
    <ToolLayout title="Timestamp Converter" description="Convert Unix timestamps to human-readable dates.">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        <div className="flex items-end gap-4">
           <div className="flex-1 flex flex-col gap-2">
             <Label htmlFor="timestamp">Unix Timestamp (Seconds or MS)</Label>
             <Input 
               id="timestamp"
               value={timestamp}
               onChange={(e) => setTimestamp(e.target.value)}
               className="font-mono text-lg"
               data-testid="input-timestamp"
             />
           </div>
           <Button onClick={handleNow} variant="secondary" data-testid="button-now">Now</Button>
        </div>

        {error ? (
          <div className="p-4 text-destructive font-semibold bg-destructive/10 rounded-md border border-destructive/20 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2 bg-card border rounded-lg p-6 shadow-sm">
               <div className="flex justify-between items-center">
                 <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Local Time</Label>
                 {localTime && <CopyButton text={localTime} className="h-6 text-xs px-2" />}
               </div>
               <div className="font-mono text-xl text-primary mt-2" data-testid="output-local">
                 {localTime}
               </div>
            </div>

            <div className="flex flex-col gap-2 bg-card border rounded-lg p-6 shadow-sm">
               <div className="flex justify-between items-center">
                 <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UTC Time</Label>
                 {utcTime && <CopyButton text={utcTime} className="h-6 text-xs px-2" />}
               </div>
               <div className="font-mono text-xl text-chart-2 mt-2" data-testid="output-utc">
                 {utcTime}
               </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
