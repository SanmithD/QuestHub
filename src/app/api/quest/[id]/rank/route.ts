import { connectDB } from "@/app/api/lib/dbConnection";
import { authorization } from "@/app/api/middlewares/auth.middleware";
import { questModel } from "@/app/api/model/quest.model";
import { rankModel } from "@/app/api/model/rank.model";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const userId = await authorization(_req);
  const { id: questId } = await context.params;
  const body = await _req.json(); 
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (typeof body.rankValue !== "number")
    return NextResponse.json({ message: "rankValue is required" }, { status: 400 });

  try {
    await connectDB();

    const quest = await questModel.findById(questId);
    if (!quest) return NextResponse.json({ message: "Quest not found" }, { status: 404 });

    quest.rankValue = body.rankValue;
    await quest.save();
    let rank = await rankModel.findOne({ questId, userId });
    if(rank){
      rank.rankValue = body.rankValue;
      await rank.save();
    }else{
      rank = new rankModel({ questId, userId, rankValue: body.rankValue });
      await rank.save();
    }

    return NextResponse.json({ message: "Quest ranked", quest }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};

