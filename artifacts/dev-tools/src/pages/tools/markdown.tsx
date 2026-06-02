import { useState, useEffect } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { marked } from "marked";

export function MarkdownTool() {
  const [input, setInput] = useState("# Hello Markdown\n\nWrite some markdown here.\n\n- It parses\n- in real time\n\n```js\nconst x = 1;\n```");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const parse = async () => {
      const html = await marked.parse(input);
      setOutput(html);
    };
    parse();
  }, [input]);

  return (
    <ToolLayout title="Markdown Previewer" description="Live preview of Markdown rendering.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label htmlFor="input" className="text-sm font-medium">Markdown</Label>
            {input && <CopyButton text={input} />}
          </div>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 font-mono resize-none text-sm p-4"
            data-testid="input-textarea"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex items-center justify-between h-[36px]">
            <Label className="text-sm font-medium">Preview</Label>
            {output && <CopyButton text={output} />}
          </div>
          <div className="relative flex-1 flex flex-col border rounded-md bg-card overflow-auto p-6 prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: output }} data-testid="markdown-preview" />
        </div>
      </div>
    </ToolLayout>
  );
}
