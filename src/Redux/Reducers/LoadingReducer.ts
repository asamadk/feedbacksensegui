export const SET_LOADER = 'SET_LOADER';

export const loadingReducer = (state = false, action: any) => {
    switch (action.type) {
        case SET_LOADER:
            return action.isLoading;
        default:
            return state;
    }
};

export const setLoader = (isLoading: boolean) => ({
    type: SET_LOADER,
    isLoading,
});