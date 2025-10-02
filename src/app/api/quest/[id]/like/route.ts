import { connectDB } from "@/app/api/lib/dbConnection";
import { authorization } from "@/app/api/middlewares/auth.middleware";
import { questModel } from "@/app/api/model/quest.model";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const userId = await authorization(_req);
    const { id: questId } = await context.params;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!questId) {
      return NextResponse.json({ message: "Quest ID is required" }, { status: 400 });
    }

    await connectDB();

    const quest = await questModel.findById(questId);
    if (!quest) {
      return NextResponse.json({ message: "Quest not found" }, { status: 404 });
    }

    if (!quest.likes) quest.likes = [];

    let liked = false;
    const userIdString = userId.toString();
    
    const likesAsStrings = quest.likes.map((id:string) => id.toString());
    
    if (likesAsStrings.includes(userIdString)) {
      quest.likes = quest.likes.filter((id: string) => id.toString() !== userIdString);
      liked = false;
    } else {
      quest.likes.push(userId);
      liked = true;
    }

    await quest.save();
    
    return NextResponse.json({ 
      message: liked ? "Liked" : "Unliked", 
      liked,
      likesCount: quest.likes.length,
      questId: quest._id
    }, { status: 200 });

  } catch (error) {
    console.error("Quest like/unlike error:", error);
    return NextResponse.json({ 
      message: "Server Error" 
    }, { status: 500 });
  }
};
