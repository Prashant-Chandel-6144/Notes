import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fname: firstName,
      lname: lastName,
      email,
      password: hashedPassword,
    });

    // Don't send hashed password back to client
    const { password: _pw, ...safeUser } = user.toObject();
    return Response.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("Error during creating user", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}