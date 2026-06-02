import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CryptoJS from "crypto-js";

export function HashTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [algo, setAlgo] = useState("SHA256");

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    
    try {
      let hash = "";
      switch (algo) {
        case "MD5": hash = CryptoJS.MD5(input).toString(); break;
        case "SHA1": hash = CryptoJS.SHA1(input).toString(); break;
        case "SHA256": hash = CryptoJS.SHA256(input).toString(); break;
        case "SHA512": hash = CryptoJS.SHA512(input).toString(); break;
        default: hash = CryptoJS.SHA256(input).toString(); break;
      }
      setOutput(hash);
    } catch (e) {
      setOutput("Error computing hash");
    }
  }, [input, algo]);

  return (
    <ToolLayout title="Hash Generator" description="Generate cryptographic hashes for text.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="input" className="text-sm font-medium">Input Text</Label>
            <Select value={algo} onValueChange={setAlgo}>
              <SelectTrigger className="w-[140px] h-8 text-xs" data-testid="select-algo">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MD5">MD5</SelectItem>
                <SelectItem value="SHA1">SHA-1</SelectItem>
                <SelectItem value="SHA256">SHA-256</SelectItem>
                <SelectItem value="SHA512">SHA-512</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type text to hash..."
            className="flex-1 font-mono resize-none text-sm p-4"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="output" className="text-sm font-medium">{algo} Hash</Label>
            {output && <CopyButton text={output} />}
          </div>
          <div className="relative flex-1 flex flex-col">
            <Textarea
              id="output"
              value={output}
              readOnly
              className="flex-1 font-mono resize-none text-sm p-4 bg-muted/30 break-all"
              data-testid="output-textarea"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
