import { UPDATE_CURRENT_WORKFLOW } from "../Reducers/currentWorkflowReducer";

export const updateCurrentWorkflow = (data: any) => {
    return (dispatch: any) => {
        dispatch({ type: UPDATE_CURRENT_WORKFLOW, payload: data });
    }
}