import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user.jsx";
import { productReducer } from "./reducers/product.jsx";
import { cartReducer } from "./reducers/cart.jsx";
import { wishlistReducer } from "./reducers/wishlist.jsx";
import { sellerReducer } from "./reducers/seller.jsx"
import { eventReducer } from "./reducers/event.jsx"
import { orderReducer } from "./reducers/order.jsx";



const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    seller: sellerReducer,
    events: eventReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  }
});
export default store;