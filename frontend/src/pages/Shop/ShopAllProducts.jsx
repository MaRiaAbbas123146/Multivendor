import React from 'react'
import DaashboardHeader from '../../components/Shop/Layout/DashboardHeader.jsx'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllProducts from "../../components/Shop/AllProducts.jsx"

const ShopAllProducts = () => {
  return (
    <div>
      <DaashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-20 md:w-75">
          <DashboardSideBar active={3} />
        </div>

        <div className="w-full justify-center flex">
          <AllProducts />
        </div>
      </div>
    </div>
  )
}

export default ShopAllProducts
