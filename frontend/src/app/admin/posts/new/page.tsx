"use client";

import { useRouter } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  const router = useRouter();

  return (
    <div>
      <PostEditor onSaved={() => router.push("/admin/posts")} />
    </div>
  );
}


