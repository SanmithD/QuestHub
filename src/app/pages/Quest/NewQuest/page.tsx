"use client";

import { UseQuestStore } from "@/app/store/UseQuestStore";
import { Send } from "lucide-react";
import React, { useState } from "react";

function NewQuest() {
  const [message, setMessage] = useState("");
  const isLoading = UseQuestStore((state) => state.isLoading);
  const postQuest = UseQuestStore((state) => state.postQuest);

  const handleShare = async()=>{
    await postQuest(message);
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col gap-2 md:gap-4" >
        <h1 className="text-2xl font-bold tracking-wide">
          Share you&apos;r Quest
        </h1>
        <div className="flex gap-3" >
          <input
            type="text"
            value={message}
            name="message"
            placeholder="Type quest..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            className="outline-0 w-full px-2 pl-1 py-1.5 border-2 rounded-sm "
          />
          <button disabled={isLoading} onClick={handleShare} className="flex text-[20px] font-medium cursor-pointer justify-center items-center px-4 py-1.5 rounded-md bg-sky-400 hover:bg-sky-700 active:bg-sky-500" >
            { isLoading ? "Sending...": "Share" } <Send size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewQuest;
