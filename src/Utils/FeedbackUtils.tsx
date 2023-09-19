import { Dayjs } from "dayjs";
import { SURVEY_LOCAL_KEY, USER_LOCAL_KEY } from "./Constants";
import { logout } from "./Endpoints";
import { logicType } from "./types";
import { DEFAULT_KEY } from "../SurveyEngine/CoreUtils/CoreConstants";

export const getUserId = (): string => {
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


export const validateSurveyDisplay = (data: any, componentId: number | undefined): string | null => {
    switch (componentId) {
        case 1:
            break;
        case 5:
            if (data.answer == null || data.answer?.length < 1) {
                return 'Please provide an answer before moving forward.';
            }
            break;
        case 13:
            // const dateData: Dayjs | null = data;
            const dateData = data;
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

            // if (data.leftText == null || data.leftText?.length < 1) {
            //     return 'Left text field cannot be empty.'
            // }

            // if (data.rightText == null || data.rightText?.length < 1) {
            //     return 'Right text field cannot be empty.'
            // }
            break;
        case 14:
            return 'Important : Please update the selector node.';
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
        return '#00B3EC';
    } else if (id === 2) {
        return '#F6AE2D';
    } else if (id === 3) {
        return '#9E4784';
    } else if (id === 4) {
        return '#F26419';
    } else if (id === 5) {
        return '#539165';
    } else if (id === 6) {
        return '#EA8FEA';
    } else if (id === 7) {
        return '#E9967A';
    } else if (id === 8) {
        return '#E4DCCF';
    } else if (id === 11) {
        return '#0F6292';
    } else if (id === 13) {
        return '#9E4784';
    }
    return '#f1f1f1';
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

export const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const modalTabList = [
    { id: 1, name: 'GENERAL' },
    { id: 2, name: 'LOGIC' },
];