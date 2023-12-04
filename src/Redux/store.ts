import { configureStore } from "@reduxjs/toolkit";
import { workflowDirtyReducer } from "./Reducers/workflowDirtyReducer";
import { currentWorkflowReducer } from "./Reducers/currentWorkflowReducer";
import { workflowCheckReducer } from "./Reducers/workflowCheckReducer";
import colorReducer from "./Reducers/backgroundModeReducer";
import userRoleReducer from "./Reducers/userRoleReducer";
import { surveyReducer } from "./Reducers/surveyReducer";
import { usersReducer } from "./Reducers/usersReducer";
import { folderReducer } from "./Reducers/folderReducer";
import { currentUserReducer } from "./Reducers/currentUserReducer";
import { subscriptionDetailReducer } from "./Reducers/subscriptionDetailReducer";
import { surveyConfigReducer } from "./Reducers/surveyConfigReducer";
import { templateReducer } from "./Reducers/templateReducer";
import { paymentHistoryReducer } from "./Reducers/paymentHistoryReducer";
import { customSettingsReducer } from "./Reducers/customSettingsReducer";

const store = configureStore({
	reducer: {
        workflowDirty: workflowDirtyReducer,
		workflowCheck : workflowCheckReducer,
		currentWorkflow: currentWorkflowReducer,
		colorReducer : colorReducer,
		userRole : userRoleReducer,
		surveys: surveyReducer,
		users : usersReducer,
		folders : folderReducer,
		currentUser : currentUserReducer,
		subscriptionDetail : subscriptionDetailReducer,
		surveyConfig : surveyConfigReducer,
		templates : templateReducer,
		paymentHistory : paymentHistoryReducer,
		settings : customSettingsReducer
	},
	devTools: true,
});

export default store;