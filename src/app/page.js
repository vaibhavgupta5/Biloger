"use client";
import Editor from "@/components/Quill";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function Home() {
  const { user } = useUser();

  console.log(user);

  const saveToDb = async (user) => {
    try {
      console.log(user.username);

      const response = await axios.post("/api/addUser", user);

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      console.log("done ho gya bc");
    } catch (error) {
      console.log(error);
    }
  };

  const savedUser = localStorage.getItem("user");

  if (user && !savedUser) {
    try {
      saveToDb(user);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Editor />
    </div>
  );
}
