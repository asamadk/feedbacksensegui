export const UPDATE_CURRENT_WORKFLOW = 'UPDATE_CURRENT_WORKFLOW';

const initialState :string = '';

export const currentWorkflowReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_CURRENT_WORKFLOW:
            return action.payload;
        default:
            return state;
    }
}