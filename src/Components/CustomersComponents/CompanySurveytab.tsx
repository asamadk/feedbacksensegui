import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import { colorPalette } from '../../Utils/Constants';

function CompanySurveyTab() {

  const col: string[] = ['Survey Name', 'Owner', 'Created Date', 'Action'];
  const [metrics, setMetrics] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);

  
  useEffect(() => {
    const tmp = [
      {id: 1,count: 10,label: 'Total Survey Sent'},
      {id: 2,count: 2,label: 'Total submitted surveys'},
      {id: 3,count: '95%',label: 'Completion rate'}
    ];
    setMetrics(tmp);

    const res = [
      {id : 1,name : 'H/M CSAT Survey',owner : 'Adam Perret',date : '12/08/24'},
      {id : 2,name : 'H/M CSAT Survey',owner : 'Adam Perret',date : '12/08/24'},
      {id : 3,name : 'H/M CSAT Survey',owner : 'Adam Perret',date : '12/08/24'},
      {id : 4,name : 'H/M CSAT Survey',owner : 'Adam Perret',date : '12/08/24'},
    ];
    setSurveys(res);
  },[]);

  return (
    <Box padding={'20px 40px'} >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
          <Typography variant='h5' >Survey Responses</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }} >
        {
          metrics?.map(metric => (
            <Box>
              <Typography variant='h2' sx={{ color: colorPalette.primary }} >{metric.count}</Typography>
              <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{metric.label}</Typography>
            </Box>
          ))
        }
      </Box>
      <Box marginTop={'20px'} >
        <TableContainer sx={{ backgroundColor: colorPalette.textSecondary, border: 'none', height: 'calc(100vh - 335px)' }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow >
                {col?.map((column: string) => (
                  <TableCell sx={{ fontWeight: '600' }} key={column}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                surveys?.map(survey => (
                  <TableRow key={survey.id} >
                    <TableCell>
                      <b style={{color : colorPalette.primary}} >{survey.name}</b>
                    </TableCell>
                    <TableCell>
                      {survey.owner}
                    </TableCell>
                    <TableCell>
                      {survey.date}
                    </TableCell>
                    <TableCell>
                      <IconButton size='small' >
                          <EditIcon sx={{color : colorPalette.fsGray}} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default CompanySurveyTab