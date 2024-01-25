import { SET_BACKGROUND_COLOR } from "../Actions/backgroundModeAction";

// const initialState = {
//   backgroundColor: '#081213', // Default to black
//   secondaryColor : '#071011', //Darker shade
//   primaryColor : '#212a2b' //Lighter shade
// };

const initialState = {
  backgroundColor: '#ffffff', // Default to black
  secondaryColor : '#f2f2f2', //Darker shade
  primaryColor : '#A4E3B5' //Lighter shade
};


function colorReducer(state = initialState, action : any) {
  switch (action.type) {
    case SET_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColor: action.payload?.backgroundColor,
        secondaryColor: action.payload?.secondaryColor,
        primaryColor : action.payload?.primaryColor,
      };
    default:
      return state;
  }
}

export default colorReducer;
