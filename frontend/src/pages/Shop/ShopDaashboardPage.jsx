import React from 'react'
import DaashboardHeader from '../../components/Shop/Layout/DaashboardHeader.jsx'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar.jsx'
import DashboardHero from '../../components/Shop/DashboardHero.jsx'

const ShopDaashboardPage = () => {
  return (
    <div>
      <DaashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-20 md:w-75">
          <DashboardSideBar active={1} />
        </div>
        <DashboardHero />
      </div>

    </div>
  )
}

export default ShopDaashboardPage
