import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import { BsFillBagFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllOrdersOfShop } from '../../redux/actions/order'

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id))
  }, [dispatch])

  const data = orders && orders.find((item) => item._id === id)

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color='crimson' />
          <h1 className='pl-2 text-[25px]'> Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div className={`${styles.button} bg-[#fce1e6]! rounded-sm! text-[#e94560] font-semibold h-11.25! text-[18px]`}>
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className='text-[#00000084]' >
          Order Id: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className='text-[#00000084]'>Placed On: <span>{data?.createdAt?.slice(0, 10)}</span></h5>
      </div>
      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5">
            <img
              src={`${item.images[0]?.url}`}
              alt=""
              className="w-[80x] h-20"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                US${item.discountPrice} x {item.qty}
              </h5>
            </div>
          </div>
        ))}
    </div>
  )
}

export default OrderDetails
