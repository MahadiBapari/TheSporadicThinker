"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./PostEditor.module.css";

type Status = "draft" | "published";

export interface PostEditorInitialData {
  id?: number;
  title: string;
  slug: string;
  status: Status;
  excerpt?: string | null;
  categoryId?: number | null;
  content: string;
  featuredImageUrl?: string | null;
  isHero?: boolean;
  heroOrder?: number | null;
  isFavorite?: boolean;
}

interface PostEditorProps {
  onSaved?: () => void;
  initialData?: PostEditorInitialData;
  postId?: number;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostEditor({
  onSaved,
  initialData,
  postId,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [status, setStatus] = useState<Status>(initialData?.status ?? "draft");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId != null ? String(initialData.categoryId) : ""
  );
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.featuredImageUrl ?? null
  );
  const [isHero, setIsHero] = useState<boolean>(initialData?.isHero ?? false);
  const [heroOrder, setHeroOrder] = useState<string>(
    initialData?.heroOrder != null ? String(initialData.heroOrder) : ""
  );
  const [isFavorite, setIsFavorite] = useState<boolean>(
    initialData?.isFavorite ?? false
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface CategoryOption {
    id: number;
    name: string;
    is_visible: 0 | 1;
  }

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  const editorRef = useRef<HTMLDivElement | null>(null);

  // Initialize editor content when initialData is provided
  useEffect(() => {
    if (initialData && editorRef.current) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("token")
            : null;

        const res = await fetch(`${apiUrl}/api/admin/categories`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const cats = (data.categories || []) as CategoryOption[];
        setCategoryOptions(cats);
      } catch {
        setCategoryOptions([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!initialData && !slug && title) {
      setSlug(slugify(title));
    }
  }, [title, slug, initialData]);

  const applyFormat = (command: string, value?: string) => {
    if (typeof document === "undefined") return;
    // execCommand is deprecated but works across modern browsers for simple formatting.
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug || slugify(title));
      formData.append("status", status);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      if (categoryId) formData.append("categoryId", categoryId);
      formData.append("isHero", isHero ? "1" : "0");
      if (heroOrder) {
        formData.append("heroOrder", heroOrder);
      }
      formData.append("isFavorite", isFavorite ? "1" : "0");
      if (imageFile) formData.append("featuredImage", imageFile);

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("token")
          : null;

      const isEdit = typeof postId === "number";

      const endpoint = isEdit
        ? `${apiUrl}/api/admin/posts/${postId}`
        : `${apiUrl}/api/admin/posts`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save post");
      }

      // Reset form after successful save
      setTitle("");
      setSlug("");
      setStatus("draft");
      setExcerpt("");
      setCategoryId("");
      setIsHero(false);
      setHeroOrder("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

      if (onSaved) onSaved();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save post";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editorContainer}>
      <div className={styles.headerRow}>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className={styles.metaRow}>
          <div>
            <label className={styles.fieldLabel} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              className={styles.textInput}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className={styles.selectInput}
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="category">
              Category (optional)
            </label>
            <select
              id="category"
              className={styles.selectInput}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">No category</option>
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="hero">
              Hero section
            </label>
            <div className={styles.heroRow}>
              <label className={styles.checkboxLabel}>
                <input
                  id="hero"
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                />{" "}
                Show in home hero
              </label>
              <input
                type="number"
                min={1}
                max={3}
                className={styles.heroOrderInput}
                placeholder="Order 1-3"
                value={heroOrder}
                onChange={(e) => setHeroOrder(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="favorite">
              Favorites
            </label>
            <div className={styles.heroRow}>
              <label className={styles.checkboxLabel}>
                <input
                  id="favorite"
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                />{" "}
                Show in favorites
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className={styles.fieldLabel} htmlFor="excerpt">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          className={styles.textInput}
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary of the post"
        />
      </div>

      <div>
        <div className={styles.fieldLabel}>Content</div>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => applyFormat("bold")}
          >
            Bold
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => applyFormat("italic")}
          >
            Italic
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => applyFormat("underline")}
          >
            Underline
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => applyFormat("formatBlock", "h2")}
          >
            H2
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => applyFormat("formatBlock", "h3")}
          >
            H3
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={() => applyFormat("insertUnorderedList")}
          >
            Bullet list
          </button>
        </div>
        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable
          onInput={handleEditorInput}
          suppressContentEditableWarning
        >
          {!content && (
            <span className={styles.editorPlaceholder}>
              Start writing your article...
            </span>
          )}
        </div>
      </div>

      <div className={styles.imageRow}>
        <label className={styles.fieldLabel} htmlFor="featuredImage">
          Featured image
        </label>
        <input
          id="featuredImage"
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleImageChange}
        />
        {imagePreview &&
          (imagePreview.startsWith("blob:") ? (
            <img
              src={imagePreview}
              alt="Preview"
              className={styles.imagePreview}
            />
          ) : (
            <Image
              src={imagePreview}
              alt="Preview"
              width={600}
              height={338}
              className={styles.imagePreview}
              unoptimized
            />
          ))}
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      <div className={styles.actionsRow}>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Post"}
        </button>
      </div>
    </form>
  );
}


