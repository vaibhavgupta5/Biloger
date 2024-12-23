"use client";
import Editor from "@/components/Quill";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();



  const router = useRouter();
  console.log(user);

  if(!user){
    router.push("/signin");
  }

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
      router.push(`/${user.username}`);

    } catch (error) {
      console.log(error);
      router.push(`/${user.username}`);

    }
  }

  return (
    <div>
     Nice eyes yaar
    </div>
  );
}
