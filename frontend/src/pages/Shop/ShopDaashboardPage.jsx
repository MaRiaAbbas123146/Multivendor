import React from 'react'
import DaashboardHeader from '../../components/Shop/Layout/DaashboardHeader.jsx'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar.jsx'

const ShopDaashboardPage = () => {
  return (
    <div>
      <DaashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-20 md:w-75">
          <DashboardSideBar active={1} />
        </div>
      </div>

    </div>
  )
}

export default ShopDaashboardPage
