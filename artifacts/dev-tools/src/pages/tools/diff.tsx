import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { diffWordsWithSpace, diffLines } from "diff";

export function DiffTool() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [mode, setMode] = useState<"words" | "lines">("words");

  const diff = mode === "words" ? diffWordsWithSpace(oldText, newText) : diffLines(oldText, newText);

  return (
    <ToolLayout title="Diff Viewer" description="Compare two text snippets to find additions and removals.">
      <div className="flex flex-col gap-4 h-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[40%]">
          <div className="flex flex-col gap-2 h-full">
            <Label htmlFor="oldText" className="text-sm font-medium">Original Text</Label>
            <Textarea
              id="oldText"
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
              className="flex-1 font-mono resize-none text-sm p-4"
              data-testid="input-old-text"
            />
          </div>
          <div className="flex flex-col gap-2 h-full">
            <Label htmlFor="newText" className="text-sm font-medium">New Text</Label>
            <Textarea
              id="newText"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste new text here..."
              className="flex-1 font-mono resize-none text-sm p-4"
              data-testid="input-new-text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 h-[60%]">
          <div className="flex items-center justify-between h-[36px]">
             <Label className="text-sm font-medium">Diff Result</Label>
             <div className="flex items-center bg-muted rounded-md p-1">
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === "words" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setMode("words")}
                  data-testid="button-mode-words"
                >
                  Words
                </button>
                <button
                  className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${mode === "lines" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setMode("lines")}
                  data-testid="button-mode-lines"
                >
                  Lines
                </button>
             </div>
          </div>
          <div className="flex-1 border rounded-md bg-card p-4 overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed" data-testid="diff-result">
            {diff.map((part, index) => {
              let className = "text-foreground";
              if (part.added) className = "bg-green-500/20 text-green-600 dark:text-green-400 rounded-sm";
              if (part.removed) className = "bg-red-500/20 text-red-600 dark:text-red-400 rounded-sm line-through";
              return (
                <span key={index} className={className}>
                  {part.value}
                </span>
              );
            })}
            {!oldText && !newText && <span className="text-muted-foreground">Waiting for input...</span>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
