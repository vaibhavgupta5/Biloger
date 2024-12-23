import connectDb from "@/lib/connectDb";
import { UserModel } from "@/Models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    console.log("here");
    const body = await req.json(); // Parse the request body
    const { username, slug, name, content } = body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });

    const blogs = existingUser?.blogs;

    const blog = blogs.filter((blog) => blog.slug === slug);

    console.log(blog)

    const comment = {
      name: name, 
      content: content,
      date: new Date()
    }

    blog[0].comments.push(comment);

    await existingUser.save();

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

    return NextResponse.json(
      {
        message: "Success",
        data: blog,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in user creation:", error);
    return NextResponse.json(
      {
        message: "Error: Unable to get user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
