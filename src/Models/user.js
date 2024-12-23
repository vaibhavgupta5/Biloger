import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  blogs: [
    {
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
      content: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      image:{
        type: String,
      },
      tags: {
        type: [String],
      },
      comments: [
        {
          name: {
            type: String,
          },
          content: {
            type: String,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);


  