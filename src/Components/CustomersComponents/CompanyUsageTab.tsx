import { Box, Button, Grid, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, linearProgressClasses, styled } from '@mui/material'
import { containedButton } from '../../Styles/ButtonStyle'
import React, { useEffect, useState } from 'react'
import Groups2Icon from '@mui/icons-material/Groups2';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { colorPalette, getUsageTimeFilter } from '../../Utils/Constants'

const usageContainer = {
  border: `1px ${colorPalette.textSecondary} solid`,
  borderRadius: '6px',
  height: '400px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
  marginBottom: '20px'
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 20,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? colorPalette.primary : '#308fe8',
  },
}));

const col: string[] = ['Name', 'Account', 'Total Events', 'Active Days', 'Time in App (min)'];


function CompanyUsageTab() {

  const [usageDurationVal, setUsageDurationValue] = useState<string>('last_90_days');
  const [eventDetails, setEventDetails] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);

  useEffect(() => {
    const tmp = [
      { label: 'Login', percentage: 51, oldData: '2,841', newData: '4.8K', status: 'up' },
      { label: 'Posted to Twitter', percentage: 25, oldData: '2,841', newData: '4.8K', status: 'up' },
      { label: 'Email Sent', percentage: 9, oldData: '459', newData: '4.8K', status: 'up' },
    ];
    setEventDetails(tmp);

    const res = [
      {id : 1,name : 'Adam',account : 'Autism Aware',totalEvents : 1024,days : 85, timeInApp : 540}
    ];
    setPeople(res);
  }, []);

  return (
    <Box sx={{ height: 'calc(100vh - 170px)', overflowY: 'scroll' }} padding={'20px 40px'} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }} >
        <Typography variant='h5' >Usage Report</Typography>
        <Box>
          <label style={{ color: colorPalette.fsGray, marginRight: '10px' }} >Show usage for :</label>
          <Select
            size='small'
            id="demo-simple-select"
            value={usageDurationVal}
          >
            {getUsageTimeFilter().map(fil => <MenuItem value={fil.value}>{fil.label}</MenuItem>)}
          </Select>
        </Box>
      </Box>
      <Box sx={usageContainer} ></Box>

      <Box sx={{ textAlign: 'start', marginTop: '50px' }} >
        <Typography variant='h5' ><EmojiEventsIcon />Usage Report</Typography>
        <Box sx={{ flexGrow: 1, color : colorPalette.fsGray, fontSize : '10px' }}>
          <Grid sx={{ marginTop: '5px' }} container spacing={3}>
            <Grid item xs>
              <Typography>Event Name</Typography>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid sx={{textAlign : 'end'}} item xs>
              <Typography>Instances</Typography>
            </Grid>
          </Grid>
          <Box sx={{padding : '20px'}} >
            {
              eventDetails?.map(e => (
                <Grid sx={{ marginTop: '10px'}} container spacing={3}>
                  <Grid item xs>
                    <Typography sx={{color : colorPalette.primary}} >{e.label}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                      <BorderLinearProgress variant="determinate" value={e.percentage}  />
                  </Grid>
                  <Grid sx={{textAlign : 'end'}} item xs>
                    <Typography>{e.oldData}/{e.newData}</Typography>
                  </Grid>
                </Grid>
              ))
            }
          </Box>
        </Box>
      </Box>

      <Box sx={{marginTop: '50px',textAlign : 'start' }} >
        <Typography variant='h5' ><ViewStreamIcon/>Time Spent in App Over Time</Typography>
        <Box sx={{...usageContainer,marginTop : '10px'}} ></Box>    
      </Box>

      <Box sx={{marginTop: '50px',textAlign : 'start' }} >
        <Typography variant='h5' ><Groups2Icon/>Top Contacts</Typography>
        <TableContainer sx={{ backgroundColor: colorPalette.textSecondary, border: 'none',marginTop : '10px'}} >
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
                people?.map(person => (
                  <TableRow key={person.id} >
                    <TableCell>
                      {person.name}
                    </TableCell>
                    <TableCell>
                      {person.account}
                    </TableCell>
                    <TableCell>
                      {person.totalEvents}
                    </TableCell>
                    <TableCell>
                      {person.days}
                    </TableCell>
                    <TableCell>
                      {person.timeInApp}
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

export default CompanyUsageTab