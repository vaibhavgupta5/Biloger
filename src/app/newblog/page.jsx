"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { CaseSensitive, Eye, Image, Link, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

function NewBlog() {
  const [quill, setquill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // if (!user || !user.username) {
    //   router.push("/signin");
    // }

    if (!quill) {
      const editor = new Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            ["link"],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
      });
      setquill(editor);
    }
  }, [user, quill, router]);

  const buttonaction = (e) => {
    e.preventDefault();

    if (quill.root?.innerHTML === "<p><br></p>") {
      Swal.fire({ title: "Please enter valid content.", icon: "error" });
      return;
    }

    const title = e.target[0].value.trim();
    const coverImage = e.target[1].value.trim();
    const slug = e.target[2].value.trim();
    const tags = e.target[3]
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    if (!title || !coverImage || !slug || tags.length === 0) {
      Swal.fire({ title: "All fields are required.", icon: "error" });
      return;
    }

    const blogdata = {
      username: user.username,
      name: title,
      content: quill.root?.innerHTML,
      coverimage: coverImage,
      slug,
      tags,
    };

    saveBlogToDB(blogdata);
  };

  const saveBlogToDB = async (blogdata) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/addBlogs", blogdata);
      if (response) {
        Swal.fire({ title: "Your Blog is Published.🔥", icon: "success" });
        router.push(`/${user.username}`);
      }
    } catch (error) {
      Swal.fire({ title: "Something went wrong, please try again.", icon: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const seePreview = () => {
    const content = quill.root?.innerHTML;
    const title = document.getElementById("title")?.value.trim();
    const coverImage = document.getElementById("coverImage")?.value.trim();
    const slug = document.getElementById("slug")?.value.trim();
    const tags = document
      .getElementById("tags")
      ?.value.split(",")
      .map((tag) => tag.trim());

    if (!title || !coverImage || !slug || !content || tags.length === 0) {
      Swal.fire({
        title: "Please fill all fields before previewing.",
        icon: "error",
      });
      return;
    }

    router.push(
      `/preview?title=${encodeURIComponent(title)}&coverImage=${encodeURIComponent(
        coverImage
      )}&slug=${encodeURIComponent(slug)}&tags=${encodeURIComponent(
        tags.join(",")
      )}&content=${encodeURIComponent(content)}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 p-8">
      <h1 className="text-3xl font-bold text-center">Create a New Blog</h1>
      <div className="flex p-6 justify-center gap-8">
        <div className="w-1/2 h-[75vh] bg-white shadow-lg rounded-lg">
          <div id="editor-container" style={{ height: "65vh", marginBottom: "20px" }}></div>
        </div>
        <form onSubmit={buttonaction} className="w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-semibold">Title</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <CaseSensitive className="h-5 w-5" />
              <input
                id="title"
                type="text"
                placeholder="Enter the title"
                className="w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="coverImage" className="font-semibold">Cover Image</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <Image className="h-5 w-5" />
              <input
                id="coverImage"
                type="url"
                placeholder="Enter the cover image URL"
                className="w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="font-semibold">Slug</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <Link className="h-5 w-5" />
              <input
                id="slug"
                type="text"
                placeholder="Enter the slug"
                className="w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tags" className="font-semibold">Tags</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <Tags className="h-5 w-5" />
              <input
                id="tags"
                type="text"
                placeholder="Enter tags separated by commas"
                className="w-full focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Eye
              onClick={seePreview}
              className="cursor-pointer rounded-full h-10 w-10 p-2 shadow-lg transition"
            />
            <button
              type="submit"
              className={`w-1/2 py-2 rounded-lg font-semibold transition ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewBlog;
