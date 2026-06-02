import { Link } from "wouter";
import { Wrench, Hash, Type, Calculator, Clock, FileJson, Link as LinkIcon, Lock } from "lucide-react";

export function Home() {
  const featured = [
    { name: "JSON Formatter", path: "/json-formatter", icon: FileJson, desc: "Format, validate, and minify JSON" },
    { name: "Base64", path: "/base64", icon: Hash, desc: "Encode and decode Base64 strings" },
    { name: "URL Encode", path: "/url-encode", icon: LinkIcon, desc: "Encode and decode URLs safely" },
    { name: "Word Counter", path: "/word-counter", icon: Type, desc: "Count words, characters, and sentences" },
    { name: "UUID Generator", path: "/uuid", icon: Lock, desc: "Generate unique identifiers" },
    { name: "Timestamp Converter", path: "/timestamp", icon: Clock, desc: "Convert Unix timestamps to dates" },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Developer Utilities Toolkit</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Your local cockpit for everyday developer tasks. Encode, decode, format, and generate data entirely client-side without leaving your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.path} href={tool.path} className="block group">
              <div className="p-5 h-full rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:border-primary hover:shadow-md hover-elevate">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold">{tool.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
