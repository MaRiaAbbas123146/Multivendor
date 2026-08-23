import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("loadSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("loadSellerSuccess", (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.seller = action.payload;
    })
    .addCase("loadSellerFail", (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.seller = null;
      state.error = action.payload;
    })

    // get all sellers ---admin
    .addCase("getAllSellersRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
    })
    .addCase("getAllSellersFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});