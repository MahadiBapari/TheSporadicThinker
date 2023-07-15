import React from 'react'
import styles from './AllArticle.module.css'
import Articlecard from '../../../../components/ArticleCard/Articlecard'
import { images } from '../../../../constants'

const AllArticle = () => {
  return (
    <div className={styles.article}>
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
          <Articlecard 
            image = {images.PostImage3}
          />
           <Articlecard 
            image = {images.PostImage}
          />
          
        </div>
        
        
    </div>
    
  )
}

export default AllArticle