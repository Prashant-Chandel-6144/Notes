import { connectDB } from "@/lib/db";

import { User } from "@/lib/models/user.model";
import bcrypt from "bcrypt";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const user = await User.findByIdAndDelete(id);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.log("Error in deleting user", error);
  }
}


export async function PUT(req,{params}) {
    try {
        await connectDB()
        const {id} = await params
        const {fname,lname,email,password} = await req.json()
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User.findByIdAndUpdate(id,{fname,lname,email,password:hashedPassword},{new:true})
        return Response.json(user,{status:200})
    } catch (error) {
        console.log("Error in updating user", error)
    }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await User.findById(id);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.log("Error in getting user", error);
  }
}