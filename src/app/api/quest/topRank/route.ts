import { NextRequest, NextResponse } from "next/server";
import { rankModel } from "../../model/rank.model";

export const GET = async(req: NextRequest) =>{
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const res = await rankModel.find().limit(limit).populate('questId').populate("userId").sort({ rankValue: -1, createdAt: -1 });

    if(!res || res.length === 0) return NextResponse.json({ message: "No top ranked quest" },{ status: 404 });

    return NextResponse.json({ message: "Top quests", res },{ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}