import { configureStore } from "@reduxjs/toolkit";
import { workflowDirtyReducer } from "./Reducers/workflowDirtyReducer";
import { currentWorkflowReducer } from "./Reducers/currentWorkflowReducer";
import { workflowCheckReducer } from "./Reducers/workflowCheckReducer";
import colorReducer from "./Reducers/backgroundModeReducer";
import userRoleReducer from "./Reducers/userRoleReducer";
const store = configureStore({
	reducer: {
        workflowDirty: workflowDirtyReducer,
		workflowCheck : workflowCheckReducer,
		currentWorkflow: currentWorkflowReducer,
		colorReducer : colorReducer,
		userRole : userRoleReducer
	},
	devTools: true, // Enable Redux DevTools Extension
});

export default store;