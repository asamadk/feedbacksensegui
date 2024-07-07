export const SET_SUB_JOURNEY = 'SET_SUB_JOURNEY';

export const journeySubStageReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_SUB_JOURNEY:
            return action.subStage;
        default:
            return state;
    }
};

// ACTION

export const setGlobalSubStages = (subStage: any[]) => ({
    type: SET_SUB_JOURNEY,
    subStage,
});