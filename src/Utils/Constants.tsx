import { CONDITION_ANSWER_CONTAINS, CONDITION_ANY_VALUE, CONDITION_HAS_ANY_VALUE, CONDITION_IS, CONDITION_IS_EXACTLY, CONDITION_IS_NOT, SMILEY_EXTREMELY_HAPPY, SMILEY_EXTREMELY_UNSATISFIED, SMILEY_HAPPY, SMILEY_NEUTRAL, SMILEY_UNSATISFIED } from "../SurveyEngine/CoreUtils/CoreConstants";

export const colorPalette = {
    darkBackground: '#3D0A74',
    primary: '#8039DF',
    secondary: '#F5EDFF',
    textPrimary: '#3D0A74',
    textSecondary: '#f6f7f9',
    fsGray: '#AFAFAF',
    background: '#ffffff'
}

export const EMAIL_LINK_SURVEY_TYPE = 'email/link';
export const APP_WEB_SURVEY_TYPE = 'app/web';

export const SURVEY_LOCAL_KEY = 'currentSurvey';
export const LIVE_SURVEY_USER_ID = 'survey-user';

export const USER_UNAUTH_TEXT = 'User is not authorized';
export const PERM_ISSUE_TEXT = 'You do not have permission to access this resource';

export const ALL_TEMPLATE_KEY = 'All Templates';
export const TEMPLATE_KEY = 'Templates';

export const componentName = {
    SUBSCRIPTION: 'SUBSCRIPTION',
    BILLING_INFO_HOME: 'BILLING_INFO_HOME',
    TEAMMATES_INVITE: 'TEAMMATES_INVITE',
    MANAGE_USER: 'MANAGE_USER',
    DELETE_USER: 'DELETE_USER',
    CREATE_SURVEY_BUTTON: 'CREATE_SURVEY_BUTTON',
    SAVE_SURVEY_BUTTON: 'SAVE_SURVEY_BUTTON',
    DELETE_SURVEY: 'DELETE_SURVEY',
    DISABLE_SURVEY: 'DISABLE_SURVEY',
    DELETE_SURVEY_RESPONSE: 'DELETE_SURVEY_RESPONSE',
    UPLOAD_LOGO: 'UPLOAD_LOGO'
}

export const ignoreAuthPaths = [
    '/invite',
    '/failure',
    '/payment/success',
    '/sign-up'
]

export const getBackgrounds = (): any[] => {
    let count = 0;
    return [
        { id: count++, name: 'Plain', value: 'plain' },
        { id: count++, name: 'Color0', value: 'color0-plain' },
        { id: count++, name: 'Color1', value: 'color1-plain' },
        { id: count++, name: 'Color2', value: 'color2-plain' },
        { id: count++, name: 'Color3', value: 'color3-plain' },
        { id: count++, name: 'Color4', value: 'color4-plain' },
        { id: count++, name: 'Color5', value: 'color5-plain' },
        { id: count++, name: 'Color6', value: 'color6-plain' },
        { id: count++, name: 'Color7', value: 'color7-plain' },
        { id: count++, name: 'Color8', value: 'color8-plain' },
        { id: count++, name: 'Color9', value: 'color9-plain' },
        { id: count++, name: 'Color10', value: 'color10-plain' },
        { id: count++, name: 'Color11', value: 'color11-plain' },
        { id: count++, name: 'Color12', value: 'color12-plain' },
        { id: count++, name: 'Color13', value: 'color13-plain' },
        { id: count++, name: 'Color14', value: 'color14-plain' },
        { id: count++, name: 'Color15', value: 'color15-plain' },
        { id: count++, name: 'Color16', value: 'color16-plain' },
        { id: count++, name: 'Color17', value: 'color17-plain' },
        { id: count++, name: 'Color18', value: 'color18-plain' },
        { id: count++, name: 'Color19', value: 'color19-plain' },
        { id: count++, name: 'Color20', value: 'color20-plain' },
        { id: count++, name: 'Color21', value: 'color21-plain' },
        { id: count++, name: 'Color22', value: 'color22-plain' },
        { id: count++, name: 'Color23', value: 'color23-plain' },
        { id: count++, name: 'Color24', value: 'color24-plain' },
        { id: count++, name: 'Color25', value: 'color25-plain' },
        { id: count++, name: 'Color26', value: 'color26-plain' },
        { id: count++, name: 'Color27', value: 'color27-plain' },
        { id: count++, name: 'Color28', value: 'color28-plain' },
        { id: count++, name: 'Color29', value: 'color29-plain' },
        { id: count++, name: 'Color30', value: 'color30-plain' },
        { id: count++, name: 'Color31', value: 'color31-plain' },
        { id: count++, name: 'Color32', value: 'color32-plain' },
        { id: count++, name: 'Color33', value: 'color33-plain' },
        { id: count++, name: 'Color34', value: 'color34-plain' },
        { id: count++, name: 'Color35', value: 'color35-plain' },
        { id: count++, name: 'Color36', value: 'color36-plain' },
        { id: count++, name: 'Color37', value: 'color37-plain' },
        { id: count++, name: 'Color38', value: 'color38-plain' },
        { id: count++, name: 'Color39', value: 'color39-plain' },
        { id: count++, name: 'Color40', value: 'color40-plain' },
        { id: count++, name: 'Color41', value: 'color41-plain' },
        { id: count++, name: 'Color42', value: 'color42-plain' },
        { id: count++, name: 'Color43', value: 'color43-plain' },
        { id: count++, name: 'Color44', value: 'color44-plain' },
        { id: count++, name: 'Color45', value: 'color45-plain' },
        { id: count++, name: 'Color46', value: 'color46-plain' },
        { id: count++, name: 'Color47', value: 'color47-plain' },
        { id: count++, name: 'Color48', value: 'color48-plain' },
        { id: count++, name: 'Color49', value: 'color49-plain' },
        { id: count++, name: 'Color50', value: 'color50-plain' },
        { id: count++, name: 'Color51', value: 'color51-plain' },
        { id: count++, name: 'Color52', value: 'color52-plain' },
        { id: count++, name: 'Color53', value: 'color53-plain' },
        { id: count++, name: 'Dark', value: 'dark-plain' },
        { id: count++, name: 'Clouds', value: 'cloud-waves' },
        { id: count++, name: 'Current', value: 'current' },
        { id: count++, name: 'Rainbow', value: 'rainbow' },
        { id: count++, name: 'Ocean', value: 'ocean' },
        { id: count++, name: 'Sea', value: 'sea' },
        { id: count++, name: 'Sky', value: 'sky' },
        { id: count++, name: 'Volcano', value: 'volcano' },
        { id: count++, name: 'Dusk', value: 'dusk' },
        { id: count++, name: 'Core', value: 'core' },
        { id: count++, name: 'Candy', value: 'candy' },
        { id: count++, name: 'Honey Comb', value: 'honeycomb' },
        { id: count++, name: 'Honey Comb Border', value: 'honeycombBorder' },
        { id: count++, name: 'Matrix', value: 'matrixPattern' },
        { id: count++, name: 'Dotted', value: 'dot' },
        { id: count++, name: 'Wavy', value: 'wavy' },
        { id: count++, name: 'ZigZag', value: 'ZigZag' },
        { id: count++, name: 'Circles', value: 'circles' },
        { id: count++, name: 'Diagonal 1', value: 'diagonal1' },
        { id: count++, name: 'Diagonal 2', value: 'diagonal2' },
        { id: count++, name: 'Lines', value: 'lines' },
        { id: count++, name: 'Vertical Lines', value: 'vertical-lines' },
        { id: count++, name: 'Waves', value: 'waves' },
        { id: count++, name: 'Radio waves', value: 'radio-waves' },
    ]
}

export const getColorSchemes = (): any[] => {
    let count = 0;

    return [
        {
            id: count++,
            header: 'Lavender',
            text: 'Trending',
            color: ['#8943FF', '#C9EEFF'],
            textColor: '#ffffff',
            shade: '#E4D3FF'
        },
        {
            id: count++,
            header: 'Off White',
            text: 'Trending',
            color: ['#ffffff', '#000000'],
            textColor: '#454545',
            shade: 'hsl(0deg 0% 88.76%)'
        },
        {
            id: count++,
            header: 'Black',
            text: 'Trending',
            color: ['#454545', '#C9EEFF'],
            textColor: '#ffffff',
            shade: '#b3b3b3'
        },
        {
            id: count++,
            header: 'Light Blue',
            text: 'Classic',
            color: ['#4ea4cc', '#FBEAEB'],
            textColor: '#ffffff',
            shade: '#e0f5ff'
        },
        {
            id: count++,
            header: 'Orange ',
            text: 'Classic',
            color: ['#e69550', '#FEE715FF'],
            shade: '#ffe4cd',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Deep pink ',
            text: 'Classic',
            color: ['#e715ff', '#FEE715FF'],
            shade: '#fad0ff',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Bunny Red',
            text: 'Classic',
            color: ['#bc4567', '#FCC8D1'],
            shade: '#f6dbe3',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Baby pink',
            text: 'Classic',
            color: ['#b08c92', '#FCC8D1'],
            shade: '#fee9ed',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Lime green ',
            text: 'Trending',
            color: ['#8faa5a', '#ADD8E6'],
            shade: '#ebfacd',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Electric blue',
            text: 'Trending',
            color: ['#7997a1', '#ADD8E6'],
            shade: '#deeff5',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Lavender',
            text: 'Trending',
            color: ['#9e92ae', '#317773'],
            shade: '#eee3fb',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Teal',
            text: 'Trending',
            color: ['#2c6b68', '#317773'],
            shade: '#c1d6d5',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Relaxed red',
            text: 'classic',
            color: ['#bd5e63', '#FCF6F5FF'],
            shade: '#edc3c5',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Yellow',
            text: 'classic',
            color: ['#dead43', '#3F497F'],
            shade: '#fdecc9',
            textColor: '#f1f1f1'
        },
        {
            id: count++,
            header: 'Navy Blue',
            text: 'classic',
            color: ['#323a66', '#3F497F'],
            shade: '#c5c8d9',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Cream & Green',
            text: 'classic',
            color: ['#9cb397', '#DFFFD8'],
            shade: '#e5ffe0',
            textColor: '#ffffff'
        },
        {
            id: count++,
            header: 'Vintage brown',
            text: 'classic',
            color: ['#7f7e75', '#E1EEDD'],
            shade: '#e5e2d2',
            textColor: '#ffffff'
        },
    ];
}

export const componentList = [
    {
        id: 1,
        bgColor: '#527853',
        header: 'Welcome message',
        description: 'Take a moment to introduce the purpose of your survey or say hi to your audience.',
        isAvailable: true
    },
    // {
    //     id: 2,
    //     bgColor: '#F6AE2D',
    //     header: 'Thank you screen',
    //     description: 'It is an important part of survey experience to ensure that users feel valued and appreciated.',
    //     isAvailable : false
    // },
    {
        id: 3,
        bgColor: '#0802A3',
        header: 'Single answer selection',
        description: 'Get people to select only one option. Good for getting definite answers.',
        isAvailable: true
    },
    {
        id: 4,
        bgColor: '#7B2869',
        header: 'Multiple answer selection',
        description: 'Let people choose multiple answers from a list. Use it when more than one answer applies.',
        isAvailable: true
    },
    {
        id: 5,
        bgColor: '#0A81AB',
        header: 'Text answer',
        description: 'Provide a text box so people can share written, open-ended feedback.',
        isAvailable: true
    },
    {
        id: 6,
        bgColor: '#FFB84C',
        header: 'Smiley scale',
        description: 'Ask people to rate something on a visual smiley scale. .',
        isAvailable: true
    },
    {
        id: 7,
        bgColor: '#FAD800',
        header: 'Rating scale',
        description: 'Ask people to rate something. Great for measuring satisfaction. ',
        isAvailable: true
    },
    {
        id: 8,
        bgColor: '#43658B',
        header: 'NPS',
        description: 'Measure brand loyalty on a scale from 0 to 10 and get a predictor of repurchases & referrals.',
        isAvailable: true
    },
    // {
    //     id: 9,
    //     bgColor: '#C1AEFC',
    //     header: 'Dropdown List',
    //     description: 'Let people pick one answer from a dropdown list of choices. Great for space-saving reasons.'
    // },
    // {
    //     id: 10,
    //     bgColor: '#D1FFF3',
    //     header: 'Matrix',
    //     description: 'Provide one or multiple row answers and the same set of column choices to evaluate them with.'
    // },
    {
        id: 11,
        bgColor: '#6E2142',
        header: 'Contact form',
        description: 'Collect contact information such as name, email, then create contacts in your CRM if you want.',
        isAvailable: true
    },
    // {
    //     id: 12,
    //     bgColor: '#CD5888',
    //     header: 'Ranking answer',
    //     description: 'Ask people to rank multiple answer choices in the order of preference or importance.',
    //      isAvailable : true
    // },
    {
        id: 13,
        bgColor: '#5F4444',
        header: 'Date',
        description: 'Let people enter a specific date. This component is useful in areas where people need to select date/time',
        isAvailable: true
    },
    {
        id: 14,
        bgColor: '#808080',
        header: 'Selector',
        description: '',
        isAvailable: false
    },
];

export const singleAnswerOperators = [
    CONDITION_IS,
    CONDITION_IS_NOT,
    CONDITION_ANY_VALUE
];

export const multipleAnswerOperators = [
    CONDITION_IS_EXACTLY,
    CONDITION_IS_NOT,
    CONDITION_ANY_VALUE,
    // CONDITION_INCLUDES_ALL
];

export const textAnswerOperators = [
    CONDITION_ANSWER_CONTAINS,
    CONDITION_HAS_ANY_VALUE,
    // CONDITION_QUESTION_IS_ANSWERED,
    // CONDITION_QUESTION_IS_NOT_ANSWERED,
];

export const dateAnswerOperators = [
    // CONDITION_QUESTION_IS_NOT_ANSWERED,
    CONDITION_HAS_ANY_VALUE,
    // CONDITION_QUESTION_IS_ANSWERED,
];

export const smileyEmojiName = [
    SMILEY_EXTREMELY_UNSATISFIED,
    SMILEY_UNSATISFIED,
    SMILEY_NEUTRAL,
    SMILEY_HAPPY,
    SMILEY_EXTREMELY_HAPPY
]

export const EmbedPositions = [
    {
        id: 1,
        name: 'top-left',
        selected: true
    },
    {
        id: 2,
        name: 'top-right',
        selected: false
    },
    {
        id: 3,
        name: 'bottom-left',
        selected: false
    },
    {
        id: 4,
        name: 'bottom-right',
        selected: false
    },
]

export const joyrideConstants = {
    JOYRIDE_1 : 'joyride-1',
    JOYRIDE_2 : 'joyride-2',
    JOYRIDE_3 : 'joyride-3',
    JOYRIDE_4 : 'joyride-4',
    JOYRIDE_5 : 'joyride-5',
    JOYRIDE_6 : 'joyride-6',
    JOYRIDE_7 : 'joyride-7',
}