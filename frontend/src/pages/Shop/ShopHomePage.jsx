import React from 'react'
// import Header from '../../components/Layout/Header'
// import Footer from '../../components/Layout/Footer'
import styles from '../../styles/styles'
import ShopInfo from "../../components/Shop/ShopInfo.jsx"
import ShopProfileData from "../../components/Shop/ShopProfileData.jsx"

const ShopHomePage = () => {
  return (

    <div className={`${styles.section} bg-[#f5f5f5]`}>
      <div className="w-full flex py-10 justify-between">

        <div className="w-[25%] bg-white rounded-sm shadow-sm overflow-y-scroll h-[90vh] sticky top-10 left-0 z-10  ">
          <ShopInfo isOwner={true} />
        </div>
        <div className="w-[72%] rounded-sm">
          <ShopProfileData isOwner={true} />
        </div>

      </div>



    </div>

  )
}

export default ShopHomePage