export const SET_PEOPLE = 'SET_PEOPLE';

export const peopleReducer = (state = [], action: any) => {
    switch (action.type) {
        case SET_PEOPLE:
            return action.people;
        default:
            return state;
    }
};

// ACTION

export const setPeopleOptions = (people: any[]) => ({
    type: SET_PEOPLE,
    people,
});