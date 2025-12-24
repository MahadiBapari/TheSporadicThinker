import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroInner}>
          <div className={styles.heroAvatarWrap}>
            <div className={styles.heroAvatarRing} />
            <Image
              src="/aboutmecard.jpeg"
              alt="Portrait"
              width={160}
              height={160}
              className={styles.heroAvatar}
              priority
            />
          </div>

          
          <h2 className={styles.heroTitle}>Safrina Kamal</h2>
          <p className={styles.heroSubtitle}>
            Writer & Economist — collecting thoughts on love, life, and the
            in-between.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/contact" className={styles.primaryCta}>
              Contact Me
            </Link>
            <Link href="/articles" className={styles.secondaryCta}>
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutMedia}>
            <div className={styles.aboutImageCard}>
              <Image
                src="/aboutmecard.jpeg"
                alt="Portrait"
                width={640}
                height={800}
                className={styles.aboutImage}
              />
            </div>
          </div>

          <div className={styles.aboutContent}>
            <p className={styles.sectionKicker}>Discover</p>
            <h2 className={styles.sectionTitle}>About Me</h2>
            <p className={styles.sectionBody}>
              Welcome to my little escape—a lifestyle blog dedicated to simple
              pleasures, sunlit moments, and soulful living. Here, I share
              pieces of my journey, thoughts, and the stories that shape who I
              am.
            </p>
            <p className={styles.sectionBody}>
              Through words and images, I explore the beauty in everyday
              moments, the wisdom in quiet reflection, and the joy of
              connecting with kindred spirits.
            </p>

            <div className={styles.infoCard}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Name</span>
                  <span className={styles.infoValue}>Safrina Kamal</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Role</span>
                  <span className={styles.infoValue}>Writer & Economist</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Focus</span>
                  <span className={styles.infoValue}>
                     • Life • Love • Storytelling
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Based in</span>
                  <span className={styles.infoValue}>Bangladesh</span>
                </div>
              </div>
            </div>

            <div className={styles.aboutActions}>
              <Link href="/contact" className={styles.primaryCta}>
                Let&apos;s Talk
              </Link>
              <Link href="/articles?category=favourites" className={styles.secondaryCta}>
                View Favourites
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

