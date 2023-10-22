export const FETCH_USERS = 'FETCH_USERS';
export const ADD_USERS = 'ADD_USERS';
export const SET_USERS = 'SET_USERS';

export const usersReducer = (state = [], action: any) => {
    switch (action.type) {
        case FETCH_USERS:
            return action.users;
        case ADD_USERS:
            return [...state, action.user];
        case SET_USERS:
            return action.users;
        default:
            return state;
    }
};

// ACTION
export const fetchUsers = (users: any[]) => ({
    type: FETCH_USERS,
    users,
});

export const setUsers = (users: any[]) => ({
    type: SET_USERS,
    users,
});

export const addUser = (user: any) => ({
    type: ADD_USERS,
    user,
});