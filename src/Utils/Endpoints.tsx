export const BASE_URL = 'http://localhost:3001';

export const createFolder = (orgId : string, folderName : string) : string => {
    return BASE_URL + `/folder/create/${orgId}/${folderName}`
}

export const getFolders = (orgId : string) :string => {
    return BASE_URL + `/folder/list/${orgId}`;
}

export const getSurveyList = (orgId : string ) :string => {
    return BASE_URL + `/survey/list/${orgId}`;
}

export const enableSurvey = (surveyId : string) : string => {
    return BASE_URL + `/survey/enable/${surveyId}`;
}

export const disableSurvey = (surveyId : string) : string => {
    return BASE_URL + `/survey/disable/${surveyId}`;
}

export const shareSurvey = (surveyId : string) : string => {
    return BASE_URL + `/survey/share/${surveyId}`
}

export const deleteSurvey = (surveyId : string) : string => {
    return BASE_URL + `/survey/delete/${surveyId}`
}

export const moveSurveyFolder = (surveyId : string, folderId : string) => {
    return BASE_URL + `/survey/move/${folderId}/${surveyId}`;
}

export const getSurveyDetails = (surveyId : string | undefined) : string => {
    return BASE_URL + `/survey/details/${surveyId}`
}

export const getUserList = (orgId : string) : string => {
    return BASE_URL + `/user/list/org/${orgId}`
}

export const getSurveyTypes = () :string => {
    return BASE_URL + '/survey/type/list';
}

export const createSurvey = (surveyTypeId : string ) : string => {
    return BASE_URL + `/survey/create/${surveyTypeId}`;
}

export const saveSurveyFlow = (surveyId : string) : string => {
    return BASE_URL + `/survey/save/flow/${surveyId}`;
}

export const getShareSurveyLink = (currentLocation : string,surveyId : any) : string => {
    return `${currentLocation}/share/survey/${surveyId}`;
}

export const saveSurveyDesgin = (surveyId : string) : string => {
    return BASE_URL + `/survey/save/design/${surveyId}`;
}

export const saveSurveyConfig = (surveyId : string) => {
    return BASE_URL + `/survey/config/update/${surveyId}`;
}

export const getSurveyConfigData = (surveyId : string) => {
    return BASE_URL + `/survey/config/detail/${surveyId}`;
}

export const getSubscriptionDetailHome = (userId : string) => {
    return BASE_URL + `/subscription/sub/details/${userId}`;
}

export const getAllPlanList = () => {
    return BASE_URL + `/plan/list/all`;
}

// ********

export const getSubscriptionDetail = (): string => {
    return BASE_URL + '/api/v1/subscription/detail';
}

export const getRedirectGoogleAuth = () => {
    return BASE_URL + '/auth/oauth2/redirect';
}

export const checkLoginStatus = () => {
    return BASE_URL + '/auth/login/success';
}

export const logout = () => {
    return BASE_URL + '/auth/logout';
}