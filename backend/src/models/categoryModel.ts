import pool from "../config/database";

export interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_visible: number; // treated as boolean
  sort_order: number;
  created_at: string;
  post_count?: number;
}

export interface NewCategoryInput {
  name: string;
  slug: string;
  description?: string;
  is_visible?: boolean;
  sort_order?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
  is_visible?: boolean;
  sort_order?: number;
}

export async function getAllCategoriesWithCounts(): Promise<CategoryRecord[]> {
  const [rows] = await pool.execute(
    `SELECT c.*, 
            COALESCE(p.post_count, 0) AS post_count
     FROM categories c
     LEFT JOIN (
       SELECT category_id, COUNT(*) AS post_count
       FROM posts
       GROUP BY category_id
     ) p ON p.category_id = c.id
     ORDER BY c.sort_order ASC, c.name ASC`
  );
  return rows as CategoryRecord[];
}

export async function getVisibleCategories(): Promise<CategoryRecord[]> {
  const [rows] = await pool.execute(
    `SELECT c.*
     FROM categories c
     WHERE c.is_visible = 1
     ORDER BY c.sort_order ASC, c.name ASC`
  );
  return rows as CategoryRecord[];
}

export async function createCategory(
  input: NewCategoryInput
): Promise<CategoryRecord> {
  const {
    name,
    slug,
    description = null,
    is_visible = true,
    sort_order = 0,
  } = input;

  const [result] = await pool.execute(
    `INSERT INTO categories (name, slug, description, is_visible, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [name, slug, description, is_visible ? 1 : 0, sort_order]
  );

  const info = result as { insertId: number };
  const category = await getCategoryById(info.insertId);
  if (!category) {
    throw new Error("Failed to create category");
  }
  return category;
}

export async function updateCategory(
  id: number,
  updates: UpdateCategoryInput
): Promise<CategoryRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.slug !== undefined) {
    fields.push("slug = ?");
    values.push(updates.slug);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.is_visible !== undefined) {
    fields.push("is_visible = ?");
    values.push(updates.is_visible ? 1 : 0);
  }
  if (updates.sort_order !== undefined) {
    fields.push("sort_order = ?");
    values.push(updates.sort_order);
  }

  if (!fields.length) {
    return getCategoryById(id);
  }

  values.push(id);

  await pool.execute(
    `UPDATE categories SET ${fields.join(
      ", "
    )}, created_at = created_at WHERE id = ?`,
    values
  );

  return getCategoryById(id);
}

export async function deleteCategory(id: number): Promise<void> {
  await pool.execute("DELETE FROM categories WHERE id = ?", [id]);
}

export async function getCategoryById(
  id: number
): Promise<CategoryRecord | null> {
  const [rows] = await pool.execute("SELECT * FROM categories WHERE id = ?", [
    id,
  ]);
  const typed = rows as CategoryRecord[];
  return typed[0] || null;
}


