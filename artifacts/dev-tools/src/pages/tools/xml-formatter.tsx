import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function formatXml(xml: string) {
  let formatted = '';
  let pad = 0;
  const PADDING = '  ';

  // remove newlines and tabs/spaces between tags
  xml = xml.replace(/(>)\s*(<)/g, '$1$2');

  xml.split(/(?=<)|(?<=>)/).forEach(function(node) {
      if (node.match(/^\/\w/)) {
          pad -= 1;
      } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
              pad -= 1;
          }
      }
      
      formatted += PADDING.repeat(pad) + node + '\n';
      
      if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          pad += 1;
      }
  });

  return formatted.trim();
}

export function XmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        throw new Error(parserError.textContent || "Invalid XML");
      }
      
      setOutput(formatXml(input));
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid XML");
    }
  }, [input]);

  return (
    <ToolLayout title="XML Formatter" description="Pretty-print and format XML documents.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <Label htmlFor="input" className="text-sm font-medium h-[36px] flex items-center">Input XML</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<root><child>value</child></root>"
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
