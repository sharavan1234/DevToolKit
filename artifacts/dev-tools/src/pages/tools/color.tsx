import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// simple hsl/hsv/rgb/hex conversions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function ColorTool() {
  const [color, setColor] = useState("#3B82F6"); // Default primary
  
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 90%, 60%)");
  const [hsv, setHsv] = useState("hsv(217, 76%, 96%)");

  useEffect(() => {
    let validHex = color;
    if (!validHex.startsWith("#")) validHex = "#" + validHex;
    
    const rgbVal = hexToRgb(validHex);
    if (rgbVal) {
      setHex(validHex.toUpperCase());
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
      
      const hsvVal = rgbToHsv(rgbVal.r, rgbVal.g, rgbVal.b);
      setHsv(`hsv(${hsvVal.h}, ${hsvVal.s}%, ${hsvVal.v}%)`);
    }
  }, [color]);

  return (
    <ToolLayout title="Color Converter" description="Convert colors between HEX, RGB, HSL, and HSV.">
      <div className="flex flex-col gap-8 max-w-xl">
        <div className="flex items-center gap-6">
           <div className="flex flex-col gap-2">
             <Label>Pick Color</Label>
             <Input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
                className="w-24 h-24 p-1 cursor-pointer rounded-md"
                data-testid="input-color-picker"
             />
           </div>
           <div 
             className="flex-1 h-24 rounded-md shadow-inner border border-border" 
             style={{ backgroundColor: color }}
             data-testid="display-color-swatch"
           />
        </div>

        <div className="grid grid-cols-1 gap-4">
           {[
             { label: "HEX", value: hex },
             { label: "RGB", value: rgb },
             { label: "HSL", value: hsl },
             { label: "HSV", value: hsv },
           ].map((fmt) => (
             <div key={fmt.label} className="flex items-center gap-4 bg-muted/30 p-3 rounded-md border border-border">
               <Label className="w-12 font-bold text-muted-foreground">{fmt.label}</Label>
               <Input value={fmt.value} readOnly className="font-mono bg-transparent border-none focus-visible:ring-0 text-foreground" data-testid={`input-${fmt.label.toLowerCase()}`} />
               <CopyButton text={fmt.value} />
             </div>
           ))}
        </div>
      </div>
    </ToolLayout>
  );
}
