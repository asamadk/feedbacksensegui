import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { colorPalette } from '../../Utils/Constants';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { getCompanySurveyResponseURL } from '../../Utils/Endpoints';
import { getPersonName, handleUnAuth } from '../../Utils/FeedbackUtils';
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';

function CompanySurveyTab(props: { personId: string | null, companyId: string | null }) {

  const snackbarRef: any = useRef(null);
  const col: string[] = ['Survey Name', 'Respondent', 'Response Date', 'Action'];

  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<any[]>([]);

  let init = false;
  useEffect(() => {
    if (init === false) {
      fetchCompanySurveys();
      init = true;
    }

  }, []);

  async function fetchCompanySurveys() {
    try {
      setLoading(true);
      const URL = getCompanySurveyResponseURL(props.companyId != null ? props.companyId : '');
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

  return (
    <Box padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Typography variant='h5' >Survey Responses</Typography>
      </Box>
      
      <Box marginTop={'20px'} >
        <TableContainer sx={{...tableContainerStyle, height: 'calc(100vh - 215px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead >
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ ...tableCellStyle,fontWeight: '600',background : colorPalette.secondary }} key={column}>
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
                      <b style={{ color: colorPalette.primary,cursor : 'pointer' }} >{response.survey.name}</b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <b style={{ color: colorPalette.primary,cursor : 'pointer' }} >
                        {getPersonName(response.person)}
                      </b>
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      {new Date(response.created_at).toDateString()}
                    </TableCell>
                    <TableCell sx={tableCellStyle} >
                      <IconButton size='small' >
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