import pool from "../config/database";

export interface PostRecord {
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
  views: number;
  created_at: string;
  updated_at: string;
}

export interface NewPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string | null;
  status: "draft" | "published";
  author_id: number;
  category_id?: number | null;
  is_hero?: boolean;
  hero_order?: number | null;
  is_favorite?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  featured_image?: string | null;
  status?: "draft" | "published";
  category_id?: number | null;
  is_hero?: boolean;
  hero_order?: number | null;
  is_favorite?: boolean;
}

export async function createPost(input: NewPostInput): Promise<PostRecord> {
  const {
    title,
    slug,
    content,
    excerpt = null,
    featured_image = null,
    status,
    author_id,
    category_id = null,
    is_hero = false,
    hero_order = null,
    is_favorite = false,
  } = input;

  const [result] = await pool.execute(
    `INSERT INTO posts
      (title, slug, content, excerpt, featured_image, status, author_id, category_id, is_hero, hero_order, is_favorite)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      slug,
      content,
      excerpt,
      featured_image,
      status,
      author_id,
      category_id,
      is_hero ? 1 : 0,
      hero_order,
      is_favorite ? 1 : 0,
    ]
  );

  const info = result as { insertId: number };
  const post = await getPostById(info.insertId);
  if (!post) {
    throw new Error("Failed to create post");
  }
  return post;
}

export async function updatePost(
  id: number,
  updates: UpdatePostInput
): Promise<PostRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.slug !== undefined) {
    fields.push("slug = ?");
    values.push(updates.slug);
  }
  if (updates.content !== undefined) {
    fields.push("content = ?");
    values.push(updates.content);
  }
  if (updates.excerpt !== undefined) {
    fields.push("excerpt = ?");
    values.push(updates.excerpt);
  }
  if (updates.featured_image !== undefined) {
    fields.push("featured_image = ?");
    values.push(updates.featured_image);
  }
  if (updates.status !== undefined) {
    fields.push("status = ?");
    values.push(updates.status);
  }
  if (updates.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(updates.category_id);
  }
  if (updates.is_hero !== undefined) {
    fields.push("is_hero = ?");
    values.push(updates.is_hero ? 1 : 0);
  }
  if (updates.hero_order !== undefined) {
    fields.push("hero_order = ?");
    values.push(updates.hero_order);
  }
  if (updates.is_favorite !== undefined) {
    fields.push("is_favorite = ?");
    values.push(updates.is_favorite ? 1 : 0);
  }

  if (!fields.length) {
    return getPostById(id);
  }

  values.push(id);

  await pool.execute(
    `UPDATE posts SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return getPostById(id);
}

export async function deletePost(id: number): Promise<void> {
  await pool.execute("DELETE FROM posts WHERE id = ?", [id]);
}

export async function getPostById(id: number): Promise<PostRecord | null> {
  const [rows] = await pool.execute("SELECT * FROM posts WHERE id = ?", [id]);
  const typed = rows as PostRecord[];
  return typed[0] || null;
}

export async function getPostBySlug(
  slug: string,
  onlyPublished = true
): Promise<PostRecord | null> {
  const [rows] = await pool.execute(
    `SELECT * FROM posts WHERE slug = ? ${onlyPublished ? "AND status = 'published'" : ""}`,
    [slug]
  );
  const typed = rows as PostRecord[];
  return typed[0] || null;
}

export async function getPublishedPosts(): Promise<any[]> {
  const [rows] = await pool.execute(
    `SELECT p.*, 
            c.id AS cat_id,
            c.name AS cat_name,
            c.slug AS cat_slug,
            c.description AS cat_description
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.status = 'published'
     ORDER BY p.created_at DESC`
  );
  return rows as any[];
}

export async function getAllPosts(): Promise<PostRecord[]> {
  const [rows] = await pool.execute("SELECT * FROM posts ORDER BY created_at DESC");
  return rows as PostRecord[];
}

export async function getHeroPosts(): Promise<PostRecord[]> {
  const [rows] = await pool.execute(
    `SELECT *
     FROM posts
     WHERE status = 'published' AND is_hero = 1
     ORDER BY 
       CASE WHEN hero_order IS NULL THEN 1 ELSE 0 END,
       hero_order ASC,
       created_at DESC
     LIMIT 3`
  );
  return rows as PostRecord[];
}

export async function getFavoritePosts(): Promise<any[]> {
  const [rows] = await pool.execute(
    `SELECT p.*, 
            c.id AS cat_id,
            c.name AS cat_name,
            c.slug AS cat_slug,
            c.description AS cat_description
     FROM posts p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.status = 'published' AND p.is_favorite = 1
     ORDER BY RAND()
     LIMIT 3`
  );
  return rows as any[];
}


