export const SET_SURVEY_FILTERS = 'SET_SURVEY_FILTERS';

const initialState = {
    surveyId : '',
    data : []
}

export type FilterReducerType = {
    surveyId : string,
    data : any[]
}

export const surveyFilterDataReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_SURVEY_FILTERS:
            return action.data;
        default:
            return state;
    }
};

// ACTION

export const setSurveyFilterData = (data: FilterReducerType) => ({
    type: SET_SURVEY_FILTERS,
    data,
});