import mongoose from "mongoose";


export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MonogDB connected successfully 🟢")
    } catch (error) {
        console.log("MonogoDB connection Failed ❌",error)
        
    }
    
}