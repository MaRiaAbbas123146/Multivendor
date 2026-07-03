import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
// import { useDispatch} from "react-redux";
import { backend_url } from "../../../server";
import styles from "../../../styles/styles";
import ProductCardDetails from "../ProductDetailsCard/ProductDetailsCard";
import { addToWishList, removeFromWishList } from "../../../redux/actions/wishlist";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist)
  const { cart } = useSelector((state) => state.cart)
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();


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

  const AddToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart");
    } else {
      if (data.stock < c1) {
        toast.error("Not enough stock available");
      } else {
        const cartItem = {
          ...data,
          qty: 1,
        };
        dispatch(addToCart(cartItem));
        toast.success("Item added to cart successfully");
      }
    }
  };
  // 

  // // Helper function to get image URL
  // const getImageUrl = (image) => {
  //   if (!image) return "/placeholder.png";

  //   // If it's an object with url property (Cloudinary format)
  //   if (typeof image === "object" && image.url) {
  //     return image.url;
  //   }

  //   // If it's already a URL string
  //   if (typeof image === "string" && image.startsWith("http")) {
  //     return image;
  //   }

  //   // Fallback for old format
  //   return image;
  // };

  return (
    <>
      <div className="w-full h-92.5 bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link
          to={`/product/${data._id}`}
        >
          <img
            src={`${backend_url}${data.images && data.images[0]}`}
            className="w-full h-42.5 object-contain rounded-t-lg"
          />
        </Link>

        {/* Shop name - make it safely accessible */}
        {data?.shop && (
          <Link to="/">
            <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
          </Link>
        )}

        <Link
          to={`/product/${data._id}`}
        >
          <h4 className="pb-3 font-medium">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.discount_price}$
              </h5>
              {data.originalPrice && data.originalPrice !== data.discount_price && (
                <h4 className={`${styles.price}`}>
                  {data.originalPrice}$
                </h4>
              )}
            </div>
            <span className="font-normal text-[17px] text-[#68d284]">
              {data?.total_sell !== undefined ? `(${data.total_sell} sold)` : "(0 sold)"}
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishListHandler(data)}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(true)}
              color="#333"
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => AddToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductCardDetails setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;