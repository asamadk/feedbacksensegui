import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import axios from 'axios';
import { getCompanyPeopleOptionURL, getJourneyStageURL, getJourneySubStageURL, getUserListAPI } from '../Utils/Endpoints';
import { setCompanyList } from '../Redux/Reducers/companyReducer';
import { setPeopleOptions } from '../Redux/Reducers/peopleOptionReducer';
import { setGlobalStages } from '../Redux/Reducers/journeyStageReducer';
import { setGlobalSubStages } from '../Redux/Reducers/journeySubStageReducer';
import { Box, Tab, Tabs } from '@mui/material';
import { colorPalette } from '../Utils/Constants';
import ClientCompass from '../Components/Dashboards/ClientCompass';
import UsageCompass from '../Components/Dashboards/UsageCompass';
import { setGlobalRiskStages } from '../Redux/Reducers/riskStageReducer';
import { setUsers } from '../Redux/Reducers/usersReducer';
import DashboardCompass from '../Components/Dashboards/DashboardCompass';

function DashboardsLayout() {

  const snackbarRef: any = useRef(null);
  const dispatch = useDispatch();

  const globalStage = useSelector((state: any) => state.stage);
  const companiesState = useSelector((state: any) => state.companies);
  const userState = useSelector((state: any) => state.users);

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
    getUserList();
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
          const res = data.data;
          dispatch(setGlobalStages(res.stage));
          dispatch(setGlobalSubStages(res.onboarding));
          dispatch(setGlobalRiskStages(res.risk));
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  const getUserList = async (): Promise<void> => {
    try {
        if (userState == null || userState.length < 1) {
            setLoading(true);
            let { data } = await axios.get(getUserListAPI(), { withCredentials: true });
            setLoading(false);
            if (data?.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }

            if (data.data != null) {
                dispatch(setUsers(data.data))
            }
        }
    } catch (error) {
        setLoading(false);
        handleUnAuth(error);
    }
}

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', background: colorPalette.textSecondary }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="1" label="Client Compass" />
          {/* <Tab value="2" label="Usage Console" /> */}
          <Tab value="3" label="Revenue Compass" />
        </Tabs>
      </Box>
      {value === '1' && <ClientCompass/>}
      {value === '2' && <UsageCompass/>}
      {value === '3' && <DashboardCompass/>}
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </>
  )
}

export default DashboardsLayout