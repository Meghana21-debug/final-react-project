import { createSlice } from "@reduxjs/toolkit";

let saved = [];
try { saved = JSON.parse(localStorage.getItem("tripwise-wishlist")) || []; } catch { saved = []; }

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: saved },
  reducers: {
    toggleWishlist(state, action) {
      const exists = state.items.some((i) => i.code === action.payload.code);
      state.items = exists
        ? state.items.filter((i) => i.code !== action.payload.code)
        : [...state.items, action.payload];
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;