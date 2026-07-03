import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { addToCart } from "../../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  addToWishList,
  removeFromWishList,
} from "../../../redux/actions/wishlist";

const ProductCardDetails = ({ setOpen, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const handleMessageSubmit = () => {
    console.log("Done!");
  };
  const incrementCount = () => {
    setCount(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };
  const AddToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < count) {
        toast.error("Not enough stock available");
      } else {
        const cartItem = {
          ...data,
          qty: count,
        };
        dispatch(addToCart(cartItem));
        toast.success("Item added to cart successfully");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i.id === data._id)) {
      setClick(true)
    } else {
      setClick(false)
    }
  }, [wishlist])

  const removeFromWishListHandler = (data) => {
    setClick(!click)
    dispatch(removeFromWishList(data))
  }
  const addToWishListHandler = (data) => {
    setClick(!click)
    dispatch(addToWishList(data))
  }

  return (
    <div className="bg-white">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-black z-40 flex items-center justify-center">
          <div className="w-[90%] md:w-[60%] h-[90vh] overflow-y-scroll md:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />
            {/* Main Container */}
            <div className="block w-full md:flex overflow-hidden">
              {/* Left Container */}
              <div className="w-full md:w-[50%]">
                {data.images && data.images[0] && (
                  <img
                    src={`${data.images && data.images[0]?.url}`}
                    alt=""
                    className="w-full h-auto object-cover"
                  />
                )}

                <div className="flex ">
                  {data.shop && data.shop.avatar && (
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-12.5 h-12.5 rounded-full mr-2"
                    />
                  )}
                  {/* Ratings to Product */}
                  <div>

                    <Link to={`/shop/preview/${data.shop._id}`}>
                      <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                    </Link>
                    <h5 className="pb-3 text-[15px] ">
                      ({data?.shop?.ratings}) Ratings
                    </h5>
                  </div>
                </div>
                <div
                  className={`${styles.button}  bg-[#000000] mt-4 rounded-sm h-11`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white  flex items-center ">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
                <h5 className="text-16px text-red-600 mt-5">
                  {`${data?.soldOut}`} sold Out
                </h5>
              </div>
              {/* Right Container */}
              <div className="w-full md:w-[50%] pt-5 pl-1.25 pr-1.25  ">
                <h1 className={`${styles.productTitle} text-[20px] `}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3 ">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.price ? data.price + "$" : null}
                  </h3>
                </div>
                {/* Quantity Handler */}
                <div className="flex items-center mt-12 justify-between pr-3 ">
                  <div>
                    <button
                      className="bg-linear-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 px-4 font-medium py-2.75 rounded-md ">
                      {count}
                    </span>
                    <button
                      className="bg-linear-to-r from-teal-400 to-teal-500 text-white font-bold rounded-md px-4 py-2 shadow-lg hover:opacity-95 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  {/* Heart icon */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={20}
                        className="cursor-pointer "
                        onClick={() => removeFromWishListHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={20}
                        className="cursor-pointer "
                        onClick={() => addToWishListHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-sm h-11 flex items-center`}
                  onClick={() => AddToCartHandler(data._id)}
                >
                  <span className="text-white  flex items-center ">
                    Add to Cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductCardDetails;