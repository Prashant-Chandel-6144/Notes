import { connectDB } from "@/lib/db";
import { Note } from "@/lib/models/notes.model";

export async function POST(req) {
    try {
        await connectDB()
        const {title,description} = await req.json()
        const note = await Note.create({title,description})
        return Response.json(note,{status:201})
    } catch (error) {
        console.log("Error in creating note", error)
    }
}



