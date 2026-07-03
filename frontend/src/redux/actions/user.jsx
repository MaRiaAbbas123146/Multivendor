import axios from "axios";
import { server } from "../../server";
import { Country } from "country-state-city";


//load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "loadUserRequest" });

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });

    dispatch({
      type: "loadUserSuccess",
      payload: data.user
    });
  } catch (error) {
    dispatch({
      type: "loadUserFail",
      payload: error.response?.data?.message || error.message || "An error occurred"
    });
  }
};

//load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "loadSellerRequest" });

    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });

    dispatch({
      type: "loadSellerSuccess",
      payload: data.user
    });
  } catch (error) {
    dispatch({
      type: "loadSellerFail",
      payload: error.response?.data?.message || error.message || "An error occurred"
    });
  }
};

//user update information
export const updateUserInformation = (email, password, phoneNumber, name) => async (dispatch, action) => {
  try {
    dispatch({
      type: "updateUserInfoRequest"
    });
    const { data } = await axios.put(`${server}/user/update-user-info`, {
      email,
      password,

      phoneNumber, name
    }, {
      withCredentials: true
    })

    dispatch({
      type: "updateUserInfoSuccess",
      payload: data.user,
    })
  } catch (error) {
    dispatch({
      type: "updateUserInfoFailed",
      payload: error.response.data.message
    })
  }
}

/// updateUserAddress — was missing async (dispatch) => and axios
export const updateUserAddress = (country, city, address1, address2, zipCode, addressType) => async (dispatch) => {
  try {
    dispatch({ type: "updateUserAddressRequest" });

    const { data } = await axios.put(`${server}/user/update-user-addresses`, {
      country, city, address1, address2, zipCode, addressType
    }, { withCredentials: true });

    dispatch({
      type: "updateUserAddressSuccess",
      payload: {
        updateAddressSuccessMessage: "User Address updated successfully",
        user: data.user
      }
    });
  } catch (error) {
    dispatch({
      type: "updateUserAddressFailed",
      payload: error.response.data.message
    });
  }
};



//delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {

    dispatch({
      type: "deleteUserAddressRequest",
    })

    // deleteUserAddress — "deleete" typo + :${id} → /${id}
    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, { withCredentials: true });

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Adress deleted successfully",
        user: data.user
      }
    })

  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};