import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import styles from '../styles/styles'
import { productData } from '../static/data'

const BestSellingPage = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    const d = productData && productData.sort((a, b) => b.total_sell - a.total_sell)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(d)
  }, []);
  return (
    <div>
      <Header activeHeading={2} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6.25 lg:grid-cols-4 lg:gap-6.25 xl:grid-cols-5 xl:gap-7.5 mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default BestSellingPage