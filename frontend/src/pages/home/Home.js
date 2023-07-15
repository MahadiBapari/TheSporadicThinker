import React from 'react'
import MainLayout from '../../components/MainLayout/MainLayout'
import Hero from './container/Hero/Hero'
import Quote from './container/Quotes/Quote'
import Article from './container/Article/Article'
import AboutMe from './container/Aboutme/AboutMe'

const Home = () => {
  return (
  
    <MainLayout>  
      <Hero/>
      <Quote/>
      <Article/>
      <AboutMe/>
    </MainLayout>
  )
}

export default Home