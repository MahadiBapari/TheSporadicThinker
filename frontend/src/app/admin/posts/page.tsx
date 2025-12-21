"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface PostListItem {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  created_at: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : null;

        const res = await fetch(`${apiUrl}/api/admin/posts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          throw new Error("Failed to load posts");
        }
        const data = await res.json();
        setPosts(data.posts || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getAuthHeader = () => {
    if (typeof window === "undefined") return undefined;
    const token = window.localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  const handleArchive = async (post: PostListItem) => {
    if (post.status === "draft") return; // already archived/draft
    try {
      const res = await fetch(`${apiUrl}/api/admin/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status: "draft" }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const updated = data.post as PostListItem;
      setPosts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
    } catch {
      // ignore for now or add toast
    }
  };

  
  const handleDelete = async (post: PostListItem) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      `Delete post "${post.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiUrl}/api/admin/posts/${post.id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!res.ok && res.status !== 204) return;
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch {
      // ignore for now or add toast
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Posts</h1>
        <Link href="/admin/posts/new">
          <button type="button" className={styles.newButton}>
            New Post
          </button>
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.emptyRow}>
                  Loading...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyRow}>
                  No posts yet. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        post.status === "published"
                          ? styles.statusPublished
                          : styles.statusDraft
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td>
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className={styles.actionsCell}>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className={styles.actionLink}
                    >
                      Edit
                    </Link>
                    {post.status === "published" && (
                      <button
                        type="button"
                        className={styles.actionLink}
                        onClick={() => handleArchive(post)}
                      >
                        Archive
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${styles.actionLink} ${styles.actionLinkDanger}`}
                      onClick={() => handleDelete(post)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


