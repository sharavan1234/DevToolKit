import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useCopyToClipboard() {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const copyToClipboard = useCallback(
    (text: string, description: string = "Text") => {
      if (!text) return;
      
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setIsCopied(true);
          toast({
            title: "Copied!",
            description: `${description} copied to clipboard.`,
          });
        })
        .catch(() => {
          toast({
            title: "Failed to copy",
            description: "An error occurred while copying to clipboard.",
            variant: "destructive",
          });
        });
    },
    [toast]
  );

  return { isCopied, copyToClipboard };
}
