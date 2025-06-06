import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counter";

// 创建根store组合子模块
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;