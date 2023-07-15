import React from 'react'
import styles from './SuggestedPosts.module.css'

const SuggestedPosts = ({ header, posts = []}) => {
  return (
    <div className={styles.suggestedPosts}>
        <h3>{header}</h3>
        <div className={styles.posts}>
            {posts.map((item) => (
                <div key = {item.id} className={styles.postData}>
                    <img src={item.image} alt="" />
                    <h4>{item.title}</h4>
                </div>

            ))}
        </div>
    </div>
  )
}

export default SuggestedPosts