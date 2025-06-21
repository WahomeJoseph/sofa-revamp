import Services from '@/components/hero/Services'
import FeaturedProducts from '@/components/products/FeaturedProducts'
import Homes from '@/components/hero/Home'
import About from '@/components/hero/About'
import Contact from '@/components/hero/Contact'
import ImageSlider from '@/components/hero/ImageSlider'

export default function Home() {
  return (
    <>
      <Homes />
      <FeaturedProducts />
      <About />
      <Services />
      <Contact />
      <ImageSlider />
    </>
  )
}
