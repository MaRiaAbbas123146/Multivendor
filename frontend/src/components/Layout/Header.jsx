import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { categoriesData } from "../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import { backend_url } from "../../server";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.products);


  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term) {
      setSearchData(null);
      return;
    }

    const filtered =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );

    setSearchData(filtered);
  };

  return (
    <>
      {/* ================= DESKTOP TOP HEADER ================= */}
      <div className={`${styles.section} hidden md:block`}>
        <div className="flex items-center justify-between h-15 my-5">
          <Link to="/">
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt="Shopo Logo"
              className="w-37.5"
            />
          </Link>

          {/* Search */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product...."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-10 w-full px-2 border-2 rounded-md"
            />
            <AiOutlineSearch
              size={25}
              className="absolute right-2 top-2 cursor-pointer"
            />

            {searchData && searchData.length !== 0 && (
              <div className="absolute bg-white shadow-lg w-full p-4 z-50 max-h-75 overflow-y-auto">
                {/* FIX 2: key was referencing undefined `index` — changed to i._id */}
                {searchData.map((i) => (
                  <Link key={i._id} to={`/product/${i._id}`}>
                    <div className="flex items-center py-2 hover:bg-gray-100">
                      <img
                        src={`${backend_url}${i.images[0]}`}
                        alt=""
                        className="w-10 h-10 mr-2 object-cover"
                      />
                      <h1>{i.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className={styles.button}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-white flex items-center">
                {isSeller ? "Go to Shop" : "Become Seller"}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div
        className={`hidden md:flex items-center justify-between bg-[#3321c8] h-17.5 w-full transition ${active ? "fixed top-0 left-0 z-50 shadow-md" : ""
          }`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* Categories */}
          <div className="relative hidden lg:block">
            <BiMenuAltLeft size={25} className="absolute top-3 left-2" />
            <button
              className="h-12.5 w-62.5 pl-10 bg-white rounded-t-md"
              onClick={() => setDropDown(!dropDown)}
            >
              All Categories
            </button>
            <IoIosArrowDown
              size={18}
              className="absolute right-2 top-4 cursor-pointer"
            />
            {dropDown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>

          <Navbar active={activeHeading} />

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishList(true)}
            >
              <AiOutlineHeart size={25} color="white" />
              <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist && wishlist?.length || 0}
              </span>
            </div>

            <div
              className="relative cursor-pointer"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={25} color="white" />
              <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cart?.length || 0}
              </span>
            </div>

            {isAuthenticated ? (
              <Link to="/profile">
                <img
                  src={user?.avatar?.url || user?.avatar}
                  className="w-9 h-9 rounded-full object-cover"
                  alt={user?.name}
                />
              </Link>
            ) : (
              <Link to="/login">
                <CgProfile size={25} color="white" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent overlap */}
      {active && <div className="hidden md:block h-17.5" />}

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-15 bg-white z-50 shadow-md flex items-center justify-between px-4">
        <BiMenuAltLeft size={28} onClick={() => setOpen(true)} />

        <Link to="/">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="logo"
            className="w-30"
          />
        </Link>

        <div onClick={() => setOpenCart(true)} className="relative">
          <AiOutlineShoppingCart size={25} />
          <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {cart && cart?.length || 0}
          </span>
        </div>
      </div>

      {/* Cart & Wishlist */}
      {openCart && <Cart setOpenCart={setOpenCart} />}

      {openWishlist && <Wishlist setOpenWishList={setOpenWishList} />}

      {open && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg p-4">
          <RxCross1
            size={20}
            className="mb-4 cursor-pointer"
            onClick={() => setOpen(false)}
          />
          <Navbar active={activeHeading} />
        </div>
      )}
    </>
  );
};

export default Header;