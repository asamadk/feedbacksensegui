import { Box } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { getTemplatesDisplayAPI } from '../../Utils/Endpoints'
import { TEMPLATE_KEY, USER_UNAUTH_TEXT } from '../../Utils/Constants';
import { handleLogout } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';
import DynamicComponentDisplay from '../../SurveyEngine/DynamicComponentDisplay';
import SurveyEndPage from '../../SurveyEngine/Core/SurveyEndPage';
// import '../../CssStyles/Reset.css';

function TemplateDetailRightPanel({
  template
}: { template: any }) {

  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [surveyDiplays, setSurveyDisplays] = useState<any[]>([]);
  const [surveyTheme, setSurveyTheme] = useState<any>();
  const [background, setBackground] = useState<any>();
  const [currentSurvey, setCurrentSurvey] = useState<any>();
  const [currentPageData, setCurrentPagedata] = useState<any>();
  const [showEnd, setShowEnd] = useState(false);

  useEffect(() => {
    fetchTemplateDisplayData();
  }, []);

  const fetchTemplateDisplayData = async () => {
    try {
      const url = getTemplatesDisplayAPI(template?.id);
      setLoading(true);
      const { data } = await axios.get(url, { withCredentials: true });
      setLoading(false);
      if (data?.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      let resData: any = data?.data;
      if (resData == null) {
        return;
      }
      setCurrentPage(0);
      setSurveyDisplays(resData.nodes);
      setSurveyTheme(resData.theme);
      setBackground(resData.background)
      setCurrentSurvey(resData.nodes[0]);
      populateComponentData(resData.nodes[0]);
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const populateComponentData = (comp: any) => {
    if (comp == null) { return; }
    const compConfigStr: string = comp?.data?.compConfig
    if (compConfigStr != null && compConfigStr.length > 0) {
      setCurrentPagedata(JSON.parse(compConfigStr));
    }
  }

  const next = () => {
    if (currentPage < surveyDiplays?.length - 1) {
      const nextPage = surveyDiplays[currentPage + 1];
      if (nextPage != null) {
        setCurrentSurvey(nextPage);
        populateComponentData(nextPage);
        setCurrentPage(currentPage + 1);
        setShowEnd(false);
      }
    } else {
      setShowEnd(true);
      setTimeout(() => {
        setShowEnd(false);
        setCurrentPage(0);
        setCurrentSurvey(surveyDiplays[0]);
        populateComponentData(surveyDiplays[0]);
      }, 2000);
    }
  }

  return (
    <Box>
      {showEnd === true ?
        <SurveyEndPage /> :
        <Box className={background?.value} sx={{ height: 'calc(100vh - 58px)', backgroundColor: '#ffffff', overflowY: 'scroll' }} >
          <Box>
            <DynamicComponentDisplay
              theme={surveyTheme}
              compId={currentSurvey?.data?.compId}
              data={currentPageData}
              next={next}
              uiId={currentSurvey?.data?.uId}
              surveyId={TEMPLATE_KEY}
            />
          </Box>
        </Box>
      }
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default TemplateDetailRightPanel