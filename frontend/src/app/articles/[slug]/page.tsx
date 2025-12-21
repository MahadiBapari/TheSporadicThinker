import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article } from "@/types/article";
import styles from "./page.module.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function resolveImageUrl(path?: string): string {
  if (!path) return "/logodark.png";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${clean}`;
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { post?: Article };
    return data.post ?? null;
  } catch {
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className={styles.article}>
      <Link href="/articles" className={styles.backLink}>
        ← Back to Articles
      </Link>

      <header className={styles.header}>
        {article.category && (
          <span className={styles.categoryTag}>{article.category.name}</span>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <time dateTime={article.created_at}>
            {new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </header>

      {article.featured_image && (
        <div className={styles.imageContainer}>
          <img
            src={resolveImageUrl(article.featured_image)}
            alt={article.title}
            className={styles.image}
          />
        </div>
      )}

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className={styles.footer}>
        <Link href="/articles" className={styles.footerLink}>
          ← Back to Articles
        </Link>
      </div>
    </article>
  );
}
