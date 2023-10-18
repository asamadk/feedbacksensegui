import { userRoleType } from "../../Utils/types";

// userRoleActions.js
export const setUserRole = (role : userRoleType) => {
    return {
      type: 'SET_USER_ROLE',
      payload: role,
    };
  };
  