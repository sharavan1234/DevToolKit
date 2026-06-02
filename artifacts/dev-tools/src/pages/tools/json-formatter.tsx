import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formatJson = (space: number) => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, space));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  };

  useEffect(() => {
    formatJson(2);
  }, [input]);

  const handleMinify = () => formatJson(0);
  const handleFormat = () => formatJson(2);

  return (
    <ToolLayout title="JSON Formatter" description="Pretty-print, validate, and minify JSON data.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="input" className="text-sm font-medium">Input JSON</Label>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleMinify} data-testid="button-minify">Minify</Button>
              <Button variant="secondary" size="sm" onClick={handleFormat} data-testid="button-format">Format</Button>
            </div>
          </div>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="flex-1 font-mono resize-none text-sm p-4"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="output" className="text-sm font-medium">
              {error ? <span className="text-destructive font-semibold">Error</span> : "Output"}
            </Label>
            {output && !error && <CopyButton text={output} />}
          </div>
          <div className="relative flex-1 flex flex-col">
            <Textarea
              id="output"
              value={error ? error : output}
              readOnly
              className={`flex-1 font-mono resize-none text-sm p-4 bg-muted/30 ${error ? "text-destructive border-destructive" : ""}`}
              data-testid="output-textarea"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
