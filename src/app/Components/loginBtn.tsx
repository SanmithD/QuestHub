"use client";

import { signIn, useSession } from "next-auth/react";

function Login() {
    const { data:session } = useSession();

    if(!session){
        return (
            <div className="w-full my-2 flex items-center justify-between" >
                <button onClick={()=>signIn("google")} className="border rounded-sm px-3 w-fit md:px-8 py-1 bg-sky-500 font-medium text-white cursor-pointer hover:bg-sky-700" >Login with Google</button>
                <button onClick={()=>signIn("github")} className="border rounded-sm px-3 py-1 bg-zinc-500 font-medium text-white cursor-pointer hover:bg-zinc-700">Login with Github</button>
            </div>
        )
    }
  return
}

export default Login