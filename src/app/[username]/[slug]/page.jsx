"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Share2, WhatsApp, Mail, Copy, Telegram, MessageCircleMore, Send } from "lucide-react"; // Import Lucide Icons

function BlogPage() {
  const params = useParams();
  const slug = params.slug;

  const [blog, setBlog] = useState({});
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [newComment, setNewComment] = useState({
    name: "",
    content: "",
  });

  const [isShareOpen, setIsShareOpen] = useState(false);

  const currentUrl = window.location.href; // Get the current URL

  const handleShareButtonClick = () => {
    setIsShareOpen((prev) => !prev); // Toggle share popup visibility
  };

  const handleShareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("URL copied to clipboard!");
  };

  const handleShareViaEmail = () => {
    window.open(
      `mailto:?subject=Check this out&body=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  const handleShareOnTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  useEffect(() => {
    if (params.username && slug) {
      getBlogDetails();
    }
  }, [slug]);

  const getBlogDetails = async () => {
    try {
      const response = await axios.post("/api/getBlog", {
        username: params.username,
        slug: slug,
      });

      if (response.data.success) {
        const blogData = response.data.data[0];
        setBlog({
          ...blogData,
          date: new Date(blogData.date).toLocaleDateString(),
        });
        setTags(blogData.tags || []);
        setImage(response.data.data[0].image);
        setComments(
          blogData.comments.map((comment) => ({
            ...comment,
            date: new Date(comment.date).toLocaleDateString(),
          })) || []
        );
      } else {
        console.error("Error in getting blog details");
      }
    } catch (error) {
      console.error("Error in fetching blog details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.name && newComment.content) {
      const newCommentData = {
        ...newComment,
        date: new Date().toLocaleDateString(),
      };
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewComment({ name: "", content: "" });

      try {
        await axios.post("/api/addComments", {
          username: params.username,
          slug: slug,
          name: newCommentData.name,
          content: newCommentData.content,
        });
      } catch (error) {
        console.error("Error in submitting comment:", error);
      }
    } else {
      alert("Please fill out both fields.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row mx-auto p-6 sm:p-8 animate-[fadeIn_0.5s_ease-out] gap-6 bg-gray-50">
      {/* Blog Post */}
      <article className="bg-white w-full md:w-[70%] shadow-lg rounded-xl overflow-hidden">
        {/* Image Section */}
        <div className="w-full h-full sm:h-80 md:h-96">
          <img
            src={blog.image || "/placeholder.svg"}
            alt={blog.name || "Blog Image"}
            className="transition-opacity h-[55vh] w-full duration-300 ease-in-out"
          />
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-800 hover:text-blue-600 transition-colors">
            {blog.name || "Untitled Blog"}
          </h1>
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span>Published on: {blog.date || "Unknown"}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="prose lg:prose-xl max-w-none mb-8 text-gray-800"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          ></div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleShareButtonClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
          </div>
        </div>
      </article>

      {isShareOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Share this Blog
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleShareOnWhatsApp}
                className="w-full flex items-center bg-green-500 text-white py-3 px-4 rounded-full hover:bg-green-600 transition-colors"
              >
                <MessageCircleMore className="w-5 h-5 mr-3" />
                Share on WhatsApp
              </button>
              {/* Copy to Clipboard */}
              <button
                onClick={handleCopyToClipboard}
                className="w-full flex items-center bg-gray-500 text-white py-3 px-4 rounded-full hover:bg-gray-600 transition-colors"
              >
                <Copy className="w-5 h-5 mr-3" />
                Copy to Clipboard
              </button>
              {/* Email */}
              <button
                onClick={handleShareViaEmail}
                className="w-full flex items-center bg-blue-500 text-white py-3 px-4 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5 mr-3" />
                Share via Email
              </button>
              {/* Telegram */}
              <button
                onClick={handleShareOnTelegram}
                className="w-full flex items-center bg-blue-400 text-white py-3 px-4 rounded-full hover:bg-blue-500 transition-colors"
              >
                <Send className="w-5 h-5 mr-3" />
                Share on Telegram
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsShareOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <section className="h-[85vh] overflow-y-scroll text-black w-full md:w-[30%] bg-white max-w-4xl shadow-lg rounded-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            Comments
          </h2>
          {comments.length > 0 ? (
            <div className="space-y-2">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start border-solid border-black border-[1px] bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src="https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352010-stock-illustration-default-placeholder-man-and-woman.jpg"
                    alt="Commenter Avatar"
                    width={40}
                    height={40}
                    className="rounded-full mr-4 border-black border-2"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.name}
                    </p>
                    <p className="text-gray-700 mt-2">{comment.content}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">
              No comments yet. Be the first to comment!
            </p>
          )}

          {/* Add Comment Form */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Add a Comment
            </h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newComment.name}
                onChange={handleCommentChange}
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg"
                required
              />
              <textarea
                name="content"
                value={newComment.content}
                onChange={handleCommentChange}
                placeholder="Your Comment"
                rows="4"
                className="w-full p-3 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Comment
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
