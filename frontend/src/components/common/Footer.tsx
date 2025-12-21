"use client";

import { useEffect, useState } from "react";
import FooterClient from "./FooterClient";
import type { Article, Category } from "@/types/article";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Footer() {
  const [recentPosts, setRecentPosts] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/posts`),
          fetch(`${API_URL}/api/categories`),
        ]);

        if (postsRes.ok) {
          const postsData = (await postsRes.json()) as { posts?: Article[] };
          setRecentPosts((postsData.posts ?? []).slice(0, 3));
        }

        if (categoriesRes.ok) {
          const categoriesData = (await categoriesRes.json()) as {
            categories?: Category[];
          };
          setCategories(categoriesData.categories ?? []);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  return <FooterClient recentPosts={recentPosts} categories={categories} />;
}
