import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] md:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1675722132184-3984d48c8ecf?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Content goes here */}
      <div className={`${styles.section} w-[90%] md:w-[60%] `}>
        <h1
          className={`text-[35px] leading-[1.2] md:text-[60px] text-[#3d3a3a] font-semibold capitalize`}
        >
          Best Collection <br />
          home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-normal text-[#000000ba] ">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
          assumenda? Voluptas tempore non repudiandae eos magnam aliqua
          quides autem. Illum, laudantium temporibus soluta optio consequatur elit
          <br /> aliquam deserunt officia. Dolorum seque nulla provident.
        </p>
        <Link to="/products" className="inline" >
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#ffff] font-[Poppins] text-[18px] ">
              Shop Now
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Hero;