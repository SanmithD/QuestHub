import { connectDB } from "@/app/api/lib/dbConnection";
import { questModel } from "@/app/api/model/quest.model";
import { userModel } from "@/app/api/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(_req: NextRequest,context : { params: Promise<{ id: string}> }) =>{
    const { id } = await context.params;

    try {
        await connectDB();
        const url = new URL(_req.url);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const res = await userModel.findById(id).select("-password");
        const userQuest = await questModel.find({ userId: id }).limit(limit).sort({ createdAt: -1 });
        const userData = {
            res,
            userQuest
        }
        if(!res) return NextResponse.json({ message: "Account not found" },{ status: 404 });

        return NextResponse.json({ message: "Profile", userData },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}