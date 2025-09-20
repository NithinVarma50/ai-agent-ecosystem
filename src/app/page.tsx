"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Badge
} from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Simple utility in case cn is not present; keep existing utility if available
// ... keep existing code ...

const agentsCatalog = [
  { id: "orchestrator", label: "Orchestrator", role: "Plans, assigns, merges", color: "#7c3aed" },
  { id: "frontend", label: "Frontend", role: "UI/UX, components", color: "#0ea5e9" },
  { id: "backend", label: "Backend", role: "APIs, data models", color: "#10b981" },
  { id: "payments", label: "Payments", role: "Stripe/PayPal", color: "#eab308" },
  { id: "testing", label: "Testing", role: "QA, automation", color: "#ef4444" },
  { id: "research", label: "Research", role: "Sources, facts", color: "#22d3ee" },
  { id: "writer", label: "Writer", role: "Docs, summaries", color: "#f97316" },
  { id: "translation", label: "Translation", role: "i18n/localization", color: "#94a3b8" },
  { id: "map", label: "Delivery-Map", role: "Geo & routing", color: "#84cc16" },
];

const presets = [
  {
    id: "travel-site",
    label: "Build a modern travel booking website",
    steps: [
      { from: "orchestrator", to: "frontend", note: "Design hero + search UI" },
      { from: "orchestrator", to: "backend", note: "Create trips & booking APIs" },
      { from: "orchestrator", to: "payments", note: "Add Stripe checkout" },
      { from: "frontend", to: "testing", note: "Run visual/regression tests" },
      { from: "backend", to: "testing", note: "Validate endpoints" },
      { from: "testing", to: "orchestrator", note: "Report & auto-fix" },
    ],
  },
  {
    id: "research-report",
    label: "Produce a fact-checked research report",
    steps: [
      { from: "orchestrator", to: "research", note: "Gather credible sources" },
      { from: "orchestrator", to: "writer", note: "Draft narrative" },
      { from: "research", to: "writer", note: "Hand off citations" },
      { from: "testing", to: "writer", note: "Lint & format" },
      { from: "writer", to: "orchestrator", note: "Deliver final report" },
    ],
  },
  {
    id: "food-delivery",
    label: "Create a food delivery app",
    steps: [
      { from: "orchestrator", to: "backend", note: "Orders, restaurants, drivers" },
      { from: "orchestrator", to: "frontend", note: "Customer & courier apps" },
      { from: "orchestrator", to: "map", note: "Live delivery routes" },
      { from: "orchestrator", to: "payments", note: "Payouts & charges" },
      { from: "testing", to: "orchestrator", note: "Integration and e2e tests" },
    ],
  },
];

function useDarkToggle() {
  const [dark, setDark] = useState<boolean>(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return { dark, setDark } as const;
}

function NetworkCanvas() {
  // Animated network nodes to convey collaboration
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useMemo(() => {
    return agentsCatalog.map((a, i) => ({
      id: a.id,
      label: a.label,
      color: a.color,
      angle: (i / agentsCatalog.length) * Math.PI * 2,
      radius: 140 + (i % 3) * 18,
    }));
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl aspect-[16/9] mx-auto">
      <svg className="absolute inset-0" viewBox="0 0 800 450">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="translate(400 225)">
          {nodes.map((n, idx) => (
            <motion.g
              key={n.id}
              animate={{ rotate: 360 }}
              transition={{ duration: 60 + idx * 3, repeat: Infinity, ease: "linear" }}
            >
              <circle cx={Math.cos(n.angle) * n.radius} cy={Math.sin(n.angle) * n.radius} r={2} fill={n.color} />
            </motion.g>
          ))}
          {nodes.map((n, idx) => (
            <motion.g
              key={n.id + "label"}
              animate={{ rotate: -360 }}
              transition={{ duration: 80 + idx * 2, repeat: Infinity, ease: "linear" }}
            >
              <g transform={`translate(${Math.cos(n.angle) * (n.radius + 22)} ${Math.sin(n.angle) * (n.radius + 22)})`}>
                <rect x={-28} y={-12} width={56} height={24} rx={6} fill={n.color} opacity={0.1} />
                <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={n.color}>
                  {n.label}
                </text>
              </g>
            </motion.g>
          ))}
          <circle r={60} fill="url(#glow)" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="currentColor">
            Orchestrator
          </text>
        </g>
      </svg>
    </div>
  );
}

function FlowChart() {
  const steps = [
    { id: 1, title: "Prompt", desc: "User describes the goal" },
    { id: 2, title: "Analyze", desc: "Orchestrator plans tasks" },
    { id: 3, title: "Assign", desc: "Best agents selected" },
    { id: 4, title: "Collaborate", desc: "Agents exchange results" },
    { id: 5, title: "Merge", desc: "Orchestrator integrates" },
    { id: 6, title: "Deliver", desc: "Final output returned" },
  ];
  const [active, setActive] = useState<number>(2);
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
        {steps.map((s, i) => (
          <Card
            key={s.id}
            className={cn(
              "relative overflow-hidden cursor-pointer border-muted hover:border-primary/40 transition-colors",
              active === s.id && "ring-2 ring-primary/60"
            )}
            onMouseEnter={() => setActive(s.id)}
            onClick={() => setActive(s.id)}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm">{s.title}</CardTitle>
              <CardDescription className="text-xs">{s.desc}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-muted-foreground">
                    <path d="M4 12h14M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            {active === 1 && "A single prompt describes the outcome, not the steps."}
            {active === 2 && "The orchestrator breaks work into tasks and dependencies."}
            {active === 3 && "Agents are selected from the ecosystem based on skills and trust."}
            {active === 4 && "Agents exchange artifacts, review each other, and iterate."}
            {active === 5 && "Results are validated and merged into a coherent whole."}
            {active === 6 && "A polished deliverable is returned to the user."}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Simulation() {
  const [presetId, setPresetId] = useState<string>(presets[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const preset = useMemo(() => presets.find((p) => p.id === presetId)!, [presetId]);
  const log = preset.steps.slice(0, stepIndex);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setStepIndex((i) => {
        if (i < preset.steps.length) return i + 1;
        return i;
      });
    }, 1100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, preset.steps.length]);

  useEffect(() => {
    if (stepIndex >= preset.steps.length) setRunning(false);
  }, [stepIndex, preset.steps.length]);

  useEffect(() => {
    setStepIndex(0);
    setRunning(false);
  }, [presetId]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Agent Orchestration</CardTitle>
          <CardDescription>Watch the orchestrator assign and collect work in real-time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="w-64">
              <Select value={presetId} onValueChange={setPresetId}>
                <SelectTrigger aria-label="Choose a scenario">
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel-site">Build a modern travel booking website</SelectItem>
                  <SelectItem value="research-report">Produce a fact-checked research report</SelectItem>
                  <SelectItem value="food-delivery">Create a food delivery app</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => { setStepIndex(0); setRunning(true); }}>Run</Button>
              <Button variant="ghost" onClick={() => { setRunning(false); }}>Pause</Button>
              <Button variant="outline" onClick={() => { setStepIndex(0); setRunning(false); }}>Reset</Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 min-h-[260px]">
              {agentsCatalog.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-md border bg-background">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.role}</div>
                  </div>
                  <Badge variant="outline">Agent</Badge>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {log.map((s, i) => {
                const from = agentsCatalog.find((a) => a.id === s.from)!;
                const to = agentsCatalog.find((a) => a.id === s.to)!;
                return (
                  <motion.div
                    key={`${s.from}-${s.to}-${i}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ background: from.color }} />
                      {from.label}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ background: to.color }} />
                      {to.label}
                    </span>
                    <span className="text-muted-foreground">· {s.note}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Message Stream</CardTitle>
          <CardDescription>Outputs and feedback shared between agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
            {log.length === 0 && (
              <div className="text-sm text-muted-foreground">No messages yet. Press Run to start the simulation.</div>
            )}
            {log.map((s, i) => (
              <div key={`msg-${i}`} className="p-3 rounded-md border">
                <div className="text-xs mb-1 text-muted-foreground">Step {i + 1}</div>
                <div className="text-sm">
                  <span className="font-medium">{agentsCatalog.find((a) => a.id === s.from)!.label}</span>
                  <span className="mx-1 text-muted-foreground">→</span>
                  <span className="font-medium">{agentsCatalog.find((a) => a.id === s.to)!.label}</span>
                  <span className="mx-2 text-muted-foreground">{s.note}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function HomePage() {
  const { dark, setDark } = useDarkToggle();

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        {/* Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b bg-background/70">
          <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between">
            <a href="#home" className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
              <span className="text-sm font-semibold">AI Digital Ecosystem</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a>
              <a href="#simulation" className="text-muted-foreground hover:text-foreground">Simulation</a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground">Benefits</a>
              <a href="#examples" className="text-muted-foreground hover:text-foreground">Examples</a>
              <a href="#usp" className="text-muted-foreground hover:text-foreground">Why different</a>
            </nav>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Light</span>
                    <Switch checked={dark} onCheckedChange={setDark} />
                    <span className="text-xs text-muted-foreground">Dark</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="home" className="relative">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">Open-Source</Badge>
                  <Badge variant="secondary">Multi-Agent</Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                  AI Digital Ecosystem: A new era of collaborative intelligence
                </h1>
                <p className="mt-4 text-muted-foreground text-base md:text-lg">
                  A centralized, open platform where specialized AI agents live together, coordinate through an orchestrator, and deliver high‑quality results—faster and with fewer errors.
                </p>
                <div className="mt-6 text-sm text-muted-foreground">
                  Purely informational and educational. No sign‑ups. No hype. Just clarity.
                </div>
              </div>
              <div>
                <NetworkCanvas />
                <div className="mt-3 text-center text-xs text-muted-foreground">Agents orbiting and collaborating around the Orchestrator</div>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        </section>

        {/* How it Works */}
        <section id="how" className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold">How it works</h2>
            <p className="mt-2 text-muted-foreground">
              The orchestrator delegates tasks to the best agents, who collaborate automatically and return a finished product.
            </p>
          </div>
          <div className="mt-8">
            <FlowChart />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Simulation */}
        <section id="simulation" className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3">
              <h2 className="text-2xl md:text-3xl font-semibold">Interactive simulation</h2>
              <p className="mt-2 text-muted-foreground">
                Choose a scenario and watch how agents coordinate end‑to‑end. This is a simplified visualization for learning purposes.
              </p>
            </div>
            <div className="lg:col-span-2 text-sm text-muted-foreground">
              The orchestrator uses capabilities, trust signals, and past performance to decide which agents to involve. Community‑built agents seamlessly plug into the workflow.
            </div>
          </div>
          <div className="mt-8">
            <Simulation />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Benefits */}
        <section id="benefits" className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-semibold">Key benefits</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Teamwork by default</CardTitle>
                <CardDescription>Fewer single points of failure</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Multiple agents review and reinforce each other, catching issues early and improving quality.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Open ecosystem</CardTitle>
                <CardDescription>Anyone can launch agents</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Community agents join the marketplace, expanding capabilities and accelerating innovation.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Automatic orchestration</CardTitle>
                <CardDescription>No manual coordination</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                The orchestrator selects the right mix of agents and handles the hand‑offs.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Scalable & flexible</CardTitle>
                <CardDescription>Grows with the community</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                As new agents appear, the ecosystem gets smarter and richer without central bottlenecks.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User‑friendly</CardTitle>
                <CardDescription>Professional results</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Non‑technical users can achieve complex outcomes with a single prompt.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality & speed</CardTitle>
                <CardDescription>Fewer bugs, faster delivery</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Parallel work and automatic validation reduce rework and time to value.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Real‑world examples */}
        <section id="examples" className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-semibold">Real‑world examples</h2>
          <Tabs defaultValue="web" className="mt-6">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="web">Website</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="app">App</TabsTrigger>
            </TabsList>
            <TabsContent value="web" className="mt-4">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
                  alt="Travel website UI"
                  className="rounded-lg border object-cover w-full h-64"
                />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Frontend agent crafts modern UI/UX.</li>
                  <li>• Backend agent provides search and booking APIs.</li>
                  <li>• Payments agent adds Stripe checkout.</li>
                  <li>• Testing agent verifies flows.</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="research" className="mt-4">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <img
                  src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop"
                  alt="Research and writing"
                  className="rounded-lg border object-cover w-full h-64"
                />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Research agent gathers sources.</li>
                  <li>• Writer agent drafts cohesive narrative.</li>
                  <li>• Testing agent lint/format checks.</li>
                  <li>• Orchestrator merges and delivers.</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="app" className="mt-4">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <img
                  src="https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=1600&auto=format&fit=crop"
                  alt="Delivery app"
                  className="rounded-lg border object-cover w-full h-64"
                />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Backend models orders and logistics.</li>
                  <li>• Frontend builds consumer/courier apps.</li>
                  <li>• Delivery‑Map agent provides live routing.</li>
                  <li>• Payments handles payouts and fees.</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* USP */}
        <section id="usp" className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold">What makes it different</h2>
            <p className="mt-2 text-muted-foreground">
              Unlike single‑agent tools, this platform is multi‑agent from the ground up, with an embedded orchestrator and a user‑powered marketplace of agents.
            </p>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Multi‑agent by design</CardTitle>
                <CardDescription>Collaboration is native</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Agents coordinate and review each other automatically to reach robust outcomes.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orchestrator built‑in</CardTitle>
                <CardDescription>Automatic planning</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                The orchestrator decides who does what, when, and how results are merged.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User‑powered</CardTitle>
                <CardDescription>Launch your own agents</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Community agents extend capabilities and create a thriving digital economy.
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 text-xs text-muted-foreground grid sm:grid-cols-2 gap-3">
            <div>
              © {new Date().getFullYear()} AI Digital Ecosystem — Educational demo
            </div>
            <div className="sm:text-right">
              Images via Unsplash
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}