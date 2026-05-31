import { connectDB } from "@/lib/db";
import { Note } from "@/lib/models/notes.model";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return Response.json(
        { message: "Todo not found or unauthorized" },
        { status: 404 },
      );
    }
    return Response.json(note, { status: 200 });
  } catch (error) {
    console.log("Error in deleting note", error);
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { title, description } = await req.json();
    const note = await Note.findByIdAndUpdate(
      { _id: id },
      { title, description },
    );
    return Response.json(note, { status: 200 });
  } catch (error) {
    console.log("Error in updating note", error);
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const note = await Note.findById(id);
    return Response.json(note, { status: 200 });
  } catch (error) {
    console.log("Error in getting note", error);
  }
}
