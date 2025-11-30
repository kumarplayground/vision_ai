"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, BookOpen, Briefcase, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function OmniSearch() {
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`)
      setIsFocused(false)
    }
  }

  // Close on escape, Open on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocused(false)
        inputRef.current?.blur()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsFocused(true)
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300",
          isFocused ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsFocused(false)}
        aria-hidden="true"
      />

      {/* Search Container */}
      <div className={cn("relative z-50 w-full max-w-2xl mx-auto transition-all duration-300", isFocused ? "scale-105" : "scale-100")}>
        <form onSubmit={handleSearch} className="relative group">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300",
             isFocused ? "opacity-60 blur-md" : ""
          )} />
          
          <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-blue/10 rounded-full shadow-2xl overflow-hidden ring-1 ring-white/20">
            <Search className="ml-5 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search courses, jobs, or ask AI..."
              className="w-full bg-transparent border-none px-4 py-4 text-lg focus:outline-none focus:ring-0 placeholder:text-muted-foreground/70"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  inputRef.current?.focus()
                }}
                className="mr-4 p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            {!isFocused && !query && (
                <div className="absolute right-5 flex gap-2 pointer-events-none">
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            )}
          </div>
        </form>
        
        {/* Suggestions / Quick Links (Visible only when focused) */}
        {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-2">
                    <div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">Quick Actions</div>
                    
                    <button onClick={() => router.push('/chat')} className="w-full flex items-center gap-3 px-3 py-3 text-sm hover:bg-accent rounded-xl transition-colors text-left group">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">Ask AI Assistant</span>
                            <span className="text-xs text-muted-foreground">Get instant answers and help</span>
                        </div>
                    </button>

                    <button onClick={() => router.push('/courses')} className="w-full flex items-center gap-3 px-3 py-3 text-sm hover:bg-accent rounded-xl transition-colors text-left group">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">Browse Courses</span>
                            <span className="text-xs text-muted-foreground">Explore our learning catalog</span>
                        </div>
                    </button>
                </div>
            </div>
        )}
      </div>
    </>
  )
}
