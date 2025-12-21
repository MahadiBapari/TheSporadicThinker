"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(home)/page.module.css";

export interface HeroSlide {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  imageUrl: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
}

export function HeroCarousel({ slides, intervalMs = 8000 }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (slides.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;

  return (
    <section
      className={styles.heroSection}
      // onMouseEnter={() => setPaused(true)}
      // onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.heroStrip}>
        {slides.map((slide, index) => (
          <article
            key={slide.id}
            className={`${styles.heroCard} ${
              index === activeIndex ? styles.heroCardActive : ""
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className={styles.heroImage}
              unoptimized
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <h2 className={styles.heroHeading}>{slide.title}</h2>
              {slide.excerpt && (
                <p className={styles.heroExcerpt}>{slide.excerpt}</p>
              )}
              <Link
                href={`/articles/${slide.slug}`}
                className={styles.heroButton}
              >
                Read Article
              </Link>
            </div>
          </article>
        ))}

        {slides.length > 1 && (
          <div className={styles.heroDots}>
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.heroDot} ${
                  index === activeIndex ? styles.heroDotActive : ""
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


