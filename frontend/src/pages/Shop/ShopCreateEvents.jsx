import React from 'react'
import DaashboardHeader from '../../components/Shop/Layout/DaashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import CreateEvent from '../../components/Shop/CreateEvent.jsx'

const ShopCreateEvents = () => {
  return (
    <div>
      <DaashboardHeader />
      <div className='flex items-center justify-between w-full'>
        <div className='w-82.5'>
          <DashboardSideBar active={6} />
        </div>
        <div className='flex items-center w-full'>
          <CreateEvent />
        </div>
      </div>
    </div>
  )
}

export default ShopCreateEvents
