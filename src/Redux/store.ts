import { configureStore } from "@reduxjs/toolkit";
import { workflowDirtyReducer } from "./Reducers/workflowDirtyReducer";
import { currentWorkflowReducer } from "./Reducers/currentWorkflowReducer";
import { workflowCheckReducer } from "./Reducers/workflowCheckReducer";
const store = configureStore({
	reducer: {
        workflowDirty: workflowDirtyReducer,
		workflowCheck : workflowCheckReducer,
		currentWorkflow: currentWorkflowReducer,
	},
	devTools: true, // Enable Redux DevTools Extension
});

export default store;