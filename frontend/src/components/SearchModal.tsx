"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, FileAudio, Quote, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const SearchResultSkeleton = () => (
  <div className="border border-[#1f2937] bg-[#0b0f19]/20 p-4 rounded-xl animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-[#1f2937] rounded w-1/2"></div>
      <div className="h-4 bg-[#1f2937] rounded w-16"></div>
    </div>
    <div className="h-3 bg-[#1f2937] rounded w-5/6"></div>
    <div className="h-3 bg-[#1f2937] rounded w-2/3"></div>
  </div>
);

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  interview: {
    id: string;
    title: string;
    transcript: string;
    participant_info?: {
      name?: string;
      role?: string;
      company?: string;
    };
    date: string;
  };
  similarity: number;
  user_persona: string;
  summary: string;
  themes: string[];
  key_quotes: {
    quote: string;
    context: string;
  }[];
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Focus input field on open
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${backendUrl}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          limit: 5,
          threshold: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(`Search failed. Make sure your backend API is online.`);
      // Mock result fallback for offline representation
      setResults([
        {
          interview: {
            id: "0e01a3ee-03b3-4e2e-9fb1-ed1d15ae1fbe",
            title: "B2B SaaS PM Interview on Synthesis Pain Points",
            transcript: "Zoom recordings are solid, but manual transcript tags coding is tedious...",
            date: new Date().toISOString(),
            participant_info: { name: "Mark Jones", role: "Senior PM", company: "SaaSFlow" }
          },
          similarity: 0.84,
          user_persona: "Senior PM handling continuous user discovery",
          summary: "Mark describes workflows as highly fragmented, manual, and offline.",
          themes: ["Discovery Workflows", "Synthesis Bottlenecks"],
          key_quotes: [
            {
              quote: "Finding the exact moments where users struggled with a specific feature is like finding a needle in a haystack.",
              context: "When describing quotes synthesis overhead."
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (id: string) => {
    onClose();
    router.push(`/interviews?id=${id}`);
  };

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 px-4 py-3 border-b border-[#1f2937]">
          <Search className="w-5 h-5 text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type research keywords (e.g., 'Notion sync', 'crashes')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none text-sm"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => setQuery("")}
              className="text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Button type="submit" size="sm" disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Search"}
          </Button>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-lg border border-[#1f2937] bg-[#1f2937]/45"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="space-y-3">
              <SearchResultSkeleton />
              <SearchResultSkeleton />
              <SearchResultSkeleton />
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex flex-col gap-3 text-xs shadow-inner">
              <div className="flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
              <Button 
                type="button" 
                variant="destructive" 
                size="sm"
                className="w-fit"
                onClick={() => handleSearch()}
              >
                Retry Search
              </Button>
            </div>
          )}


          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-1">Semantic Matches</span>
              {results.map((result) => {
                const matchPct = Math.round(result.similarity * 100);
                
                return (
                  <Card 
                    key={result.interview.id} 
                    className="hover:border-indigo-500/60 transition-all cursor-pointer bg-[#0b0f19]/40 hover:bg-[#0b0f19]/80"
                    onClick={() => handleResultClick(result.interview.id)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Match title and badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileAudio className="w-4 h-4 text-indigo-400 shrink-0" />
                          <h4 className="font-bold text-sm text-white hover:text-indigo-400 transition-colors">
                            {result.interview.title}
                          </h4>
                        </div>
                        <Badge variant={matchPct > 70 ? "success" : "warning"} className="shrink-0">
                          {matchPct}% Match
                        </Badge>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {result.summary || "No summary extracted for this session."}
                      </p>

                      {/* Themes */}
                      {result.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {result.themes.map((t, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] px-2 py-0">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Top Quote Highlight */}
                      {result.key_quotes.length > 0 && (
                        <div className="bg-[#111827] p-2.5 rounded-lg border border-[#1f2937] flex gap-2 items-start text-xs">
                          <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="italic text-gray-300">
                              "{result.key_quotes[0].quote}"
                            </p>
                            <span className="block text-[9px] text-gray-500">
                              Context: {result.key_quotes[0].context}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Click indicator */}
                      <div className="flex justify-end pt-1">
                        <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          View in Evidence Panel
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs">No matching quotes found above threshold. Try different keywords.</p>
            </div>
          )}

          {!query && (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <Search className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs max-w-xs leading-relaxed">
                Search transcripts conceptually. For example, search for "frustration with manual workflows" to match transcripts discussing copy-pasting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
