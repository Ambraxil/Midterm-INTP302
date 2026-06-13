"use client";

import { useState } from "react";

export default function Home() {
  const [comment, setComment] = useState('')
  const [posts, setPosts] = useState<string[]>([]);

  const handlePosting = async () =>{
    setPosts([...posts, comment]);
    setComment("");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="flex w-2/6 flex-col">
      <div className="bg-gray-300 p-10 border border-zinc-400 rounded-2xl">
        <h2 className="mb-2 ml-2">Post your comment</h2>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment here"
          className="bg-mauve-300 p-2 w-1/1 border border-zinc-500 text-black rounded-2xl"
        />
        <button
        type="submit"
        onClick={handlePosting}
        className="bg-mauve-400 pt-2 pb-2 mt-5 border border-zinc-500 rounded-2xl w-2/10"
        >
        <h2>Post</h2>
      </button>
      </div>
      {posts.length !== 0 &&
      <div className="mt-10">
        {posts.map((post, i) => (
          <div
          key = {i}
          className="border border-zinc-400 p-3 mb-3 bg-gray-300 rounded-2xl"
          >
          <p>{post}</p>
        </div>
      ))}
      </div>
      }
      </div>
    </main>
  );
}
