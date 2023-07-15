import React from 'react'
import styles from './AboutMe.module.css'
import { images } from '../../../../constants'

const AboutMe = () => {
  return (
    <div className={styles.aboutMe}>

        <div className={styles.aboutContainer}>
          <h2>About Me</h2>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
           Quis veritatis nobis maiores dicta voluptates eligendi ullam. 
           Porro soluta eveniet ducimus quas quo iusto obcaecati deleniti, 
           doloribus ex libero nulla harum. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
           Non nobis, provident fuga aspernatur molestias cum quae officia necessitatibus nesciunt 
           voluptatibus neque rerum cupiditate, adipisci reiciendis iusto. Quis suscipit dicta molestias!
           Natus modi similique quibusdam perferendis doloribus sed voluptatem pariatur tenetur voluptates, 
           a unde fugit molestiae enim voluptate laboriosam quod earum 
           quasi est velit non nemo consequatur provident! Velit, ut aliquam?</p>

           <button className={styles.btn}>More About Me</button>
        </div>
        <div className={styles.aboutImage}></div>
        <img src={images.Profile} alt="" />
        
    </div>
  )
}

export default AboutMe