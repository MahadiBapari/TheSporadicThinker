"use client";

import { usePathname } from "next/navigation";
import HeaderSecondary from "./HeaderSecondary";
import Header from "./Header";
import HeaderThird from "./HeaderThird";
import Footer from "./Footer";
import styles from "../../app/layout.module.css";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const isHomePage = pathname === "/";
  const isHappyBirthdayPage = pathname === "/happybirthday";
  const isArticleSlugPage = pathname?.startsWith("/articles/") && pathname !== "/articles";

  if (isAdminPage || isHappyBirthdayPage) {
    return <>{children}</>;
  }

  let headerComponent;
  if (isHomePage) {
    headerComponent = <Header />;
  } else if (isArticleSlugPage) {
    headerComponent = <HeaderThird />;
  } else {
    headerComponent = <HeaderSecondary />;
  }

  return (
    <div className={styles.root}>
      {headerComponent}
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}

