import { CSSProperties } from "react"
import { Step } from "react-joyride"
import { EdgeMarkerType } from "reactflow"

export type genericModalData = {
    header: string,
    description: string,
    warning: string,
    successButtonText: string,
    cancelButtonText: string,
    type: string,
    data?: any
}

export type surveyFlowType = {
    nodes: any[],
    edges: any[],
    viewport: any
}

export type surveyIdProp = {
    surveyId: string
}

export type orgSettingUrlParam = {
    tabset: number
}

export type authUser = {
    id: string,
    name: string,
    email: string,
    oauth_provider: string
    oauth_id: string
    organization_id: string
    created_at: Date,
    updated_at: Date,
    emailVerified: boolean
}

export type logicType = {
    id: string,
    operator: string,
    value: string,
    path: string,
    showValue?: boolean
}

export type DefaultEdgeOptions = {
    type?: string;
    labelStyle?: CSSProperties;
    labelShowBg?: boolean;
    labelBgStyle?: CSSProperties;
    labelBgPadding?: [number, number];
    labelBgBorderRadius?: number;
    style?: CSSProperties;
    animated?: boolean;
    hidden?: boolean;
    deletable?: boolean;
    className?: string;
    selected?: boolean;
    markerStart?: EdgeMarkerType;
    markerEnd?: EdgeMarkerType;
    zIndex?: number;
    ariaLabel?: string;
    interactionWidth?: number;
};

export type userRoleType = 'OWNER' | 'ADMIN' | 'USER' | 'GUEST';

export type durationType = { duration: string, startDate: string, endDate: string };

export type FilterCondition = {
    id: string;
    questionId: string,
    question: string;
    operator: string;
    value: string;
    logicOperator?: 'and' | 'or';
};

export interface joyrideState {
    run: boolean;
    steps: Step[];
    stepIndex : number
}

export type sideBarListType = {
    label : string,
    value : string
}

export type companyFieldType = 'owner' | 'nextRenewalDate' | 'status' | 'contractStatus' | 'address' | 'name' | 'website' | 'industry' | 'lastContactDate' | 'pointOfContact';
export type personFieldType = 'lastName' | 'firstName' | 'email' | 'phone' | 'title' | 'communicationPreferences' | 'lastContactedDate' | 'company';