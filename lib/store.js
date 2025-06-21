import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "@/lib/features/Productslice";
import { productReducer } from "@/lib/features/Productslice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        product: productReducer,
    }
})

export default store;
