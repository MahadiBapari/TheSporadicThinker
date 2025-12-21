import Link from "next/link";
import styles from "./page.module.css";
import type { Article, Category } from "@/types/article";
import {
  CategoryStrip,
  type CategoryStripCard,
} from "@/components/home/CategoryStrip";
import {
  HeroCarousel,
  type HeroSlide,
} from "@/components/home/HeroCarousel";

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

async function getHeroArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts/hero`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: Article[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

async function getAllArticles(): Promise<Article[]> {
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

function getRandomArticles(articles: Article[], count: number = 3): Article[] {
  if (articles.length === 0) return [];
  const shuffled = [...articles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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

async function getLatestPosts(limit: number = 5): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts?: Article[] };
    return (data.posts ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

interface CategoryCardData {
  category: Category;
  post: Article;
  postCount: number;
}

function buildCategoryCards(
  articles: Article[],
  categories: Category[]
): CategoryCardData[] {
  const postsByCategory = new Map<number, Article[]>();

  for (const post of articles) {
    if (!post.category_id) continue;
    const list = postsByCategory.get(post.category_id) ?? [];
    list.push(post);
    postsByCategory.set(post.category_id, list);
  }

  const eligibleCategories = categories.filter((c) =>
    postsByCategory.has(c.id)
  );
  if (!eligibleCategories.length) return [];

  const shuffled = [...eligibleCategories].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map((cat) => {
    const posts = postsByCategory.get(cat.id)!;
    const randomPost =
      posts[Math.floor(Math.random() * posts.length)] ?? posts[0];
    return {
      category: cat,
      post: randomPost,
      postCount: posts.length,
    };
  });
}

export default async function Home() {
  const [heroArticles, allArticles, categories, favoriteArticles, latestPosts] =
    await Promise.all([
      getHeroArticles(),
      getAllArticles(),
      getCategories(),
      getFavoriteArticles(),
      getLatestPosts(3),
    ]);

  // Limit favorite articles to 5
  const displayFavorites = favoriteArticles.slice(0, 5);

  // Get random articles for the Articles section
  const randomArticles = getRandomArticles(allArticles, 3);

  const heroSlides: HeroSlide[] = heroArticles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    imageUrl: resolveImageUrl(article.featured_image),
  }));

  const categoryCards = buildCategoryCards(allArticles, categories);

  const categoryViewCards: CategoryStripCard[] = categoryCards.map(
    ({ category, post, postCount }) => ({
      id: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
      postSlug: post.slug,
      postCount,
      excerpt: post.excerpt,
      imageUrl: resolveImageUrl(post.featured_image),
    })
  );

  return (
    <>
      {heroSlides.length === 0 ? (
        <section className={styles.heroSection}>
          <div className={styles.heroFallback}>
            <h1 className={styles.heroTitle}>
              Welcome to The Sporadic Thinker
            </h1>
            <p className={styles.heroDescription}>
              A collection of thoughts, ideas, and musings on love, life,
              and everything in between.
            </p>
            <Link href="/articles" className={styles.heroButton}>
              Read Articles
            </Link>
          </div>
        </section>
      ) : (
        <HeroCarousel slides={heroSlides} />
      )}

      

            {/* Articles section */}
            {randomArticles.length > 0 && (
        <section className={styles.favoritesSection}>
          
          <div className={styles.favoritesGrid}>
            {/* Main big card */}
            <article className={styles.favMainCard}>
              <Link
                href={`/articles/${randomArticles[0].slug}`}
                className={styles.favMainLink}
              >
                <div className={styles.favMainImageWrapper}>
                  <img
                    src={resolveImageUrl(randomArticles[0].featured_image)}
                    alt={randomArticles[0].title}
                    className={styles.favMainImage}
                  />
                </div>
                <div className={styles.favMainContent}>
                  <p className={styles.favTag}>
                    {randomArticles[0].category?.name || "Blog"}
                  </p>
                  <h3 className={styles.favMainTitle}>
                    {randomArticles[0].title}
                  </h3>
                  {randomArticles[0].excerpt && (
                    <p className={styles.favMainExcerpt}>
                      {randomArticles[0].excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </article>

            {/* Right column with up to two smaller cards */}
            <div className={styles.favSideColumn}>
              {randomArticles.slice(1, 3).map((post) => (
                <article key={post.id} className={styles.favSideCard}>
                  <Link
                    href={`/articles/${post.slug}`}
                    className={styles.favSideLink}
                  >
                    <div className={styles.favSideImageWrapper}>
                      <img
                        src={resolveImageUrl(post.featured_image)}
                        alt={post.title}
                        className={styles.favSideImage}
                      />
                    </div>
                    <div className={styles.favSideContent}>
                      <p className={styles.favTag}>
                        {post.category?.name || "Blog"}
                      </p>
                      <h3 className={styles.favSideTitle}>{post.title}</h3>
                      {post.excerpt && (
                        <p className={styles.favSideExcerpt}>{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.favoritesHeader}>
            <Link href="/articles" className={styles.favoritesLink}>
              Show More →
            </Link>
          </div>
        </section>
      )}
      
        {categoryViewCards.length > 0 && (
          <CategoryStrip cards={categoryViewCards} />
        )}

        {/* About Me Section */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2 className={styles.aboutTitle}>About Myself</h2>
              <div className={styles.aboutDescription}>
                <p>
                  Welcome to my little escape—a lifestyle blog dedicated to
                  simple pleasures, sunlit moments, and soulful living. Here, I
                  share pieces of my journey, thoughts, and the stories that
                  shape who I am.
                </p>
                <p>
                  Through words and images, I explore the beauty in everyday
                  moments, the wisdom in quiet reflection, and the joy of
                  connecting with kindred spirits. Join me as we navigate
                  life&apos;s adventures together.
                </p>
              </div>
              <Link href="/about" className={styles.exploreButton}>
                More →
              </Link>
            </div>
            <div className={styles.aboutImage}>
              <img
                src="/queen.jpg"
                alt="The Sporadic Thinker"
                className={styles.aboutCharacter}
              />
            </div>
          </div>
        </section>

        {/* Favourites Section */}
        {displayFavorites.length > 0 && (
          <section className={styles.favouritesSection}>
            <div className={styles.favouritesContainer}>
              <div className={styles.favouritesMain}>
                <h2 className={styles.favouritesTitle}>Favourites</h2>
                <div className={styles.favouritesList}>
                  {displayFavorites.map((article) => (
                    <article key={article.id} className={styles.favouriteCard}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className={styles.favouriteLink}
                      >
                        {article.featured_image && (
                          <div className={styles.favouriteImageWrapper}>
                            <img
                              src={resolveImageUrl(article.featured_image)}
                              alt={article.title}
                              className={styles.favouriteImage}
                            />
                            <div className={styles.favouriteOverlay}>
                              {/* <span className={styles.overlayText}>Read</span> */}
                              {/* <span className={styles.overlayArrow}>→</span> */}
                            </div>
                          </div>
                        )}
                        <div className={styles.favouriteContent}>
                          {article.category && (
                            <p className={styles.favouriteTag}>
                              {article.category.name}
                            </p>
                          )}
                          <h3 className={styles.favouriteTitle}>
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className={styles.favouriteExcerpt}>
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
                <div className={styles.favouritesHeader}>
                  <Link href="/articles?category=favourites" className={styles.favouritesLink}>
                    Show All →
                  </Link>
                </div>
              </div>

              {/* Sidebar - Latest Posts */}
              <aside className={styles.favouritesSidebar}>
                <h3 className={styles.sidebarTitle}>Latest Posts</h3>
                <ul className={styles.latestPostsList}>
                  {latestPosts.map((post) => (
                    <li key={post.id} className={styles.latestPostItem}>
                      <Link
                        href={`/articles/${post.slug}`}
                        className={styles.latestPostLink}
                      >
                        {post.featured_image && (
                          <div className={styles.latestPostImage}>
                            <img
                              src={resolveImageUrl(post.featured_image)}
                              alt={post.title}
                              className={styles.latestPostImg}
                            />
                          </div>
                        )}
                        <div className={styles.latestPostContent}>
                          <h4 className={styles.latestPostTitle}>{post.title}</h4>
                          <p className={styles.latestPostDate}>
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* About Me Card */}
                <div className={styles.aboutMeCard}>
                  <h4 className={styles.aboutMeTitle}>About Me</h4>
                  <div className={styles.aboutMeImageWrapper}>
                    <img
                      src="/aboutmecard.jpeg"
                      alt="Safrina Kamal"
                      className={styles.aboutMeImage}
                    />
                  </div>
                  <h5 className={styles.aboutMeName}>Safrina Kamal</h5>
                  <p className={styles.aboutMeLabel}>WRITER & ECONOMIST</p>
                  <p className={styles.aboutMeBio}>
                    Hey there! I&apos;m an economist and a storyteller at heart, navigating
                    life&apos;s beautiful chaos.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        )}
    </>
  );
}
