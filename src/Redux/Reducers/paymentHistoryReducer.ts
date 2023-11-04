export const FETCH_HIS = 'FETCH_HIS';
export const SET_HIS = 'SET_HIS';

export const paymentHistoryReducer = (state = null, action: any) => {
    switch (action.type) {
        case FETCH_HIS:
            return action.subs;
        case SET_HIS:
            return action.subs;
        default:
            return state;
    }
};

// ACTION
export const fetchPaymentHistoryRedux = (subs: any) => ({
    type: FETCH_HIS,
    subs,
});

export const setPaymentHistoryRedux = (subs: any) => ({
    type: SET_HIS,
    subs,
});
