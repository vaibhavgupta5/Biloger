import connectDb from "@/lib/connectDb";
import { UserModel } from "@/Models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    console.log("here");
    const body = await req.json(); // Parse the request body
    const {  username } = body;

    


    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username
    });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
          success: false,
          data: false,
        },
        {
          status: 400,
        }
      );
    }


    return NextResponse.json(
      {
        message: "No User",
        data: true,
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
        message: "Error: Unable to create user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
