"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_visible: 0 | 1;
  sort_order: number;
  post_count: number;
}

type FormMode = "create" | "edit";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const getAuthHeader = () => {
    if (typeof window === "undefined") return undefined;
    const token = window.localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/admin/categories`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });
        if (!res.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [apiUrl]);

  const resetForm = () => {
    setMode("create");
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsVisible(true);
    setSortOrder(0);
    setError(null);
  };

  const handleEdit = (cat: AdminCategory) => {
    setMode("edit");
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIsVisible(cat.is_visible === 1);
    setSortOrder(cat.sort_order);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const body = {
        name,
        slug: slug || name.toLowerCase().trim().replace(/\s+/g, "-"),
        description: description || undefined,
        isVisible,
        sortOrder,
      };

      const endpoint =
        mode === "edit" && editingId != null
          ? `${apiUrl}/api/admin/categories/${editingId}`
          : `${apiUrl}/api/admin/categories`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save category");
      }

      const data = await res.json();
      const saved = data.category as AdminCategory;

      setCategories((prev) => {
        const others = prev.filter((c) => c.id !== saved.id);
        return [...others, saved].sort(
          (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)
        );
      });

      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save category";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: AdminCategory) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      `Delete category "${cat.name}"? Posts will be set to no category.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiUrl}/api/admin/categories/${cat.id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!res.ok && res.status !== 204) return;

      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      if (editingId === cat.id) {
        resetForm();
      }
    } catch {
      // ignore for now or show toast
    }
  };

  const toggleVisibility = async (cat: AdminCategory) => {
    try {
      const res = await fetch(`${apiUrl}/api/admin/categories/${cat.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ isVisible: !(cat.is_visible === 1) }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const updated = data.category as AdminCategory;
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    } catch {
      // ignore for now
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.formTitleRow}>
          <h2 className={styles.formTitle}>
            {mode === "create" ? "New Category" : "Edit Category"}
          </h2>
          {mode === "edit" && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={resetForm}
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className={styles.formGrid}>
          <div>
            <label className={styles.fieldLabel} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className={styles.textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Love"
            />
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              className={styles.textInput}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-from-name"
            />
          </div>

          <div>
            <label className={styles.fieldLabel} htmlFor="sortOrder">
              Sort Order
            </label>
            <input
              id="sortOrder"
              type="number"
              className={styles.textInput}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              placeholder="0"
            />
            <div className={styles.checkboxRow}>
              <input
                id="visible"
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
              <label className={styles.checkboxLabel} htmlFor="visible">
                Visible on site
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <label className={styles.fieldLabel} htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description shown on category pages"
          />
        </div>

        {error && <div className={styles.errorText}>{error}</div>}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : mode === "create"
              ? "Create Category"
              : "Save Changes"}
          </button>
        </div>
      </form>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Posts</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>
                  Loading...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyRow}>
                  No categories yet. Create your first one above.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.slug}</td>
                  <td>{cat.post_count}</td>
                  <td>
                    <button
                      type="button"
                      className={
                        cat.is_visible === 1
                          ? styles.visibleBadge
                          : styles.hiddenBadge
                      }
                      onClick={() => toggleVisibility(cat)}
                    >
                      {cat.is_visible === 1 ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.actionLink}
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionLink} ${styles.actionLinkDanger}`}
                      onClick={() => handleDelete(cat)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


