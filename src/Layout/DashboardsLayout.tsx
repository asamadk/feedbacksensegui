import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import axios from 'axios';
import { getCompanyPeopleOptionURL } from '../Utils/Endpoints';
import { setCompanyList } from '../Redux/Reducers/companyReducer';
import { setPeopleOptions } from '../Redux/Reducers/peopleOptionReducer';

function DashboardsLayout() {

  const snackbarRef: any = useRef(null);
  const dispatch = useDispatch();
  
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

  return (
    <>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </>
  )
}

export default DashboardsLayout