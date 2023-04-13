import { SURVEY_LOCAL_KEY, USER_LOCAL_KEY } from "./Constants";

export const getUserId = () : string=> {
    let userStr = localStorage.getItem(USER_LOCAL_KEY);
    if (userStr == null) {
        return '';
    }
    let userData = JSON.parse(userStr);
    return userData.id;
}

export const getOrgId = (): string => {
    let userStr = localStorage.getItem(USER_LOCAL_KEY);
    if (userStr == null) {
        return '';
    }

    let userData = JSON.parse(userStr);
    return userData?.organization_id;
}

export const getSurveyFromLocalStorage = () => {
    let surveyData = localStorage.getItem(SURVEY_LOCAL_KEY);
    if (surveyData == null) {
        return null;
    }
    return JSON.parse(surveyData);
}

export const getSurveyIdFromLocalStorage = (): string => {
    let surveyData = localStorage.getItem(SURVEY_LOCAL_KEY);
    if (surveyData == null) {
        return '';
    }

    let surveyDataObj = JSON.parse(surveyData);
    return surveyDataObj?.id;
}

export const getCompConfig = (props: any): any => {
    const flow = props.flow;
    if (flow == null) { return {};}
    const surveyFlowJSON = flow.json;
    if (surveyFlowJSON == null) { return {}; }
    const flowObj = JSON.parse(surveyFlowJSON);

    let result = {};
    flowObj?.nodes?.forEach((node : any) => {
        const compData = node.data;
        if(node.id == props.uiId){
            result = compData?.compConfig;
            return;
        }
    });

    if(result != null && typeof result === 'string'){
        return JSON.parse(result);
    }
    return result;
}

export const validateFlowComponent = (data: any, componentId: string | undefined): string | null => {
    if (componentId == '1') {
        if (data.welcomeText == null || data.welcomeText == '' || data.buttonText == null || data.buttonText === '') {
            return 'Please fill in all required fields before saving.';
        }
    }
    return null;
}

export const getColorsFromTheme = (theme : any ) => {
    if(theme == null){
        return null;
    }
    const colors : any[] = theme.color;
    return {
        primaryColor : colors[0],
        secondaryColor : colors[1],
    }
}