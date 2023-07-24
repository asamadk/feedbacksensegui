import { UPDATE_WORKFLOW_DIRTY } from "../Reducers/workflowDirtyReducer";

export const updateWorkflowDirty = (data: any) => {
    return (dispatch: any) => {
        dispatch({ type: UPDATE_WORKFLOW_DIRTY, payload: data });
    }
}