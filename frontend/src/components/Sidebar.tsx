"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { LayoutDashboard, FileAudio, Sparkles, Brain, Search } from "lucide-react";
import SearchModal from "./SearchModal";

export default function Sidebar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Shortcut keypress: '/' triggers search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "/") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const links = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Interviews",
      href: "/interviews",
      icon: FileAudio,
    },
  ];

  return (
    <aside className="w-64 bg-[#0d1321] border-r border-[#1e293b] flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1e293b] flex items-center gap-3">
        <div className="bg-[#6366f1] p-2 rounded-lg text-white">
          <Brain className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Qualia
          </h1>
          <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">
            AI Synthesis
          </span>
        </div>
      </div>

      {/* Conceptual Search Button */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#0b0f19] border border-[#1e293b] hover:border-indigo-500/50 rounded-xl text-left text-xs text-gray-500 hover:text-gray-300 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <span>Search concepts...</span>
          </div>
          <span className="text-[10px] bg-[#1e293b] px-1.5 py-0.5 rounded text-gray-400 font-mono">/</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1">

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/10"
                  : "text-gray-400 hover:bg-[#1e293b] hover:text-white"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#1e293b] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span className="text-xs text-gray-500">Evidence-Backed Synthesis</span>
      </div>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </aside>
  );
}
