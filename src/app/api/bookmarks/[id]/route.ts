import { NextRequest, NextResponse } from "next/server";
import { authorization } from "../../middlewares/auth.middleware";
import { bookModel } from "../../model/bookmark.model";

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
) => {
  const { id } = await context.params;
  const questId = id;

  const userId = await authorization(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const existing = await bookModel.findOne({ questId, userId });

    if (existing) {
      await bookModel.findByIdAndDelete(existing._id);
      return NextResponse.json({ message: "Bookmark removed" }, { status: 200 });
    } else {
      await bookModel.create({ questId, userId });
      return NextResponse.json({ message: "Bookmark added" }, { status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

