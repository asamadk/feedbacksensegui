import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
	reducer: {
		
	},
	devTools: true, // Enable Redux DevTools Extension
});

export default store;