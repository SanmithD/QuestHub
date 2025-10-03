import { connectDB } from "@/app/api/lib/dbConnection";
import { authorization } from "@/app/api/middlewares/auth.middleware";
import { questModel } from "@/app/api/model/quest.model";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const body = await _req.json();
  const userId = await authorization(_req);
  const { id: questId } = await context.params;

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (!body.comment)
    return NextResponse.json({ message: "Message is required" }, { status: 400 });

  try {
    await connectDB();

    const updateQuest = await questModel.findByIdAndUpdate(
      questId,
      {
        $push: {
          comments: { userId, message: body.comment },
        },
      },
      { new: true }
    );

    if (!updateQuest)
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });

    return NextResponse.json({ message: "Comment added", quest: updateQuest }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const userId = await authorization(_req);
  const { id: questId } = await context.params;

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(_req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const quest = await questModel
      .findById(questId)
      .select("comments")
      .populate("comments.userId");

    if (!quest) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const sortedComments = [...quest.comments]
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);

    return NextResponse.json(
      { message: "Comments", comments: sortedComments },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
