import {create} from 'zustand';
import { getProfile, logout as apiLogout, sendOtp, verifyOtp } from '../api/auth';
import { getCart as apiGetCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, mergeCart as apiMergeCart } from '../api/cart';
import { getProductById } from '../api/products';
import { getAllLocalCartItems, addToLocalCart, setLocalCart, clearLocalCart } from '../utils/localCart';
import { getCategories as apiGetCategories } from '../api/categories';
import { getProductsByCategory as apiGetProductsByCategory } from '../api/products';
import debounce from 'lodash.debounce';

const useStore = create((set, get) => ({
  // Auth slice
  user: null,
  isLoggedIn: false,
  async fetchProfile() {
    try {
      const res = await getProfile();
      set({ user: res.data.user, isLoggedIn: true });
    } catch {
      set({ user: null, isLoggedIn: false });
    }
  },
  async logout() {
    await apiLogout();
    set({ user: null, isLoggedIn: false });
  },
  async loginWithOtp(phone, otp) {
    try {
      const data = await verifyOtp(phone, otp);
      set({ user: data.user, isLoggedIn: true });
      // Merge guest cart if it exists
      const guestItems = getAllLocalCartItems();
      if (guestItems && guestItems.length > 0) {
        try {
          await apiMergeCart(guestItems);
          clearLocalCart();
        } catch (mergeError) {
          console.error('Failed to merge cart:', mergeError);
          // Continue with login even if merge fails
        }
      }
      // Fetch the updated backend cart
      await get().fetchCart();
      return data;
    } catch (err) {
      set({ user: null, isLoggedIn: false });
      throw err;
    }
  },

  // Cart slice
  items: [],
  hydratedItems: [],
  cartLoading: false,
  cartError: null,
  async fetchCart() {
    set({ cartLoading: true, cartError: null });
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      try {
        const data = await apiGetCart();
        // The API returns the cart items directly, not wrapped in an 'items' property
        const cartItems = Array.isArray(data) ? data : [];
        set({ items: cartItems, hydratedItems: cartItems, cartLoading: false });
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        set({ items: [], hydratedItems: [], cartError: 'Failed to load cart', cartLoading: false });
      }
    } else {
      try {
        const localItems = getAllLocalCartItems();
        set({ items: localItems });
        if (localItems.length === 0) {
          set({ hydratedItems: [], cartLoading: false });
          return;
        }
        // Hydrate guest cart
        const hydrated = await Promise.all(localItems.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            if (!product || !Array.isArray(product.variants)) {
              return {
                ...item,
                name: 'Unavailable',
                imageUrl: '/vite.svg',
                price: 0,
                originalPrice: 0,
                variantLabel: '',
              };
            }
            const variant = product.variants[item.variantIndex] || {};
            return {
              ...item,
              name: product.name || 'Unavailable',
              imageUrl: product.images?.[0] || product.imageUrl || '/vite.svg',
              price: typeof variant.discountedPrice === 'number' ? variant.discountedPrice : (typeof variant.price === 'number' ? variant.price : 0),
              originalPrice: typeof variant.price === 'number' ? variant.price : 0,
              variantLabel: variant.quantityLabel || '',
            };
          } catch {
            return {
              ...item,
              name: 'Unavailable',
              imageUrl: '/vite.svg',
              price: 0,
              originalPrice: 0,
              variantLabel: '',
            };
          }
        }));
        set({ hydratedItems: hydrated, cartLoading: false });
      } catch {
        set({ items: [], hydratedItems: [], cartError: 'Failed to load local cart', cartLoading: false });
      }
    }
  },
  async addToCart(item) {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      // Optimistic UI: update cart immediately
      const prevCart = get().items;
      let found = false;
      const newCart = prevCart.map(cartItem => {
        if (cartItem.productId === item.productId && cartItem.variantIndex === item.variantIndex) {
          found = true;
          return { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) };
        }
        return cartItem;
      });
      const optimisticCart = found ? newCart : [...prevCart, { ...item }];
      set({ items: optimisticCart, hydratedItems: optimisticCart });
      try {
        const response = await apiAddToCart(item);
        if (response && response.cart) {
          set({ items: [...response.cart], hydratedItems: [...response.cart] });
        } else {
          await get().fetchCart();
        }
      } catch (error) {
        set({ items: prevCart, hydratedItems: prevCart });
        console.error('Failed to add to cart:', error);
        toast.error('Failed to add to cart. Please try again.');
      }
    } else {
      addToLocalCart(item);
      await get().fetchCart();
    }
  },

  // --- Optimistic UI helpers ---
  _debouncedUpdateCartItem: debounce(async (productId, variantIndex, quantity, prevCart) => {
    try {
      const response = await apiUpdateCartItem(productId, variantIndex, quantity);
      if (response && response.cart) {
        set({ items: [...response.cart], hydratedItems: [...response.cart] });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      set({ items: prevCart, hydratedItems: prevCart });
      toast.error('Failed to update cart. Please try again.');
    }
  }, 300),

  _debouncedRemoveFromCart: debounce(async (productId, variantIndex, prevCart) => {
    try {
      const response = await apiRemoveFromCart(productId, variantIndex);
      if (response && response.cart) {
        set({ items: [...response.cart], hydratedItems: [...response.cart] });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      set({ items: prevCart, hydratedItems: prevCart });
      toast.error('Failed to remove from cart. Please try again.');
    }
  }, 300),

  updateCartItem(productId, variantIndex, quantity) {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      // Optimistic UI: update cart immediately
      const prevCart = get().items;
      const newCart = prevCart.map(item =>
        item.productId === productId && item.variantIndex === variantIndex
          ? { ...item, quantity }
          : item
      );
      set({ items: newCart, hydratedItems: newCart });
      // Debounced API call
      get()._debouncedUpdateCartItem(productId, variantIndex, quantity, prevCart);
    } else {
      const items = getAllLocalCartItems().map((item) =>
        item.productId === productId && item.variantIndex === variantIndex
          ? { ...item, quantity }
          : item
      ).filter((item) => item.quantity > 0);
      setLocalCart(items);
      get().fetchCart();
    }
  },

  removeFromCart(productId, variantIndex) {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      // Optimistic UI: update cart immediately
      const prevCart = get().items;
      const newCart = prevCart.filter(item => !(item.productId === productId && item.variantIndex === variantIndex));
      set({ items: newCart, hydratedItems: newCart });
      // Debounced API call
      get()._debouncedRemoveFromCart(productId, variantIndex, prevCart);
    } else {
      const items = getAllLocalCartItems().filter(
        (item) => !(item.productId === productId && item.variantIndex === variantIndex)
      );
      setLocalCart(items);
      get().fetchCart();
    }
  },
  async clearCart() {
    const { isLoggedIn } = get();
    if (isLoggedIn) {
      await apiClearCart();
      await get().fetchCart();
    } else {
      clearLocalCart();
      await get().fetchCart();
    }
  },

  // Product/category slice
  categories: [],
  categoryProducts: {},
  loadingCategories: false,
  loadingProducts: false,
  productError: null,
  async fetchCategories() {
    set({ loadingCategories: true, productError: null });
    try {
      const data = await apiGetCategories();
      set({ categories: Array.isArray(data) ? data : [], loadingCategories: false });
    } catch (err) {
      set({ categories: [], loadingCategories: false, productError: 'Failed to load categories' });
    }
  },
  async fetchProductsForCategories() {
    const { categories } = get();
    if (!categories || categories.length === 0) {
      set({ loadingProducts: false });
      return;
    }
    set({ loadingProducts: true });
    const productsMap = {};
    await Promise.all(
      categories.map(async (cat) => {
        try {
          const data = await apiGetProductsByCategory(cat.id);
          productsMap[cat.name] = data;
        } catch {
          productsMap[cat.name] = [];
        }
      })
    );
    set({ categoryProducts: productsMap, loadingProducts: false });
  },
  setProductError(error) {
    set({ productError: error });
  },
}));

export default useStore; 
