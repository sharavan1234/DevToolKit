import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function UrlEncodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput("Invalid URL encoding");
    }
  }, [input, mode]);

  return (
    <ToolLayout title="URL Encode/Decode" description="Encode or decode URLs and query string parameters.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between">
            <Label htmlFor="input" className="text-sm font-medium">Input</Label>
            <div className="flex items-center bg-muted rounded-md p-1">
              <button
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === "encode" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setMode("encode")}
                data-testid="button-mode-encode"
              >
                Encode
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === "decode" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setMode("decode")}
                data-testid="button-mode-decode"
              >
                Decode
              </button>
            </div>
          </div>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste URL encoded string..."}
            className="flex-1 font-mono resize-none text-sm p-4"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="output" className="text-sm font-medium">Output</Label>
            {output && output !== "Invalid URL encoding" && (
              <CopyButton text={output} />
            )}
          </div>
          <div className="relative flex-1 flex flex-col">
            <Textarea
              id="output"
              value={output}
              readOnly
              className={`flex-1 font-mono resize-none text-sm p-4 bg-muted/30 ${output === "Invalid URL encoding" ? "text-destructive" : ""}`}
              data-testid="output-textarea"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
