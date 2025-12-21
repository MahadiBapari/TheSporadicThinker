export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: "draft" | "published";
  author_id: number;
  category_id?: number;
  category?: Category;
  is_hero?: 0 | 1;
  hero_order?: number | null;
  is_favorite?: 0 | 1;
  views: number;
  created_at: string;
  updated_at: string;
}

