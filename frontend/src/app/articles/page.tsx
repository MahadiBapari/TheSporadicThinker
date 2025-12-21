import Link from "next/link";
import type { Article, Category } from "@/types/article";
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

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: Article[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { categories?: Category[] };
    return data.categories ?? [];
  } catch {
    return [];
  }
}

async function getFavoriteArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts/favorites`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: Article[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategorySlug = params.category;
  const isFavourites = selectedCategorySlug === "favourites";

  const [articles, categories, favoriteArticles] = await Promise.all([
    getArticles(),
    getCategories(),
    getFavoriteArticles(),
  ]);

  // Filter articles by category or show favorites
  const filteredArticles = isFavourites
    ? favoriteArticles
    : selectedCategorySlug
    ? articles.filter(
        (article) => article.category?.slug === selectedCategorySlug
      )
    : articles;

  // Find the selected category for highlighting
  const selectedCategory = selectedCategorySlug
    ? categories.find((cat) => cat.slug === selectedCategorySlug)
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Articles</h1>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left Sidebar - Categories */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Categories</h2>
            <ul className={styles.categoryList}>
              <li>
                <Link
                  href="/articles"
                  className={`${styles.categoryLink} ${
                    !selectedCategorySlug ? styles.categoryLinkActive : ""
                  }`}
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/articles?category=favourites"
                  className={`${styles.categoryLink} ${
                    isFavourites ? styles.categoryLinkActive : ""
                  }`}
                >
                  Favourites
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/articles?category=${category.slug}`}
                    className={`${styles.categoryLink} ${
                      selectedCategorySlug === category.slug
                        ? styles.categoryLinkActive
                        : ""
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Quote Card */}
            <div className={styles.quoteCard}>
              <p className={styles.quoteText}>
                &ldquo;Life is all about imagining the future and making it happen.&rdquo;
              </p>
              <p className={styles.quoteAuthor}>— Mahadi Hasan</p>
            </div>
          </aside>

          {/* Right Content - Articles */}
          <main className={styles.articlesSection}>
            {filteredArticles.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>
                  {isFavourites
                    ? "No favorite articles yet."
                    : selectedCategory
                    ? `No articles found in "${selectedCategory.name}" category.`
                    : "No articles published yet. Check back soon!"}
                </p>
              </div>
            ) : (
              <div className={styles.articlesList}>
                {filteredArticles.map((article) => (
                  <article key={article.id} className={styles.articleCard}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className={styles.articleLink}
                    >
                      {article.featured_image && (
                        <div className={styles.articleImageWrapper}>
                          <img
                            src={resolveImageUrl(article.featured_image)}
                            alt={article.title}
                            className={styles.articleImage}
                          />
                          <div className={styles.articleOverlay}>
                            {/* <span className={styles.overlayText}>Read</span> */}
                            {/* <span className={styles.overlayArrow}>→</span> */}
                          </div>
                        </div>
                      )}
                      <div className={styles.articleContent}>
                        {article.category && (
                          <p className={styles.articleTag}>
                            {article.category.name}
                          </p>
                        )}
                        <h3 className={styles.articleTitle}>{article.title}</h3>
                        {article.excerpt && (
                          <p className={styles.articleExcerpt}>
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
