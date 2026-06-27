import ClassesContent from "@/components/home/classes/ClassesContent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClassesContent />
    </Suspense>
  );
}
