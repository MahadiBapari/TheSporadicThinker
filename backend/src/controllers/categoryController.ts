import type { Request, Response, NextFunction } from "express";
import {
  CategoryRecord,
  createCategory,
  deleteCategory,
  getAllCategoriesWithCounts,
  getCategoryById,
  getVisibleCategories,
  updateCategory,
} from "../models/categoryModel";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Admin controllers

export async function getAdminCategories(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getAllCategoriesWithCounts();
    return res.json({ categories });
  } catch (err) {
    next(err);
  }
}

export async function createAdminCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, slug, description, isVisible, sortOrder } = req.body as {
      name: string;
      slug?: string;
      description?: string;
      isVisible?: boolean;
      sortOrder?: number;
    };

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = await createCategory({
      name,
      slug: slug || slugify(name),
      description,
      is_visible: isVisible ?? true,
      sort_order: sortOrder ?? 0,
    } as any);

    return res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const { name, slug, description, isVisible, sortOrder } = req.body as {
      name?: string;
      slug?: string;
      description?: string;
      isVisible?: boolean;
      sortOrder?: number;
    };

    const updated = await updateCategory(id, {
      name,
      slug,
      description,
      is_visible: isVisible,
      sort_order: sortOrder,
    } as any);

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.json({ category: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const existing: CategoryRecord | null = await getCategoryById(id);
    if (!existing) {
      return res.status(404).json({ message: "Category not found" });
    }

    await deleteCategory(id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Public controllers

export async function getPublicCategories(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await getVisibleCategories();
    return res.json({ categories });
  } catch (err) {
    next(err);
  }
}


