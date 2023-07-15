import React from 'react'
import styles from './Article.module.css'
import Articlecard from '../../../../components/ArticleCard/Articlecard'
import { images } from '../../../../constants'

const Article = () => {
  return (
    <div className={styles.article}>
        <h2>ARTICLES</h2>
        <div className={styles.articlePosts}>
          <Articlecard 
            image = {images.PostImage}
          />
          <Articlecard 
            image = {images.PostImage2}
          />
          <Articlecard 
            image = {images.PostImage3}
          />
          
        </div>
        <button className={styles.btn}>More Articles</button>
        
    </div>
    
  )
}

export default Article