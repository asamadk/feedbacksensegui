export const BASE_URL = 'http://localhost:3001';

export const getFolders = () :string => {
    return BASE_URL + '/api/v1/folders';
}

export const getSubscriptionDetail = (): string => {
    return BASE_URL + '/api/v1/subscription/detail';
}

export const getSurveyList = () :string => {
    return BASE_URL + '/api/v1/surveys/list';
}

export const getUserList = () : string => {
    return BASE_URL + '/api/v1/users/list'
}

export const getSurveyTypes = () :string => {
    return BASE_URL + '/api/v1/survey/type/list';
}

export const getSurveyDetails = (surveyId : string | undefined) : string => {
    return BASE_URL + '/api/v1/survey/details/'+surveyId
}