// userRoleReducer.js
const userRoleReducer = (state = null, action : any) => {
    switch (action.type) {
      case 'SET_USER_ROLE':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default userRoleReducer;
  