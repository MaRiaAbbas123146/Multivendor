import React, { useState } from 'react'
import { AiOutlineGift, AiOutlineMenu } from 'react-icons/ai'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { backend_url } from '../../../server'

const DaashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className='w-full h-20 bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4'>
        <div>
          <Link to='/dashboard'>
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="Logo"
              className="h-8 md:h-10"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">

            <Link to="/dashboard-cupouns">
              <AiOutlineGift
                color='#555'
                size={30}
                className='mx-3 cursor-pointer' />
            </Link>

            <Link to="/dashboard-events">
              <MdOutlineLocalOffer
                color='#555'
                size={30}
                className='mx-3 cursor-pointer' />
            </Link>

            <Link to="/dashboard-products">
              <FiShoppingBag
                color='#555'
                size={30}
                className='mx-3 cursor-pointer' />
            </Link>

            <Link to="/dashboard-orders">
              <FiPackage
                color='#555'
                size={30}
                className='mx-3 cursor-pointer' />
            </Link>

            <Link to="/dashboard-messages">
              <BiMessageSquareDetail
                color='#555'
                size={30}
                className='mx-3 cursor-pointer' />
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <AiOutlineMenu size={24} color='#555' />
          </button>

          {/* Avatar */}
          {seller?._id && (
            <Link to={`/shop/${seller?._id}`}>
              <img
                src={seller?.avatar ? `${backend_url}${seller.avatar}` : "/avatar.png"}
                alt="seller"
                className='w-10 h-10 md:w-12 md:h-12 rounded-full object-cover'
              />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-20 left-0 right-0 z-20 p-4">

          <Link to="/dashboard-cupouns" className="flex items-center gap-3 py-3 border-b">
            <AiOutlineGift
              size={24}
              color='#555' />
            <span>Coupons</span>
          </Link>

          <Link to="/dashboard-events" className="flex items-center gap-3 py-3 border-b">
            <MdOutlineLocalOffer
              size={24}
              color='#555' />
            <span>Events</span>
          </Link>

          <Link to="/dashboard-products" className="flex items-center gap-3 py-3 border-b">
            <FiShoppingBag
              size={24}
              color='#555' />
            <span>Products</span>
          </Link>

          <Link to="/dashboard-orders" className="flex items-center gap-3 py-3 border-b">
            <FiPackage
              size={24}
              color='#555' />
            <span>Orders</span>
          </Link>

          <Link to="/dashboard-messages" className="flex items-center gap-3 py-3">
            <BiMessageSquareDetail
              size={24}
              color='#555' />
            <span>Messages</span>
          </Link>

        </div>
      )}
    </>
  )
}

export default DaashboardHeader