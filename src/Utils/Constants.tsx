export const EMAIL_LINK_SURVEY_TYPE = 'email/link';
export const APP_WEB_SURVEY_TYPE = 'app/web';

export const USER_LOCAL_KEY = 'user';
export const SURVEY_LOCAL_KEY = 'currentSurvey';

export const getColorSchemes = () : any[] => {
    let count = 0;

    return [
        {
            id : count++,
            header : 'Royal blue & peach',
            text : 'Trending',
            color : ['#00539CFF','#EEA47FFF']
        },
        {
            id : count++,
            header : 'Blue & pink',
            text : 'Classic',
            color : ['#2F3C7E','#FBEAEB']
        },
        {
            id : count++,
            header : 'Charcoal & yellow ',
            text : 'Classic',
            color : ['#101820FF','#FEE715FF']
        },
        {
            id : count++,
            header : 'Red & yellow',
            text : 'Classic',
            color : ['#F96167','#FCE77D']
        },
        {
            id : count++,
            header : 'Lime green & electric blue ',
            text : 'Trending',
            color : ['#CCF381','#4831D4']
        },
        {
            id : count++,
            header : 'Lavender & teal',
            text : 'Trending',
            color : ['#E2D1F9','#317773']
        },
        {
            id : count++,
            header : 'Cherry red & off-white',
            text : 'classic',
            color : ['#990011FF','#FCF6F5FF']
        },
    ];
}