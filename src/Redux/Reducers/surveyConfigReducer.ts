export const FETCH_SURVEY_CONFIG = 'FETCH_SURVEY_CONFIG';
export const SET_SURVEY_CONFIG = 'SET_SURVEY_CONFIG';

export const surveyConfigReducer = (state = null, action: any) => {
    switch (action.type) {
        case FETCH_SURVEY_CONFIG:
            return action.config;
        case SET_SURVEY_CONFIG:
            return action.config;
        default:
            return state;
    }
};

// ACTION
export const fetchSurveyConfigRedux = (config: any) => ({
    type: FETCH_SURVEY_CONFIG,
    config,
});

export const setSurveyConfigRedux = (config: any) => ({
    type: SET_SURVEY_CONFIG,
    config,
});
