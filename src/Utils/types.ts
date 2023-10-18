import { CSSProperties } from "react"
import { EdgeMarkerType } from "reactflow"

export type genericModalData = {
    header : string,
    description : string,
    warning : string,
    successButtonText : string,
    cancelButtonText : string,
    type : string,
    data? : any
}

export type surveyFlowType = {
    nodes : any[],
    edges : any[],
    viewport : any
}

export type surveyIdProp = {
    surveyId: string
}

export type orgSettingUrlParam = {
    tabset : number
}

export type authUser = {
    id : string,
    name : string,
    email : string,
    oauth_provider : string
    oauth_id : string
    organization_id : string
    created_at : Date,
    updated_at : Date,
    emailVerified : boolean
}

export type logicType = {
    id : string,
    operator : string,
    value : string,
    path : string,
    showValue ?: boolean
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