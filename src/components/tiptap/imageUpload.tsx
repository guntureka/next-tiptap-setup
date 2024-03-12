import { Editor } from "@tiptap/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "../ui/toggle";
import {
  RiDeleteBin6Line,
  RiImage2Fill,
  RiLoader5Line,
  RiLoaderLine,
  RiSendToBack,
} from "react-icons/ri";
import { TbReload } from "react-icons/tb";
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
import { Button } from "../ui/button";
import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { getListAllFiles, storage } from "@/lib/firebase";

export const formSchema =
  typeof window !== "undefined"
    ? z.object({
        imgFile: z
          .instanceof(FileList)
          .refine(
            (fileList) => {
              const files = Array.from(fileList) as File[];

              return files.every((file) => file.size < 2 * 1024 * 1024);
            },
            {
              message: "File size should be less than 2MB",
            }
          )
          .refine(
            (fileList) => {
              const files = Array.from(fileList) as File[];

              return files.every((file) =>
                ["image/jpg", "image/jpeg", "image/png", "image/gif"].includes(
                  file.type
                )
              );
            },
            {
              message:
                "Invalid file type. Only jpg, jpeg, png, gif are allowed",
            }
          )
          .optional(),
      })
    : z.object({
        imgFile: z.unknown().optional(),
      });

const ImageUpload = ({ editor }: { editor: Editor }) => {
  const [imagePreview, setImagePreview] = useState<string[] | null>(null);
  const [list, setList] = useState<{ name: string; url: string }[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitUpload = async (data: z.infer<typeof formSchema>) => {
    if (data?.imgFile === undefined || data?.imgFile === null) {
      setImagePreview(null);
      return;
    }

    if ((data.imgFile as FileList).length === 0) {
      setImagePreview(null);
      return;
    }

    setIsLoading(true);

    const files = Array.from(data.imgFile as File[]);

    const result = await Promise.all(
      files.map((file) => {
        return new Promise(async (resolve, reject) => {
          const storageRef = ref(storage, `images/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot: UploadTaskSnapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
              editor.commands.setImage({ src: downloadURL });
            }
          );
        });
      })
    );

    setImagePreview(null);

    const list = await getListAllFiles();
    setList(list);

    setIsLoading(false);
  };

  const handleDelete = async (name: string) => {
    setIsLoading(true);
    const desertRef = ref(storage, `images/${name}`);
    await deleteObject(desertRef);
    const list = await getListAllFiles();
    setList(list);
    setIsLoading(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Toggle
            variant={"outline"}
            pressed={editor.isActive("link")}
            onPressedChange={async () => {
              const list = await getListAllFiles();
              setList(list);
            }}
          >
            <RiImage2Fill />
          </Toggle>
        </DialogTrigger>
        <DialogContent className="max-w-sm md:max-w-4xl rounded-md">
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">Drop</TabsTrigger>
              <TabsTrigger value="uploaded">Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="">
              <Form {...form}>
                <form
                  method="POST"
                  onSubmit={form.handleSubmit(onSubmitUpload)}
                  className="flex flex-col justify-between gap-3 pt-2 h-80"
                >
                  <FormField
                    control={form.control}
                    name="imgFile"
                    render={({ field }) => (
                      <FormItem>
                        {imagePreview ? (
                          <div className="grid md:grid-cols-4 grid-cols-2 justify-start items-center gap-2 overflow-auto h-44">
                            {imagePreview.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt="preview"
                                className="object-cover"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center items-center h-44">
                            <p>Drop your image here</p>
                          </div>
                        )}
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
                  <DialogFooter className="">
                    <div className="flex justify-end gap-3">
                      <DialogClose asChild>
                        <Button variant={"outline"} className="">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant={"default"}
                        type="submit"
                        className=""
                        {...(isLoading && { disabled: true })}
                      >
                        Add Image
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="uploaded" className="">
              {list?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-auto h-80">
                  {list.map((item, index) => (
                    <div key={index} className="relative">
                      <Button
                        variant={"destructive"}
                        className="absolute top-0 right-0 z-10 transition-none "
                        onClick={() => handleDelete(item.name)}
                        {...(isLoading && { disabled: true })}
                      >
                        <RiDeleteBin6Line />
                      </Button>
                      <div
                        onClick={() => {
                          editor.commands.setImage({ src: item.url });
                        }}
                        className="static z-0 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-90 hover:shadow-lg"
                      >
                        <img
                          src={item.url}
                          alt="preview"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-80">
                  <p>No such file</p>
                </div>
              )}
              <Button variant={"outline"} className="absolute top-6 right-10">
                <TbReload />
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
