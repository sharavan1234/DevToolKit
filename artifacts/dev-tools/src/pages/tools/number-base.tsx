import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function NumberBaseTool() {
  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [octal, setOctal] = useState("");
  const [hex, setHex] = useState("");

  const updateFromBase = (val: string, base: number) => {
    if (!val) {
      setDecimal("");
      setBinary("");
      setOctal("");
      setHex("");
      return;
    }

    try {
      // Allow hex to have '0x' or binary to have '0b' etc if pasted, remove them for parsing
      let cleanVal = val.toLowerCase().replace(/^(0x|0b|0o)/, "");
      
      const num = parseInt(cleanVal, base);
      if (isNaN(num)) throw new Error("NaN");

      setDecimal(num.toString(10));
      setBinary(num.toString(2));
      setOctal(num.toString(8));
      setHex(num.toString(16).toUpperCase());
    } catch {
      // Just keep what they typed but don't update others to show it's invalid
    }
  };

  return (
    <ToolLayout title="Number Base Converter" description="Convert numbers between decimal, binary, octal, and hex instantly.">
      <div className="flex flex-col gap-4 max-w-2xl w-full">
        <div className="bg-muted/30 p-4 border rounded-md mb-4">
          <p className="text-sm text-muted-foreground">Type in any field to instantly convert to all other bases.</p>
        </div>

        {[
          { id: "decimal", label: "Decimal (Base 10)", value: decimal, base: 10 },
          { id: "binary", label: "Binary (Base 2)", value: binary, base: 2 },
          { id: "octal", label: "Octal (Base 8)", value: octal, base: 8 },
          { id: "hex", label: "Hexadecimal (Base 16)", value: hex, base: 16 },
        ].map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={item.id} className="text-sm font-semibold">{item.label}</Label>
              {item.value && <CopyButton text={item.value} className="h-6 text-xs px-2" />}
            </div>
            <Input 
              id={item.id}
              value={item.value}
              onChange={(e) => {
                const val = e.target.value;
                if (item.id === "decimal") setDecimal(val);
                if (item.id === "binary") setBinary(val);
                if (item.id === "octal") setOctal(val);
                if (item.id === "hex") setHex(val);
                updateFromBase(val, item.base);
              }}
              className="font-mono text-lg h-12"
              data-testid={`input-${item.id}`}
            />
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
