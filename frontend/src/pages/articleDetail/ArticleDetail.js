import React from 'react'
import styles from './ArticleDetail.module.css'
import Mainlayout from '../../components/MainLayout/MainLayout'
import { images } from '../../constants'
//import { Link } from 'react-router-dom'
import SuggestedPosts from '../blogs/container/SuggestedPosts/SuggestedPosts'

const ArticleDetail = () => {

  const postsData = [
    {
      _id: "1",
      image:  images.PostImage,
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      _id: "2",
      image:  images.PostImage2,
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
    {
      _id: "3",
      image:  images.PostImage3,
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    }
   
  ]
  return (
   
    <Mainlayout>
      <article className={styles.articleDetail}>
        <div className={styles.imageContainer}>
          <img src={images.PostImage} alt="" />
        </div>

        {/* <Link to="/blogs?category=selectedCatagory">
          Adamemic
        </Link> */}
        <div className={styles.articleData}>
            <h1>Title</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam id repellat numquam laborum perferendis et, ut odit minus labore obcaecati beatae ipsam magni officia corporis dolore incidunt. Quisquam, vel placeat.
            Dolor quasi itaque beatae nisi asperiores consequatur nemo, repellendus magni fugit quo. Vero assumenda nisi amet odio officiis! Explicabo illo ipsum repudiandae atque id nostrum a eveniet consequatur tempore maxime.
            Ducimus et recusandae tenetur. Necessitatibus recusandae ad illum voluptates reiciendis aliquam dolores temporibus architecto facere, quas magnam saepe, provident atque vitae deserunt eligendi. Nam atque accusantium, sapiente iste voluptas minus!
            Eos placeat deleniti qui, consequatur nobis, porro eaque optio aliquid, exercitationem reiciendis odit cum recusandae sed nostrum natus! Corrupti, doloremque tempore. Labore consectetur nobis repellat sunt dolorum impedit accusantium et.
            Delectus sed corrupti velit adipisci suscipit, facere consequatur? Veritatis voluptates hic perspiciatis sint suscipit repellat. Tenetur accusamus suscipit, quod dolorem et quibusdam dolorum nam modi voluptates, officiis fugiat beatae hic.
            Necessitatibus, officia similique molestias aspernatur eius in vero voluptates quibusdam aut officiis ad fuga dolorem. In tenetur nulla ab laboriosam iure dolorem optio mollitia, repellat similique rerum, assumenda aliquid quos.
            In minus laborum, a alias dolorem labore possimus repellat reiciendis perferendis magnam maxime amet! Aut repellendus sit reprehenderit fugit sint eos laudantium distinctio ea voluptatibus, harum perspiciatis rerum numquam error.
            Consequuntur numquam quia perferendis pariatur facere neque, eius repellat itaque delectus. Veritatis voluptate repudiandae itaque odio, odit quae quos, recusandae incidunt officia ex numquam eaque, praesentium enim ab voluptatum ea.
            Unde architecto dicta repudiandae atque qui ducimus, mollitia est odio consequatur tempora numquam repellat. Possimus, architecto incidunt dolorem expedita beatae voluptate veritatis sint magni nisi consequuntur iste mollitia neque doloribus.
            Officia assumenda nisi esse aspernatur cum incidunt praesentium, accusamus magnam exercitationem error repellat perferendis ab quas rem amet eligendi distinctio enim nihil sit, adipisci natus a quibusdam. Fugit, totam minus!</p>
        </div>
        <SuggestedPosts header = "Latest Posts" posts = {postsData}/>
      </article>
      
    </Mainlayout>
     
  )
}

export default ArticleDetail