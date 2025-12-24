"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalViews: number;
}

interface RecentPost {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalViews: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : null;

        const res = await fetch(`${apiUrl}/api/admin/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          throw new Error("Failed to load dashboard stats");
        }

        const data = await res.json();
        if (data.stats) {
          setStats(data.stats as DashboardStats);
        }
        if (Array.isArray(data.recentPosts)) {
          setRecentPosts(data.recentPosts as RecentPost[]);
        }
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
    },
    {
      title: "Published",
      value: stats.publishedPosts,
    },
    {
      title: "Drafts",
      value: stats.draftPosts,
    },
    {
      title: "Categories",
      value: stats.totalCategories,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back your Majesty!</p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Posts</h2>
          {loading ? (
            <div className={styles.emptyState}>
              <p>Loading...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No posts yet. Create your first post!</p>
            </div>
          ) : (
            <ul>
              {recentPosts.map((post) => (
                <li key={post.id}>
                  {post.title}{" "}
                  <span className={styles.postStatus}>
                    ({post.status})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actions}>
            <Link href="/admin/posts/new" className={styles.actionButton}>
              Create New Post
            </Link>
            <Link href="/admin/categories" className={styles.actionButton}>
              Manage Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

