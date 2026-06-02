import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function RegexTool() {
  const [regexStr, setRegexStr] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState("");
  
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regexStr) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const flagStr = Object.entries(flags).filter(([_, v]) => v).map(([k]) => k).join("");
      const regex = new RegExp(regexStr, flagStr);
      
      const newMatches = [];
      let match;
      if (flags.g) {
         while ((match = regex.exec(testString)) !== null) {
           newMatches.push(match);
           if (match.index === regex.lastIndex) regex.lastIndex++; // prevent infinite loops on 0-length matches
         }
      } else {
         match = regex.exec(testString);
         if (match) newMatches.push(match);
      }
      
      setMatches(newMatches);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [regexStr, flags, testString]);

  return (
    <ToolLayout title="Regex Tester" description="Test regular expressions against strings with live match highlighting.">
      <div className="flex flex-col gap-6 max-w-4xl w-full h-full">
        <div className="flex flex-col gap-2">
          <Label>Regular Expression</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-muted rounded-md border border-border px-3 overflow-hidden">
               <span className="text-muted-foreground font-mono">/</span>
               <Input 
                 value={regexStr} 
                 onChange={(e) => setRegexStr(e.target.value)} 
                 className="border-none bg-transparent font-mono focus-visible:ring-0 px-1 shadow-none h-10" 
                 placeholder="pattern"
                 data-testid="input-regex"
               />
               <span className="text-muted-foreground font-mono">/</span>
               <span className="text-primary font-mono ml-1 font-bold">
                 {Object.entries(flags).filter(([_, v]) => v).map(([k]) => k).join("")}
               </span>
            </div>
          </div>
          {error && <span className="text-sm text-destructive font-semibold">{error}</span>}
          
          <div className="flex items-center gap-6 mt-2">
             {[
               { id: "g", label: "Global (g)" },
               { id: "i", label: "Case Insensitive (i)" },
               { id: "m", label: "Multiline (m)" },
               { id: "s", label: "Dotall (s)" },
             ].map((f) => (
               <div key={f.id} className="flex items-center gap-2">
                 <Checkbox 
                   id={`flag-${f.id}`} 
                   checked={flags[f.id as keyof typeof flags]} 
                   onCheckedChange={(c) => setFlags({ ...flags, [f.id]: !!c })}
                   data-testid={`checkbox-flag-${f.id}`}
                 />
                 <Label htmlFor={`flag-${f.id}`} className="cursor-pointer text-xs font-normal">{f.label}</Label>
               </div>
             ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-[200px]">
          <Label>Test String</Label>
          <Textarea 
            value={testString} 
            onChange={(e) => setTestString(e.target.value)}
            className="flex-1 font-mono resize-none text-sm p-4"
            placeholder="Type your test string here..."
            data-testid="input-test-string"
          />
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-[200px]">
           <Label>Matches ({matches.length})</Label>
           <div className="flex-1 bg-muted/30 border rounded-md p-4 overflow-y-auto font-mono text-sm" data-testid="match-results">
             {matches.length === 0 ? (
               <span className="text-muted-foreground">No matches</span>
             ) : (
               <div className="space-y-4">
                 {matches.map((m, i) => (
                   <div key={i} className="bg-card border rounded p-3 shadow-sm">
                     <div className="font-bold text-primary mb-2">Match {i + 1}</div>
                     <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                        <span className="text-muted-foreground">Full match</span>
                        <span className="bg-muted px-1 rounded break-all">{m[0]}</span>
                        {m.slice(1).map((group, gi) => (
                          <div key={gi} className="col-span-2 grid grid-cols-[auto_1fr] gap-x-4">
                            <span className="text-muted-foreground">Group {gi + 1}</span>
                            <span className="bg-muted px-1 rounded break-all">{group !== undefined ? group : <em className="text-muted-foreground">undefined</em>}</span>
                          </div>
                        ))}
                        <span className="text-muted-foreground mt-2">Index</span>
                        <span className="mt-2 text-chart-4">{m.index}</span>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    </ToolLayout>
  );
}
