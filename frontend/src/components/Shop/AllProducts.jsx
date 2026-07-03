import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getAllProductsShop } from '../../redux/actions/product';
import { Link } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { Button } from "@mui/material";
import Loader from '../Layout/Loader';
import { DataGrid } from '@mui/x-data-grid';


const AllProducts = () => {

  const { products, isLoading } = useSelector((state) => state.product)
  const { seller } = useSelector((state) => state.seller)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
    dispatch(getAllProductsShop(seller._id));
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5
    },
    {
      field: "sold",
      headerName: "Sold",
      type: "number",
      minWidth: 130,
      flex: 0.6
    },
    {
      field: "Preview",
      minWidth: 120,
      type: "number",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, '-').toLowerCase();
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        )
      }
    },
    {
      field: "Delete",
      minWidth: 120,
      type: 'number',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        )
      }
    }
  ];

  const rows = [];

  products && products.forEach((item) => {
    rows.push({
      id: item._id,
      name: item.name,
      price: "US$ " + item.discountPrice,
      stock: item.stock,
      sold: item.sold_out,
    })
  })

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div className='w-full mx-8 pt-1 mt-10 bg-white'>

            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />

          </div >
        )
      }
    </>
  )
}

export default AllProducts