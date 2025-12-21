"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

interface Sparkle {
  id: number;
  left: number;
  top: number;
  delay: number;
}

export default function HappyBirthdayPage() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [showBirthdayText, setShowBirthdayText] = useState(false);

  const handleCakeClick = () => {
    // Show birthday text first
    setShowBirthdayText(true);
    
    // Generate sparkles randomly around the text area
    // Text is centered, so sparkles should be around center area
    const newSparkles: Sparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      left: 30 + (Math.random() * 40), // Position between 30% and 70% (around text)
      top: -60 + (Math.random() * 80), // Position around text area (-180 to -100)
      delay: Math.random() * 0.5,
    }));
    setSparkles(newSparkles);
    
    // Clear sparkles after animation
    setTimeout(() => {
      setSparkles([]);
    }, 1000);
    
    // Hide birthday text after animation
    setTimeout(() => {
      setShowBirthdayText(false);
    }, 2000);
  };

  return (
    <div className={styles.page}>
      {/* Animated Cake */}
      <div className={styles.cakeContainer}>
        {/* Happy Birthday Text Animation */}
        {showBirthdayText && (
          <div className={styles.birthdayText}>
            <span className={styles.birthdayTextInner}>Happy<br />Birthday<br />Baby</span>
            {/* Sparkles Around Text */}
            {sparkles.map((sparkle) => (
              <div
                key={sparkle.id}
                className={styles.sparkle}
                style={{
                  left: `${sparkle.left}%`,
                  top: `${sparkle.top}px`,
                  animationDelay: `${sparkle.delay}s`,
                }}
              ></div>
            ))}
          </div>
        )}
        <div className={styles.cake} onClick={handleCakeClick}>
          {/* Candle */}
          <div className={styles.candle}>
            <div className={styles.flame}>
              <div className={styles.flameInner}></div>
            </div>
            <div className={styles.wick}></div>
          </div>
          {/* Cake Layers */}
          <div className={styles.cakeTop}></div>
          <div className={styles.cakeMiddle}></div>
          {/* <div className={styles.cakeBottom}></div> */}
          {/* Decorations */}
          {/* <div className={styles.decoration1}></div>
          <div className={styles.decoration2}></div>
          <div className={styles.decoration3}></div> */}
        </div>
      </div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroLeft}>
          <div className={styles.bookWrapper}>
            <div className={styles.bookLeftPage}>
              <Image
                src="/bdhero1.png"
                alt="Book Image"
                fill
                className={styles.bookImage}
                priority
              />
            </div>
            <div className={styles.bookRightPage}>
              <h3 className={styles.bookTitle}>Happy <br /> Birthday <br /> Darling</h3>

            </div>
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroRightContent}>
            <h1 className={styles.heroHeading}>A Special Birthday</h1>
            <p className={styles.heroText}>
            Some birthdays are just dates, but yours is something my heart waits for every year. You turned an ordinary day into something special just by existing. Even though I can’t be there to hold you today, my love is right beside you, celebrating you in every way it knows how. Happy Birthday my love, you make this day, and my life, meaningful.<br /> I love you so much.
            </p>
            
          </div>
          <div className={styles.decorativeRose}></div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <p className={styles.quoteText}>
        I spent years of my life never really understanding why birthdays mattered. They came and went like any other day, carrying no excitement, no anticipation, just another date on the calendar. That was before you walked into my life. Somehow, without trying, you gave birthdays meaning. Not the kind that can be explained with words, but the kind that settles quietly in the heart and stays there.
Year after year, there has been only one day I truly looked forward to, yours. Every time it returned, it felt like a reminder of how grateful I was that the world chose that day to bring you into it. And this year, in so many ways, it feels the same… except for one aching difference—your presence is missing from my arms.
I miss you, darling, in ways that language cannot hold. I miss you in the small, intimate moments, the way I would lean in to kiss your forehead, the way I would whisper “happy birthday” as if the words themselves carried a promise. This year, I can’t do that. I can’t be there to touch you, to look into your eyes, to let my silence say everything my heart feels.
Yet even from afar, my love reaches you. Every thought, every memory, every beat of my heart is with you today. Distance may stand between us, but it cannot dim what you mean to me, nor can it lessen the weight of this day in my heart.
So today, I celebrate you in absence, loving you in longing, holding you in every quiet moment. Happy Birthday, my love. Until the day I can finally kiss your forehead again and say these words where they belong, right beside you. <br /><br /> Your Love, <br /> <span className={styles.signature}>Mahadi</span>

        </p>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContainer}>
          <div className={styles.servicesLeft}>
            <h2 className={styles.servicesHeading}>
              Ways I celebrate special occasions:
            </h2>
            <div className={styles.decorativeRoseWhite}></div>
          </div>
          <div className={styles.servicesRight}>
            <ul className={styles.servicesList}>
              <li className={styles.serviceItem}>
                <span>Birthday parties and celebrations</span>
              </li>
              <li className={styles.serviceItem}>
                <span>Memorable moments and milestones</span>
              </li>
              <li className={styles.serviceItem}>
                <span>Personalized gifts and surprises</span>
              </li>
              <li className={styles.serviceItem}>
                <span>Heartfelt messages and wishes</span>
              </li>
              <li className={styles.serviceItem}>
                <span>Creating lasting memories</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className={styles.bottomSection}>
        <div className={styles.bottomContainer}>
          {/* Top Left - Image */}
          <div className={styles.bottomImageLeft}>
            <div className={styles.imageTray}>
              <Image
                src="/bd1.jpg"
                alt="Birthday Items"
                fill
                className={styles.trayImage}
              />
            </div>
          </div>

          {/* Top Right - How Can I Help */}
          <div className={styles.bottomTextRight}>
            <h2 className={styles.bottomHeading}>How can I help you?</h2>
            <p className={styles.bottomText}>
              Celebrations are magical when you get them right, and working with
              wonderful people to create special moments is what I love to do.
            </p>
            <p className={styles.bottomText}>
              I&apos;m open to planning birthday parties, creating personalized gifts,
              organizing surprises, and making every occasion memorable and
              meaningful.
            </p>
            <p className={styles.bottomTextDotted}>
              Something else in mind? ................... Let&apos;s talk about it.
            </p>
          </div>

          {/* Bottom Left - Why Work With Me */}
          <div className={styles.bottomTextLeft}>
            <h2 className={styles.bottomHeading}>Why celebrate with me?</h2>
            <p className={styles.bottomText}>
              I have extensive experience in creating beautiful and meaningful
              celebrations for a variety of occasions.
            </p>
            <p className={styles.bottomText}>
              With years of experience in event planning, gift curation, and
              creating memorable experiences, I&apos;ve successfully helped people
              celebrate birthdays, anniversaries, and special milestones.
            </p>
            <p className={styles.bottomText}>
              And I bring all of my creativity and attention to detail to every
              celebration in what can be a unique, personal, and heartfelt
              approach. An approach that&apos;s exactly right for the occasion
              and the people involved.
            </p>
          </div>

          {/* Bottom Right - Image */}
          <div className={styles.bottomImageRight}>
            <Image
              src="/bd1.jpg"
              alt="Celebration"
              fill
              className={styles.bottomImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
