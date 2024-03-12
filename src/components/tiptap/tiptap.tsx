"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Taskitem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import TiptapMenu from "./tiptapMenu";
import { useEffect, useState } from "react";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

interface props {
  editable: boolean;
  onChange: (content: string) => void;
  content: string;
}

const Tiptap = ({ editable, onChange, content }: props) => {
  const editor = useEditor({
    // Extensions
    extensions: [
      StarterKit.configure({
        orderedList: {
          keepMarks: false,
          keepAttributes: false,
        },
        bulletList: {
          keepMarks: false,
          keepAttributes: false,
        },
        codeBlock: {
          HTMLAttributes: {
            class: "max-h-[40vh]",
          },
        },
      }),
      Youtube.configure({
        inline: true,
        autoplay: false,
        allowFullscreen: true,
        controls: true,
        HTMLAttributes: {
          class: "flex md:max-w-6xl w-full mx-auto",
        },
      }),
      Image.configure({
        inline: true,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Taskitem.configure({
        nested: true,
      }),
      Link.configure({
        protocols: [
          {
            scheme: "https",
            optionalSlashes: true,
          },
          "http",
        ],
        autolink: false,
      }),
      Typography,
    ],
    // Content
    content: content,
    // Options
    editable: editable,
    // Editor props
    editorProps: {
      attributes: {
        class: `prose max-w-none w-full ${editable ? "h-[65vh] border-2 rounded-md overflow-auto p-4" : ""}`,
      },
    },
    // Editor events
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <>
      {editable && <TiptapMenu editor={editor} />}
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
