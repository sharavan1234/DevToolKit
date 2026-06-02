import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "sql-formatter";

export function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState("mysql");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
    try {
      const formatted = format(input, { language: dialect as any });
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Formatting error");
      // keep previous output but show error state if wanted, or clear it
    }
  }, [input, dialect]);

  return (
    <ToolLayout title="SQL Formatter" description="Format SQL queries for better readability.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="input" className="text-sm font-medium">Input SQL</Label>
            <Select value={dialect} onValueChange={setDialect}>
              <SelectTrigger className="w-[140px] h-8 text-xs" data-testid="select-dialect">
                <SelectValue placeholder="Select dialect" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="bigquery">BigQuery</SelectItem>
                <SelectItem value="sql">Standard SQL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT * FROM users WHERE active = 1"
            className="flex-1 font-mono resize-none text-sm p-4"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="output" className="text-sm font-medium">
              {error ? <span className="text-destructive font-semibold">Error</span> : "Formatted SQL"}
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
