"use client";

import { useState } from "react";

export default function Home() {
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePosting = async () => {
    if (!comment.trim()) return;
    
    setIsLoading(true);
    try {
      // 1. Send the raw comment text to your internal Next.js API route
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

      // 2. Evaluate the decision returned by your Azure backend logic
      if (data.isSafe) {
        // If approved by the threshold check, display it in the comment section
        setPosts([...posts, comment]);
        setComment("");
      } else {
        // Find the specific category that triggered the block to show the user
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
    <main className="flex min-h-screen flex-col items-center bg-[#D5BDAF]">
      <div className="flex w-2/6 flex-col p-10">
      <h1 className="font-bold text-4xl mb-3 text-black">Comment Section</h1>
      <div className="bg-[#E3D5CA] p-10 border border-zinc-400 rounded-2xl">
        <h2 className="mb-2 ml-2">Post your comment</h2>
        <input
          type="text"
            value={comment}
            disabled={isLoading}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isLoading ? "Analyzing via Azure AI..." : "Enter your comment here"}
          className="bg-[#F5EBE0] p-2 w-1/1 border border-zinc-500 text-black rounded-2xl disabled:opacity-50"
        />
        <button
        type="submit"
        onClick={handlePosting}
        disabled={isLoading || !comment.trim()}
        className="bg-[#F5EBE0] pt-2 pb-2 mt-5 border border-zinc-500 rounded-2xl w-2/10 disabled:opacity-50 flex items-center justify-center gap-2"
        >
        <h2>{isLoading ? "Checking..." : "Post"}</h2>
      </button>
      </div>
        {posts.length !== 0 && (
          <div className="mt-10">
            <h3 className="mb-3 font-bold text-zinc-700 ml-2">Approved Public Feed</h3>
            {posts.map((post, i) => (
              <div
                key={i}
                className="border border-zinc-400 p-3 mb-3 bg-gray-300 rounded-2xl"
              >
                <p>{post}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}