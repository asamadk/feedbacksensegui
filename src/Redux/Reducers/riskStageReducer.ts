export const SET_RISK_STAGE = 'SET_RISK_STAGE';

export const riskStageReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_RISK_STAGE:
            return action.riskStage;
        default:
            return state;
    }
};

// ACTION

export const setGlobalRiskStages = (riskStage: any[]) => ({
    type: SET_RISK_STAGE,
    riskStage,
});