import { lazy, Suspense } from "react";
import NewQuest from "./pages/Quest/NewQuest/page";

const AllQuest = lazy(()=>import('./pages/Quest/AllQuests/page'));

function page() {
  return (
    <div>
      <NewQuest/>
      <Suspense fallback={"Loading..."} >
        <AllQuest/>
      </Suspense>
    </div>
  )
}

export default page