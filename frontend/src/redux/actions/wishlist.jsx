// add to wishlist
export const addToWishList = (data) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishList",
    payload: data,
  });

  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};

// remove from wishlist
export const removeFromWishList = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromWishList",
    payload: data._id,
  });
  localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  return data;
};
