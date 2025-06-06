import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 异步的 thunk 操作
export const incrementAsync = createAsyncThunk(
  "counter/incrementAsync",
  async (amount, thunkAPI) => {
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve(amount), 1000)
    );
    return response;
  }
);

const counterStore = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    // 修改数据的同步方法
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(incrementAsync.fulfilled, (state, action) => {
      state.count += action.payload;
    });
  },
});

export const { increment, decrement, incrementByAmount } = counterStore.actions;

export default counterStore.reducer;
