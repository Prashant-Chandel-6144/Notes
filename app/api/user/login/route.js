import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user.model";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "No account found with this email" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: "Incorrect password" }, { status: 401 });
    }

    const { password: _pw, ...safeUser } = user.toObject();
    return Response.json({ message: "Login successful", user: safeUser }, { status: 200 });
  } catch (error) {
    console.error("Error during login", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}