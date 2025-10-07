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

  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();

    const quest = await questModel.findById(questId);
    if (!quest) return NextResponse.json({ message: "Quest not found" }, { status: 404 });

    let rank = await rankModel.findOne({ questId, userId });

    if (rank) {
      await rankModel.deleteOne({ _id: rank._id });
    } else {
      rank = new rankModel({ questId, userId, rankValue: 1 });
      await rank.save();
    }

    const totalRanks = await rankModel.countDocuments({ questId });
    quest.rankValue = totalRanks;
    await quest.save();

    return NextResponse.json(
      { message: "Quest rank updated", quest, userRanked: !rank ? false : true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};



