export const SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR';

type colorObject = {
  backgroundColor: string,
  secondaryColor: string,
}

export function setBackgroundColor(color : colorObject) {
  return {
    type: SET_BACKGROUND_COLOR,
    payload: color
  };
}
