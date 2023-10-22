export const FETCH_FOLDERS = 'FETCH_FOLDERS';
export const ADD_FOLDER = 'ADD_FOLDER';
export const SET_FOLDERS = 'SET_FOLDERS';

export const folderReducer = (state = [], action: any) => {
    switch (action.type) {
        case FETCH_FOLDERS:
            return action.folders;
        case ADD_FOLDER:
            return [...state, action.folder];
        case SET_FOLDERS:
            return action.folders;
        default:
            return state;
    }
};

// ACTION
export const fetchFolders = (folders: any[]) => ({
    type: FETCH_FOLDERS,
    folders,
});

export const setFolders = (folders: any[]) => ({
    type: SET_FOLDERS,
    folders,
});

export const addFolder = (folder: any) => ({
    type: ADD_FOLDER,
    folder,
});