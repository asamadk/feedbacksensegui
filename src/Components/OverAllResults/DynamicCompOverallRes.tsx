import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DynamicComponentIcon from '../../FlowComponents/DynamicComponentIcon'
import { getComponentNameById, handleLogout } from '../../Utils/FeedbackUtils'
import DynamicOverallCharts from './DynamicOverallCharts'
import { getOverAllComponentsData } from '../../Utils/Endpoints'
import FSLoader from '../FSLoader'
import Notification from '../../Utils/Notification'
import axios from 'axios'
import { USER_UNAUTH_TEXT } from '../../Utils/Constants'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const mainContainer = (bgColor : string) => {
  return {
    margin: '20px',
    marginTop: '25px',
    border: '1px #454545 solid',
    borderRadius: '6px',
    backgroundColor: bgColor
  }
}

const mainTextStyle = {
  color: '#f1f1f1',
  textAlign: 'start',
  fontSize: '16px',
  fontWeight: '500',
  marginBottom: '15px',
  paddingTop: '10px',
  paddingLeft: '10px'
}

function DynamicCompOverallRes(props: any) {

  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [overAllComponentData, setOverAllComponentData] = useState<any>({});
  const [idMap,setIdMap] = useState<any>({});

  let init = false;

  useEffect(() => {
    if(init === false){
      fetchOverAllComponentData();
      init = true;
    }
  }, []);

  const fetchOverAllComponentData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(getOverAllComponentsData(props.surveyId), { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      setIdMap(data?.data?.idMap);
      setOverAllComponentData(data?.data?.info);
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  return (
    <Box>
      {
        Object.keys(overAllComponentData).map(key => {
          return (
            <ComponentOverAllResponse idMap={idMap} id={key} data={overAllComponentData[key]} />
          )
        })
      }
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default DynamicCompOverallRes

const subContainerStyle = {
  display: 'flex',
}

type propsType = {
  id: string,
  data: any,
  idMap :any
}

function ComponentOverAllResponse(props: propsType) {

  const defaultColor = useSelector((state: any) => state.colorReducer);

  return (
    <Box sx={mainContainer(defaultColor?.primaryColor)} >
      <Box sx={subContainerStyle} >
        <Box sx={{ marginTop: '10px', marginLeft: '10px' }} >
          <DynamicComponentIcon id={props.idMap[props?.id]} />
        </Box>
        <Typography sx={mainTextStyle}>{getComponentNameById(props.idMap[props?.id])}</Typography>
      </Box>
      <Divider sx={{ borderTop: '1px #454545 solid', marginBottom: '20px' }} />
      <DynamicOverallCharts id={props.idMap[props?.id]} data={props.data} />
    </Box>
  )
}