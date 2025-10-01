import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnection";
import { authorization } from "../../middlewares/auth.middleware";
import { userModel } from "../../model/user.model";

export const GET = async(req: NextRequest) =>{
    const userId  = await authorization(req);
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 403 });
    try {
        await connectDB();
        const res = await userModel.findById(userId).select("-password");
        if(!res) return NextResponse.json({ message: "Account not found" },{ status: 404 });

        return NextResponse.json({ message: "Profile", res },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}

export const DELETE = async(req: NextRequest) =>{
    const userId  = await authorization(req);
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 403 });
    try {
        await connectDB();
        const res = await userModel.findByIdAndDelete(userId);
        if(!res) return NextResponse.json({ message: "Account not found" },{ status: 404 });

        return NextResponse.json({ message: "Profile Deleted", res },{ status: 403 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}

export const PUT = async(req: NextRequest) =>{
    const body = await req.json();
    const userId  = await authorization(req);
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 403 });
    try {
        await connectDB();
        const res = await userModel.findByIdAndUpdate(userId,body,{ new: true });
        if(!res) return NextResponse.json({ message: "Account not found" },{ status: 404 });

        return NextResponse.json({ message: "Profile", res },{ status: 403 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}