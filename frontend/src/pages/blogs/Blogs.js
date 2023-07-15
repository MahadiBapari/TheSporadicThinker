import React from 'react'
import MainLayout from '../../components/MainLayout/MainLayout'
import Hero from './container/Hero/Hero'
import AllArticles from './container/AllArticles/AllArticles'

const Blogs = () => {
  return (
    <div>
     <MainLayout>
       <Hero/>
       <AllArticles/>
     </MainLayout>

    </div>
  )
}

export default Blogs