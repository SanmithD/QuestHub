import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { connectDB } from "../lib/dbConnection";
import { userModel } from "../model/user.model";

export const authorization = async (req: NextRequest): Promise<string> => {
  const token = req.cookies.get("jwt")?.value;
  if (!token) {
    throw new Error("Invalid token");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("Invalid secret");
  }

  try {
    await connectDB();
    const decode = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    const user = await userModel.findById(decode.userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user._id.toString();
  } catch (error) {
    console.log(error);
    throw new Error("Authorization failed");
  }
};
