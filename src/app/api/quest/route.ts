import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../lib/dbConnection";
import { authorization } from "../middlewares/auth.middleware";
import { questModel } from "../model/quest.model";

export const POST = async(req: NextRequest) =>{
    const body = await req.json();
    const userId = await authorization(req);
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 401 });

    if (!body.data)
    return NextResponse.json({ message: "Message is required" }, { status: 400 });

    try {
        await connectDB();
        const newQuest = new questModel({
            userId,
            message: body.data,
        });
        if(!newQuest) return NextResponse.json({ message: "Invalid request" },{ status: 400 });
        await newQuest.save();
        return NextResponse.json({ message: "Quest posted" },{ status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" },{ status: 500 });
    }
}

export const GET = async(req: NextRequest) =>{
    
    const userId = await authorization(req);
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    try {

        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const skip = (page -1) * 10;

        const res = await questModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId");
        if(!res || res.length === 0) return NextResponse.json({ message: "Not found" },{ status: 404 });

        return NextResponse.json({ message: "All quests", res },{ status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}
