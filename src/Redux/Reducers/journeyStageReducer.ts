export const SET_JOURNEY = 'SET_JOURNEY';

export const journeyReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_JOURNEY:
            return action.stages;
        default:
            return state;
    }
};

// ACTION

export const setGlobalStages = (stages: any[]) => ({
    type: SET_JOURNEY,
    stages,
});