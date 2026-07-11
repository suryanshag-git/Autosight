"use client";

import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Loader2, 
  User, 
  Calendar, 
  Tag, 
  MessageSquare, 
  Frown, 
  Lightbulb, 
  ThumbsUp, 
  Quote, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";


interface KeyQuote {
  quote: string;
  context: string;
}

interface InsightData {
  pain_points: string[];
  feature_requests: string[];
  positive_feedback: string[];
  key_quotes: KeyQuote[];
  user_persona: string;
  sentiment: string;
  summary: string;
  themes: string[];
}

interface InterviewItem {
  id: string;
  title: string;
  transcript: string;
  participant_info?: {
    name?: string;
    role?: string;
    company?: string;
  };
  date: string;
  insight: InsightData;
}

const INITIAL_INTERVIEWS: InterviewItem[] = [
  {
    id: "0e01a3ee-03b3-4e2e-9fb1-ed1d15ae1fbe",
    title: "B2B SaaS PM Interview on Synthesis Pain Points",
    date: "2026-07-10T16:28:08Z",
    transcript: "Zoom recordings are solid, but manual transcript tags coding is tedious...",
    participant_info: {
      name: "Mark Jones",
      role: "Senior Product Manager",
      company: "SaaSFlow Corp"
    },
    insight: {
      user_persona: "Senior Product Manager conducting continuous discovery",
      sentiment: "Mixed",
      summary: "Mark describes current qualitative research workflows as highly fragmented and manual. While raw transcription speed is acceptable, synthesizing text and pushing bugs to Jira are severe bottlenecks.",
      themes: ["Discovery Workflows", "Synthesis Bottlenecks", "Jira Integration", "Thematic Tagging"],
      pain_points: [
        "Synthesis phase is tedious and disorganized, requiring copy-pasting of quotes into separate Notion pages",
        "No centralized repository to search for pain points across multiple user interviews",
        "Finding exact context of quotes requires manually re-watching hours of interview videos"
      ],
      feature_requests: [
        "Centralized and searchable repository for all transcripts",
        "Automated thematic tagging to replace manual sorting",
        "One-click Jira ticket generation directly from quotes"
      ],
      positive_feedback: [
        "Zoom's recording quality is solid and reliable",
        "Initial transcription speed and 90% accuracy provide a good baseline"
      ],
      key_quotes: [
        {
          quote: "Finding the exact moments where users struggled with a specific feature is like finding a needle in a haystack.",
          "context": "Explaining the main friction point during qualitative synthesis."
        }
      ]
    }
  }
];

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewItem[]>(INITIAL_INTERVIEWS);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_INTERVIEWS[0].id);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participantRole, setParticipantRole] = useState("");
  const [participantCompany, setParticipantCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedInterview = interviews.find((i) => i.id === selectedId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !transcript) {
      setError("Please fill out both the interview title and the transcript text.");
      return;
    }

    setLoading(true);
    setError(null);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const payload = {
      title,
      transcript,
      participant_info: {
        name: participantName || "Anonymous",
        role: participantRole || "Undetermined",
        company: participantCompany || "N/A"
      }
    };

    try {
      const response = await fetch(`${backendUrl}/api/v1/interviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      
      const newItem: InterviewItem = {
        id: result.interview.id,
        title: result.interview.title,
        transcript: result.interview.transcript,
        date: result.interview.date,
        participant_info: result.interview.participant_info,
        insight: result.insight.data
      };

      setInterviews((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
      
      // Reset form
      setTitle("");
      setTranscript("");
      setParticipantName("");
      setParticipantRole("");
      setParticipantCompany("");
      
    } catch (err: any) {
      console.error(err);
      setError(`Backend call failed (${err.message}). Make sure your FastAPI server is running on port 8000. Fallback simulation completed.`);
      
      // Fallback simulation if backend is down for demonstration
      const simulatedId = Math.random().toString(36).substring(7);
      const simulatedItem: InterviewItem = {
        id: simulatedId,
        title: `${title} (Local Simulation)`,
        transcript,
        date: new Date().toISOString(),
        participant_info: {
          name: participantName || "Simulated User",
          role: participantRole || "UX Designer",
          company: participantCompany || "Stark Industries"
        },
        insight: {
          user_persona: `${participantRole || "Researcher"} using transcription workflows`,
          sentiment: "Mixed",
          summary: "This is a locally generated preview of qualitative analysis because your backend server is offline.",
          themes: ["Simulation Mode", "Local Analysis", "Usability"],
          pain_points: [
            "Manual cleanup of transcript tags is frustrating",
            "Slow tag organization cycles"
          ],
          feature_requests: [
            "Auto-tagging themes",
            "Search across dashboard transcripts"
          ],
          positive_feedback: [
            "Clean layout structures"
          ],
          key_quotes: [
            {
              quote: "The interface is beautiful, but I need local connection setups.",
              "context": "Simulated quote reflecting missing connection to API server."
            }
          ]
        }
      };

      setInterviews((prev) => [simulatedItem, ...prev]);
      setSelectedId(simulatedItem.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full overflow-hidden max-w-7xl mx-auto w-full">
      {/* Left Column: Upload Form + List */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 max-w-md w-full">
        {/* Upload Form */}
        <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Plus className="w-5 h-5" />
            <h2 className="font-bold text-sm uppercase tracking-wider">Analyze New Interview</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400 font-semibold uppercase">Interview Title</label>
              <input
                type="text"
                placeholder="e.g. UX Designer Interview - File Uploads"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366f1] transition-all"
                disabled={loading}
              />
            </div>

            {/* Participant Info */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Participant</label>
                <input
                  type="text"
                  placeholder="Sarah"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#6366f1]"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Role</label>
                <input
                  type="text"
                  placeholder="Researcher"
                  value={participantRole}
                  onChange={(e) => setParticipantRole(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#6366f1]"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-semibold uppercase">Company</label>
                <input
                  type="text"
                  placeholder="Google"
                  value={participantCompany}
                  onChange={(e) => setParticipantCompany(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#6366f1]"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-gray-400 font-semibold uppercase">Transcript Text</label>
              <textarea
                rows={6}
                placeholder="Paste interview transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6366f1] transition-all resize-none"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex gap-2 items-start text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with Gemini...
                </>
              ) : (
                "Synthesize Insights"
              )}
            </button>
          </form>
        </div>

        {/* Interviews List */}
        <div className="space-y-3">
          <h3 className="text-xs text-gray-400 font-bold uppercase tracking-wider px-2">Processed Sessions</h3>
          {interviews.length === 0 ? (
            <p className="text-gray-500 text-sm px-2">No interviews uploaded yet.</p>
          ) : (
            interviews.map((item) => {
              const active = item.id === selectedId;
              const dateObj = new Date(item.date);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 ${
                    active
                      ? "bg-[#1f2937]/35 border-[#6366f1] shadow-lg shadow-indigo-500/5"
                      : "bg-[#111827]/40 border-[#1f2937] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-white truncate max-w-[280px]">
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        item.insight.sentiment === "Positive"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.insight.sentiment === "Negative"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {item.insight.sentiment}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {item.insight.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-gray-500 font-semibold pt-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {item.participant_info?.name || "Participant"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: AI Analysis details */}
      <div className="flex-1 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden h-[85vh]">
        {selectedInterview ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Analysis Header */}
            <div className="p-6 border-b border-[#1f2937] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Qualitative Synthesis</span>
                  <h2 className="text-xl font-extrabold tracking-tight text-white">{selectedInterview.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">{selectedInterview.participant_info?.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {selectedInterview.participant_info?.role} at {selectedInterview.participant_info?.company}
                    </p>
                  </div>
                  <div className="bg-[#1f2937] p-2.5 rounded-xl border border-[#2d3748]">
                    <User className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </div>

              {/* Themes list */}
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedInterview.insight.themes.map((theme, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    <Tag className="w-3 h-3" />
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Analysis Grid scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Executive Summary */}
              <div className="bg-[#0b0f19] p-5 rounded-xl border border-[#1f2937] space-y-2">
                <h3 className="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Executive Summary
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedInterview.insight.summary}
                </p>
                <div className="border-t border-[#1f2937] mt-3 pt-2">
                  <p className="text-xs text-gray-500">
                    <span className="font-bold text-gray-400">Persona Profile:</span> {selectedInterview.insight.user_persona}
                  </p>
                </div>
              </div>

              {/* Quotes */}
              {selectedInterview.insight.key_quotes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Quote className="w-4 h-4" />
                    Evidence-Backed Quotes
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedInterview.insight.key_quotes.map((q, i) => (
                      <div key={i} className="border-l-2 border-[#6366f1] pl-4 py-1 space-y-2">
                        <blockquote className="text-sm italic text-gray-200 leading-relaxed">
                          "{q.quote}"
                        </blockquote>
                        <span className="block text-[11px] text-gray-500 font-semibold">
                          Grounding Context: {q.context}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Pain Points */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-red-400 border-b border-red-500/10 pb-2">
                    <Frown className="w-4.5 h-4.5" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Pain Points</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedInterview.insight.pain_points.map((p, i) => (
                      <li key={i} className="text-xs text-gray-300 leading-relaxed flex items-start gap-1.5">
                        <span className="text-red-500 shrink-0 mt-0.5">•</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Feature Requests */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400 border-b border-indigo-500/10 pb-2">
                    <Lightbulb className="w-4.5 h-4.5" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Feature Requests</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedInterview.insight.feature_requests.map((f, i) => (
                      <li key={i} className="text-xs text-gray-300 leading-relaxed flex items-start gap-1.5">
                        <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Positive Feedback */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 border-b border-emerald-500/10 pb-2">
                    <ThumbsUp className="w-4.5 h-4.5" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Positive Feedback</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedInterview.insight.positive_feedback.map((f, i) => (
                      <li key={i} className="text-xs text-gray-300 leading-relaxed flex items-start gap-1.5">
                        <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
            <HelpCircle className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-sm">Select an interview to view qualitative analysis and insights.</p>
          </div>
        )}
      </div>
    </div>
  );
}
