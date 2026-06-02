import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Base64 } from "js-base64";

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    try {
      if (mode === "encode") {
        setOutput(Base64.encode(input));
      } else {
        // Try decoding
        if (Base64.isValid(input) || input === "") {
           setOutput(Base64.decode(input));
        } else {
           setOutput("Invalid Base64 string");
        }
      }
    } catch (e) {
      setOutput("Error processing string");
    }
  }, [input, mode]);

  // Auto-detect mode based on input heuristically when input is pasted, if empty just default
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 0 && mode === "encode" && Base64.isValid(val) && !val.includes(" ")) {
       // user might be pasting base64 to decode
       // let's leave it manual to avoid jarring UI changes
    }
  };

  return (
    <ToolLayout title="Base64 Encode/Decode" description="Encode text to Base64 or decode Base64 to text.">
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
            onChange={handleInputChange}
            placeholder={mode === "encode" ? "Type or paste text to encode..." : "Paste Base64 to decode..."}
            className="flex-1 font-mono resize-none text-sm p-4"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="output" className="text-sm font-medium">Output</Label>
            {output && output !== "Invalid Base64 string" && output !== "Error processing string" && (
              <CopyButton text={output} />
            )}
          </div>
          <div className="relative flex-1 flex flex-col">
            <Textarea
              id="output"
              value={output}
              readOnly
              className={`flex-1 font-mono resize-none text-sm p-4 bg-muted/30 ${(output === "Invalid Base64 string" || output === "Error processing string") ? "text-destructive" : ""}`}
              data-testid="output-textarea"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
