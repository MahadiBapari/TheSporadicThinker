import React from 'react'
import styles from './ArticleCard.module.css'


const Articlecard = ({image}) => {
  return (
    <div className={styles.articleCard}>
      <div>
          <img src={image} alt="Article" className={styles.articleImage} />
          <div className={styles.postInfo}>
            <h2 className={styles.articleTitle}>Title</h2>
            <p className={styles.articleText}>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
          </div>  
      </div>
      <div className={styles.layer}>
        <h4>Read More...</h4>
      </div>
      
    </div>
  )
}

export default Articlecard