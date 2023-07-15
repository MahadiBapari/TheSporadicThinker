import React from 'react'
import styles from "./Header.module.css"
import {images} from "../../constants/index.js"
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom';

const Header = () => {


  const location = useLocation();

    const isActive = (path) => {
    return location.pathname === path;
  }


  return (
    <section>
      <header className={styles.navbar}>

        <NavLink to='/'>
          <div>
            <img src={images.LogoLight} alt="Logo" />
          </div>
        </NavLink>
        
        <nav>
          <ul className={styles.menu}>
          <li className={isActive('/') ? styles.active : ''}>
            <NavLink to="/">Home</NavLink>
          </li>
          <li className={isActive('/blogs') ? styles.active : ''}>
            <NavLink to="/blogs">Articles</NavLink>
          </li>
          <li className={isActive('/docs') ? styles.active : ''}>
            <NavLink to="/docs">Docs</NavLink>
          </li>
          <li className={isActive('/about') ? styles.active : ''}>
            <NavLink to="/about">About</NavLink>
          </li>
          <li className={isActive('/contact') ? styles.active : ''}>
            <NavLink to="/contact">Contact</NavLink>
          </li>

          <button className={styles.btn}>Sign in</button>
          </ul>

         
        </nav>
      </header>
    </section>
  )
}

export default Header