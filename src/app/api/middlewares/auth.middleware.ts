import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "../lib/dbConnection";
import { userModel } from "../model/user.model";

export const authorization = async (req: NextRequest) => {
  const token = req.cookies.get("jwt")?.value;
  await connectDB();
  try {
    if(token && process.env.JWT_SECRET){
      const decode = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
      const user = await userModel.findById(decode.userId).select("-password");
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user._id.toString();
    }
    const session = await getServerSession(authOptions);
    if(session?.user?.email){
      const user = await userModel.findOne({ email: session.user.email }).select("-password");
      if(user) return user._id.toString();
    }

    return null
  } catch (error) {
    console.log(error);
    throw new Error("Authorization failed");
  }
};
