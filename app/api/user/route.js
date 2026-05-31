import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import bcrypt from "bcrypt";

export  async function POST(req) {
  try {
    await connectDB();
    const { fname, lname, email, password } = await req.json();
    const hashedpassword = await bcrypt.hash(password,10)
    const user = await User.create({
      fname,
      lname,
      email,
      password:hashedpassword
    });
    return Response.json(user, { status: 201 });
  } catch (error) {
    console.log("Error during creating user", error);
  }
}
