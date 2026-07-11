import Link from "next/link";
import { FileAudio, Sparkles, Brain, ArrowRight, Quote, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Dashboard() {
  const topThemes = [
    { name: "Discovery Workflows", count: 8 },
    { name: "Synthesis Bottlenecks", count: 6 },
    { name: "Jira Integration", count: 5 },
    { name: "Thematic Tagging", count: 4 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#0b0f19] border border-[#1e293b] p-8 lg:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Qualia Research Synthesis
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Synthesize Qualitative Data with Evidence-Backed Insights
          </h2>
          <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
            Upload user transcripts, extract key themes, compile feature requests, and cross-reference verbatim pain points instantly using Gemini AI.
          </p>
          <div className="pt-2">
            <Link href="/interviews">
              <Button size="lg" className="gap-2">
                Start Analysis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Interviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Total Interviews</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">Continuous Discovery</CardDescription>
            </div>
            <FileAudio className="w-5 h-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">12</div>
            <div className="text-xs text-gray-500 mt-2 font-medium">
              +3 this week
            </div>
          </CardContent>
        </Card>

        {/* Average Sentiment */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Average Sentiment</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">User Emotion Index</CardDescription>
            </div>
            <Heart className="w-5 h-5 text-indigo-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold tracking-tight">Mixed</span>
              <Badge variant="warning">Neutral Baseline</Badge>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#1f2937] rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">65% of sessions contain conflicting feedback</p>
          </CardContent>
        </Card>

        {/* Top Themes count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Top Themes</CardTitle>
              <CardDescription className="text-[10px] mt-0.5">Discovered Clusters</CardDescription>
            </div>
            <Brain className="w-5 h-5 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">6</div>
            <div className="flex flex-wrap gap-1.5 pt-3">
              <Badge variant="secondary">Discovery</Badge>
              <Badge variant="secondary">Synthesis</Badge>
              <Badge variant="secondary">Integrations</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Methods & Themes list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Synthesis cards */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Synthesis Methodology</h3>
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-[#111827]/50">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg mt-1">
                  <Quote className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold text-white">Strict Quote Grounding</CardTitle>
                  <CardDescription className="text-xs text-gray-400 leading-relaxed">
                    Qualia maps every single qualitative insight directly to a verbatim quote in the raw transcript. No assumptions, no extrapolations.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-[#111827]/50">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg mt-1">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-sm font-semibold text-white">Deterministic LLM Parsing</CardTitle>
                  <CardDescription className="text-xs text-gray-400 leading-relaxed">
                    Using Gemini 2.0's zero-temperature structured JSON schema, we eliminate parsing inconsistencies to ensure high-fidelity insights.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Top themes list */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Popular Themes</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">Frequency Index</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topThemes.map((theme, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-gray-300">{theme.name}</span>
                    <span className="text-indigo-400 font-semibold">{theme.count} tags</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#0b0f19] rounded-full h-1">
                    <div
                      className="bg-indigo-500 h-1 rounded-full"
                      style={{ width: `${(theme.count / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
