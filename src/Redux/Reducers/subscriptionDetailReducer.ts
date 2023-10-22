export const FETCH_SUBS = 'FETCH_SUBS';
export const SET_SUBS = 'SET_SUBS';

export const subscriptionDetailReducer = (state = null, action: any) => {
    switch (action.type) {
        case FETCH_SUBS:
            return action.subs;
        case SET_SUBS:
            return action.subs;
        default:
            return state;
    }
};

// ACTION
export const fetchSubscriptionDetailRedux = (subs: any) => ({
    type: FETCH_SUBS,
    subs,
});

export const setSubscriptionDetailRedux = (subs: any) => ({
    type: SET_SUBS,
    subs,
});
