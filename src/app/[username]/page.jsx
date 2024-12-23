'use client';

import React, { useEffect, useState } from 'react';
import { Search, Tag, Calendar, MessageSquare, Menu, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

function BlogListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const params = useParams();
  const username = params.username;
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (username) {
      getBlogs();
    }
  }, [username]);

  const getBlogs = async () => {
    try {
      const response = await axios.post('/api/getAllBlogs', { username: username });

      if (response.data.success) {
        setBlogs(response.data.data);
      } else {
        console.log('Error in getting blogs');
      }
    } catch (error) {
      console.error('Error in fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedTag || blog.tags.includes(selectedTag))
  );

  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)));

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  const rediectTo = (blog) => {
    console.log(blog)
    router.push(`/${username}/${blog.slug}`);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className=" md:hidden bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:block w-64 bg-white p-6 border-r border-gray-200 h-[calc(100vh-64px)] overflow-auto`}
        >
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Filters</h3>
          <div className="space-y-6">
            {/* Search Bar */}
            <div>
              <div className="relative">
                <div className="absolute text-black inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block text-black w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-auto">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTag === tag
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <div key={index} onClick={() => rediectTo(blog)} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <img
                  src={blog.image}
                  alt={blog.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900">{blog.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {blog.content.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(blog.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {blog.comments.length} comments
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default BlogListing;

