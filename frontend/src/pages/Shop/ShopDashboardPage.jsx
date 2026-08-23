import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader.jsx'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar.jsx'
import DashboardHero from '../../components/Shop/DashboardHero.jsx'

const ShopDaashboardPage = () => {
  return (
    <div>
      <DashboardHeader />
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
