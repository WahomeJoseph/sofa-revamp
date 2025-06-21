import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely get data from localStorage
const getLocalStorageData = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }
  return defaultValue
};

// PRODUCT SLICE
export const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: getLocalStorageData('product', []),
    wishlist: getLocalStorageData('wishlist', []),
    userWishlists: getLocalStorageData('userWishlists', {}),
  },
  reducers: {
    // Product-specific reducers
    addToWishList: (state, action) => {
      const { product, userId } = action.payload;
      if (!product || !product._id) {
        console.error('Invalid product data:', product);
        return state;
      }

      if (userId) {
        if (!state.userWishlists[userId]) {
          state.userWishlists[userId] = [];
          localStorage.setItem('userWishlists', JSON.stringify(state.userWishlists));
        }

        const exists = state.userWishlists[userId].some(w => w._id === product._id);
        if (exists) {
          state.userWishlists[userId] = state.userWishlists[userId].filter(
            w => w._id !== product._id);
        } else {
          state.userWishlists[userId].push(product);
        }

        localStorage.setItem('userWishlists', JSON.stringify(state.userWishlists));
      } else {

        const itemExists = state.wishlist.some(w => w._id === product._id);
        if (itemExists) {
          state.wishlist = state.wishlist.filter(w => w._id !== product._id);
        } else {
          state.wishlist.push(product);
        }

        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },
    removeFromWishList: (state, action) => {
      const { userId, product } = action.payload;
      if (!product || !product._id) {
        console.error('Invalid product data:', product);
        return;
      }

      if (userId) {
        if (state.userWishlists[userId]) {
          state.userWishlists[userId] = state.userWishlists[userId].filter(
            item => item._id !== product._id
          );
        }
      } else {
        state.wishlist = state.wishlist.filter(item => item._id !== product._id);
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },
    setUserWishlist: (state, action) => {
      const { userId, products } = action.payload;
      state.userWishlists[userId] = products;
    },
    mergeGuestWishlist: (state, action) => {
      const { userId } = action.payload;
      if (!state.userWishlists[userId]) {
        state.userWishlists[userId] = [];
      }

      state.wishlist.forEach(product => {
        if (!state.userWishlists[userId].some(w => w._id === product._id)) {
          state.userWishlists[userId].push(product);
        }
      });

      state.wishlist = [];
      localStorage.removeItem('wishlist');
      localStorage.setItem('userWishlists', JSON.stringify(state.userWishlists));
    },
  },
});

// CART SLICE
export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getLocalStorageData('cart', []),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        if (updatedItems[existingIndex].quantity < updatedItems[existingIndex].stockQuantity) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + 1
          };
          state.items = updatedItems;
        }
      } else if (product.inStock && product.stockQuantity > 0) {
        state.items = [
          ...state.items,
          {
            id: product.id, // Ensure consistent ID usage
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image, // Changed from images to image
            stockQuantity: product.stockQuantity,
            inStock: product.inStock,
            quantity: 1,
            addedAt: new Date().toISOString()
            // ...product,
            // quantity: 1,
            // addedAt: new Date().toISOString()
          }
        ];
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);

      if (itemIndex >= 0) {
        const updatedItems = [...state.items];
        const item = updatedItems[itemIndex];

        updatedItems[itemIndex] = {
          ...item,
          quantity: Math.min(Math.max(1, quantity), item.stockQuantity)
        };

        state.items = updatedItems;
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cart', JSON.stringify([]));
    }
  }
});

// Export actions from both slices
export const {
  addToWishList,
  removeFromWishList,
  setUserWishlist,
  mergeGuestWishlist
} = productSlice.actions;

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

// Selectors
export const selectIsWishlisted = (state, productId, userId) => {
  if (!productId) return false;
  if (userId) {
    return state.product?.userWishlists?.[userId]?.some(
      item => item?._id === productId) || false;
  }
  return state.product?.wishlist?.some(
    item => item?._id === productId
  ) || false;
};

export const selectUserWishlist = (state, userId) => {
  if (userId) {
    return state.product?.userWishlists?.[userId] || [];
  }
  return state.product?.wishlist || [];
};

export const selectCartItems = state => state.cart.items;
export const selectCartTotal = state =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemCount = state =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

// Export reducers
export const productReducer = productSlice.reducer;
export const cartReducer = cartSlice.reducer;
