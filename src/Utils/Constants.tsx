export const EMAIL_LINK_SURVEY_TYPE = 'email/link';
export const APP_WEB_SURVEY_TYPE = 'app/web';

export const USER_LOCAL_KEY = 'user';
export const SURVEY_LOCAL_KEY = 'currentSurvey';
export const LIVE_SURVEY_USER_ID = 'survey-user';

export const USER_UNAUTH_TEXT = 'User is not authorized';

export const ALL_TEMPLATE_KEY = 'All Templates';
export const TEMPLATE_KEY = 'Templates';

export const getBackgrounds = () :any[] => {
    let count = 0;
    return [
        {
            id : count++,
            name : 'Plain',
            value : 'plain'
        },
        {
            id : count++,
            name : 'Clouds',
            value : 'cloud-waves'
        },
        {
            id : count++,
            name : 'Current',
            value : 'current'
        },
        {
            id : count++,
            name : 'Rainbow',
            value : 'rainbow'
        },
        {
            id : count++,
            name : 'Ocean',
            value : 'ocean'
        }, 
        {
            id : count++,
            name : 'Sea',
            value : 'sea'
        }, 
        {
            id : count++,
            name : 'Sky',
            value : 'sky'
        }, 
        {
            id : count++,
            name : 'Volcano',
            value : 'volcano'
        }, 
        {
            id : count++,
            name : 'Dusk',
            value : 'dusk'
        }, 
        {
            id : count++,
            name : 'Core',
            value : 'core'
        }, 
        {
            id : count++,
            name : 'Candy',
            value : 'candy'
        }, 
        {
            id : count++,
            name : 'Honey Comb',
            value : 'honeycomb'
        },
        {
            id : count++,
            name : 'Honey Comb Border',
            value : 'honeycombBorder'
        },
        {
            id : count++,
            name : 'Matrix',
            value : 'matrixPattern'
        },
        {
            id : count++,
            name : 'Dotted',
            value : 'dot'
        },
        {
            id : count++,
            name : 'Wavy',
            value : 'wavy'
        },
        {
            id : count++,
            name : 'ZigZag',
            value : 'ZigZag'
        },
        {
            id : count++,
            name : 'Circles',
            value : 'circles'
        },
        {
            id : count++,
            name : 'Diagonal 1',
            value : 'diagonal1'
        },
        {
            id : count++,
            name : 'Diagonal 2',
            value : 'diagonal2'
        },
        {
            id : count++,
            name : 'Lines',
            value : 'lines'
        },        
        {
            id : count++,
            name : 'Vertical Lines',
            value : 'vertical-lines'
        },
        {
            id : count++,
            name : 'Waves',
            value : 'waves'
        },
        {
            id : count++,
            name : 'Radio waves',
            value : 'radio-waves'
        },
    ]
}

export const getColorSchemes = () : any[] => {
    let count = 0;

    return [
        {
            id : count++,
            header : 'Lavender',
            text : 'Trending',
            color : ['#8943FF','#C9EEFF'],
            textColor : '#ffffff',
            shade : '#E4D3FF'
        },
        {
            id : count++,
            header : 'Off White',
            text : 'Trending',
            color : ['#ffffff','#C9EEFF'],
            textColor : '#454545',
            shade : '#b3b3b3'
        },
        {
            id : count++,
            header : 'Black',
            text : 'Trending',
            color : ['#454545','#C9EEFF'],
            textColor : '#ffffff',
            shade : '#b3b3b3'
        },
        {
            id : count++,
            header : 'Light Blue',
            text : 'Classic',
            color : ['#4ea4cc','#FBEAEB'],
            textColor : '#ffffff',
            shade : '#e0f5ff'
        },
        {
            id : count++,
            header : 'Orange ',
            text : 'Classic',
            color : ['#e69550','#FEE715FF'],
            shade : '#ffe4cd',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Deep pink ',
            text : 'Classic',
            color : ['#e715ff','#FEE715FF'],
            shade : '#fad0ff',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Bunny Red',
            text : 'Classic',
            color : ['#bc4567','#FCC8D1'],
            shade : '#f6dbe3',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Baby pink',
            text : 'Classic',
            color : ['#b08c92','#FCC8D1'],
            shade : '#fee9ed',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Lime green ',
            text : 'Trending',
            color : ['#8faa5a','#ADD8E6'],
            shade : '#ebfacd',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Electric blue',
            text : 'Trending',
            color : ['#7997a1','#ADD8E6'],
            shade : '#deeff5',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Lavender',
            text : 'Trending',
            color : ['#9e92ae','#317773'],
            shade : '#eee3fb',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Teal',
            text : 'Trending',
            color : ['#2c6b68','#317773'],
            shade : '#c1d6d5',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Relaxed red',
            text : 'classic',
            color : ['#bd5e63','#FCF6F5FF'],
            shade : '#edc3c5',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Yellow',
            text : 'classic',
            color : ['#dead43','#3F497F'],
            shade : '#fdecc9',
            textColor : '#f1f1f1'
        },
        {
            id : count++,
            header : 'Navy Blue',
            text : 'classic',
            color : ['#323a66','#3F497F'],
            shade : '#c5c8d9',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Cream & Green',
            text : 'classic',
            color : ['#9cb397','#DFFFD8'],
            shade : '#e5ffe0',
            textColor : '#ffffff'
        },
        {
            id : count++,
            header : 'Vintage brown',
            text : 'classic',
            color : ['#7f7e75','#E1EEDD'],
            shade : '#e5e2d2',
            textColor : '#ffffff'
        },
    ];
}