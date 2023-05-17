// export const BASE_URL = 'https://api.feedbacksense.tech';
export const BASE_URL = 'http://localhost:3001';

export const createFolder = (folderName : string) : string => {
    return BASE_URL + `/folder/create/${folderName}`
}

export const getFolders = () :string => {
    return BASE_URL + `/folder/list`;
}

export const getSurveyList = () :string => {
    return BASE_URL + `/survey/list`;
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

export const getUserList = () : string => {
    return BASE_URL + `/user/list/org`
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

export const getSubscriptionDetailHome = () => {
    return BASE_URL + `/subscription/sub/details`;
}

export const getAllPlanList = () => {
    return BASE_URL + `/plan/list/all`;
}

export const createOrgForuser = (orgName : string) => {
    return BASE_URL + `/org/create/${orgName}`;
}

export const getOrgList = () => {
    return BASE_URL + `/org/list`;
}

export const pointOrgToUser = () => {
    return BASE_URL + `/org/point`;
}

export const updateSurveyName = (surveyId : string) => {
    return BASE_URL + `/survey/update/name/${surveyId}`;
}

export const deleteFolder = (folderId : string) => {
    return BASE_URL + `/folder/delete/${folderId}`;
}

export const getLiveSurveyData = (surveyId : string | undefined ) => {
    return BASE_URL + `/live/survey/${surveyId}`;
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

export const saveSurveyResponseDb = (surveyId : string) => {
    return BASE_URL + `/live/survey/response/${surveyId}`;
}

export const getSurveyResponseList = (surveyId : string) => {
    return `${BASE_URL}/analysis/response/list/${surveyId}`
}

export const deleteSurveyResponse = (surveyResponseId : string) => {
    return `${BASE_URL}/analysis/response/${surveyResponseId}`
} 


export const getOverallResponse = (surveyId : string) => {
    return `${BASE_URL}/analysis/response/overall/${surveyId}`
}

export const getOverallMetricsResponse = (surveyId : string) => {
    return `${BASE_URL}/analysis/response/sub-data/${surveyId}`
}

export const getOverAllComponentsData = (surveyId : string) => {
    return `${BASE_URL}/analysis/response/components/${surveyId}`
}
