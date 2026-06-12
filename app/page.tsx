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
    <main className="flex min-h-screen flex-col items-center">
      <div className="bg-gray-100 p-10 border border-zinc-300 rounded-2xl">
        <h2 className="mb-2 ml-2">Make comment</h2>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment here"
          className="bg-white p-2 "
        />
      </div>
      <button
        type="submit"
        onClick={handlePosting}
        className="bg-gray-100 pl-8 pr-8 p-2 mt-5 border border-zinc-300 rounded-2xl"
      >
        <h2>Post</h2>
      </button>
      {posts.length !== 0 &&
      <div className="mt-10">
        {posts.map((post, i) => (
        <div
          key = {i}
          className="border border-zinc-300 p-2 mb-3"
        >
          <p>{post}</p>
        </div>
      ))}
      </div>
      }
    </main>
  );
}
