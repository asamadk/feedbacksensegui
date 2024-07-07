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
import { surveyFilterDataReducer } from "./Reducers/surveyFilterReducer";
import { sideBarReducer } from "./Reducers/sidebarPosReducer";
import { companyReducer } from "./Reducers/companyReducer";
import { peopleReducer } from "./Reducers/peopleOptionReducer";
import { journeyReducer } from "./Reducers/journeyStageReducer";
import { journeySubStageReducer } from "./Reducers/journeySubStageReducer";
import { riskStageReducer } from "./Reducers/riskStageReducer";
import { loadingReducer } from "./Reducers/LoadingReducer";
import { notificationReducer } from "./Reducers/NotificationReducer";

const store = configureStore({
	reducer: {
		workflowDirty: workflowDirtyReducer,
		workflowCheck: workflowCheckReducer,
		currentWorkflow: currentWorkflowReducer,
		colorReducer: colorReducer,
		userRole: userRoleReducer,
		surveys: surveyReducer,
		users: usersReducer,
		folders: folderReducer,
		currentUser: currentUserReducer,
		subscriptionDetail: subscriptionDetailReducer,
		surveyConfig: surveyConfigReducer,
		templates: templateReducer,
		paymentHistory: paymentHistoryReducer,
		settings: customSettingsReducer,
		surveyFilterData: surveyFilterDataReducer,
		sideBarReducer: sideBarReducer,
		companies: companyReducer,
		people : peopleReducer,
		stage: journeyReducer,
		subStage : journeySubStageReducer,
		riskStage : riskStageReducer,
		loading: loadingReducer,
        notification: notificationReducer,
	},
	devTools: true,
});

export default store;