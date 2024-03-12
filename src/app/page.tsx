"use client";

import Tiptap from "@/components/tiptap/tiptap";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [body, setBody] = useState("");

  const handleChange = (data: string) => {
    setBody(data);
  };

  console.log(body);
  return (
    <main className="flex min-h-screen flex-col items-center justify-start md:p-24 p-8">
      <h1 className="text-7xl font-bold">TEXT EDITOR</h1>
      <ResizablePanelGroup direction="horizontal" className="py-5">
        <ResizablePanel defaultSize={50}>
          <div className="p-4">
            <Tiptap
              editable={true}
              onChange={handleChange}
              content={"type your content"}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="p-4">
            <Tiptap editable={false} onChange={handleChange} content={body} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
