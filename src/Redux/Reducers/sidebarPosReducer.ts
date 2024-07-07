export const SET_POSITION = 'SET_POSITION';

export const sideBarReducer = (state = 'Dashboard', action: any) => {
    switch (action.type) {
        case SET_POSITION:
            return action.pos;
        default:
            return state;
    }
};

// ACTION

export const setSideBarPosition = (pos: string) => ({
    type: SET_POSITION,
    pos,
});