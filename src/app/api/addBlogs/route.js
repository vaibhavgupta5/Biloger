import connectDb from "@/lib/connectDb";
import { UserModel } from "@/Models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    
    await connectDb();

    console.log("here")
    const body = await req.json(); // Parse the request body
    const { username, name, coverimage, content, tags  } = body;

  

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not exists",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const slug = name.toLowerCase().split(" ").join("-");


    const existingBlog = await UserModel.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        {
          message: "Blog already exists",
          success: false,
        },
        {
          status: 400,
        }
      );
    }


    // Create a new user
    const blog = {
      name,
      content,
      slug,
      tags,
      image: coverimage,
    }

    existingUser.blogs.push(blog);

    await existingUser.save();

    return NextResponse.json(
      {
        message: "Blog added successfully",
        success: true,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in user creation:", error);
    return NextResponse.json(
      {
        message: "Error: Unable to create blog",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
