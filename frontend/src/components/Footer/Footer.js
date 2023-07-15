import styles from './Footer.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react';
import { images } from '../../constants'

const Footer = () => {
    const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

    return ( 

        <footer>
                    <div className={styles.footer}>
            <div className={styles.footer_row}>

                <div className={styles.footer_box}>
                    <div className={styles.logo}>
                        <img src={images.LogoLight} alt='Logo' />
                       
                    </div>
                    <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                     Natus praesentium nesciunt ea eos excepturi similique saepe tempora quia eum magni 
                     repudiandae voluptatum accusamus quidem quam,
                      nisi aut ullam doloribus hic.
                    </p>
                </div>
                <div className={styles.footer_box}>
                    <h3>Quick Links</h3>
                    <ul>
                        <li>
                            <Link className={styles.link} to="/about">About</Link>
                        </li>
                        <li>
                            <Link  className={styles.link} to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link  className={styles.link} to="/articles">Articles</Link>
                        </li>
                        
                
                    </ul>
                </div>
                <div className={styles.footer_box}>

                    <h3>Our Contact</h3>
                    <div className={styles.contact_info}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <p>Uttara,Dhaka,Bangladesh</p>
                    </div>
                    <div className={styles.contact_info}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <p>TheSporadicThinker@example.com</p>
                    </div>
                    <div className={styles.contact_info}>
                    <FontAwesomeIcon icon={faPhone} />
                    <p>01011223344</p>
                    </div>
                    
                </div>

                                     
            </div>
            <div className={styles.line}></div> 
        </div>
        </footer>

        
     );
}
 
export default Footer;