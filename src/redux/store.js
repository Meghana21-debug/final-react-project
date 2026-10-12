import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./wishlistSlice";

const store = configureStore({ reducer: { wishlist: wishlistReducer } });

store.subscribe(() => {
  localStorage.setItem("tripwise-wishlist", JSON.stringify(store.getState().wishlist.items));
});

export default store;