import type { Request, Response, NextFunction } from "express";
import pool from "../config/database";

export async function getAdminStats(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const [
      [postCountsRows],
      [categoryCountRows],
      [recentPostsRows],
    ] = (await Promise.all([
      pool.query(
        `SELECT 
           COUNT(*) AS totalPosts,
           SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS publishedPosts,
           SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draftPosts,
           COALESCE(SUM(views), 0) AS totalViews
         FROM posts`
      ),
      pool.query(`SELECT COUNT(*) AS totalCategories FROM categories`),
      pool.query(
        `SELECT id, title, slug, status, created_at
         FROM posts
         ORDER BY created_at DESC
         LIMIT 5`
      ),
    ])) as any;

    const postCounts = postCountsRows[0] || {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
    };

    const categoryCounts = categoryCountRows[0] || { totalCategories: 0 };

    const recentPosts = recentPostsRows || [];

    return res.json({
      stats: {
        totalPosts: Number(postCounts.totalPosts) || 0,
        publishedPosts: Number(postCounts.publishedPosts) || 0,
        draftPosts: Number(postCounts.draftPosts) || 0,
        totalViews: Number(postCounts.totalViews) || 0,
        totalCategories: Number(categoryCounts.totalCategories) || 0,
      },
      recentPosts,
    });
  } catch (err) {
    next(err);
  }
}


