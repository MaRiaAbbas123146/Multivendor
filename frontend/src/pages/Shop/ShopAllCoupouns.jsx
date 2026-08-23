import React from 'react'
import DaashboardHeader from '../../components/Shop/Layout/DashboardHeader.jsx'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllCoupons from "../../components/Shop/AllCoupons.jsx";

const ShopAllCoupouns = () => {
  return (
    <div>
      <DaashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-20 800px:w-[330px]">
          <DashboardSideBar active={9} />
        </div>
        <div className="w-full justify-center flex">
          <AllCoupons />
        </div>
      </div>
    </div>
  )
}

export default ShopAllCoupouns