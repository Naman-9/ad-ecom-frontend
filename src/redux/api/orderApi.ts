import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AllOrdersResponse, MessageResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from '../../types/api-types';

export const orderApi = createApi({
  reducerPath: 'orderPath',
  tagTypes: ["orders"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  endpoints: (builder) => ({
    //                         <ResultType, res Type>
    newOrder: builder.mutation<MessageResponse, NewOrderRequest> ({
      query: (order) => ({ url: 'new', method: 'POST', body: order }),
      invalidatesTags: ["orders"],
    }),
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest> ({
      query: ({userId, orderId}) => ({ url: `${orderId}?id=${userId}`, method: 'PUT'}),
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest> ({
      query: (order) => ({ url: 'new', method: 'Delete', body: order }),
      invalidatesTags: ["orders"],
    }),
    myOrders: builder.query<AllOrdersResponse, string> ({
      query: (id) => (`my?id=${id}`),
      providesTags: ["orders"],
    }),
    allOrders: builder.query<AllOrdersResponse, string> ({
      query: (id) => (`all?id=${id}`),
      providesTags: ["orders"],
    }),
    orderDetails: builder.query<OrderDetailsResponse, string> ({
      query: (id) => (id),
      providesTags: ["orders"],
    }),
  }),
});

export const { 
    useNewOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useMyOrdersQuery,
    useAllOrdersQuery,
    useOrderDetailsQuery,
 } = orderApi;
