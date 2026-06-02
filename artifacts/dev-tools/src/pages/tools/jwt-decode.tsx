import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function JwtDecodeTool() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState<string>("");
  const [payload, setPayload] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setHeader("");
      setPayload("");
      setError(null);
      setIsExpired(false);
      return;
    }

    try {
      const parts = input.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format (must have 3 parts)");
      }

      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        if (pad) {
          if (pad === 1) throw new Error("Invalid base64 string");
          base64 += new Array(5 - pad).join("=");
        }
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      };

      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);

      if (decodedPayload.exp) {
        const expTime = decodedPayload.exp * 1000;
        setIsExpired(Date.now() > expTime);
      } else {
        setIsExpired(false);
      }
    } catch (e: any) {
      setError(e.message || "Invalid JWT");
      setHeader("");
      setPayload("");
      setIsExpired(false);
    }
  }, [input]);

  return (
    <ToolLayout title="JWT Decoder" description="Decode JSON Web Tokens (JWT) client-side.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <Label htmlFor="input" className="text-sm font-medium h-[36px] flex items-center">Input Token</Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="flex-1 font-mono resize-none text-sm p-4 break-all"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-[36px]">
              <Label className="text-sm font-medium text-destructive">{error && "Invalid JWT"}</Label>
              {header && <CopyButton text={header} className="h-7 text-xs" />}
            </div>
            {header && (
              <div className="relative">
                <Label className="absolute top-2 right-4 text-xs font-semibold text-muted-foreground">HEADER</Label>
                <Textarea
                  value={header}
                  readOnly
                  className="h-[150px] font-mono resize-none text-sm p-4 bg-muted/30 text-chart-2"
                  data-testid="output-header"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
               {payload && <CopyButton text={payload} className="h-7 text-xs" />}
               {payload && isExpired && <span className="text-xs font-semibold text-destructive px-2 py-1 bg-destructive/10 rounded">Expired Token</span>}
            </div>
            {payload && (
              <div className="relative flex-1 flex flex-col">
                 <Label className="absolute top-2 right-4 text-xs font-semibold text-muted-foreground">PAYLOAD</Label>
                 <Textarea
                    value={payload}
                    readOnly
                    className="flex-1 font-mono resize-none text-sm p-4 bg-muted/30 text-chart-4"
                    data-testid="output-payload"
                  />
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
