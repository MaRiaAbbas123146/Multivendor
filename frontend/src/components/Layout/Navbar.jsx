import React from 'react'
import styles from '../../styles/styles'
import { navItems } from '../../static/data'
import { Link } from 'react-router-dom'

const Navbar = ({ active }) => {
  return (
    <div className={`block md:${styles.normalFlex}`}>
      {
        navItems && navItems.map((i, index) => (
          <div className="flex" key={i.title}>  {/* fixed here */}
            <Link
              to={i.url}
              className={`${active === index + 1 ? "text-[#17dd1f]" : "text-black md:text-[#e2e2e2]"} pb-7.5 md:pb-0 font-medium px-6 cursor-pointer`}
            >
              {i.title}
            </Link>
          </div>
        ))
      }
    </div>
  )
}

export default Navbar
