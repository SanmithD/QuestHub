import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnection";
import { authorization } from "../../middlewares/auth.middleware";
import { searchModel } from "../../model/search.model";

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const userId = await authorization(req);
  const { id } = await context.params;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const search = await searchModel.findById(id).populate("questId");
    if (!search) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Search found", search }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const userId = await authorization(req);
  const { id : questId } = await context.params;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();

    const newSearch = new searchModel({
      questId,
      userId,
    });
    await newSearch.save();

    return NextResponse.json({ message: "Saved recent search", search: newSearch }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};


export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const userId = await authorization(req);
  const { id } = await context.params;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();
    const deleted = await searchModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recent search removed", deleted }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
