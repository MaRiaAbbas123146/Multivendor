import React, { useEffect, useState } from 'react'
import { backend_url, server } from '../../server'
import styles from '../../styles/styles'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({})
  // const [isLoading, setIsLoading] = useState(false)

  const { id } = useParams()
  useEffect(() => {
    const setIsLoading = setIsLoading(true)
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
      setData(res.data.shop)
      setIsLoading(false)
    }).catch((error) => {
      console.log(error)
      setIsLoading(false)
    })
  }, [id])

  const logoutHandler = () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true
    }
    )
    window.location.reload()
  }
  console.log(data)
  return (
    <>

      <div className='w-full  py-5'>
        <div className="w-full flex items-center justify-center">
          <img
            src={`${backend_url}${data.avatar}`} alt=""
            className='w-37.5 h-37.5 object-cover rounded-full'
          />
        </div>
        <h3 className="text-center py-2 text-[20px]">
          {data.name}
        </h3>
        <p className='text-[16px] text-[#000000a6] p-2.5 flex items-center'>
          {data.description}
        </p>
      </div>

      <div className="p-3">
        <h5 className='font-semibold'>Address</h5>
        <h4 className='text-[#000000a6]'>{data.address}</h4>
      </div>

      <div className="p-3">
        <h5 className='font-semibold'>Seller Phone Number</h5>
        <h4 className='text-[#000000a6]'>{data.phoneNumber}</h4>
      </div>

      <div className="p-3">
        <h5 className='font-semibold'>Rotal Products</h5>
        <h4 className='text-[#000000a6]'>10</h4>
      </div>

      <div className="p-3">
        <h5 className='font-semibold'>Shop Rating</h5>
        <h4 className='text-[#000000a6]'>4/5</h4>
      </div>

      <div className="p-3">
        <h5 className='font-semibold'>Joined On</h5>
        <h4 className='text-[#000000a6]'>{data?.createdAt?.slice(0, 10)}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
          <Link to="/settings">

            <div className={`${styles.button} w-full! h-10.5! rounded-[5px]!`}>
              <span className='text-white'>Edit Shop</span>
            </div>

          </Link>

          <div
            onClick={logoutHandler}
            className={`${styles.button} w-full! h-10.5! rounded-[5px]!`}>
            <span className='text-white'>Logout</span>
          </div>
        </div>
      )}


    </>

  )
}

export default ShopInfo
