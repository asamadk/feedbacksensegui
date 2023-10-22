export const FETCH_SURVEYS = 'FETCH_SURVEYS';
export const ADD_SURVEY = 'ADD_SURVEY';
export const SET_SURVEY = 'SET_SURVEY';

export const surveyReducer = (state = [], action: any) => {
    switch (action.type) {
        case FETCH_SURVEYS:
            return action.surveys;
        case ADD_SURVEY:
            return [...state, action.survey];
        case SET_SURVEY:
            return action.surveys;
        default:
            return state;
    }
};

// ACTION
export const fetchSurveys = (surveys: any[]) => ({
    type: FETCH_SURVEYS,
    surveys,
});

export const setSurvey = (surveys: any[]) => ({
    type: SET_SURVEY,
    surveys,
});

export const addSurvey = (survey: any) => ({
    type: ADD_SURVEY,
    survey,
});