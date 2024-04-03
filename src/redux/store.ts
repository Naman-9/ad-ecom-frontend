import { configureStore } from '@reduxjs/toolkit';
import { userAPI } from './api/userAPI';
import { userReducer } from './reducer/userReducer';
import { productAPI } from './api/productApi';
import { cartReducer } from './reducer/cartReducer';
import { orderApi } from './api/orderApi';
import { dashboardApi } from './api/dashboardApi';

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [cartReducer.name]: cartReducer.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (defaultMid) => [
    ...defaultMid(),
    userAPI.middleware,
    productAPI.middleware,
    orderApi.middleware,
    dashboardApi.middleware,
  ],
});

// to get all state
export type RootState = ReturnType<typeof store.getState>;
