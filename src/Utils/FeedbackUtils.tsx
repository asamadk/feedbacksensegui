import { logout } from "./Endpoints";
import { logicType } from "./types";
import { DEFAULT_KEY } from "../SurveyEngine/CoreUtils/CoreConstants";
import { USER_UNAUTH_TEXT, colorPalette, contactFieldTypes, fieldTypes } from "./Constants";
import platform from 'platform';


export const getComponentConfigFromNode = (node: any) => {
    const compData = node?.data;
    const result = compData?.compConfig;
    if (result != null && typeof result === 'string') {
        return JSON.parse(result);
    }
    return {};
}

export const getCompConfigFromUiId = (props: any): any => {
    const compConfMap: Map<string, object> = props.data;
    return compConfMap.get(props.uiId);
}

export const validateContactDisplay = (fieldList: any[], answerObj: any): string | null => {
    const answerList: string[] = [];
    for (const key in answerObj) {
        answerList.push(answerObj[key]);
    }
    const length = answerList.length;

    for (let i = 0; i < length; i++) {
        const answer = answerList[i];
        const field = fieldList[i];
        const res = validateFieldAndAnswer(field, answer);
        if (res != null) { return res; }
    }

    return null;
}

export const validateFieldAndAnswer = (field: fieldTypes, answer: any): string | null => {
    switch (field) {
        case 'first-name':
        case 'last-name':
        case 'organization':
        case 'job-title':
        case 'department':
        case 'comment':
        case 'city':
        case 'state':
            // For these fields, we might just check if the answer is a non-empty string
            if (typeof answer !== 'string' || answer.trim() === '') {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        case 'e-mail':
            // For email, we can use a regular expression to validate its format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof answer !== 'string' || !emailRegex.test(answer)) {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        case 'phone':
            // For phone, you might have specific rules, like minimum length, or formatting rules
            // Here's a simple check for minimum length
            if (typeof answer !== 'string' || answer.trim().length < 5) {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        case 'website':
            // For website, you might want to check if it's a valid URL
            // This regex might not cover all cases but provides a basic check
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            if (typeof answer !== 'string' || !urlRegex.test(answer)) {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        case 'country':
        case 'address-1':
        case 'address-2':
            // For these fields, you might have specific rules, but for now, let's just ensure it's a non-empty string
            if (typeof answer !== 'string' || answer.trim() === '') {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        case 'zip':
            // For zip code, you might have specific rules based on countries (e.g., length, format)
            // For simplicity, let's just check if it's a non-empty string
            if (typeof answer !== 'string' || answer.trim() === '') {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        case 'annual-revenue':
        case 'employees':
            // For numeric fields, you might check if it's a valid number
            if (isNaN(answer)) {
                return `Invalid ${field}: ${answer}`;
            }
            break;
        default:
            return `Unknown field: ${field}`;
    }

    return null; // If all checks pass, return null indicating no error
}

export const validateSurveyDisplay = (data: any, componentId: number | undefined): string | null => {
    switch (componentId) {
        case 1:
            break;
        case 5:
            if (data.required === true && (data.answer == null || data.answer?.length < 1)) {
                return 'Please provide an answer before moving forward.';
            }
            break;
        case 13:
            const dateData = data.value;
            if (dateData == null) {
                return 'Selected date is not valid';
            }
            break;
        case 3:
            if (data == null || data.selectedVal == null || data.selectedVal?.length < 1) {
                return 'Please select something before moving forward.'
            }
            break;
        case 4:
            if (data == null || data.selectedVal == null || data.selectedVal?.length < 1) {
                return 'Please select something before moving forward.'
            }
            break;
        case 11:
            if (data == null) {
                return 'Please fill all the values before moving forward'
            }
            for (const d in data) {
                if (data[d] == null || data[d]?.length < 1) {
                    return 'Please fill all the values before moving forward'
                }
            }
            break;
        default:
            break;
    }
    return null;
}

export const validateFlowComponent = (data: any, componentId: number | undefined): string | null => {
    if (data == null) {
        return 'Empty config.';
    }
    switch (componentId) {
        case 1:
            if (data.welcomeText == null || data.welcomeText?.length < 1) {
                return 'Important: Don\'t forget to fill the required fields.'
            }

            if (data.buttonText == null || data.buttonText?.length < 1) {
                return 'Button text cannot be empty.';
            }
            break;
        case 3:
        case 4:
        case 11:
            if (data.question == null || data.question?.length < 1) {
                return 'Important: Don\'t forget to fill in the question field.'
            }
            if (data.answerList == null) {
                return 'Component should have at least one answer choice.'
            } else {
                const comChoiceList: string[] = data.answerList;
                for (const choice of comChoiceList) {
                    if (choice == null || choice.length < 1) {
                        return 'Important: Please fill in the answer fields.'
                    }
                }
            }
            break;
        case 5:
        case 13:
            if (data.question == null || data.question?.length < 1) {
                return 'Important: Don\'t forget to fill in the question field.'
            }
            break;
        case 6:
        case 7:
        case 8:
            if (data.question == null || data.question?.length < 1) {
                return 'Important: Don\'t forget to fill in the question field.'
            }

            break;
        case 14:
            return 'Important : Please update the selector node.';
        case 15:
        case 16:
            if (data.insertType === 'some') {
                const conditions: any[][] = data.conditionBlock || [[]];
                if (conditions.length < 1) { return 'Incorrect condition'; }
                if (conditions[0].length < 1) { return 'Incorrect condition'; }
                for (let i = 0; i < conditions.length; i++) {
                    const condition = conditions[i];
                    for (let j = 0; j < condition.length; j++) {
                        const singleCond = condition[j];
                        if (
                            singleCond == null ||
                            singleCond?.field == null || singleCond?.field.length < 1 ||
                            singleCond?.operator == null || singleCond?.operator.length < 1 ||
                            singleCond?.value == null || singleCond?.value.length < 1 ||
                            singleCond?.where == null || singleCond?.where.length < 1
                        ) {
                            return 'Incorrect condition'
                        }
                    }
                }
            }
            break;
        case 18:
            if (data?.days == null || data?.days === 0) {
                return 'Please select number of days.'
            }
            break;
        case 19:
            if (
                data == null ||
                data.title == null || data.title.length < 1 ||
                data.owner == null || data.owner.length < 1 ||
                data.priority == null || data.priority.length < 1 ||
                data.dueDate == null || data.dueDate.length < 1
            ) {
                return 'Please fill all the fields';
            }
            break;
        case 20:
            if (
                data == null ||
                data?.subject == null || data?.subject?.length < 1 ||
                data?.body == null || data?.body?.length < 1
            ) {
                return 'Please fill all the fields';
            }
            break;
        case 21:
            if (data?.owner == null || data?.owner.length < 1) {
                return 'Please select an owner.';
            }
            break;
        case 22:
            if (data.fields == null || data.fields.length < 1) { return 'Incorrect values'; }
            const fields: { field: string, value: string }[] = data.fields;
            for (let i = 0; i < fields.length; i++) {
                const tmp = fields[i];
                if (
                    tmp.field == null || tmp.field.length < 1 ||
                    tmp.value == null || tmp.value.length < 1
                ) {
                    return 'Please fill all the value';
                }
            }
            break;
        case 24:
            if (data.survey == null || data.survey.length < 1) {
                return 'Please select a survey';
            }
            break;
        default:
            break;
    }
    return null;
}

export const validateComponentLogic = (data: any, uniqueId: string | null, componentId: number | undefined, edges: any[]): string | null => {
    if (data == null) {
        return 'Empty config.';
    }
    const logics: logicType[] = data?.logic;
    const answerList: string[] = data?.answerList;
    const range: number = data?.range;
    if (logics == null || logics.length < 1) { return null }
    for (let i = 0; i < logics.length; i++) {
        const logic = logics[i];
        switch (componentId) {
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 13:
                {
                    const logicPath = logic.path;
                    if (!logic.operator) {
                        return 'Essential: Please specify the logic operator.';
                    }
                    if (!logicPath) {
                        return 'Essential: Please define the logic path.';
                    }
                    if (componentId === 3 || componentId === 4) {
                        if ((!logic.value || !answerList?.includes(logic.value)) && !answerNotNeededSet.has(logic.operator)) {
                            return 'Essential: Specify a valid logic value from the available answers.';
                        }
                    }

                    if (componentId === 5 || componentId === 6 || componentId === 8) {
                        if ((!logic.value) && !answerNotNeededSet.has(logic.operator)) {
                            return 'Essential: Specify a valid logic value from the available answers.';
                        }
                    }
                    if (componentId === 7) {
                        if ((!logic.value || parseInt(logic.value) > range) && !answerNotNeededSet.has(logic.operator)) {
                            return 'Essential: Specify a valid logic value from the available answers.';
                        }
                    }
                    if (uniqueId != null) {
                        let labelFound = false;
                        let defaultLabelFound = false;
                        for (const edge of edges) {
                            const label = edge.label;
                            const nodeId: string = edge.source;
                            if (nodeId === uniqueId) {
                                if (logicPath.length > 0 && label === logicPath) {
                                    labelFound = true;
                                }
                                if (label === DEFAULT_KEY) {
                                    defaultLabelFound = true;
                                }
                            }
                        }
                        if (labelFound === false) {
                            return `Path : ${logicPath} not present`
                        }

                        if (defaultLabelFound === false) {
                            return 'Path : Default not present.'
                        }
                    }
                    break;
                }
        }
    }
    return null;
}

export const answerNotNeededSet = new Set<string>([
    'has any value', 'includes all of the following', 'answer has any value', 'question is answered',
    'question is not answered'
]);

export const getColorsFromTheme = (theme: any) => {
    if (theme == null) {
        return null;
    }
    const colors: any[] = theme.color;
    return {
        primaryColor: colors[0],
        secondaryColor: colors[1],
        shade: theme?.shade
    }
}

export const getSurveyUserInformation = () => {
    const details = {
        userAgent: window.navigator.userAgent,
        languages: window.navigator.languages,
        platform: {
            os: platform.os,
            browser: platform.name,
            product: platform.product
        }
    }
    return details;
}

export const getCenterAlignmentStyle = () => {
    return {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
}

export const getEmojiFromId = (emojiId: string) => {
    if (emojiId === '0') {
        return '😡';
    } else if (emojiId === '1') {
        return '🙁';
    } else if (emojiId === '2') {
        return '😐';
    } else if (emojiId === '3') {
        return '🙂';
    } else if (emojiId === '4') {
        return '😍';
    }
}

export const getIconColorById = (id: number): string => {
    if (id === 1) {
        return '#527853';
    } else if (id === 2) {
        return '#F6AE2D';
    } else if (id === 3) {
        return '#0802A3';
    } else if (id === 4) {
        return '#7B2869';
    } else if (id === 5) {
        return '#0A81AB';
    } else if (id === 6) {
        return '#FFB84C';
    } else if (id === 7) {
        return '#FAD800';
    } else if (id === 8) {
        return '#43658B';
    } else if (id === 11) {
        return '#6E2142';
    } else if (id === 13) {
        return '#5F4444';
    }
    return colorPalette.primary;
}

export const getComponentNameById = (id: number): string => {
    if (id === 1) {
        return 'Welcome message';
    } else if (id === 2) {
        return 'Thank you screen';
    }
    else if (id === 3) {
        return 'Single answer selection';
    } else if (id === 4) {
        return 'Multiple answer selection';
    } else if (id === 5) {
        return 'Text answer';
    } else if (id === 6) {
        return 'Smiley scale';
    } else if (id === 7) {
        return 'Rating scale';
    } else if (id === 8) {
        return 'NPS';
    } else if (id === 9) {
        return 'CSAT';
    } else if (id === 11) {
        return 'Contact form';
    } else if (id === 13) {
        return 'Date';
    }
    return '';
}

export const handleLogout = () => {
    window.open(
        logout(),
        "_self"
    );
}

export const handleUnAuth = (error: any) => {
    if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
    }
}

export const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const ConfigurePageTabList = [
    { id: 1, name: 'GENERAL' },
    { id: 1, name: 'EMBED' },
]

export const modalTabList = [
    { id: 1, name: 'GENERAL' },
    { id: 2, name: 'LOGIC' },
];

export const modalTabList2 = [
    { id: 1, name: 'GENERAL' },
    { id: 2, name: 'LOGIC' },
    { id: 3, name: 'ADVANCED' },
];

export const validateLogoImageFile = (file: any): string | null => {
    const maxSize = 1 * 1024 * 1024; // 1 MB
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!file) {
        return "No file selected.";
    }
    if (file.size > maxSize) {
        return "Image size exceeds 1 MB limit.";
    }
    if (!allowedTypes.includes(file.type)) {
        return "Invalid file type. Please upload a valid image (JPEG, PNG).";
    }
    return null;
}

export const getDurationLabel = (durationValue: string) => {
    if (durationValue === 'all') {
        return 'All time'
    } else if (durationValue === 'today') {
        return 'Today';
    } else if (durationValue === 'yesterday') {
        return 'Yesterday'
    } else if (durationValue === 'last_7_days') {
        return 'Last 7 days'
    } else if (durationValue === 'last_30_days') {
        return 'Last 30 days'
    } else if (durationValue === 'last_90_days') {
        return 'Last 90 days'
    } else if (durationValue === 'last_12_months') {
        return 'Last 12 Months'
    } else if (durationValue === 'custom') {
        return 'Custom'
    }
}

export const getDateWithDuration = (duration: string): { startDate: string, endDate: string } => {
    const today = new Date();
    const returnData = {
        startDate: new Date(0).toLocaleDateString('en-US'),
        endDate: today.toLocaleDateString('en-US')
    }
    if (duration === 'all') {
        returnData.startDate = new Date(0).toLocaleDateString('en-US');
    } else if (duration === 'today') {
        returnData.startDate = new Date().toLocaleDateString('en-US');
    } else if (duration === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        returnData.startDate = yesterday.toLocaleDateString('en-US');
        returnData.endDate = yesterday.toLocaleDateString('en-US')
    } else if (duration === 'last_7_days') {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        returnData.startDate = sevenDaysAgo.toLocaleDateString('en-US');
    } else if (duration === 'last_30_days') {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        returnData.startDate = thirtyDaysAgo.toLocaleDateString('en-US');
    } else if (duration === 'last_90_days') {
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        returnData.startDate = ninetyDaysAgo.toLocaleDateString('en-US');
    } else if (duration === 'last_12_months') {
        const twelveMonthAgo = new Date(today);
        twelveMonthAgo.setDate(today.getDate() - 365);
        returnData.startDate = twelveMonthAgo.toLocaleDateString('en-US');
    }
    return returnData;
}

export const getTwelveMonthAgoDate = () => {
    const today = new Date();
    const twelveMonthAgo = new Date(today);
    twelveMonthAgo.setDate(today.getDate() - 365);
    return twelveMonthAgo.toLocaleDateString('en-US');
}

export function getPersonName(person: any): string {
    let name = 'None';
    if (person == null) { return name }
    if (person.firstName != null && person.firstName.length > 0) {
        name = person.firstName;
    }
    if (person.lastName != null && person.lastName.length > 0) {
        name = `${name} ${person.lastName}`;
    }
    return name;
}

export function getLineChartColor(index: number): string {
    if (index === 0) {
        return colorPalette.primary
    } else if (index === 1) {
        return colorPalette.darkBackground
    } else if (index === 2) {
        return '#8481DD'
    } else if (index === 3) {
        return colorPalette.fsGray
    } else if (index === 4) {
        return '#a674e9'
    } else if (index === 5) {
        return '#C9190B'
    } else if (index === 6) {
        return '#8481DD'
    } else if (index === 7) {
        return '#8F4700'
    } else if (index === 8) {
        return '#7D1007'
    } else if (index === 9) {
        return '#003737'
    } else if (index === 10) {
        return '#38812F'
    }
    return colorPalette.fsGray
}

export function getHealthScoreName(count: number) {
    if (count === 0) {
        return 'Poor';
    } else if (count === 50) {
        return 'Average';
    } else if (count === 100) {
        return 'Good';
    } else {
        return 'None'
    }
}

export function getAPIErrorMessage(error: any): string {
    return error?.response?.data?.message || ''
}

export function getEmailRecipientDesc(recordType: string): string {
    if (recordType === 'task') {
        return `Email will be sent to owner's email`;
    } else if (recordType === 'person') {
        return `Email will be send to person's email`;
    }
    return `Email will be sent to company's person of contact`
}

export function parseDataType(value: string): number | Date | boolean | string {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
        return numberValue;
    }
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
        return dateValue;
    }
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true') {
        return true;
    } else if (lowerValue === 'false') {
        return false;
    }
    return value;
}