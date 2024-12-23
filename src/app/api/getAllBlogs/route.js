import connectDb from "@/lib/connectDb";
import { UserModel } from "@/Models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    console.log("here");
    const body = await req.json(); // Parse the request body
    const { username } = body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username });

    const blogs = existingUser?.blogs;

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
        data: blogs,
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
