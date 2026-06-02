import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const TOOLS = [
  {
    category: "Encoding / Decoding",
    items: [
      { name: "Base64", path: "/base64" },
      { name: "URL Encode/Decode", path: "/url-encode" },
      { name: "HTML Entities", path: "/html-entities" },
      { name: "JWT Decoder", path: "/jwt-decode" },
    ],
  },
  {
    category: "Formatters",
    items: [
      { name: "JSON Formatter", path: "/json-formatter" },
      { name: "XML Formatter", path: "/xml-formatter" },
      { name: "SQL Formatter", path: "/sql-formatter" },
      { name: "Markdown Previewer", path: "/markdown" },
    ],
  },
  {
    category: "Generators",
    items: [
      { name: "UUID Generator", path: "/uuid" },
      { name: "Hash Generator", path: "/hash" },
      { name: "Lorem Ipsum", path: "/lorem-ipsum" },
      { name: "Password Generator", path: "/password" },
      { name: "Color Converter", path: "/color" },
    ],
  },
  {
    category: "Text Utilities",
    items: [
      { name: "Diff Viewer", path: "/diff" },
      { name: "Regex Tester", path: "/regex" },
      { name: "Word Counter", path: "/word-counter" },
      { name: "Case Converter", path: "/case-converter" },
    ],
  },
  {
    category: "Number & Date",
    items: [
      { name: "Timestamp Converter", path: "/timestamp" },
      { name: "Number Base", path: "/number-base" },
      { name: "Cron Explainer", path: "/cron" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("sidebar-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTools = TOOLS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border w-64 flex-shrink-0">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded flex items-center justify-center text-sidebar-primary-foreground font-bold">
            DT
          </div>
          <span className="font-bold text-lg text-sidebar-foreground tracking-tight">DevTools</span>
        </Link>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="sidebar-search"
            type="text"
            placeholder="Search tools... (/)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background border-sidebar-border text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {filteredTools.length === 0 ? (
          <div className="px-4 text-sm text-muted-foreground text-center">No tools found</div>
        ) : (
          filteredTools.map((group) => (
            <div key={group.category} className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
                {group.category}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block px-4 py-1.5 text-sm transition-colors ${
                        location === item.path
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-sidebar-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">Theme</span>
        <div className="flex gap-1 bg-background rounded-md border border-sidebar-border p-1">
          <button
            onClick={() => setTheme("light")}
            className={`p-1.5 rounded-sm ${theme === "light" ? "bg-sidebar text-sidebar-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            title="Light Mode"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-1.5 rounded-sm ${theme === "dark" ? "bg-sidebar text-sidebar-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            title="Dark Mode"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`p-1.5 rounded-sm ${theme === "system" ? "bg-sidebar text-sidebar-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            title="System Theme"
          >
            <Laptop className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
