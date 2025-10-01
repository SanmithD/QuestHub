import { connectDB } from "@/app/api/lib/dbConnection";
import { authorization } from "@/app/api/middlewares/auth.middleware";
import { questModel } from "@/app/api/model/quest.model";
import { NextRequest, NextResponse } from "next/server";

// Like/unlike a quest
export const PATCH = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const userId = await authorization(_req);
  const { id: questId } = await context.params;

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const quest = await questModel.findById({ _id: questId});
    if (!quest) return NextResponse.json({ message: "Quest not found" }, { status: 404 });

    let liked = false;
    if (!quest.likes) quest.likes = [];
    if (quest.likes.includes(userId)) {
      quest.likes = quest.likes.filter((id:string) => id !== userId.toString());
    } else {
      quest.likes.push(userId);
      liked = true;
    }

    await quest.save();
    return NextResponse.json({ message: liked ? "Liked" : "Unliked", quest }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
