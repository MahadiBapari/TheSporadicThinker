"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostEditor, {
  PostEditorInitialData,
} from "@/components/admin/PostEditor";

interface ApiPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: "draft" | "published";
  author_id: number;
  category_id: number | null;
  is_hero?: 0 | 1;
  hero_order?: number | null;
  is_favorite?: 0 | 1;
  created_at: string;
  updated_at: string;
}

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<PostEditorInitialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : null;

        const res = await fetch(
          `${apiUrl}/api/admin/posts/${params.id as string}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load post");
        }
        const data = (await res.json()) as { post: ApiPost };
        const post = data.post;

        setInitialData({
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post.status,
          excerpt: post.excerpt,
          categoryId: post.category_id,
          content: post.content,
          featuredImageUrl: post.featured_image
            ? `${apiUrl}${post.featured_image}`
            : undefined,
          isHero: post.is_hero === 1,
          heroOrder: post.hero_order ?? null,
          isFavorite: post.is_favorite === 1,
        });
      } catch {
        // If something goes wrong, go back to list
        router.push("/admin/posts");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id, router]);

  if (loading || !initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PostEditor
        postId={initialData.id}
        initialData={initialData}
        onSaved={() => router.push("/admin/posts")}
      />
    </div>
  );
}


