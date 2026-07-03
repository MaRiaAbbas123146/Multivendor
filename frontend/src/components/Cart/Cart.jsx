import React, { useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from '../../styles/styles';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { backend_url } from '../../server';
import { addToCart, removeFromCart } from '../../redux/actions/cart';

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data))
  }

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0)

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data))
  }

  return (
    <div className='fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10'>
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">

        {
          cart && cart.length === 0 ? (
            <div className="w-full h-screen flex items-center justify-center">
              <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                <RxCross1
                  sixe={25}
                  className='cursor-pointer'
                  onClick={() => setOpenCart(false)}
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="flex w-full justify-end pt-5 pr-5">
                  <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
                </div>

                {/* Item length */}
                <div className={`${styles.normalFlex} p-4`}>
                  <IoBagHandleOutline size={25} />
                  <h5 className='pl-2 text-[20px] font-medium'>
                    {cart && cart.length} items
                  </h5>
                </div>

                {/* Cart single items */}
                <div
                  className='w-full border-t'>
                  {cart.map((i, index) => <CartSingle
                    key={index}
                    data={i}
                    quantityChangeHandler={quantityChangeHandler} removeFromCartHandler={removeFromCartHandler} />)}
                </div>
              </div>

              {/* Checkout Button */}
              <div className="px-5 mb-3">
                <Link to="/checkout">
                  <div className="h-11.25 flex items-center justify-center w-full bg-[#e44343] rounded-[5px] cursor-pointer">
                    <h1 className='text-white text-[18px] font-medium'>
                      Checkout now (USD ${totalPrice})
                    </h1>
                  </div>
                </Link>
              </div>
            </>
          )
        }

      </div>
    </div>
  )
}

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    setValue(value + 1);
    if (data.stock < value) {
      toast.error("Product stock limited")
    } else {
      setValue(value + 1)
      const updateCartData = { ...data, qty: value + 1 }
      quantityChangeHandler(updateCartData)
    }

  }
  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 }
    quantityChangeHandler(updateCartData)
  }

  return (
    <div className='border-b p-4'>
      <div className="w-full flex items-center gap-3">
        {/* Quantity Controls */}
        <div className="flex flex-col items-center">
          <div className="bg-[#e44343] border border-[#e4434373] rounded-full w-6.25 h-6.25 flex items-center justify-center cursor-pointer"
            onClick={() => increment(data)}>
            <HiPlus size={12} color="#fff" />
          </div>
          <span className="py-1">{data.qty}</span>
          <div className="bg-[#a7abb14f] rounded-full w-6.25 h-6.25 flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}>
            <HiOutlineMinus size={14} color="#7d879c" />
          </div>
        </div>

        {/* Product Image */}
        <img
          src={`${backend_url}${data?.images[0]}`}
          alt=""
          className='w-20 h-min object-cover ml-1 mr-2 rounded-[5px]'
        />

        {/* Product Info */}
        <div className='pl-2'>
          <h1 className='font-medium'>{data.name}</h1>
          <h4 className='text-[15px] text-[#00000082]'>${data.price} *{value}</h4>
          <h4 className='font-semibold text-[17px] text-[#d02222] pt-0.75 font-Roboto'>US${totalPrice}</h4>
        </div>

        {/* Remove Item */}
        <RxCross1 className='cursor-pointer ml-auto' onClick={() => removeFromCartHandler(data)} />
      </div>
    </div>
  )
}

export default Cart