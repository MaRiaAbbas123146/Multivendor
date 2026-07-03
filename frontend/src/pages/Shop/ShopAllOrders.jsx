import React from 'react'
import DaashboardHeader from '../../components/Shop/Layout/DaashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllOrders from '../../components/Shop/AllOrders.jsx'

const ShopAllOrders = () => {
  return (
    <div>
      return (
      <div>
        <DaashboardHeader />
        <div className="flex justify-between w-full">
          <div className="w-20 md:w-75">
            <DashboardSideBar active={3} />
          </div>

          <div className="w-full justify-center flex">
            <AllOrders />
          </div>
        </div>
      </div>
      )
    </div>
  )
}

export default ShopAllOrders
