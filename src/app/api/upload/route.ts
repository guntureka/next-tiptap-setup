import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const files = formData.getAll("imgFile") as File[];

  const result = await Promise.all(
    files.map(async (file) => {
      const fileName = file.name.replace(" ", "_");
      const filePath = path.join(process.cwd(), "public", "images", fileName);
      const fileStream = fs.createWriteStream(filePath);
      const reader = file.stream().getReader();
      let done = false;
      while (!done) {
        const { value, done: doneValue } = await reader.read();
        done = doneValue;
        if (value) {
          fileStream.write(Buffer.from(value));
        }
      }
      fileStream.end();
      return fileName;
    })
  );

  return NextResponse.json({ message: "oke", result });
};
