import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";

import { Base64Tool } from "@/pages/tools/base64";
import { UrlEncodeTool } from "@/pages/tools/url-encode";
import { JsonFormatterTool } from "@/pages/tools/json-formatter";
import { UuidTool } from "@/pages/tools/uuid";
import { HtmlEntitiesTool } from "@/pages/tools/html-entities";
import { JwtDecodeTool } from "@/pages/tools/jwt-decode";
import { XmlFormatterTool } from "@/pages/tools/xml-formatter";
import { SqlFormatterTool } from "@/pages/tools/sql-formatter";
import { MarkdownTool } from "@/pages/tools/markdown";
import { HashTool } from "@/pages/tools/hash";
import { LoremIpsumTool } from "@/pages/tools/lorem-ipsum";
import { PasswordTool } from "@/pages/tools/password";

// New tools
import { ColorTool } from "@/pages/tools/color";
import { DiffTool } from "@/pages/tools/diff";
import { RegexTool } from "@/pages/tools/regex";
import { WordCounterTool } from "@/pages/tools/word-counter";
import { CaseConverterTool } from "@/pages/tools/case-converter";
import { TimestampTool } from "@/pages/tools/timestamp";
import { NumberBaseTool } from "@/pages/tools/number-base";
import { CronTool } from "@/pages/tools/cron";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Encoding / Decoding */}
        <Route path="/base64" component={Base64Tool} />
        <Route path="/url-encode" component={UrlEncodeTool} />
        <Route path="/html-entities" component={HtmlEntitiesTool} />
        <Route path="/jwt-decode" component={JwtDecodeTool} />

        {/* Formatters */}
        <Route path="/json-formatter" component={JsonFormatterTool} />
        <Route path="/xml-formatter" component={XmlFormatterTool} />
        <Route path="/sql-formatter" component={SqlFormatterTool} />
        <Route path="/markdown" component={MarkdownTool} />

        {/* Generators */}
        <Route path="/uuid" component={UuidTool} />
        <Route path="/hash" component={HashTool} />
        <Route path="/lorem-ipsum" component={LoremIpsumTool} />
        <Route path="/password" component={PasswordTool} />
        <Route path="/color" component={ColorTool} />

        {/* Text Utilities */}
        <Route path="/diff" component={DiffTool} />
        <Route path="/regex" component={RegexTool} />
        <Route path="/word-counter" component={WordCounterTool} />
        <Route path="/case-converter" component={CaseConverterTool} />

        {/* Number & Date */}
        <Route path="/timestamp" component={TimestampTool} />
        <Route path="/number-base" component={NumberBaseTool} />
        <Route path="/cron" component={CronTool} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="devtools-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
