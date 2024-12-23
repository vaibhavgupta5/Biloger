import connectDb from "@/lib/connectDb";
import { UserModel } from "@/Models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    console.log("here");
    const body = await req.json(); // Parse the request body
    const { fullName, primaryEmailAddress,  username } = body;


    const password = process.env.GOOGLE_PASSWORD;

    console.log(body)

    if (!fullName || !primaryEmailAddress || !password || !username) {
      return NextResponse.json(
        {
          message: "Error: Missing required fields",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const email = primaryEmailAddress.emailAddress;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email
    });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Error: User already exists",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    // Create a new user
    const newUser = new UserModel({
      name: fullName,
      email : primaryEmailAddress.emailAddress,
      password,
      username,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser,
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
        message: "Error: Unable to create user",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
