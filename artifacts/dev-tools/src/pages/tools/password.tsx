import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export function PasswordTool() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");

  const generate = () => {
    let charset = "";
    if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!charset) {
      setPassword("");
      setStrength("Weak");
      return;
    }

    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(pass);

    // Calculate basic strength
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (length >= 16) score++;
    if (uppercase) score++;
    if (lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;

    if (score < 4) setStrength("Weak");
    else if (score < 6) setStrength("Fair");
    else if (score < 8) setStrength("Strong");
    else setStrength("Very Strong");
  };

  useEffect(() => {
    generate();
  }, [length, uppercase, lowercase, numbers, symbols]);

  return (
    <ToolLayout title="Password Generator" description="Generate secure passwords with configurable constraints.">
      <div className="flex flex-col gap-8 max-w-xl">
        <div className="bg-card p-8 rounded-lg border border-border shadow-sm flex items-center justify-between gap-4">
           <div className="font-mono text-2xl tracking-wider text-foreground break-all" data-testid="text-password">
             {password || "Select options below"}
           </div>
           {password && <CopyButton text={password} />}
        </div>

        <div className="space-y-6">
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <Label>Length: {length}</Label>
               <span className={`text-sm font-semibold ${
                 strength === "Weak" ? "text-destructive" : 
                 strength === "Fair" ? "text-chart-4" : 
                 strength === "Strong" ? "text-primary" : "text-chart-5"
               }`}>
                 {strength}
               </span>
             </div>
             <Slider 
                value={[length]} 
                min={8} 
                max={128} 
                step={1} 
                onValueChange={(val) => setLength(val[0])}
                data-testid="slider-length"
             />
           </div>

           <div className="space-y-4 pt-4">
             <div className="flex items-center justify-between">
               <Label htmlFor="uppercase" className="cursor-pointer">Uppercase (A-Z)</Label>
               <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} data-testid="switch-uppercase" />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="lowercase" className="cursor-pointer">Lowercase (a-z)</Label>
               <Switch id="lowercase" checked={lowercase} onCheckedChange={setLowercase} data-testid="switch-lowercase" />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
               <Switch id="numbers" checked={numbers} onCheckedChange={setNumbers} data-testid="switch-numbers" />
             </div>
             <div className="flex items-center justify-between">
               <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
               <Switch id="symbols" checked={symbols} onCheckedChange={setSymbols} data-testid="switch-symbols" />
             </div>
           </div>

           <div className="pt-4">
             <Button className="w-full" onClick={generate} data-testid="button-generate">Regenerate</Button>
           </div>
        </div>
      </div>
    </ToolLayout>
  );
}
