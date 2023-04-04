import { AxiosResponse } from "axios";
import { SURVEY_LOCAL_KEY, USER_LOCAL_KEY } from "./Constants";

export const validateAPIResponse = (res : AxiosResponse<any,any>) : Boolean => {
    //TODO : work here
    return true;
}

export const getOrgId = () : string => {
    let userStr = localStorage.getItem(USER_LOCAL_KEY);
    if(userStr == null){
        return '';
    }

    let userData = JSON.parse(userStr);
    return userData?.organization_id;
}

export const getSurveyFromLocalStorage = () => {
    let surveyData = localStorage.getItem(SURVEY_LOCAL_KEY);
    if(surveyData == null){
        return null;
    }
    return JSON.parse(surveyData);
}

export const getSurveyIdFromLocalStorage = () : string => {
    let surveyData = localStorage.getItem(SURVEY_LOCAL_KEY);
    if(surveyData == null){
        return '';
    }

    let surveyDataObj = JSON.parse(surveyData);
    return surveyDataObj?.id;
}