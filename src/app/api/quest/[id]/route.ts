import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnection";
import { authorization } from "../../middlewares/auth.middleware";
import { questModel } from "../../model/quest.model";

export const PUT = async(_req: NextRequest, context: { params: Promise<{ id: string }> }) =>{
    const body = await _req.json();
    const userId = await authorization(_req);
    const { id: questId } = await context.params;
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 401 });
    if (!body.message) return NextResponse.json({ message: "Message is required" }, { status: 400 });

    try {
        await connectDB();
        const updateQuest = await questModel.findByIdAndUpdate({ userId, _id: questId }, { ...body },{ new: true });
        if(!updateQuest) return NextResponse.json({ message: "Invalid request" },{ status: 400 });
        return NextResponse.json({ message: "Quest updated" },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" },{ status: 500 });
    }
}

export const DELETE = async(_req: NextRequest, context: { params: Promise<{ id: string }> }) =>{
    const userId = await authorization(_req);
    const { id: questId } = await context.params;
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 401 });

    try {
        await connectDB();
        const updateQuest = await questModel.findByIdAndDelete({ userId, _id: questId });
        if(!updateQuest) return NextResponse.json({ message: "Invalid request" },{ status: 400 });
        return NextResponse.json({ message: "Quest deleted" },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" },{ status: 500 });
    }
}

export const GET = async(_req: NextRequest, context: { params: Promise<{ id: string }> }) =>{
    const userId = await authorization(_req);
    const { id: questId } = await context.params;
    if(!userId) return NextResponse.json({ message: "Unauthorized" },{ status: 401 });

    try {
        await connectDB();
        const quest = await questModel.findById(questId).populate("userId");
        if(!quest) return NextResponse.json({ message: "Invalid request" },{ status: 400 });
        return NextResponse.json({ message: "Quest", quest },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" },{ status: 500 });
    }
}