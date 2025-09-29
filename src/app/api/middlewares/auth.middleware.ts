import jwt from 'jsonwebtoken';
import { NextRequest } from "next/server";
import { userModel } from '../model/user.model';

export const authorization = async(req: NextRequest) =>{
    const token = req.cookies.get("jwt")?.value;
    if(!token){
        throw new Error("Invalid token")
    }
    try {
        if(!process.env.JWT_SECRET) {
            throw new Error("Invalid secret");
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        const user = await userModel.findById(decode.userId).select("-password");

        if(!user) {
            throw new Error("user not found");
        }

        return { user }
    } catch (error) {
        console.log(error);
        throw new Error("Middleware Error")
    }
}