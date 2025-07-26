import React, { lazy, Suspense } from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import Explore from '../Components/Explore'

const MoreCategories = lazy(() => import('../Components/moreCategories'))
const Testinomials = lazy(() => import('../Components/Testinomials'))
const WhyShopUs = lazy(() => import('../Components/WhyshopUs'))
const Footer = lazy(() => import('../Components/Footer'))

function Home() {
  return (
    <>
      <div className="overflow-x-hidden">
        <section className="h-screen">
          <HeroSection />
        </section>

        <section>
          <Explore />
        </section>

        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <section>
            <MoreCategories />
            <Testinomials />
            <WhyShopUs />
            <Footer />
          </section>
        </Suspense>
      </div>
    </>
  )
}


export default Home
