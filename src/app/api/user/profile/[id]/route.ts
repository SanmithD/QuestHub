import { connectDB } from "@/app/api/lib/dbConnection";
import { authorization } from "@/app/api/middlewares/auth.middleware";
import { userModel } from "@/app/api/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(_req: NextRequest,context : { params: Promise<{ id: string}> }) =>{
    const userId  = await authorization(_req);
    const id = context.params;
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 403 });
    try {
        await connectDB();
        const res = await userModel.findById(id).select("-password");
        if(!res) return NextResponse.json({ message: "Account not found" },{ status: 404 });

        return NextResponse.json({ message: "Profile", res },{ status: 403 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}