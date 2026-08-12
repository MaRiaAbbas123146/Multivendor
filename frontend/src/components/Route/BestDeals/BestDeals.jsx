import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { useSelector } from "react-redux";

const BestDeals = () => {

  const { allProducts } = useSelector((state) => state.product?.allProducts);
  const [data, setData] = useState([]);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5)
    setData(firstFive)

  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-7 mb-12">
          {data.length > 0 && data.map((i, index) => (
            <ProductCard data={i} key={i._id || i.id || index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;