import React from "react";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-clipboard";
import { Button } from "@/components/ui/button";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto w-full flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={() => copyToClipboard(text)}
      data-testid="button-copy"
    >
      {isCopied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
      {isCopied ? "Copied" : "Copy"}
    </Button>
  );
}
