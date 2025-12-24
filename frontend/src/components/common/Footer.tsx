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
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const [postsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/posts`, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          }).catch(err => {
            console.error("Posts fetch error:", err);
            return null;
          }),
          fetch(`${API_URL}/api/categories`, {
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
            },
          }).catch(err => {
            console.error("Categories fetch error:", err);
            return null;
          }),
        ]);

        clearTimeout(timeoutId);

        if (postsRes && postsRes.ok) {
          try {
            const postsData = (await postsRes.json()) as { posts?: Article[] };
            const posts = postsData.posts ?? [];
            const sortedPosts = [...posts]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 3);
            setRecentPosts(sortedPosts);
          } catch (parseError) {
            console.error("Error parsing posts response:", parseError);
          }
        } else if (postsRes) {
          console.error("Failed to fetch posts:", postsRes.status, postsRes.statusText);
        }

        if (categoriesRes && categoriesRes.ok) {
          try {
            const categoriesData = (await categoriesRes.json()) as {
              categories?: Category[];
            };
            setCategories(categoriesData.categories ?? []);
          } catch (parseError) {
            console.error("Error parsing categories response:", parseError);
          }
        } else if (categoriesRes) {
          console.error("Failed to fetch categories:", categoriesRes.status, categoriesRes.statusText);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
        // Check if it's a network error
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          console.error("Network error - check if API is accessible at:", API_URL);
          console.error("Make sure CORS is configured correctly on the backend");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  // Always render footer, even with empty data
  return <FooterClient recentPosts={recentPosts} categories={categories} />;
}
