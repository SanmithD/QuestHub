import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../lib/dbConnection";
import { userModel } from "../../model/user.model";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        await connectDB();

        const existingUser = await userModel.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new userModel({
            username: user.name,
            email: user.email,
            password: "",
          });
          await newUser.save();
        }
        return true;
      } catch (error) {
        console.log("Sign in error", error);
        throw new Error("Server error");
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.sub) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
