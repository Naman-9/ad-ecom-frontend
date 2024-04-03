import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AllProductsResponse,
  DeleteProductResponse,
  MessageResponse,
  NewProductResponse,
  ProductResponse,
  SearchQuery,
  SearchQueryRequest,
  UpdateProductResponse,
  categoriesResponse,
  searchProductsResponse,
} from '../../types/api-types';

export const productAPI = createApi({
  reducerPath: 'productApi', // name
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  // to invalidate cache
  tagTypes: ['product'],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => 'latest',
      providesTags: ['product'], // refresh
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ['product'],
    }),
    categories: builder.query<categoriesResponse, string>({
      query: () => `categories`,
      providesTags: ['product'],
    }),
    searchProducts: builder.query<searchProductsResponse, SearchQueryRequest>({
      query: ({ price, search, category, page, sort }) => {
        let base = `all?search${search}&page=${page}`;

        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;

        return base;
      },
      providesTags: ['product'],
    }),
    productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ['product'], // refresh
    }),
    newProduct: builder.mutation<MessageResponse, NewProductResponse>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['product'],
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductResponse>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['product'],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductResponse>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['product'],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
