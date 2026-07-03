/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import styles from '../styles/styles'
import { useSearchParams } from 'react-router-dom'

import { useSelector } from 'react-redux'
import ProductCard from '../components/Route/ProductCard/ProductCard'

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products)

  useEffect(() => {
    if (categoryData === null) {
      const d = allProducts && [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
      setData(d);
    } else {
      const d = allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
  }, [categoryData, allProducts]); // re-run whenever category changes

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-7 mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
        {data && data.length === 0 ? (
          <h1 className="text-center w-full pb-25 text-[20px]">
            No products Found!
          </h1>
        ) : null}
      </div>
      <Footer />
    </div>
  )
}

export default ProductsPage