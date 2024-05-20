import { Badge, Box, Button, Grid, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { outlinedButton } from '../../Styles/ButtonStyle'
import AddIcon from '@mui/icons-material/Add';
import { colorPalette, dateLiterals } from '../../Utils/Constants';
import DashboardDoughnut from '../../ChartComponents/DashboardDoughnut';
import { getCstmrJrnyStgScoreColor, npsColors, overAllCustomerHealthColors, renewedColors } from '../../Utils/DashboardConstants';
import DashboardGauge from '../../ChartComponents/DashboardGauge';
import FilterModal from '../../Modals/FilterModal';
import { getClientCompassURL } from '../../Utils/Endpoints';
import axios from 'axios';
import { handleUnAuth } from '../../Utils/FeedbackUtils';

function chipStyle(selected: boolean) {
  return {
    border: `1px solid ${colorPalette.fsGray}`,
    width: 'fit-content',
    padding: '2px 10px',
    borderRadius: '10px',
    marginRight: '5px',
    cursor: 'pointer',
    background: selected ? colorPalette.secondary : colorPalette.background,
    color: selected ? colorPalette.primary : colorPalette.darkBackground
  }
}

const blockStyle = {
  borderRadius: '6px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
  padding: '20px',
  textAlign: 'center',
  background: colorPalette.textSecondary,
  height: '110px'
  // width : '20%'
}

function ClientCompass() {

  type doughnutChartData = {
    name: string,
    value: number
  }

  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'my'>('all');
  const [dateFilter, setDateFilter] = useState<string>('Today');
  const [showAddFilter, setShowAddFilter] = useState(false);
  
  const [overAllCustomerHealth, setOverAllCustomerHealth] = useState<doughnutChartData[]>([]);
  const [quarterCustomerHealth, setQuarterCustomerHealth] = useState<doughnutChartData[]>([]);
  const [customerJourneyStage, setCustomerJourneyStage] = useState<doughnutChartData[]>([]);
  const [currentQtrRnwlContract, setCurrentQtrRnwlContract] = useState<doughnutChartData[]>([]);
  const [currentQtrChurnContract, setCurrentQtrChurnContract] = useState<doughnutChartData[]>([]);
  const [churnRiskReason, setChurnRiskReason] = useState<doughnutChartData[]>([]);
  const [npsScore, setNpsScore] = useState<doughnutChartData[]>([]);
  const [csatScore, setCsatScore] = useState<doughnutChartData[]>([]);
  const [onboardingStages, setOnboardingStages] = useState<doughnutChartData[]>([]);
  const [OnboardingHealth, setOnboardingHealth] = useState<doughnutChartData[]>([]);

  const [contractValue, setContractValue] = useState('$0');
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [qtrRenewalCompanies, setQtrRenewalCompanies] = useState(0);
  const [qtrRenewalContractVal, setQtrRenewalContractVal] = useState('$0');
  const [overdueRenewals, setOverdueRenewals] = useState(0);
  const [qtrRiskRenewal, setQtrRiskRenewal] = useState(0);
  const [qtrRiskContractVal, setQtrRiskContractVal] = useState('$0');
  const [riskContractVal, setRiskContractVal] = useState('$0')

  let init = false;
  useEffect(() => {
    if (init === false) {
      fetchData();
      init = true;
    }
  }, [filterType, dateFilter]);

  async function fetchData() {

    try {
      setLoading(true);
      const url = getClientCompassURL(dateFilter, filterType);
      const { data } = await axios.get(url, { withCredentials: true });
      const res = data?.data;
      setLoading(false);
      //Chart Data
      setOnboardingHealth(res.onboardingHealth);
      setOnboardingStages(res.onboardingStages);
      setCsatScore(res.csatScores);
      setNpsScore(res.npsScore);
      setChurnRiskReason(res.churnRiskReasons);
      setCurrentQtrChurnContract(res.qtrChurnContract);
      setCurrentQtrRnwlContract(res.qtrRenewContract);
      setQuarterCustomerHealth(res.qtrCustomerHealth);
      setOverAllCustomerHealth(res.customerHealth);
      setCustomerJourneyStage(res.journeyStage);

      //Text Data
      setContractValue(res.totalACV);
      setTotalCompanies(res.totalCompanies)
      setQtrRenewalCompanies(res.qtrRenewalCompanies);
      setQtrRenewalContractVal(res.qtrRenewalContractVal);
      setOverdueRenewals(res.overdueRenewals);
      setQtrRiskRenewal(res.qtrRiskRenewal);
      setQtrRiskContractVal(res.qtrRiskContractVal);
      setRiskContractVal(res.riskContractVal)
    } catch (error) {
      setLoading(false);
      handleUnAuth(error);
    }
  }

  function handleDateFilter(event: any) {
    const val = event.target.value;
    setDateFilter(val);
  }

  return (
    <Box sx={{ height: 'calc(100vh - 68px)', padding: '10px 20px', overflowY: 'auto' }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
        <Box sx={{ display: 'flex', height: '25px', marginTop: '15px' }} >
          <Typography sx={{ marginRight: '5px' }} >Companies</Typography>
          <Box onClick={() => setFilterType('all')} sx={chipStyle(filterType === 'all')} >All</Box>
          <Box onClick={() => setFilterType('my')} sx={chipStyle(filterType === 'my')} >My</Box>
        </Box>
        <Box>
          {/* <Select onChange={handleDateFilter} value={dateFilter} size='small' sx={{ marginTop: '10px' }} >
            {dateLiterals.map(d => <MenuItem value={d} >{d}</MenuItem>)}
          </Select> */}
        </Box>
      </Box>

      <Box marginTop={'20px'} textAlign={'start'} >
        <Typography variant='h6' fontWeight={600} marginBottom={'15px'} >Overall Customer Summary</Typography>
        <Grid container spacing={4} >
          <Grid height={'250px'} item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Total ACV</Typography>
              <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >{contractValue}</Typography>
              <Typography fontSize={13} >All Paying Companies</Typography>
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Overall Customer Health</Typography>
              <GraphSkeleton loading={loading} />
              <DashboardDoughnut colors={overAllCustomerHealthColors} data={overAllCustomerHealth} />
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Companies by Customer Journey Stage</Typography>
              <DashboardDoughnut colors={getCstmrJrnyStgScoreColor()} data={customerJourneyStage} />
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Total Companies</Typography>
              <Typography marginTop={'10px'} variant='h4' fontWeight={600} sx={{ color: colorPalette.primary }} >{totalCompanies}</Typography>
              <Typography fontSize={13} >All Paying Companies</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box marginTop={'30px'} textAlign={'start'} >
        <Typography variant='h6' fontWeight={600} marginBottom={'15px'} >Ensuring high renewal rates</Typography>
        <Grid container spacing={4} >
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Renewable Companies</Typography>
              <Typography marginTop={'10px'} sx={{ color: colorPalette.primary }} variant='h4' fontWeight={600} >{qtrRenewalCompanies}</Typography>
              <Typography fontSize={13} >All Paying Companies</Typography>
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Renewable ACV</Typography>
              <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >{qtrRenewalContractVal}</Typography>
              <Typography fontSize={13} >All Paying Companies</Typography>
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Renewable Health</Typography>
              <DashboardDoughnut colors={overAllCustomerHealthColors} data={quarterCustomerHealth} />
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Overdue Renewals</Typography>
              <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.darkBackground }} fontWeight={600} >{overdueRenewals}</Typography>
              <Typography fontSize={13} >This Quarter</Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid sx={{ marginTop: '5px' }} container spacing={4} >
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Renewals at Risk</Typography>
              <Typography marginTop={'10px'} sx={{ color: colorPalette.darkBackground }} variant='h4' fontWeight={600} >{qtrRiskRenewal}</Typography>
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Renewal Contract Value at risk</Typography>
              <Typography marginTop={'10px'} variant='h4' sx={{ color: '#FF0000' }} fontWeight={600} >{qtrRiskContractVal}</Typography>
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Renewed Contract value</Typography>
              <DashboardDoughnut colors={renewedColors} data={currentQtrRnwlContract} />
              {/* <DashboardGauge colors={renewedColors} data={currentQtrRnwlContract} /> */}
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Current Quarter Churned Contract Value</Typography>
              <DashboardDoughnut colors={renewedColors} data={currentQtrChurnContract} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box marginTop={'30px'} textAlign={'start'} >
        <Typography variant='h6' fontWeight={600} marginBottom={'15px'} >Mitigate Churn Risk</Typography>
        <Grid container spacing={4} >
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Contract Value at risk</Typography>
              <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.darkBackground }} fontWeight={600} >{riskContractVal}</Typography>
            </Box>
          </Grid>
          {/* <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Churn Risk Reason</Typography>
              <DashboardDoughnut colors={getCstmrJrnyStgScoreColor()} data={churnRiskReason} />
            </Box>
          </Grid> */}
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Latest NPS Score</Typography>
              <DashboardDoughnut colors={npsColors} data={npsScore} />
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Latest CSAT Score</Typography>
              <DashboardDoughnut colors={npsColors} data={csatScore} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box marginTop={'50px'} textAlign={'start'} >
        <Typography variant='h6' fontWeight={600} marginBottom={'15px'} >Meet Onboarding Timelines</Typography>
        <Grid container spacing={4} >
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Delayed Onboarding</Typography>
              <DashboardDoughnut colors={getCstmrJrnyStgScoreColor()} data={onboardingStages} />
            </Box>
          </Grid>
          <Grid item xs={3} >
            <Box sx={blockStyle} >
              <Typography fontSize={13} fontWeight={600} >Health of Onboarding Customers</Typography>
              <DashboardDoughnut colors={overAllCustomerHealthColors} data={OnboardingHealth} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box marginTop={'20px'} textAlign={'start'} ></Box>
      <FilterModal open={showAddFilter} close={() => setShowAddFilter(false)} data={[]} update={() => { }} />
    </Box>
  )
}

export default ClientCompass

function GraphSkeleton({ loading }: { loading: boolean }) {
  return (
    <>
      {
        loading &&
        <Box sx={{ display: 'flex', justifyContent: 'center' }} >
          <Skeleton variant="circular" width={80} height={80} />
        </Box>
      }
    </>
  )
}