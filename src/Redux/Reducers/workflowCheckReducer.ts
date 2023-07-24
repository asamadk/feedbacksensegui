export const UPDATE_WORKFLOW_CHECK = 'UPDATE_WORKFLOW_CHECK';

const initialState: {
    [key: string]: boolean;
} = {}

export const workflowCheckReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_WORKFLOW_CHECK:
            return { ...state,...action.payload };
        default:
            return state;
    }
}