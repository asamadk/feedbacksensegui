import { Dayjs } from "dayjs";
import { SURVEY_LOCAL_KEY, USER_LOCAL_KEY } from "./Constants";
import { logout } from "./Endpoints";

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

export const validateIsNodeDisconnected = (flow: any): boolean => {
    const uniqueNodeIds = new Set<string>();
    const edges: any[] = flow.edges;
    const nodes: any[] = flow.nodes;

    if ((edges === null || edges.length < 1) && (nodes != null && nodes.length > 1)) {
        return false;
    }

    if (edges === null || edges.length < 1) {
        return true;
    }

    for (const edge of edges) {
        uniqueNodeIds.add(edge.source);
        uniqueNodeIds.add(edge.target);
    }

    for (const node of nodes) {
        if (!uniqueNodeIds.has(node.id)) {
            return true;
        }
    }
    return false;
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
            if (data == null || data.selectedVal == null || data.selectedVal?.size < 1) {
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
    switch (componentId) {
        case 1:
            if (data.welcomeText == null || data.welcomeText?.length < 1) {
                return 'Please fill in all required fields before saving.';
            }

            if (data.buttonText == null || data.buttonText?.length < 1) {
                return 'Button text cannot be empty.';
            }
            break;
        case 3:
        case 4:
        case 11:
            if (data.question == null || data.question?.length < 1) {
                return 'Question field cannot be empty.'
            }
            if (data.answerList == null) {
                return 'Component should have at least one answer choice.'
            } else {
                const comChoiceList: string[] = data.answerList;
                for (const choice of comChoiceList) {
                    if (choice == null || choice.length < 1) {
                        return 'Answer fields cannot be empty.'
                    }
                }
            }
            break;
        case 5:
        case 13:
            if (data.question == null || data.question?.length < 1) {
                return 'Question field cannot be empty.'
            }
            break;
        case 6:
        case 7:
        case 8:
            if (data.question == null || data.question?.length < 1) {
                return 'Question field cannot be empty.'
            }

            if (data.leftText == null || data.leftText?.length < 1) {
                return 'Left text field cannot be empty.'
            }

            if (data.rightText == null || data.rightText?.length < 1) {
                return 'Right text field cannot be empty.'
            }
            break;
        default:
            break;
    }
    return null;
}

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