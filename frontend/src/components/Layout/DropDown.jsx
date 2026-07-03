import React from 'react'
import { useNavigate } from 'react-router-dom'
import { categoriesData } from '../../static/data';
import styles from '../../styles/styles';

const DropDown = ({ categories, setDropDown }) => {

  const navigate = useNavigate();
  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  }

  return (
    <div className='pb-4 w-67.5 bg-white absolute z-30 rounded-b-md shadow-sm font-sans'>
      {
        categoriesData && categoriesData.map((i, index) => (
          <div
            key={index}
            className={`${styles.normalFlex} p-3 hover:bg-gray-100 cursor-pointer gap-3`}
            onClick={() => submitHandle(i)}
          >
            <img
              src={i.image_Url}
              alt={i.title}
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                userSelect: "none"
              }}
            />
            <h3 className='m-3 cursor-pointer select-none'>{i.title}</h3>
          </div>
        ))
      }
    </div>
  )
}

export default DropDown