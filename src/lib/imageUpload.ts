"use server";

import React from "react";
import { promises as fs } from "fs";

export const ImageUpload = async ({ selectedImage, data }: any) => {
  if (!selectedImage) return;
  const imageName = `public/uploads/${selectedImage.name}`;
  await fs.writeFile(`public/uploads/${imageName}`, data.imgFile);
  return imageName;
};
