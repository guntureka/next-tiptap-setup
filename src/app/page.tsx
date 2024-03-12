"use client";

import Tiptap from "@/components/tiptap/tiptap";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [body, setBody] = useState("");

  const handleChange = (data: string) => {
    setBody(data);
  };

  console.log(body);
  return (
    <main className="flex min-h-screen flex-col items-center justify-start md:p-24 p-8">
      <h1>Hiii</h1>
      <div className="flex flex-col gap-5 w-full">
        <div className="relative w-full py-5">
          <Tiptap
            editable={true}
            onChange={handleChange}
            content={"type your content"}
          />
        </div>
        <div className="relative w-full py-5">
          <h1>h2</h1>
          <Tiptap editable={false} onChange={handleChange} content={body} />
        </div>
      </div>
    </main>
  );
}
