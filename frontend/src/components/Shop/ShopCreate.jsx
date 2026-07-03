import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styles from '../../styles/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import { server } from '../../server';
import { toast } from 'react-toastify';
import { RxAvatar } from 'react-icons/rx';

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Create preview
      setAvatarPreview(URL.createObjectURL(file));

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!avatar) {
      toast.error("Please upload a profile picture");
      return;
    }

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const shopData = {
      name,
      email,
      password,
      phoneNumber,
      address,
      zipCode,
      avatar, // base64 string
    };

    try {
      const res = await axios.post(`${server}/shop/shop-create`, shopData, config); // ✅ make sure server = "http://localhost:8000/api/v2"
      toast.success(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);
      setAvatarPreview(null);
      setPhoneNumber("");
      setAddress("");
      setZipCode("");
      navigate("/shop-login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Register as a Seller
        </h2>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-120'>
        <div className='bg-white py-8 px-4 shadow sm:rounded sm:px-10'>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className='block text-sm font-medium text-gray-700'>
                Shop Name
              </label>
              <div className='mt-1'>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className='block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <div className='mt-1'>
                <input
                  type="number"
                  name="phone-number"
                  id="phoneNumber"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <div className='mt-1'>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className='block text-sm font-medium text-gray-700'>
                Address
              </label>
              <div className='mt-1'>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label htmlFor="zipCode" className='block text-sm font-medium text-gray-700'>
                Zip Code
              </label>
              <div className='mt-1'>
                <input
                  type="number"
                  name="zip-code"
                  id="zipCode"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1 relative'>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                  {visible ? (
                    <AiOutlineEye
                      className='cursor-pointer text-gray-400 hover:text-gray-600'
                      size={20}
                      onClick={() => setVisible(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className='cursor-pointer text-gray-400 hover:text-gray-600'
                      size={20}
                      onClick={() => setVisible(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span>Upload a file</span>
                </label>
                <input
                  type="file"
                  name="avatar"
                  id="file-input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleInputChange}
                  className="sr-only"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-10 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Submit
              </button>
            </div>

            <div className={`${styles.normalFlex} w-full`}>
              <h4>Already have any account? </h4>
              <Link to="/shop-login" className='text-blue-600 pl-2'>
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ShopCreate