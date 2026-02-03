import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../lib/orderService";

/* ---------- FETCH ALL ORDERS ---------- */

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    if (state.orders.orders.length > 0) {
      // Already loaded, return existing
      return state.orders.orders;
    }
    try {
      return await orderService.getAllOrders();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- UPDATE ORDER STATUS ---------- */

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      return await orderService.updateOrderStatus(orderId, status);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---------- SLICE ---------- */

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH ALL ORDERS */
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE ORDER STATUS */
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex((order) => order.$id === updatedOrder.$id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
