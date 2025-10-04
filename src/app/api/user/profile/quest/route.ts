import { connectDB } from "@/app/api/lib/dbConnection";
import { authorization } from "@/app/api/middlewares/auth.middleware";
import { questModel } from "@/app/api/model/quest.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) =>{
    try {
        await connectDB();
        const userId = await authorization(req);

        if(!userId){
            return NextResponse.json({ message: "Invalid credential" },{ status: 400 });
        }
        const res = await questModel.find({ userId: userId });
        if(!res) return NextResponse.json({ message: "response" },{ status: 404 });

        return NextResponse.json({ message: "Quests", res },{ status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server error" },{ status: 500 });
    }
}