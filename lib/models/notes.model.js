import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    title: {
      type: String,
      minlength: [6, "Title must be at least 6 chars"],
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);


export const  Note = mongoose.models.Note || mongoose.model("Note", noteSchema)