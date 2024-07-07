// src/reducers/notificationSlice.ts
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

interface NotificationState {
    message: string | null;
    status: 'success' | 'warning' | 'error' | null;
}

const initialState: NotificationState = {
    message: null,
    status: 'success',
};

export const notificationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return { message: action.message, status: action.status };
        case HIDE_NOTIFICATION:
            return initialState;
        default:
            return state;
    }
};

export const showNotification = (message: string | null, status: 'success' | 'warning' | 'error') => ({
    type: SHOW_NOTIFICATION,
    message,
    status,
});

export const hideNotification = () => ({
    type: HIDE_NOTIFICATION,
});