"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(home)/page.module.css";

export interface CategoryStripCard {
  id: number;
  categoryName: string;
  categorySlug: string;
  postSlug: string;
  postCount: number;
  excerpt?: string | null;
  imageUrl: string;
}

interface CategoryStripProps {
  cards: CategoryStripCard[];
}

export function CategoryStrip({ cards }: CategoryStripProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <h2 className={styles.categoryHeaderTitle}>Categories</h2>
        </div>
      <div className={styles.categoryGrid}>
        {cards.map((card, index) => (
          <article
            key={card.id}
            className={`${styles.categoryCard} ${
              index === activeIndex ? styles.categoryCardActive : ""
            }`}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <Image
              src={card.imageUrl}
              alt={card.categoryName}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className={styles.categoryImage}
              unoptimized
            />
            <div className={styles.categoryOverlay} />
            <div className={styles.categoryContent}>
              <h3 className={styles.categoryTitle}>
                {card.categoryName}{" "}
                <span className={styles.categoryCount}>
                  – {card.postCount.toString().padStart(2, "0")}
                </span>
              </h3>
              <div className={styles.categoryMeta}>
                {card.excerpt && (
                  <p className={styles.categoryExcerpt}>{card.excerpt}</p>
                )}
                <Link
                  href={`/articles?category=${card.categorySlug}`}
                  className={styles.categoryButton}
                >
                  Explore All
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}



