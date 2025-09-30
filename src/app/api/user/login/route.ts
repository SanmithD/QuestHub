import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '../../lib/dbConnection';
import { userModel } from "../../model/user.model";
import { generateToken } from "../../utils/generateToken";

export const POST = async(req: NextRequest) =>{
    const data = await req.json();
    try {
        await connectDB();
        const user = await userModel.findOne({ email: data.email });
        if(!user) {
            return NextResponse.json({ message: "User does not exists" },{ status: 400 });
        }

        const hashPass = await bcrypt.compare(user.password, data.password);
        if(!hashPass){
            return NextResponse.json({ message: "Invalid credentials" },{ status: 403 });
        }
        const token = generateToken({ userId: user._id.toString()});
        
        const res = NextResponse.json({ message: "User loggedIn" },{ status: 201 });
        res.cookies.set("jwt", token,{
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== "development",
            path: '/'
        });

        return res;
    } catch (error) {
        console.log("signup error", error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}