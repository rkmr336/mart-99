import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
  cart: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex(item => item.id === action.payload.id);
      let newCart = [...state.cart];
      
      if (existingIndex >= 0) {
        newCart[existingIndex].quantity += action.payload.quantity || 1;
      } else {
        newCart.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      
      return {
        ...state,
        cart: newCart,
        totalItems: newCart.reduce((acc, curr) => acc + curr.quantity, 0),
        totalAmount: newCart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
      };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        cart: newCart,
        totalItems: newCart.reduce((acc, curr) => acc + curr.quantity, 0),
        totalAmount: newCart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
      };
    }
    case 'UPDATE_QUANTITY': {
      const newCart = state.cart.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: Math.max(1, action.payload.quantity) };
        }
        return item;
      });
      return {
        ...state,
        cart: newCart,
        totalItems: newCart.reduce((acc, curr) => acc + curr.quantity, 0),
        totalAmount: newCart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)
      };
    }
    case 'CLEAR_CART': {
      return initialState;
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
