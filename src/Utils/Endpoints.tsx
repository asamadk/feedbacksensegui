// export const BASE_URL = 'https://api.feedbacksense.io';

import { durationType } from "./types";

// export const BASE_URL = 'https://stagingapi.feedbacksense.io';
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

export const getUserListAPI = () : string => {
    return BASE_URL + `/user/list/org`
}

export const getSurveyTypes = () :string => {
    return BASE_URL + '/survey/type/list';
}

export const createSurvey = (surveyTypeId : string ) : string => {
    return BASE_URL + `/survey/create/${surveyTypeId}`;
}

export const saveSurveyFlow = (surveyId : string,deleteResponse : boolean) : string => {
    return BASE_URL + `/survey/save/flow/${surveyId}?delete=${deleteResponse+''}`;
}

export const checkBeforeSaveSurveyFlow = (surveyId : string) : string => {
    return BASE_URL + `/survey/save/check/${surveyId}`;
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

export const informSupportUserPricingAPI = () => {
    return BASE_URL + `/subscription/support`;
}

export const getSubscriptionPaymentHistory = () => {
    return BASE_URL + `/subscription/history`;
}

export const initializePaymentAPI = () => {
    return BASE_URL + `/subscription/initialize/payment`;
}

export const getAllPlanList = () => {
    return BASE_URL + `/plan/list/all`;
}

export const createOrgForuser = () => {
    return BASE_URL + `/org/create`;
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

export const getRedirectMicrosoftAuth = () => {
    return BASE_URL + '/auth/microsoft';
}

export const checkLoginStatus = () => {
    return BASE_URL + '/auth/login/success';
}

export const logout = () => {
    return BASE_URL + '/auth/logout';
}

export const saveSurveyResponseDb = (surveyId : string | undefined) => {
    return BASE_URL + `/live/survey/response/${surveyId}`;
}

export const getSurveyResponseList = (surveyId : string) => {
    return `${BASE_URL}/analysis/response/list/${surveyId}`
}

export const deleteSurveyResponse = (surveyResponseId : string) => {
    return `${BASE_URL}/analysis/response/${surveyResponseId}`
} 

export const getOverallResponse = (surveyId : string,duration : durationType) => {
    return `${BASE_URL}/analysis/response/overall/${surveyId}?startDate=${duration?.startDate}&endDate=${duration?.endDate}`;
}

export const getOverallMetricsResponse = (surveyId : string,duration : durationType) => {
    return `${BASE_URL}/analysis/response/sub-data/${surveyId}?startDate=${duration?.startDate}&endDate=${duration?.endDate}`;
}

export const getOverAllComponentsData = (surveyId : string,duration : durationType) => {
    return `${BASE_URL}/analysis/response/components/${surveyId}?startDate=${duration?.startDate}&endDate=${duration?.endDate}`;
}

export const getSurveyFilterDataAPI = (surveyId : string) => {
    return `${BASE_URL}/analysis/response/filter-data/${surveyId}`;
}

export const getStripePaymentIntent = () => {
    return `${BASE_URL}/stripe/create-payment-intent`
}

export const startSubScription = () => {
    return `${BASE_URL}/stripe/api/subscribe`
}

export const duplicateSurveyAPI = (surveyId : string) => {
    return `${BASE_URL}/survey/duplicate/${surveyId}`;
}

export const getTemplatesAPI = () => {
    return `${BASE_URL}/template/list`
}

export const getTemplatesDisplayAPI = (templateId : string | undefined) => {
    return `${BASE_URL}/template/test-display/${templateId}`
}

export const createSurveyFromTemplateAPI = (templateId : string) => {
    return `${BASE_URL}/template/create-survey/${templateId}`
}

export const inviteUserAPI = () => {
    return `${BASE_URL}/user/invite`
}

export const updateUserRoleAPI = () => {
    return `${BASE_URL}/user/role`
}

export const deleteUserRoleAPI = () => {
    return `${BASE_URL}/user/delete/org`
}

export const processInviteAPI = (code : string) => {
    return `${BASE_URL}/auth/invite?code=${code}`
}

export const acceptCleanInviteAPI = (code : string) => {
    return `${BASE_URL}/auth/process/clean/invite?code=${code}`
}

export const uploadLogoAPI = () => {
    return `${BASE_URL}/survey/upload`
}

export const getLogoAPI = () => {
    return `${BASE_URL}/survey/logo`
}

export const deleteLogoAPI = () => {
    return `${BASE_URL}/survey/logo`
}

export const getCustomSettingsAPI = () => {
    return `${BASE_URL}/settings/dashboard-settings`
}

export const getSurveyLogoAPI = (surveyId : string) => {
    return `${BASE_URL}/live/survey/logo/${surveyId}`
}

export const exportSurveyCsvAPI = (surveyId : string) => {
    return `${BASE_URL}/analysis/export/csv/${surveyId}`
}

export const exportSurveyJsonAPI = (surveyId : string) => {
    return `${BASE_URL}/analysis/export/json/${surveyId}`
}

export const updateEmbedConfigAPI = () => {
    return `${BASE_URL}/survey/config/embed`
}