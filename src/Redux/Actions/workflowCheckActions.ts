import { UPDATE_WORKFLOW_CHECK } from "../Reducers/workflowCheckReducer";


export const updateWorkflowCheck = (data: any) => {
    return (dispatch: any) => {
        dispatch({ type: UPDATE_WORKFLOW_CHECK, payload: data });
    }
}