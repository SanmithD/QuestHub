"use client";

import { signIn, signOut, useSession } from "next-auth/react";

function Login() {
    const { data:session } = useSession();

    if(!session){
        return (
            <div>
                <button onClick={()=>signIn("google")} >Login with google</button>
                <button onClick={()=>signIn("github")} >Login with github</button>
            </div>
        )
    }
  return (
    <div>
        <button onClick={()=>signOut()} >Logout</button>
    </div>
  )
}

export default Login