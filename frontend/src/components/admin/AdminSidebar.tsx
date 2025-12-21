"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard"},
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/categories", label: "Categories"},
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.logo}>Admin Panel</h2>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? `${styles.navItem} ${styles.navItemActive}`
                : styles.navItem
            }
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user?.username || "Admin"}</p>
            <p className={styles.userEmail}>{user?.email || ""}</p>
          </div>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </aside>
  );
}

