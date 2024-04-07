export const SET_COMPANIES = 'SET_COMPANIES';

export const companyReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_COMPANIES:
            return action.companies;
        default:
            return state;
    }
};

// ACTION

export const setCompanyList = (companies: any[]) => ({
    type: SET_COMPANIES,
    companies,
});