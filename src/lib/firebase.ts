// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage } from "firebase/storage";
import { Readable } from "stream";
import { ref, listAll } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6ge-ufG9EgGx-Kmq34_ZuYI8yBR_qz0Y",
  authDomain: "next-tiptap.firebaseapp.com",
  projectId: "next-tiptap",
  storageBucket: "next-tiptap.appspot.com",
  messagingSenderId: "375120065160",
  appId: "1:375120065160:web:77b7d557163217fc7aa53d",
  measurementId: "G-QQ4NTTZWDH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadImage(formData: FormData) {
  const files = formData.getAll("imgFile") as File[];

  const result = await Promise.all(
    files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const stream = Readable.from(buffer);
    })
  );
}

export const getListAllFiles = async () => {
  const listRef = ref(storage, "images");

  const list = await Promise.all(
    await listAll(listRef).then((res) => {
      return res.items.map(async (url) => {
        const name = url.name;
        const urlPath = await getDownloadURL(url);
        return { name: name, url: urlPath };
      });
    })
  );

  return list;
};
