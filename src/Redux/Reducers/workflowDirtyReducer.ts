export const UPDATE_WORKFLOW_DIRTY = 'UPDATE_WORKFLOW_DIRTY';

const initialState: {
    [key: string]: boolean;
} = {}

export const workflowDirtyReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_WORKFLOW_DIRTY:
            return { ...state,...action.payload };
        default:
            return state;
    }
}