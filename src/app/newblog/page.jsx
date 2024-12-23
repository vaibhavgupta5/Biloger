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
  const [quill, setquill] = useState("");
  const { user } = useUser();
  const router = useRouter();


  
 
  useEffect(() => {

      if(user?.username === "" || user === null){
        router.push("/signin");
      }
   
  
    
    // Initialize Quill editor
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
  }, []);

  const [blogData, setblogData] = useState("");

  const buttonaction = (e) => {
    e.preventDefault();

    if (quill.root?.innerHTML === "<p><br></p>") {
      Swal.fire({
        title: "Please enter valid content.",
        icon: "error",
      });
      return;
    }

    if (e.target[0].value === "") {
      Swal.fire({
        title: "Please enter a valid title.",
        icon: "error",
      });
      return;
    }

    if (user.username === "") {
      router.push("/signin");
    }

    if (e.target[1].value === "" || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(e.target[1].value)) {
      Swal.fire({
        title: "Please enter a valid image link.",
        icon: "error",
      });
      return;
    }

    if (e.target[2].value === "") {
      Swal.fire({
        title: "Please enter a valid slug.",
        icon: "error",
      });
      return;
    }

    if (e.target[3].value === "") {
      Swal.fire({
        title: "Please enter valid tags.",
        icon: "error",
      });
      return;
    }

    const tags = e.target[3].value.split(",");
    const blogdata = {
      username: user.username,
      name: e.target[0].value,
      content: quill.root?.innerHTML,
      coverimage: e.target[1].value,
      slug: e.target[2].value,
      tags: tags,
    };

    setblogData(blogdata);
    saveBlogToDB(blogdata);
  };

  const seePreview = () => {
    const queryString = new URLSearchParams(blogData).toString();
    router.push(`/preview?${queryString}`);
  };

  const saveBlogToDB = async (blogdata) => {
    try {
      const response = await axios.post("/api/addBlogs", blogdata);

      if (response) {
        Swal.fire({
          title: "Your Blog is Published.🔥",
          icon: "success",
        });

        router.push(`/${user.username}`);
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong, please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 p-8">
      <h1 className="text-3xl font-bold  text-center">Create a New Blog</h1>
      <div className="flex p-6 justify-center gap-8">
        <div className="w-1/2 h-[75vh] bg-white shadow-lg rounded-lg">
          <div
            id="editor-container"
            style={{ height: "65vh", marginBottom: "20px" }}
            ></div>
        </div>
        <form
          onSubmit={(e) => buttonaction(e)}
          className="w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col gap-6"
        >
          <div>
            <label className="font-semibold mb-2 block" htmlFor="title">
              <CaseSensitive className="inline-block mr-2" /> Title
            </label>
            <input
              id="title"
              className="w-full border border-gray-300 rounded-lg p-2"
              type="text"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className="font-semibold mb-2 block" htmlFor="cover-image">
              <Image className="inline-block mr-2" /> Cover Image URL
            </label>
            <input
              id="cover-image"
              className="w-full border border-gray-300 rounded-lg p-2"
              type="text"
              placeholder="http://example.image.com"
            />
          </div>

          <div>
            <label className="font-semibold mb-2 block" htmlFor="slug">
              <Link className="inline-block mr-2" /> Slug
            </label>
            <input
              id="slug"
              className="w-full border border-gray-300 rounded-lg p-2"
              type="text"
              placeholder="enter-your-slug"
            />
          </div>

          <div>
            <label className="font-semibold mb-2 block" htmlFor="tags">
              <Tags className="inline-block mr-2" /> Tags (comma-separated)
            </label>
            <input
              id="tags"
              className="w-full border border-gray-300 rounded-lg p-2"
              type="text"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Publish
          </button>
        </form>
      </div>

      {/* <Eye
        onClick={() => seePreview()}
        className="text-gray-600 bg-white fixed left-5 bottom-5 cursor-pointer hover:text-gray-800 rounded-full h-10 w-10 p-2 shadow-lg transition"
      /> */}
    </div>
  );
}

export default NewBlog;
