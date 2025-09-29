import jwt from 'jsonwebtoken';

export const generateToken = ({ userId }: { userId: string, }) =>{
    if(!process.env.JWT_SECRET){
        throw new Error("Invalid secret")
    }

    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '7d' })
}