export const SET_SETTINGS = 'SET_SETTINGS';

export const customSettingsReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_SETTINGS:
            return action.settings;
        default:
            return state;
    }
};

//Action
export const setCustomSettings = (settings: any) => ({
    type: SET_SETTINGS,
    settings,
});