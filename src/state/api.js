import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().global.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  reducerPath: "menuApi",
  tagTypes: ["User", "Pizzas", "Drinks", "Sides", "Salads", "Customers"],
  endpoints: (build) => ({
    // User Endpoint
    getUser: build.query({
      query: (id) => `/api/user/getUser/${id}`,
      providesTags: ["User"],
    }),

    // User Endpoints
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/api/user/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),

    updateUser: build.mutation({
      query: ({ id, body }) => ({
        url: `/api/user/updateUser/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    createUser: build.mutation({
      query: (body) => ({
        url: "/api/user/createUser",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customers"],
    }),

    // Pizza Endpoints
    getPizzas: build.query({
      query: () => "/api/pizza/getAllPizza",
      providesTags: ["Pizzas"],
    }),
    deletePizza: build.mutation({
      query: (id) => ({
        url: `/api/pizza/deletePizza/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pizzas"],
    }),
    createPizza: build.mutation({
      query: (body) => ({
        url: "/api/pizza/createPizza",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Pizzas"],
    }),
    updatePizza: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/pizza/updatePizza/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Pizzas"],
    }),

    // Drink Endpoints
    getDrinks: build.query({
      query: () => "/api/drink/getAllDrink",
      providesTags: ["Drinks"],
    }),
    deleteDrink: build.mutation({
      query: (id) => ({
        url: `/api/drink/deleteDrink/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Drinks"],
    }),
    createDrink: build.mutation({
      query: (body) => ({
        url: "/api/drink/createDrink",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Drinks"],
    }),
    updateDrink: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/drink/updateDrink/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Drinks"],
    }),

    // Side Endpoints
    getSides: build.query({
      query: () => "/api/side/getAllSide",
      providesTags: ["Sides"],
    }),
    deleteSide: build.mutation({
      query: (id) => ({
        url: `/api/side/deleteSide/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sides"],
    }),
    createSide: build.mutation({
      query: (body) => ({
        url: "/api/side/createSide",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sides"],
    }),
    updateSide: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/side/updateSide/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Sides"],
    }),

    // Salad Endpoints
    getSalads: build.query({
      query: () => "/api/salad/getAllSalad",
      providesTags: ["Salads"],
    }),
    deleteSalad: build.mutation({
      query: (id) => ({
        url: `/api/salad/deleteSalad/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Salads"],
    }),
    createSalad: build.mutation({
      query: (body) => ({
        url: "/api/salad/createSalad",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Salads"],
    }),
    updateSalad: build.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/salad/updateSalad/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Salads"],
    }),
    getCustomers: build.query({
      query: () => "/api/user/getAllUser",
      providesTags: ["Customers"],
    }),

    // Payments Endpoint
    getPayments: build.query({
      query: ({ page, pageSize, sort, search }) => {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
          ...(sort && { sort: JSON.stringify(sort) }),
          ...(search && { search }),
        }).toString();
        return `/api/payment/getAllPayments?${queryParams}`;
      },
      providesTags: ["Payments"],
    }),

    // Stats Endpoints
    getAverageOrderValue: build.query({
      query: ({ startDate, endDate }) => {
        const queryParams = new URLSearchParams({
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        }).toString();
        return `/api/stats/average-order-value?${queryParams}`;
      },
      providesTags: ["Stats"],
    }),
    getOrderCountByStatus: build.query({
      query: ({ startDate, endDate }) => {
        const queryParams = new URLSearchParams({
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        }).toString();
        return `/api/stats/order-count-by-status?${queryParams}`;
      },
      providesTags: ["Stats"],
    }),
    getTopActiveUsers: build.query({
      query: ({ startDate, endDate, metric }) => {
        const queryParams = new URLSearchParams({
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(metric && { metric }),
        }).toString();
        return `/api/stats/top-active-users?${queryParams}`;
      },
      providesTags: ["Stats"],
    }),
    getRevenueByDay: build.query({
      query: ({ startDate, endDate }) => {
        const queryParams = new URLSearchParams({
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        }).toString();
        return `/api/stats/revenue-by-day?${queryParams}`;
      },
      providesTags: ["Stats"],
    }),
    getTotalRevenue: build.query({
      query: ({ startDate, endDate }) => {
        const queryParams = new URLSearchParams({
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        }).toString();
        return `/api/stats/total-revenue?${queryParams}`;
      },
      providesTags: ["Stats"],
    }),
    getTopSellingProducts: build.query({
      query: ({ startDate, endDate, limit }) => {
        const queryParams = new URLSearchParams({
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          ...(limit && { limit }),
        }).toString();
        return `/api/stats/top-selling-products?${queryParams}`;
      },
      providesTags: ["Stats"],
    }),

    // Chat Endpoint
    sendChatMessage: build.mutation({
      query: (prompt) => ({
        url: "/chat",
        method: "POST",
        body: { prompt },
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useGetPizzasQuery,
  useDeletePizzaMutation,
  useCreatePizzaMutation,
  useUpdatePizzaMutation,
  useGetDrinksQuery,
  useDeleteDrinkMutation,
  useCreateDrinkMutation,
  useUpdateDrinkMutation,
  useGetSidesQuery,
  useDeleteSideMutation,
  useCreateSideMutation,
  useUpdateSideMutation,
  useGetSaladsQuery,
  useDeleteSaladMutation,
  useCreateSaladMutation,
  useUpdateSaladMutation,
  useGetCustomersQuery,
  useGetPaymentsQuery,
  useGetAverageOrderValueQuery,
  useGetOrderCountByStatusQuery,
  useGetTopActiveUsersQuery,
  useGetRevenueByDayQuery,
  useGetTotalRevenueQuery,
  useGetTopSellingProductsQuery,
  useSendChatMessageMutation,
} = api;