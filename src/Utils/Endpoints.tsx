import { durationType } from "./types";

export const BASE_URL = process.env.REACT_APP_ROOT_DOMAIN;

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

export const getShareSurveyLink = (currentLocation : string,surveyId : any,personId : string) : string => {
    return `${currentLocation}/share/survey/${surveyId}?person=${personId}`;
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

export const addCompanyURL = () => {
    return `${BASE_URL}/company/create/individual`
}

export const updateCompanyURL = () => {
    return `${BASE_URL}/company/update`
}

export const getCompanyPeopleOptionURL = () => {
    return `${BASE_URL}/company/select-options`
}

export const deleteCompanyURL = () => {
    return `${BASE_URL}/company/delete`;
}

export const getCompanyIndividualURL = (companyId : string) => {
    return `${BASE_URL}/company/get?companyId=${companyId}`;
}

export const getCompanySurveyResponseURL = (companyId : string) => {
    return `${BASE_URL}/company/survey-response?companyId=${companyId}`;
}

export const getCompanySurveyMetricsURL = (companyId : string) => {
    return `${BASE_URL}/company/survey-score-metrics?companyId=${companyId}`;
}

export const getPersonSurveyResponseURL = (personId : string) => {
    return `${BASE_URL}/people/survey-response?personId=${personId}`;
}

export const getPersonSurveyMetricsURL = (personId : string) => {
    return `${BASE_URL}/people/survey-score-metrics?personId=${personId}`;
}

export const deletePersonURL = () => {
    return `${BASE_URL}/people/delete`;
}

export const updatePersonURL = () => {
    return `${BASE_URL}/people/update`;
}

export const getCompanyListURL = (page : number,limit : number,searchStr : string) => {
    return `${BASE_URL}/company/get/list?page=${page}&limit=${limit}&search=${searchStr}`
}

export const addPersonURL = () => {
    return `${BASE_URL}/people/create/individual`
}

export const getPersonListURL = (page : number,limit : number,searchStr : string) => {
    return `${BASE_URL}/people/get/list?page=${page}&limit=${limit}&search=${searchStr}`
}

export const getCompanyColumnURL = () => {
    return `${BASE_URL}/company/column-metadata`
}

export const uploadBulkCompanyURL = () => {
    return `${BASE_URL}/company/bulk/upload`
}

export const getCompanyPersonListURL = (peopleId : string) => {
    return `${BASE_URL}/company/people/${peopleId}`
}

export const getCompanyHealthHistoryURL = (companyId : string) => {
    return `${BASE_URL}/company/health-history-chart?companyId=${companyId}`
}

export const createTagURL = () => {
    return `${BASE_URL}/tag/create`
}

export const getTagURL = () => {
    return `${BASE_URL}/tag/list`
}

export const deleteTagURL = (companyId : string,tagId : number) => {
    return `${BASE_URL}/tag/remove?companyId=${companyId}&tagId=${tagId}`
}

export const createTaskURL = () => {
    return `${BASE_URL}/task/create`
}

export const updateTaskURL = () => {
    return `${BASE_URL}/task/update`
}

export const getTaskURL = (
    companyId: string | null, 
    personId: string | null, 
    status : string,
    ownerId : string,
    page: number, 
    limit: number
) => {
    if(companyId == null){
        companyId = '';
    }
    if(personId == null){
        personId = '';
    }
    return `${BASE_URL}/task/get?page=${page}&limit=${limit}&companyId=${companyId}&personId=${personId}&status=${status}&ownerId=${ownerId}`
}

export const deleteTaskURL = (taskId : string) => {
    return `${BASE_URL}/task/delete?taskId=${taskId}`
}

export const completeTaskURL = () => {
    return `${BASE_URL}/task/complete-task`
}

export const getActivitiesURL = (personId : string,companyId : string) => {
    return `${BASE_URL}/activity/get?companyId=${companyId}&personId=${personId}`
}

export const createNoteURL = () => {
    return `${BASE_URL}/notes/create`
}

export const getNotesURL = (companyId: string | null, personId: string | null, page: number, limit: number) => {
    if(companyId == null){
        companyId = '';
    }
    if(personId == null){
        personId = '';
    }
    return `${BASE_URL}/notes/get?page=${page}&limit=${limit}&companyId=${companyId}&personId=${personId}`;
}

export const deleteNotesURL = (noteId : string) => {
    return `${BASE_URL}/notes/delete?noteId=${noteId}`
}

export const getUsageEventTypeURL = () => {
    return `${BASE_URL}/usage-event-type/list`;
}

export const createUsageEventTypeURL = () => {
    return `${BASE_URL}/usage-event-type/create`;
}

export const getUsageStatusURL = () => {
    return `${BASE_URL}/usage-event/usage-status`;
}

export const deleteUsageEventTypeURL = (eventTypeId : string) => {
    return `${BASE_URL}/usage-event-type/delete?usageEventTypeId=${eventTypeId}`;
}

export const getEventsOverTimeData = (interval : string,personId : string,companyId : string) => {
    return `${BASE_URL}/usage-event/events-over-time?interval=${interval}&personId=${personId}&companyId=${companyId}`;
}

export const getTimeSpentDataURL = (interval : string,personId : string,companyId : string) => {
    return `${BASE_URL}/usage-event/time-spent?interval=${interval}&personId=${personId}&companyId=${companyId}`;
}

export const getTopUsagePeopleURL = (interval : string,companyId : string) => {
    return `${BASE_URL}/usage-event/top-people?interval=${interval}&companyId=${companyId}`;
}

export const createJourneyStageURL = () => {
    return `${BASE_URL}/journey-stage/create`;
}

export const createJourneySubStageURL = () => {
    return `${BASE_URL}/journey-stage/create-sub-stage`;
}

export const createRiskStageURL = () => {
    return `${BASE_URL}/journey-stage/create-risk-stage`;
}

export const getJourneyStageURL = () => {
    return `${BASE_URL}/journey-stage/get-stage`;
}

export const getJourneySubStageURL = () => {
    return `${BASE_URL}/journey-stage/get-sub-stage`;
}

export const updateCompanyJourneyURL = () => {
    return `${BASE_URL}/journey-stage/update-company`;
}

export const getHealthConfigURL = () => {
    return `${BASE_URL}/health/get`;
}

export const createHealthConfigURL = () => {
    return `${BASE_URL}/health/create`;
}

export const getClientCompassURL = (date :string,type : 'all' | 'my') => {
    return `${BASE_URL}/dashboard/client-compass?date=${date}&type=${type}`
}

export const endpoints = {
    flows : {
        get : `${BASE_URL}/flow/all`,
        create : `${BASE_URL}/flow/create`,
        getOneById : (id : string | undefined) => `${BASE_URL}/flow/one?flowId=${id}`,
        update : `${BASE_URL}/flow/update-attribute`,
        updateJSON : `${BASE_URL}/flow/update-flow-json`,
        publish : (id : string | undefined) => `${BASE_URL}/flow/publish?flowId=${id}`,
        unpublish : (id : string | undefined) => `${BASE_URL}/flow/unpublish?flowId=${id}`
    },
    home : {
        onboarding : `${BASE_URL}/home/onboarding`
    },
    auth : {
        appSumoCoupon : `${BASE_URL}/auth/appsumo/init`
    }
}