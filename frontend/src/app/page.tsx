import Link from "next/link";
import { FileAudio, Sparkles, Brain, ArrowRight, BarChart3, Quote } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1b4b] via-[#0f172a] to-[#0b0f19] border border-[#1e293b] p-8 lg:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Qualia Next-Gen Research
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Synthesize Qualitative Data with Evidence-Backed Insights
          </h2>
          <p className="text-gray-400 text-sm lg:text-base leading-relaxed">
            Upload user transcripts, extract key themes, compile feature requests, and cross-reference verbatim pain points instantly using Gemini AI.
          </p>
          <div className="pt-2 flex gap-4">
            <Link
              href="/interviews"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              Start Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Interviews Analyzed</span>
            <FileAudio className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight">12</h3>
            <p className="text-[11px] text-gray-500">Continuous Discovery Sessions</p>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Total Pain Points</span>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight">48</h3>
            <p className="text-[11px] text-gray-500 font-medium text-gray-400">Identified & grounded friction areas</p>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Core Themes</span>
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight">6</h3>
            <p className="text-[11px] text-gray-500">Automated Qualitative Tags</p>
          </div>
        </div>
      </div>

      {/* Synthesis Method cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold tracking-tight">Synthesis Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827]/50 border border-[#1f2937] p-6 rounded-xl flex gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 h-fit rounded-lg">
              <Quote className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Strict Quote Grounding</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Qualia maps every single qualitative insight directly to a verbatim quote in the raw transcript. No assumptions, no extrapolations.
              </p>
            </div>
          </div>

          <div className="bg-[#111827]/50 border border-[#1f2937] p-6 rounded-xl flex gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 h-fit rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Deterministic LLM Parsing</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Using Gemini 2.0's zero-temperature structured JSON schema, we eliminate parsing inconsistencies to ensure high-fidelity insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
