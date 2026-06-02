import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";

export function WordCounterTool() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setStats({ words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, readingTime: 0 });
      return;
    }

    const words = trimmed.split(/\s+/).length;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length || (trimmed ? 1 : 0);
    const paragraphs = trimmed.split(/\n\s*\n/).length;
    const readingTime = Math.ceil(words / 200);

    setStats({ words, chars, charsNoSpaces, sentences, paragraphs, readingTime });
  }, [text]);

  return (
    <ToolLayout title="Word Counter" description="Count words, characters, sentences, and paragraphs.">
      <div className="flex flex-col gap-6 h-full flex-1 max-w-4xl w-full">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.chars },
            { label: "Chars (No Space)", value: stats.charsNoSpaces },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Reading Time", value: `${stats.readingTime} min` },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-2xl font-bold text-primary" data-testid={`stat-${stat.label.toLowerCase().replace(/[^a-z]/g, "")}`}>{stat.value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="flex-1 resize-none text-base p-6 leading-relaxed bg-muted/10"
            data-testid="input-textarea"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
