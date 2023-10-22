export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const currentUserReducer = (state = null, action: any) => {
    switch (action.type) {
        case FETCH_CURRENT_USER:
            return action.currentUser;
        case SET_CURRENT_USER:
            return {...action.currentUser};
        default:
            return state;
    }
};

// ACTION
export const fetchCurrentUser = (currentUser: any) => ({
    type: FETCH_CURRENT_USER,
    currentUser,
});

export const setCurrentUsers = (currentUser: any) => ({
    type: SET_CURRENT_USER,
    currentUser,
});