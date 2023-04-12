export const EMAIL_LINK_SURVEY_TYPE = 'email/link';
export const APP_WEB_SURVEY_TYPE = 'app/web';

export const USER_LOCAL_KEY = 'user';
export const SURVEY_LOCAL_KEY = 'currentSurvey';

export const getColorSchemes = () : any[] => {
    let count = 0;

    return [
        {
            id : count++,
            header : 'Lavendar & Blue',
            text : 'Trending',
            color : ['#AA77FF','#C9EEFF'],
            textColor : '#000000'
        },
        {
            id : count++,
            header : 'Blue & White',
            text : 'Classic',
            color : ['#62CDFF','#FBEAEB'],
            textColor : '#808080'
        },
        {
            id : count++,
            header : 'Orange & yellow ',
            text : 'Classic',
            color : ['#FFA559','#FEE715FF'],
            textColor : '#808080'
        },
        {
            id : count++,
            header : 'Red & pink',
            text : 'Classic',
            color : ['#D14D72','#FCC8D1'],
            textColor : '#808080'
        },
        {
            id : count++,
            header : 'Lime green & electric blue ',
            text : 'Trending',
            color : ['#CCF381','#ADD8E6'],
            textColor : '#808080'
        },
        {
            id : count++,
            header : 'Lavender & teal',
            text : 'Trending',
            color : ['#E2D1F9','#317773'],
            textColor : '#f1f1f1'
        },
        {
            id : count++,
            header : 'Relaxed red & off-white',
            text : 'classic',
            color : ['#D2686E','#FCF6F5FF'],
            textColor : '#808080'
        },
        {
            id : count++,
            header : 'Yellow & Blue',
            text : 'classic',
            color : ['#F7C04A','#3F497F'],
            textColor : '#f1f1f1'
        },
        {
            id : count++,
            header : 'Baby pink & Green',
            text : 'classic',
            color : ['#F7C8E0','#DFFFD8'],
            textColor : '#808080'
        },
        {
            id : count++,
            header : 'Vintage brown',
            text : 'classic',
            color : ['#FEFBE9','#E1EEDD'],
            textColor : '#808080'
        },
    ];
}