import { lazy, Suspense } from "react";

const AllQuest = lazy(()=>import('./pages/Quest/AllQuests/page'));

function page() {
  return (
    <div>
      <Suspense fallback={"Loading..."} >
        <AllQuest/>
      </Suspense>
    </div>
  )
}

export default page