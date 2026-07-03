import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../../styles/styles'
import ProductCard from '../ProductCard/ProductCard'
import { getAllProducts } from '../../../redux/actions/product'
import { productData } from '../../../static/data'

const FeatureProduct = () => {
  const dispatch = useDispatch();

  // Pick out only what you need — avoids new object references every render
  const { allProducts } = useSelector((state) => state.products?.allProducts);
  const isLoading = useSelector((state) => state.product?.isLoading);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Use static data as fallback if API hasn't returned anything
  const displayProducts = allProducts && allProducts.length > 0 ? allProducts : productData;

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-7 mb-12">
            {displayProducts && displayProducts.length > 0 ? (
              displayProducts.map((product, index) => (
                <ProductCard data={product} key={product._id || `product-${product.id}-${index}`} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No products available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureProduct