import { Box, Button, Grid, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, linearProgressClasses, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Groups2Icon from '@mui/icons-material/Groups2';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { colorPalette, getUsageTimeFilter } from '../../Utils/Constants'
import { tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import UsageEventDetailChart from '../../ChartComponents/UsageEventDetailChart';
import UsageTimeSpent from '../../ChartComponents/UsageTimeSpent';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { getEventsOverTimeData, getTimeSpentDataURL, getTopUsagePeopleURL } from '../../Utils/Endpoints';
import FSLoader from '../FSLoader';

const usageContainer = {
  border: `1px ${colorPalette.textSecondary} solid`,
  borderRadius: '6px',
  height: '400px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
  marginBottom: '20px',
  paddingTop: '20px',
  textAlign: 'start'
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

const col: string[] = ['Name', 'Company', 'Total Events', 'Active Days'];


function CompanyUsageTab(props: { companyId: string | null, personId: string | null }) {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = useState(false);
  const [usageDurationVal, setUsageDurationValue] = useState<string>('last_90_days');
  const [events, setEvents] = useState([]);
  const [eventDetails, setEventDetails] = useState<any[]>([]);
  const [timeSpentData, setTimeSpentData] = useState([]);
  const [people, setPeople] = useState<any[]>([]);

  let init = false;

  useEffect(() => {
    if (init === false) {
      fetchEventsOverTime();
      fetchTimeSpentOverTime();
      fetchTopUsagePeople();
      init = true;
    }
  }, []);

  function populateDataForEventDetails(data: any) {
    const labelCount = new Map<string, number>();
    data?.forEach((d: any) => {
      let count = labelCount.get(d.eventName);
      if (count == null) { count = 0; }
      count++
      labelCount.set(d.eventName, count);
    });
    const transformedData: any = [];

    let id = 0;
    labelCount.forEach((val, key) => {
      transformedData.push({
        id: id++,
        label: key,
        oldData: val,
        newData: data?.length,
        percentage: (val * 100) / data?.length
      })
    });
    setEventDetails(transformedData);
  }

  async function fetchEventsOverTime() {
    try {
      setLoading(true);
      const url = getEventsOverTimeData(
        usageDurationVal,
        props.personId != null ? props.personId : '',
        props.companyId != null ? props.companyId : ''
      );
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.data) {
        const resData = data.data;
        console.log("🚀 ~ fetchEventsOverTime ~ resData:", resData)
        setEvents(resData);
        populateDataForEventDetails(resData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function fetchTimeSpentOverTime() {
    try {
      setLoading(true);
      const url = getTimeSpentDataURL(
        usageDurationVal,
        props.personId != null ? props.personId : '',
        props.companyId != null ? props.companyId : ''
      );
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.data) {
        const resData = data.data;
        setTimeSpentData(resData);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  async function fetchTopUsagePeople() {
    if (props.companyId == null) { return; }
    try {
      setLoading(true);
      const url = getTopUsagePeopleURL(
        usageDurationVal,
        props.companyId != null ? props.companyId : ''
      );
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.data) {
        const resData = data.data;
        setPeople(resData)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

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
            onChange={(e) => setUsageDurationValue(e.target.value)}
          >
            {getUsageTimeFilter().map(fil => <MenuItem value={fil.value}>{fil.label}</MenuItem>)}
          </Select>
        </Box>
      </Box>

      <Typography textAlign={'start'} variant='h5' margin={'20px 0px'} ><SsidChartIcon />Events Over Time</Typography>
      <Box sx={usageContainer} >
        <UsageEventDetailChart data={events} />
      </Box>

      <Box sx={{ textAlign: 'start', marginTop: '50px' }} >
        <Typography variant='h5' ><EmojiEventsIcon />Event Details</Typography>
        <Box sx={{ flexGrow: 1, color: colorPalette.fsGray, fontSize: '10px' }}>
          <Grid sx={{ marginTop: '5px' }} container spacing={3}>
            <Grid item xs>
              <Typography>Event Name</Typography>
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid sx={{ textAlign: 'end' }} item xs>
              <Typography>Instances</Typography>
            </Grid>
          </Grid>
          <Box sx={{ padding: '20px' }} >
            {
              eventDetails?.map(e => (
                <Grid sx={{ marginTop: '10px' }} container spacing={3}>
                  <Grid item xs>
                    <Typography sx={{ color: colorPalette.primary }} >{e.label}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <BorderLinearProgress variant="determinate" value={e.percentage} />
                  </Grid>
                  <Grid sx={{ textAlign: 'end' }} item xs>
                    <Typography>{e.oldData}/{e.newData}</Typography>
                  </Grid>
                </Grid>
              ))
            }
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginTop: '50px', textAlign: 'start' }} >
        <Typography variant='h5' ><ViewStreamIcon />Time Spent in App Over Time</Typography>
        <Box sx={{ ...usageContainer, marginTop: '10px' }} >
          <UsageTimeSpent data={timeSpentData} />
        </Box>
      </Box>

      {
        props.companyId != null &&
        <Box sx={{ marginTop: '50px', textAlign: 'start' }} >
          <Typography variant='h5' ><Groups2Icon />Top Contacts</Typography>
          <TableContainer sx={tableContainerStyle} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow >
                  {col?.map((column: string) => (
                    <TableCell sx={{ ...tableCellStyle, fontWeight: '600', background: colorPalette.secondary }} key={column}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  people?.map(person => (
                    <TableRow key={person.id} >
                      <TableCell sx={tableCellStyle} >
                        {person.personName}
                      </TableCell>
                      <TableCell sx={tableCellStyle} >
                        {person.company}
                      </TableCell>
                      <TableCell sx={tableCellStyle} >
                        {person.totalEvents}
                      </TableCell>
                      <TableCell sx={tableCellStyle} >
                        {person.activeDays}
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      }
      <FSLoader show={loading} />
    </Box>
  )
}

export default CompanyUsageTab