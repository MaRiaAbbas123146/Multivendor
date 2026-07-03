import React, { useEffect, useState } from 'react'
import { productData } from '../../static/data';
import styles from '../../styles/styles';
import ProductCard from "../Route/ProductCard/ProductCard";
import { useSelector } from 'react-redux';

const SuggestedProducts = ({ data }) => {
  const { products } = useSelector((state) => state.products)
  const [productData, setProductData] = useState()

  useEffect(() => {
    const d = products && products.filter((i) => i.category === data.category)
    setProductData(d)
  }, []);
  return (
    <div>
      <div>
        {data ? (
          <div className={`p-4 ${styles.section}`}>
            <h2
              className={`${styles.heading} text-[25px] font-medium border-b mb-5`}
            >
              Related Product
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6.25 lg:grid-cols-4 lg:gap-6.25 xl:grid-cols-5 xl:gap-7.5 mb-12">
              {
                productData && productData.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))
              }
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SuggestedProducts