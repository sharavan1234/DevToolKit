import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function generateLorem(count: number, type: "words" | "sentences" | "paragraphs") {
  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
  
  const generateSentence = (wordCount: number) => {
    const words = Array.from({ length: wordCount }, getRandomWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
  };

  if (type === "words") {
    return Array.from({ length: count }, getRandomWord).join(" ");
  }

  if (type === "sentences") {
    return Array.from({ length: count }, () => generateSentence(Math.floor(Math.random() * 8) + 5)).join(" ");
  }

  // paragraphs
  return Array.from({ length: count }, () => {
    const sentenceCount = Math.floor(Math.random() * 5) + 4;
    return Array.from({ length: sentenceCount }, () => generateSentence(Math.floor(Math.random() * 8) + 5)).join(" ");
  }).join("\n\n");
}

export function LoremIpsumTool() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"words" | "sentences" | "paragraphs">("paragraphs");
  const [output, setOutput] = useState("");

  const generate = () => {
    let num = Number(count);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 100) num = 100;
    setOutput(generateLorem(num, type));
  };

  useEffect(() => {
    generate();
  }, [count, type]);

  return (
    <ToolLayout title="Lorem Ipsum" description="Generate placeholder text quickly.">
      <div className="flex flex-col gap-6 max-w-3xl w-full h-full">
        <div className="flex items-end gap-4">
          <div className="space-y-2 w-24">
            <Label htmlFor="count">Count</Label>
            <Input 
              id="count" 
              type="number" 
              min={1} 
              max={100} 
              value={count} 
              onChange={(e) => setCount(parseInt(e.target.value) || 1)} 
              data-testid="input-count"
            />
          </div>
          <div className="space-y-2 w-40">
            <Label>Type</Label>
            <Select value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger data-testid="select-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="sentences">Sentences</SelectItem>
                <SelectItem value="paragraphs">Paragraphs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} data-testid="button-generate">Generate</Button>
          <div className="ml-auto">
             {output && <CopyButton text={output} />}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
          <Textarea 
            value={output} 
            readOnly 
            className="flex-1 font-serif text-base bg-muted/30 resize-none p-6 leading-relaxed"
            data-testid="output-textarea"
          />
        </div>
      </div>
    </ToolLayout>
  );
}
