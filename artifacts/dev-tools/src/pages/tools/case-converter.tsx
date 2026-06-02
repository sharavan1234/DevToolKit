import { useState } from "react";
import { ToolLayout, CopyButton } from "@/components/tool-layout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function toCamelCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

function toPascalCase(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
    return word.toUpperCase();
  }).replace(/\s+/g, '');
}

function toSnakeCase(str: string) {
  return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('_') || str;
}

function toKebabCase(str: string) {
  return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('-') || str;
}

function toScreamingSnakeCase(str: string) {
  return toSnakeCase(str).toUpperCase();
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

export function CaseConverterTool() {
  const [text, setText] = useState("");

  const formats = [
    { label: "camelCase", value: text ? toCamelCase(text) : "" },
    { label: "PascalCase", value: text ? toPascalCase(text) : "" },
    { label: "snake_case", value: text ? toSnakeCase(text) : "" },
    { label: "kebab-case", value: text ? toKebabCase(text) : "" },
    { label: "SCREAMING_SNAKE_CASE", value: text ? toScreamingSnakeCase(text) : "" },
    { label: "Title Case", value: text ? toTitleCase(text) : "" },
    { label: "UPPER CASE", value: text ? text.toUpperCase() : "" },
    { label: "lower case", value: text ? text.toLowerCase() : "" },
  ];

  return (
    <ToolLayout title="Case Converter" description="Convert text to various programming casing conventions instantly.">
      <div className="flex flex-col gap-6 max-w-4xl w-full h-full">
        <div className="flex flex-col gap-2">
          <Label>Input Text</Label>
          <Textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a variable name or sentence..."
            className="font-mono resize-none text-sm p-4 h-24"
            data-testid="input-textarea"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((fmt) => (
            <div key={fmt.label} className="flex flex-col gap-2 bg-card border rounded-lg p-4 shadow-sm">
               <div className="flex justify-between items-center">
                 <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{fmt.label}</Label>
                 {fmt.value && <CopyButton text={fmt.value} className="h-6 text-xs px-2" />}
               </div>
               <div className="font-mono text-sm break-all text-foreground min-h-[1.5rem]" data-testid={`output-${fmt.label.replace(/\s+/g, '-').toLowerCase()}`}>
                 {fmt.value}
               </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
