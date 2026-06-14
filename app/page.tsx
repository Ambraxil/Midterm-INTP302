"use client";

import { useState, useEffect } from "react";

interface DBComment {
  id: number;
  content: string;
}

export default function Home() {
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Pull previously approved comments when page loads
  useEffect(() => {
    async function fetchApprovedComments() {
      try {
        const response = await fetch("/api/moderate");
        if (response.ok) {
          const data = await response.json();
          const contentArray = data.map((c: DBComment) => c.content);
          setPosts(contentArray);
        }
      } catch (error) {
        console.error("Failed to load historical comments:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchApprovedComments();
  }, []);

  const handlePosting = async () => {
    if (!comment.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process comment.");
      }

      if (data.isSafe) {
        setPosts([comment, ...posts]);
        setComment("");
      } else {
        const categories = data.details || [];
        const triggered = categories
          .filter((c: any) => c.severity > 1)
          .map((c: any) => `${c.category} (Severity: ${c.severity})`)
          .join(", ");

        alert(`❌ Content Blocked! Your comment violates community guidelines.\n\nReasoning: ${triggered || "General Toxicity"}`);
      }
    } catch (error) {
      console.error("Transmission Error:", error);
      alert("Could not connect to the moderation server. Check server terminal logs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D5BDAF] text-black flex flex-col">
      
      {/* ================= HEADER / NAVIGATION BAR ================= */}
      <header className="w-full bg-[#B79A8B] border-b border-zinc-500 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider uppercase">Anyhub</span>
            <span className="bg-[#E3D5CA] text-xs font-bold px-2 py-0.5 rounded-full border border-zinc-400">
              Community Blog
            </span>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* ================= FAKE POST ================= */}
        <article className="bg-[#E3D5CA] p-8 border border-zinc-400 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-700 mb-3">
            <span>Posted by u/BananaInsights</span>
            <span>•</span>
            <span>2 hours ago</span>
          </div>
          <h2 className="font-extrabold text-3xl mb-4 leading-tight">
            What Big Banana Doesn't Tell You About Their Products
          </h2>
          <p className="text-zinc-800 leading-relaxed mb-4">
            Bananas sold by Big Banana are not what you'd think. Despite how yummy they look, these bananas are actually not bananas at all. They are genetically modified to look and taste like bananas, but they are made from a blend of playdough. The company has been under scrutiny for their deceptive marketing practices, and many consumers have reported adverse reactions after consuming their products.
          </p>
        </article>

        <hr className="border-zinc-400" />

        {/* ================= INTERACTION SECTION ================= */}
        <section className="flex flex-col gap-6">
          <div className="bg-[#E3D5CA] p-6 border border-zinc-400 rounded-2xl shadow-sm">
            <h3 className="mb-3 ml-1 font-bold text-lg">Discussion Arena</h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={comment}
                disabled={isLoading}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isLoading ? "Analyzing via Azure AI..." : "What are your thoughts? Join the conversation..."}
                className="bg-[#F5EBE0] p-3 w-full border border-zinc-500 text-black placeholder-zinc-500 rounded-xl disabled:opacity-50 focus:outline-none focus:border-zinc-700 text-sm"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handlePosting}
                  disabled={isLoading || !comment.trim()}
                  className="bg-[#F5EBE0] px-6 py-2 border border-zinc-500 text-black font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#eddcd0] transition-colors text-sm shadow-sm"
                >
                  {isLoading ? "Checking..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>

          {/* ================= DYNAMIC COMMENT FEED ================= */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-zinc-800 text-md ml-1">
              Approved Public Feed ({posts.length})
            </h4>
            
            {isFetching ? (
              <p className="text-sm italic text-zinc-700 ml-1">Loading approved feed from database...</p>
            ) : posts.length === 0 ? (
              <p className="text-sm italic text-zinc-700 ml-1">No comments have been posted yet. Be the first!</p>
            ) : (
              posts.map((post, i) => (
                <div
                  key={i}
                  className="border border-zinc-400 p-4 bg-[#EAEAEA] rounded-xl shadow-sm flex flex-col gap-1"
                >
                  <span className="text-xs font-bold text-zinc-600">Anonymous Contributor</span>
                  <p className="text-black text-sm whitespace-pre-wrap">{post}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}