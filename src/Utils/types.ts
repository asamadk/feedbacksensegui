export type genericModalData = {
    header : string,
    description : string,
    warning : string,
    successButtonText : string,
    cancelButtonText : string,
    type : string
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