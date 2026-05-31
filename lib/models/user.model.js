import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        fname:{
            type:String,
            required:true,
            minlength:[4,"First name must be at least 4 Chars"]
        },
        lname:{
            type:String,
            required:true,
            minlength:[4,"Last name must be at least 4 Chars"]
        },
        email:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            minlength:[6, "Password must be at least 6 Chars"]
        }
    },
    {
        timestamps:true
    }
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)