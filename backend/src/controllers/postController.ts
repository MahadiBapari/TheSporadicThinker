import type { Request, Response, NextFunction } from "../types/express";
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
    } = (req as any).body as {
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
      return (res as any)
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const authorId = ((req as any).user as any)?.id;
    if (!authorId) {
      return (res as any).status(401).json({ message: "Not authorized" });
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

    return (res as any).status(201).json({ post });
  } catch (err) {
    (next as any)(err);
  }
}

export async function updateAdminPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number((req as any).params.id);
    if (Number.isNaN(id)) {
      return (res as any).status(400).json({ message: "Invalid post id" });
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
    } = (req as any).body as {
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
      return (res as any).status(404).json({ message: "Post not found" });
    }

    return (res as any).json({ post: updated });
  } catch (err) {
    (next as any)(err);
  }
}

export async function deleteAdminPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number((req as any).params.id);
    if (Number.isNaN(id)) {
      return (res as any).status(400).json({ message: "Invalid post id" });
    }

    const post = await getPostById(id);
    if (!post) {
      return (res as any).status(404).json({ message: "Post not found" });
    }

    await deletePost(id);
    return (res as any).status(204).send();
  } catch (err) {
    (next as any)(err);
  }
}

export async function getAdminPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await getAllPosts();
    return (res as any).json({ posts });
  } catch (err) {
    (next as any)(err);
  }
}

export async function getAdminPostById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number((req as any).params.id);
    if (Number.isNaN(id)) {
      return (res as any).status(400).json({ message: "Invalid post id" });
    }

    const post = await getPostById(id);
    if (!post) {
      return (res as any).status(404).json({ message: "Post not found" });
    }

    return (res as any).json({ post });
  } catch (err) {
    (next as any)(err);
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
    return (res as any).json({ posts: formattedPosts });
  } catch (err) {
    (next as any)(err);
  }
}

export async function getPublicHeroPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await getHeroPosts();
    return (res as any).json({ posts });
  } catch (err) {
    (next as any)(err);
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
    return (res as any).json({ posts: formattedPosts });
  } catch (err) {
    (next as any)(err);
  }
}

export async function getPublicPostBySlug(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = (req as any).params;
    const post = await getPostBySlug(slug, true);
    if (!post) {
      return (res as any).status(404).json({ message: "Post not found" });
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

    return (res as any).json({ post: formattedPost });
  } catch (err) {
    (next as any)(err);
  }
}


