import type { Request, Response, NextFunction } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  getPublishedPosts,
  getHeroPosts,
  getFavoritePosts,
  updatePost,
} from "../models/postModel";

function toNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export async function createAdminPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      status,
      categoryId,
      isHero,
      heroOrder,
      isFavorite,
    } = req.body as {
      title: string;
      slug?: string;
      content: string;
      excerpt?: string;
      status?: "draft" | "published";
      categoryId?: string;
      isHero?: string;
      heroOrder?: string;
      isFavorite?: string;
    };

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const authorId = (req.user as any)?.id;
    if (!authorId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const file = (req as any).file as Express.Multer.File | undefined;
    // Cloudinary returns the URL in file.path
    const featuredImage = file ? (file as any).path : null;

    const post = await createPost({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      content,
      excerpt,
      featured_image: featuredImage,
      status: status || "draft",
      author_id: authorId,
      category_id: toNumber(categoryId),
      is_hero: isHero === "1" || isHero === "true",
      hero_order:
        heroOrder !== undefined && heroOrder !== ""
          ? Number(heroOrder)
          : null,
      is_favorite: isFavorite === "1" || isFavorite === "true",
    });

    return res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const {
      title,
      slug,
      content,
      excerpt,
      status,
      categoryId,
      isHero,
      heroOrder,
      isFavorite,
    } = req.body as {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      status?: "draft" | "published";
      categoryId?: string;
      isHero?: string;
      heroOrder?: string;
      isFavorite?: string;
    };

    const file = (req as any).file as Express.Multer.File | undefined;
    // Cloudinary returns the URL in file.path
    const featuredImage = file ? (file as any).path : undefined;

    const updated = await updatePost(id, {
      title,
      slug,
      content,
      excerpt,
      status,
      category_id: categoryId !== undefined ? toNumber(categoryId) : undefined,
      featured_image: featuredImage,
      is_hero:
        isHero !== undefined
          ? isHero === "1" || isHero === "true"
          : undefined,
      hero_order:
        heroOrder !== undefined && heroOrder !== ""
          ? Number(heroOrder)
          : heroOrder === ""
          ? null
          : undefined,
      is_favorite:
        isFavorite !== undefined
          ? isFavorite === "1" || isFavorite === "true"
          : undefined,
    });

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await deletePost(id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getAdminPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await getAllPosts();
    return res.json({ posts });
  } catch (err) {
    next(err);
  }
}

export async function getAdminPostById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post });
  } catch (err) {
    next(err);
  }
}

// Public controllers

export async function getPublicPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await getPublishedPosts();
    // Format posts with nested category data
    const formattedPosts = posts.map((post: any) => {
      const { cat_id, cat_name, cat_slug, cat_description, ...postData } = post;
      return {
        ...postData,
        category: cat_id
          ? {
              id: cat_id,
              name: cat_name,
              slug: cat_slug,
              description: cat_description,
            }
          : null,
      };
    });
    return res.json({ posts: formattedPosts });
  } catch (err) {
    next(err);
  }
}

export async function getPublicHeroPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await getHeroPosts();
    return res.json({ posts });
  } catch (err) {
    next(err);
  }
}

export async function getPublicFavoritePosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await getFavoritePosts();
    // Format posts with nested category data
    const formattedPosts = posts.map((post: any) => {
      const { cat_id, cat_name, cat_slug, cat_description, ...postData } = post;
      return {
        ...postData,
        category: cat_id
          ? {
              id: cat_id,
              name: cat_name,
              slug: cat_slug,
              description: cat_description,
            }
          : null,
      };
    });
    return res.json({ posts: formattedPosts });
  } catch (err) {
    next(err);
  }
}

export async function getPublicPostBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;
    const post = await getPostBySlug(slug, true);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Format post with nested category data
    const { cat_id, cat_name, cat_slug, cat_description, ...postData } = post;
    const formattedPost = {
      ...postData,
      category: cat_id
        ? {
            id: cat_id,
            name: cat_name,
            slug: cat_slug,
            description: cat_description,
          }
        : null,
    };

    return res.json({ post: formattedPost });
  } catch (err) {
    next(err);
  }
}


