export const SET_TEMPLATES = 'SET_TEMPLATES';

export const templateReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_TEMPLATES:
            return action.templates;
        default:
            return state;
    }
};

// ACTION

export const setTemplatesRedux = (templates: any[]) => ({
    type: SET_TEMPLATES,
    templates,
});