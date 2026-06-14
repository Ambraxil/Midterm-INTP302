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
      // 1. Send the raw comment text to the internal Next.js API route
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

      // 2. Evaluate the decision returned by Azure backend logic
      if (data.isSafe) {
        // If approved by the threshold check, display it in the comment section
        setPosts([comment, ...posts]); // Places the newest comment right at the top
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

  To force the colors to look exactly the same regardless of whether a user has system dark mode enabled, we need to explicitly assign background and text colors to elements that are currently inheriting default values.

Right now, classes like text-black or generic background colors are vulnerable to Tailwind's dark mode media queries or browser auto-inversions if the wrapper containers aren't locked down.

Here is your fully updated app/page.tsx with hardcoded light-theme color mappings applied to all containers, inputs, lists, and text fields so that it stays perfectly readable on any system setting:

TypeScript
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
    // 1. Explicitly forced background color and text-black for the entire viewport wrapper
    <main className="flex min-h-screen flex-col items-center bg-[#D5BDAF] text-black">
      <div className="flex w-2/6 flex-col p-10">
        <h1 className="font-bold text-4xl mb-3 text-black">Comment Section</h1>
        
        {/* 2. Card container forced to light tone with explicit text color */}
        <div className="bg-[#E3D5CA] p-10 border border-zinc-400 rounded-2xl text-black">
          <h2 className="mb-2 ml-2 text-black font-medium">Post your comment</h2>
          <input
            type="text"
            value={comment}
            disabled={isLoading}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isLoading ? "Analyzing via Azure AI..." : "Enter your comment here"}
            // 3. Locked input field colors down so typed text won't flip to white in dark mode
            className="bg-[#F5EBE0] p-2 w-full border border-zinc-500 text-black placeholder-zinc-500 rounded-2xl disabled:opacity-50 focus:outline-none focus:border-zinc-700"
          />
          <button
            type="submit"
            onClick={handlePosting}
            disabled={isLoading || !comment.trim()}
            // 4. Solidified button text and background parameters
            className="bg-[#F5EBE0] pt-2 pb-2 mt-5 border border-zinc-500 text-black font-semibold rounded-2xl w-2/10 disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#eddcd0] transition-colors"
          >
            {isLoading ? "Checking..." : "Post"}
          </button>
        </div>

        {/* Dynamic Feed Section */}
        <div className="mt-10">
          <h3 className="mb-3 font-bold text-zinc-800 ml-2">Approved Public Feed</h3>
          
          {isFetching ? (
            <p className="text-sm italic text-zinc-700 ml-2">Loading approved feed from database...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm italic text-zinc-700 ml-2">No comments have been posted yet.</p>
          ) : (
            posts.map((post, i) => (
              // 5. Hardcoded comment blocks to stay light-gray with dark text regardless of theme
              <div
                key={i}
                className="border border-zinc-400 p-3 mb-3 bg-[#EAEAEA] rounded-2xl shadow-sm"
              >
                <p className="text-black whitespace-pre-wrap">{post}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}