import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai";
import styles from '../../styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishList } from '../../redux/actions/wishlist';
import { backend_url } from '../../server';
import { addToCart } from '../../redux/actions/cart';

const Wishlist = ({ setOpenWishList }) => {
  const { wishlist } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()

  const removeFromWishListHandler = (data) => {
    dispatch(removeFromWishList(data))
  }

  const AddToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(data))
    setOpenWishList(false)
  }



  return (
    <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10'>
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        {
          wishlist && wishlist.length === 0 ? (
            <div className="w-full h-screen flex items-center justify-center">
              <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                <RxCross1
                  sixe={25}
                  className='cursor-pointer'
                  onClick={() => setOpenWishList(false)}
                />
              </div>
              <h5>Wishlist item is empty</h5>
            </div>
          ) : (
            <>
              <div>
                <div className="flex w-full justify-end pt-5 pr-5">
                  <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenWishList(false)} />
                </div>

                {/* Item length */}
                <div className={`${styles.normalFlex} p-4`}>
                  <AiOutlineHeart size={25} />
                  <h5 className='pl-2 text-[20px] font-medium'>
                    {wishlist.length} items
                  </h5>
                </div>

                {/* Cart single items */}
                <div className='w-full border-t'>
                  {wishlist.map((i, index) => <CartSingle key={index} data={i} removeFromWishList={removeFromWishList()} AddToCartHandler={AddToCartHandler} />)}
                </div>
              </div>

            </>
          )
        }

      </div >
    </div >
  )
}

const CartSingle = ({ data, removeFromWishListHandler, AddToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <div className='border-b p-4'>
      <div className="w-full flex items-center gap-3">
        <RxCross1 className='cursor-pointer' />
        <img
          src={`${backend_url}${data?.image[0]}`}
          alt=""
          className='w-20 h-min ml-2 mr-2 object-cover rounded-[5px]'
          onClick={removeFromWishListHandler(data)}
        />

        {/* Product Info */}
        <div className='pl-2'>
          <h1 className='font-medium'>{data.name}</h1>
          <h4 className='text-[15px] text-[#00000082]'>${data.price} × {value}</h4>
          <h4 className='font-semibold text-[17px] text-[#d02222] pt-0.75 font-Roboto'>US${totalPrice}</h4>
        </div>
        <div>
          <BsCartPlus size={20} className="cursor-pointer" title="Add to cart " onClick={() => AddToCartHandler()} />
        </div>


      </div>
    </div>
  )
}

export default Wishlist