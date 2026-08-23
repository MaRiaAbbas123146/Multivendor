/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react'
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import ProductDetails from "../components/Products/ProductDetails.jsx"
import { useParams, useSearchParams } from 'react-router-dom'

import SuggestedProducts from "../components/Products/SuggestedProducts.jsx"
import { useSelector } from 'react-redux'

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.product)
  const { allEvents } = useSelector((state) => state.events)
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent")

  console.log(isEvent)

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id)
      setData(data)
    } else {
      const data = allEvents && allEvents.find((i) => i._id === id)
      setData(data)
    }
    const data = allProducts.find(
      (i) => i._id === id
    )

    setData(data)
  }, [allProducts])

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {
        !eventData && (
          <>
            {data && <SuggestedProducts data={data} />}
          </>
        )

      }

      {/* ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl">Product not found</p>
        </div>
      )} */}
      <Footer />
    </div>
  )
}

export default ProductDetailsPage