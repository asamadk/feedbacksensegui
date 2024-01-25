import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DynamicComponentIcon from '../../FlowComponents/DynamicComponentIcon'
import { getComponentNameById, handleLogout } from '../../Utils/FeedbackUtils'
import DynamicOverallCharts from './DynamicOverallCharts'
import { getOverAllComponentsData } from '../../Utils/Endpoints'
import FSLoader from '../FSLoader'
import Notification from '../../Utils/Notification'
import axios from 'axios'
import { USER_UNAUTH_TEXT, colorPalette } from '../../Utils/Constants'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { durationType } from '../../Utils/types'

const mainContainer = (bgColor : string) => {
  return {
    margin: '20px',
    marginTop: '25px',
    borderRadius: '6px',
    backgroundColor: bgColor,
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
  }
}

const mainTextStyle = {
  color: colorPalette.darkBackground,
  textAlign: 'start',
  fontSize: '16px',
  fontWeight: '500',
  marginBottom: '15px',
  paddingTop: '10px',
  paddingLeft: '10px'
}

type mainPropType = {
  surveyId : string,
  dateFilter : durationType,
  filterPayload : any[]
}

function DynamicCompOverallRes(props: mainPropType) {

  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [overAllComponentData, setOverAllComponentData] = useState<any>(null);
  const [idMap,setIdMap] = useState<any>({});

  let init = false;

  useEffect(() => {
    if(init === false){
      fetchOverAllComponentData();
      init = true;
    }
  }, [props.dateFilter,props.filterPayload]);

  const resetData = () => {
    setOverAllComponentData(null);
    setIdMap({});
  }

  const fetchOverAllComponentData = async () => {
    resetData();
    try {
      setLoading(true);
      const URL = getOverAllComponentsData(props.surveyId,props.dateFilter);
      const { data } = await axios.post(URL,props.filterPayload, { withCredentials: true });
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
        overAllComponentData != null && Object.keys(overAllComponentData)?.map(key => {
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
  marginBottom: '20px'
}

type propsType = {
  id: string,
  data: any,
  idMap :any
}

function ComponentOverAllResponse(props: propsType) {

  return (
    <Box sx={mainContainer(colorPalette.background)} >
      <Box sx={subContainerStyle} >
        <Box sx={{ marginTop: '10px', marginLeft: '10px' }} >
          <DynamicComponentIcon id={props.idMap[props?.id]} />
        </Box>
        <Typography sx={mainTextStyle}>{getComponentNameById(props.idMap[props?.id])}</Typography>
      </Box>
      <DynamicOverallCharts id={props.idMap[props?.id]} data={props.data} />
    </Box>
  )
}