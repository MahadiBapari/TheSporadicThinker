import type { Request, Response, NextFunction } from "express";

// Type assertions for Express 5 compatibility
type ExpressRequest = Request & { body?: any; params?: any; user?: any };
type ExpressResponse = Response & { status: (code: number) => ExpressResponse; json: (body: any) => ExpressResponse };
type ExpressNextFunction = (err?: any) => void;
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
  _req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) {
  try {
    const categories = await getAllCategoriesWithCounts();
    return (res as any).json({ categories });
  } catch (err) {
    (next as any)(err);
  }
}

export async function createAdminCategory(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) {
  try {
    const { name, slug, description, isVisible, sortOrder } = (req.body || {}) as {
      name: string;
      slug?: string;
      description?: string;
      isVisible?: boolean;
      sortOrder?: number;
    };

    if (!name) {
      return (res as any).status(400).json({ message: "Name is required" });
    }

    const category = await createCategory({
      name,
      slug: slug || slugify(name),
      description,
      is_visible: isVisible ?? true,
      sort_order: sortOrder ?? 0,
    } as any);

    return (res as any).status(201).json({ category });
  } catch (err) {
    (next as any)(err);
  }
}

export async function updateAdminCategory(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) {
  try {
    const id = Number((req.params || {}).id);
    if (Number.isNaN(id)) {
      return (res as any).status(400).json({ message: "Invalid category id" });
    }

    const { name, slug, description, isVisible, sortOrder } = (req.body || {}) as {
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
      return (res as any).status(404).json({ message: "Category not found" });
    }

    return (res as any).json({ category: updated });
  } catch (err) {
    (next as any)(err);
  }
}

export async function deleteAdminCategory(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) {
  try {
    const id = Number((req.params || {}).id);
    if (Number.isNaN(id)) {
      return (res as any).status(400).json({ message: "Invalid category id" });
    }

    const existing: CategoryRecord | null = await getCategoryById(id);
    if (!existing) {
      return (res as any).status(404).json({ message: "Category not found" });
    }

    await deleteCategory(id);
    return (res as any).status(204).send();
  } catch (err) {
    (next as any)(err);
  }
}

// Public controllers

export async function getPublicCategories(
  _req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) {
  try {
    const categories = await getVisibleCategories();
    return (res as any).json({ categories });
  } catch (err) {
    (next as any)(err);
  }
}


