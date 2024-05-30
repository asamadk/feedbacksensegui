import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SURVEY_OPEN_SOURCE, colorPalette } from '../../Utils/Constants';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { getCompanySurveyMetricsURL, getCompanySurveyResponseURL, getPersonSurveyMetricsURL, getPersonSurveyResponseURL } from '../../Utils/Endpoints';
import { getPersonName, handleUnAuth } from '../../Utils/FeedbackUtils';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';
import { updateCurrentWorkflow } from '../../Redux/Actions/currentWorkflowActions';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

function CompanySurveyTab(props: { personId: string | null, companyId: string | null }) {

  const snackbarRef: any = useRef(null);
  const col: string[] = ['Survey Name', 'Respondent', 'Response Date', 'Action'];

  let navigation = useNavigate();
  const dispatch = useDispatch<any>();

  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  let init = false;
  useEffect(() => {
    if (init === false) {
      fetchCompanySurveys();
      populateMetrics();
      init = true;
    }
  }, []);

  async function populateMetrics() {
    try {
      setLoading(true);
      let URL = getCompanySurveyMetricsURL(props.companyId != null ? props.companyId : '');
      if (props.personId != null) {
        URL = getPersonSurveyMetricsURL(props.personId != null ? props.personId : '');
      }
      const { data } = await axios.get(URL, { withCredentials: true });
      if (data.data) {
        setMetrics(data.data);
      }
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function fetchCompanySurveys() {
    try {
      setLoading(true);
      let URL = getCompanySurveyResponseURL(props.companyId != null ? props.companyId : '');
      if (props.personId != null) {
        URL = getPersonSurveyResponseURL(props.personId != null ? props.personId : '');
      }
      const { data } = await axios.get(URL, { withCredentials: true });
      if (data.data) {
        const list = data.data.list;
        setSurveys(list);
      }
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  const handleOpenSurvey = (surveyId: string) => {
    dispatch(updateCurrentWorkflow(surveyId));
    navigation('/survey/detail/create/' + surveyId);
  }

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Survey Responses</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} >
        {
          metrics?.map(metric =>
            <Box sx={{ borderRadius: '6px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px', padding: '20px', textAlign: 'center', background: colorPalette.textSecondary, width: '15%' }} >
              <Typography fontSize={13} fontWeight={600} >{metric.name}</Typography>
              <Typography marginTop={'10px'} variant='h4' fontWeight={600} >{metric?.score}</Typography>
            </Box>
          )
        }
      </Box>

      <Box marginTop={'20px'} >
        <TableContainer sx={{ ...tableContainerStyle, height: 'calc(100vh - 355px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle, fontWeight: '600', background: colorPalette.textSecondary }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                surveys?.map(response => (
                  <TableRow key={response.id} >
                    <TableCell sx={tableCellStyle} >
                      <b>{response.survey.name}</b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {getPersonName(response.person)}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {new Date(response.created_at).toDateString()}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <IconButton onClick={() => handleOpenSurvey(response?.survey?.id)} size='small' >
                        <ArrowForwardIosIcon sx={{ color: colorPalette.fsGray }} fontSize='small' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default CompanySurveyTab