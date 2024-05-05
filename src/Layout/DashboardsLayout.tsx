import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import axios from 'axios';
import { getCompanyPeopleOptionURL, getJourneyStageURL, getJourneySubStageURL } from '../Utils/Endpoints';
import { setCompanyList } from '../Redux/Reducers/companyReducer';
import { setPeopleOptions } from '../Redux/Reducers/peopleOptionReducer';
import { setGlobalStages } from '../Redux/Reducers/journeyStageReducer';
import { setGlobalSubStages } from '../Redux/Reducers/journeySubStageReducer';

function DashboardsLayout() {

  const snackbarRef: any = useRef(null);
  const dispatch = useDispatch();

  const globalStage = useSelector((state: any) => state.stage);
  const globalSubStage = useSelector((state: any) => state.subStage);
  const companiesState = useSelector((state: any) => state.companies);

  const [loading, setLoading] = React.useState(false);

  let init = false;

  useEffect(() => {
    if (init === false) {
      initialize();
      init = true;
    }
  }, []);


  async function initialize() {
    if (companiesState == null || companiesState.length < 1) {
      fetchCompanyPersonOptions();
    }
    fetchStages();
    fetchSubStages();
  }

  async function fetchCompanyPersonOptions() {
    try {
      setLoading(true);
      const { data } = await axios.get(getCompanyPeopleOptionURL(), { withCredentials: true });
      const res = data.data;
      if (res) {
        if (res.companies) {
          dispatch(setCompanyList(res.companies));
        }
        if (res.people) {
          dispatch(setPeopleOptions(res.people));
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function fetchStages() {
    try {
      setLoading(true);
      if (globalStage == null || globalStage.length < 1) {
        const { data } = await axios.get(getJourneyStageURL(), { withCredentials: true });
        if (data.data) {
          dispatch(setGlobalStages(data.data));
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function fetchSubStages() {
    try {
      setLoading(true);
      if (globalSubStage == null || globalSubStage.length < 1) {
        const { data } = await axios.get(getJourneySubStageURL(), { withCredentials: true });
        if (data.data) {
          dispatch(setGlobalSubStages(data.data));
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  return (
    <>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </>
  )
}

export default DashboardsLayout