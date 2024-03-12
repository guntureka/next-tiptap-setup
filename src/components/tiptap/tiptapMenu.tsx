"use client";

import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowGoBackFill,
  RiArrowGoForwardFill,
  RiBold,
  RiCodeFill,
  RiDoubleQuotesL,
  RiH1,
  RiH2,
  RiH3,
  RiH4,
  RiHeading,
  RiImage2Fill,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiParagraph,
  RiSeparator,
  RiStrikethrough,
  RiUnderline,
  RiYoutubeFill,
} from "react-icons/ri";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { Label } from "../ui/label";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export const formSchema =
  typeof window !== "undefined"
    ? z.object({
        imgFile: z.instanceof(FileList).optional(),
      })
    : z.object({
        imgFile: z.unknown().optional(),
      });

const TiptapMenu = ({ editor }: { editor: Editor | null }) => {
  const [align, setAlign] = useState(<RiAlignLeft />);
  const [imagePreview, setImagePreview] = useState<string[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  if (!editor) {
    return null;
  }
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if ((data.imgFile as FileList).length === 0) return;

    const formData = new FormData();

    Array.from(data.imgFile as FileList).forEach((file) => {
      formData.append("imgFile", file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    response.result.map((img: string) => {
      editor.commands.setImage({ src: `/images/${img}` });
    });

    console.log(response.result);

    setImagePreview(null);
  };

  return (
    <div className="flex flex-wrap justify-start items-center py-2 gap-2 overflow-hidden">
      {/* bold */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        pressed={editor.isActive("blockquote")}
      >
        <RiBold />
      </Toggle>

      {/* italic */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        pressed={editor.isActive("italic")}
      >
        <RiItalic />
      </Toggle>

      {/* strike */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        pressed={editor.isActive("strike")}
      >
        <RiStrikethrough />
      </Toggle>

      {/* underline */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        pressed={editor.isActive("underline")}
      >
        <RiUnderline />
      </Toggle>

      {/* paragraph */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().setParagraph().run()}
        pressed={editor.isActive("paragraph")}
      >
        <RiParagraph />
      </Toggle>

      {/* Code */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
        pressed={editor.isActive("code")}
      >
        <RiCodeFill />
      </Toggle>

      {/* block quote */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        pressed={editor.isActive("blockquote")}
      >
        <RiDoubleQuotesL />
      </Toggle>

      {/* Link */}

      <Dialog>
        <DialogTrigger asChild>
          <Toggle variant={"outline"} pressed={editor.isActive("link")}>
            <RiLink />
          </Toggle>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" placeholder="https://facebook.com" />
          </div>
          <DialogFooter className="flex gap-3 justify-end">
            <DialogClose>Close</DialogClose>
            <DialogClose asChild>
              <Button
                variant={"default"}
                onClick={() => {
                  const url = document.getElementById(
                    "link"
                  ) as HTMLInputElement;
                  if (url === null) return;
                  if (url.value === "") {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();
                  } else {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url.value })
                      .run();
                  }
                }}
              >
                Add Link
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Youtube */}

      <Dialog>
        <DialogTrigger asChild>
          <Toggle variant={"outline"} pressed={editor.isActive("link")}>
            <RiYoutubeFill />
          </Toggle>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" placeholder="https://facebook.com" />
          </div>
          <DialogFooter className="flex gap-3 justify-end">
            <DialogClose>Close</DialogClose>
            <DialogClose asChild>
              <Button
                variant={"default"}
                onClick={() => {
                  const url = document.getElementById(
                    "link"
                  ) as HTMLInputElement;
                  if (url === null) return;
                  if (url.value === "") {
                    return;
                  } else {
                    editor.commands.setYoutubeVideo({
                      src: url.value,
                    });
                  }
                }}
              >
                Add Link
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image */}

      <Dialog>
        <DialogTrigger asChild>
          <Toggle variant={"outline"} pressed={editor.isActive("link")}>
            <RiImage2Fill />
          </Toggle>
        </DialogTrigger>
        <div></div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Drop Photo</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <div className="flex flex-wrap justify-center items-center gap-2">
              {imagePreview.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="preview"
                  className="w-20 h-20 object-cover"
                />
              ))}
            </div>
          )}
          <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="imgFile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="file"
                        ref={field.ref}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          const file = e.target.files;
                          field.onChange(file);
                          if (file) {
                            const files = Array.from(file);
                            setImagePreview(
                              files.map((file) => URL.createObjectURL(file))
                            );
                          }
                        }}
                        multiple={true}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex gap-3 justify-end">
                <DialogClose>Close</DialogClose>
                <Button variant={"default"} type="submit">
                  Add Image
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <pre>|</pre>

      {/* Heading */}

      <Popover>
        <PopoverTrigger className="border border-input bg-transparent hover:bg-accent hover:text-accent-foreground px-3 h-10 rounded-md">
          <RiHeading />
        </PopoverTrigger>
        <PopoverContent className="flex gap-2 w-fit">
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            pressed={editor.isActive("heading", { level: 1 })}
          >
            <RiH1 />
          </Toggle>
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            pressed={editor.isActive("heading", { level: 2 })}
          >
            <RiH2 />
          </Toggle>
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            pressed={editor.isActive("heading", { level: 3 })}
          >
            <RiH3 />
          </Toggle>
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            pressed={editor.isActive("heading", { level: 4 })}
          >
            <RiH4 />
          </Toggle>
        </PopoverContent>
      </Popover>

      {/* Text Align */}

      <Popover>
        <PopoverTrigger className="border border-input bg-transparent hover:bg-accent hover:text-accent-foreground px-3 h-10 rounded-md">
          {align}
        </PopoverTrigger>
        <PopoverContent className="flex gap-2 w-fit">
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run() &&
              setAlign(<RiAlignLeft />)
            }
            pressed={editor.isActive({ TextAlign: "left" })}
          >
            <RiAlignLeft />
          </Toggle>
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run() &&
              setAlign(<RiAlignCenter />)
            }
            pressed={editor.isActive({ TextAlign: "center" })}
          >
            <RiAlignCenter />
          </Toggle>
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run() &&
              setAlign(<RiAlignRight />)
            }
            pressed={editor.isActive({ TextAlign: "right" })}
          >
            <RiAlignRight />
          </Toggle>
          <Toggle
            variant={"outline"}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("justify").run() &&
              setAlign(<RiAlignJustify />)
            }
            pressed={editor.isActive({ TextAlign: "justify" })}
          >
            <RiAlignJustify />
          </Toggle>
        </PopoverContent>
      </Popover>

      {/* Order and Unorder list */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        pressed={editor.isActive("orderList")}
      >
        <RiListOrdered />
      </Toggle>
      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        pressed={editor.isActive("bulletList")}
      >
        <RiListUnordered />
      </Toggle>

      <pre>|</pre>

      {/* Horizontal Rule */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <RiSeparator />
      </Toggle>

      {/* Undo Redo */}

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().undo().run()}
        pressed={editor.isActive("undo")}
      >
        <RiArrowGoBackFill />
      </Toggle>

      <Toggle
        variant={"outline"}
        onPressedChange={() => editor.chain().focus().redo().run()}
        pressed={editor.isActive("redo")}
      >
        <RiArrowGoForwardFill />
      </Toggle>
    </div>
  );
};

export default TiptapMenu;
