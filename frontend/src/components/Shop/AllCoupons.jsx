import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AiOutlineDelete } from 'react-icons/ai';
import { Button } from "@mui/material";
import Loader from '../Layout/Loader';
import { DataGrid } from '@mui/x-data-grid';
import styles from '../../styles/styles.js'
import { toast } from "react-toastify";
import { server } from '../../server';
import { RxCross1 } from 'react-icons/rx'; // FIX 1: was used in JSX but never imported

const AllCoupouns = () => {

  const [open, setOpen] = useState(false)
  const [coupouns, setCoupouns] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [value, setValue] = useState(null)
  const [minAmount, setMinAmount] = useState(null)
  const [maxAmount, setMaxAmount] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState(null)
  const { seller } = useSelector((state) => state.seller)
  const { products } = useSelector((state) => state.products)

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true)
    axios.get(`${server}/coupoun/get-coupoun/${seller._id}`, {
      withCredentials: true
    }).then((res) => {
      setIsLoading(false)
      setCoupouns(res.data) // FIX 2: setCoupouns and setIsLoading were swapped into the catch block;
      // on success, data was never saved and state was never cleared
    }).catch((error) => {
      setIsLoading(false)
      console.log(error)   // FIX 3: `res` is not in scope inside catch — changed to `error`
    })
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    axios.delete(`${server}/coupoun/delete-coupoun/${id}`, { withCredentials: true })
      .then(() => {
        setCoupouns((prev) => prev.filter((c) => c._id !== id)) // FIX 4: was calling deleteProduct (a product action)
      })                                                         // for coupons, and reloading the page
      .catch((error) => toast.error(error.response?.data?.message))
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios.post(`${server}/coupoun/create-coupon-code`, {
      name,
      minAmount,
      maxAmount,
      selectedProducts,
      value,
      shop: seller
    }, { withCredentials: true }) // FIX 5: missing withCredentials on POST
      .then((res) => {
        toast.success("Coupoun Code created successfully")
        setOpen(false)
        setCoupouns((prev) => [...prev, res.data.coupoun]) // FIX 6: page reload replaced with state update
      }).catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const columns = [
    { field: "id", headerName: "Coupon ID", minWidth: 150, flex: 0.7 },
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
      field: "sold",
      headerName: "Sold",
      type: "number",
      minWidth: 130,
      flex: 0.6
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

  coupouns && coupouns.forEach((item) => {
    rows.push({
      id: item._id,
      name: item.name,
      price: item.value,
      sold: 10
    })
  })

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div className='w-full mx-8 pt-1 mt-10 bg-white'>
            <div className="w-full flex justify-end ">
              <div className={`${styles.button} w-max! h-11.25! px-3 rounded-[5px]! mr-3 mb-3`}
                onClick={() => setOpen(true)}
              >
                <span className='text-white'>Create Coupon</span> {/* FIX 7: button label was empty */}
              </div>
            </div>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />
            {
              open && (
                <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-20000 flex items-center justify-center"> {/* FIX 8: z-20000 is not valid Tailwind — use z-[20000] */}
                  <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4 overflow-y-auto"> {/* FIX 9: added overflow-y-auto so form is scrollable on small screens */}

                    <div className="w-full flex justify-end">
                      <RxCross1 size={30} className="cursor-pointer"
                        onClick={() => setOpen(false)}
                      />
                    </div>
                    <h5 className="text-[30px] font-Poppins text-center">Create Coupoun Code</h5>

                    <form onSubmit={handleSubmit} aria-required={true}>
                      <br />
                      <div>
                        <label className="pb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={name}
                          className="mt-2 appearance-none block w-full px-3 h-8.75 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your coupoun code name..."
                        />
                      </div>
                      <br />
                      <div>
                        <label className="pb-2">
                          Discount Percentage<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="value"
                          required
                          value={value}
                          className="mt-2 appearance-none block w-full px-3 h-8.75 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="Enter your coupoun code value..."
                        />
                      </div>
                      <br />
                      <div>
                        <label className="pb-2">
                          Minimum Amount
                        </label>
                        <input
                          type="text"
                          name="minAmount" // FIX 10: was "minAmouunt" (double u typo)
                          value={minAmount}
                          className="mt-2 appearance-none block w-full px-3 h-8.75 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={(e) => setMinAmount(e.target.value)}
                          placeholder="Enter your coupoun code minimum value..."
                        />
                      </div>
                      <br />
                      <div>
                        <label className="pb-2">
                          Maximum Amount
                        </label>
                        <input
                          type="text"
                          name="maxAmount"
                          value={maxAmount}
                          className="mt-2 appearance-none block w-full px-3 h-8.75 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          onChange={(e) => setMaxAmount(e.target.value)}
                          placeholder="Enter your coupoun code value..."
                        />
                      </div>
                      <br />
                      <div>
                        <label className="pb-2">
                          Selected Products
                        </label>
                        <select
                          className="w-full mt-2 border h-8.75 rounded-[5px]"
                          value={selectedProducts}
                          onChange={(e) => setSelectedProducts(e.target.value)}
                        >
                          <option value="Choose a category">Choose your selected products</option>
                          {products &&
                            products.map((i) => (
                              <option value={i.name} key={i.name}>
                                {i.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <br />
                      <div>
                        <input
                          type="submit"
                          value="Create"
                          className="mt-2 appearance-none block w-full px-3 h-8.75 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        // FIX 11: submit input had an onChange calling setMaxAmount — nonsensical and removed
                        />
                      </div>
                    </form>
                  </div>
                </div>
              )
            }
          </div >
        )
      }
    </>
  )
}

export default AllCoupouns