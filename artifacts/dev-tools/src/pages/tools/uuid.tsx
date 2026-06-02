import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function UuidTool() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    let num = Number(count);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 1000) num = 1000;
    
    const newUuids = Array.from({ length: num }, () => uuidv4());
    setUuids(newUuids);
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <ToolLayout title="UUID Generator" description="Generate random UUIDs (version 4).">
      <div className="flex flex-col gap-6 max-w-2xl w-full">
        <div className="flex items-end gap-4">
          <div className="space-y-2 w-32">
            <Label htmlFor="count">How many?</Label>
            <Input 
              id="count" 
              type="number" 
              min={1} 
              max={1000} 
              value={count} 
              onChange={(e) => setCount(parseInt(e.target.value) || 1)} 
              data-testid="input-count"
            />
          </div>
          <Button onClick={generate} data-testid="button-generate">Generate</Button>
          {uuids.length > 0 && <CopyButton text={uuids.join("\n")} />}
        </div>
        
        <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
          <Textarea 
            value={uuids.join("\n")} 
            readOnly 
            className="flex-1 font-mono text-sm bg-muted/30 resize-none p-4"
            data-testid="output-textarea"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
