//Import Mixpanel SDK
import mixpanel from "mixpanel-browser";
 
export function initMixpanel(){
  const token = process.env.REACT_APP_MIXPANEL_TOKEN as string
  if(process.env.REACT_APP_ENV != 'prod'){
    return;
  }
  mixpanel.init(token, {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
}