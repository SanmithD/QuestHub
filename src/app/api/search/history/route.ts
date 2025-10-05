import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnection";
import { authorization } from "../../middlewares/auth.middleware";
import { searchModel } from "../../model/search.model";

export const GET = async (req: NextRequest) => {
  const userId = await authorization(req);
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  try {
    await connectDB();

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const res = await searchModel
      .find({userId}).populate("userId").populate('questId')
      .sort({ createdAt: -1 })
      .limit(limit);

    if (!res || res.length === 0)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json(
      { message: "Searched quest", res },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};