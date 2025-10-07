import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnection";
import { authorization } from "../../middlewares/auth.middleware";
import { bookModel } from "../../model/bookmark.model";

export const GET = async(req: NextRequest) =>{
    const userId = await authorization(req);
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 403 });
    try {
        await connectDB();
        const res = await bookModel.find({ userId }).populate("questId").populate("userId").sort({ createdAt: -1 });
        if(!res || res.length === 0) return NextResponse.json({ message: "Not found" },{ status: 404 });

        return NextResponse.json({ message: "All bookmarked", res },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}