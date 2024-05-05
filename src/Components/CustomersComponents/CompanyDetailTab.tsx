import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import KeyIcon from '@mui/icons-material/Key';
import InfoIcon from '@mui/icons-material/Info';
import TabIcon from '@mui/icons-material/Tab';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { colorPalette } from '../../Utils/Constants';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import NearMeIcon from '@mui/icons-material/NearMe';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SellIcon from '@mui/icons-material/Sell';
import CreateTagModal from '../../Modals/ContactModals/CreateTagModal';
import numeral from 'numeral';
import { getLineChartColor } from '../../Utils/FeedbackUtils';
import EditIcon from '@mui/icons-material/Edit';
import EditJourneyModal from '../../Modals/ContactModals/EditJourneyModal';
import CompanyFieldTable from './CompanyFieldTable';

const iconStyle = { fontWeight: 500, marginRight: '10px', color: colorPalette.fsGray };

function journeyStyle(index: number) {
  return {
    padding: '5px',
    // background: '#F9C329',
    background: getLineChartColor(index + 3),
    width: 'fit-content',
    color: colorPalette.textSecondary,
    borderRadius: '5px',
    cursor: 'pointer',
  }
}

const tagStyle = {
  marginLeft: '20px',
  marginTop: '10px',
  border: `1px ${colorPalette.textSecondary} solid`,
  borderRadius: '5px',
  padding: '5px',
  color: colorPalette.primary,
  background: colorPalette.secondary,
  cursor: 'pointer'
}

function CompanyDetailTab({ company }: any) {

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [details, setDetails] = useState<any[]>([]);
  const [tagList, setTagList] = useState(company.tags);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ company:", company)
    const tmp = [];
    tmp.push({
      icon: <KeyIcon sx={iconStyle} />,
      label: 'Owner',
      value: company?.owner?.name
    });
    tmp.push({
      icon: <InfoIcon sx={iconStyle} />,
      label: 'Status',
      value: company?.status
    });
    tmp.push({
      icon: <HourglassBottomIcon sx={iconStyle} />,
      label: 'Start Date',
      value: company.startDate ? new Date(company.startDate).toLocaleDateString() : 'N/A'
    });
    tmp.push({
      icon: <CalendarMonthIcon sx={iconStyle} />,
      label: 'Next Renewal Date',
      value: company.nextRenewalDate ? new Date(company.nextRenewalDate).toLocaleDateString() : 'N/A'
    });
    tmp.push({
      icon: <LocalAtmIcon sx={iconStyle} />,
      label: 'Total Contract Amount',
      value: company.totalContractAmount != null ? numeral(company.totalContractAmount).format('0a').toUpperCase() : '$0'
    });
    tmp.push({
      icon: <QueryBuilderIcon sx={iconStyle} />,
      label: 'Last Activity Date',
      value: company.lastActivityDate || 'N/A'
    });
    tmp.push({
      icon: <TrendingUpIcon sx={iconStyle} />,
      label: 'Usage Frequency',
      value: company.usageFrequency || 'N/A'
    });
    tmp.push({
      icon: <TabIcon sx={iconStyle} />,
      label: 'Website',
      value: company.website
    });
    tmp.push({
      icon: <FlightTakeoffIcon sx={iconStyle} />,
      label: 'Success Panel',
      value: 'Default'
    });
    tmp.push({
      icon: <PersonIcon sx={iconStyle} />,
      label: 'License Count',
      value: company.licenseCount || 'N/A'
    });
    tmp.push({
      icon: <EmojiEmotionsIcon sx={iconStyle} />,
      label: 'NPS',
      value: company.npsScore || 'N/A'
    });
    tmp.push({
      icon: <NearMeIcon sx={iconStyle} />,
      label: 'Billing Address',
      value: company.address || 'N/A'
    });
    setDetails(tmp);
  }, []);


  function handleCreateModalClose(data: any) {
    setShowCreateModal(false);
    if (data.refresh === true) {
      // fetchCompanies();
    }
  }

  return (
    <Box sx={{ height: 'calc(100vh - 121px)', overflowY: 'scroll' }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', }} >
        <Box sx={{ width: '40%', padding: '20px' }} >
          {
            details?.map(d => (
              <Grid container sx={{ textAlign: 'start', margin: '5px' }} spacing={1.5}>
                <Grid sx={{ display: 'flex' }} item xs>
                  {d.icon}
                  <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{d.label}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography fontWeight={500} >{d.value}</Typography>
                </Grid>
              </Grid>
            ))
          }
        </Box>
        <Box width={'50%'} padding={'20px'}>
          <Box>
            <Typography sx={{ textAlign: 'start' }} variant='h5' ><EmojiEventsIcon />Churn Score</Typography>
            <Box height={'200px'} border={`1px ${colorPalette.textSecondary} solid`} borderRadius={'5px'} >
            </Box>
          </Box>
          <Box marginTop={'20px'} >
            <Typography sx={{ textAlign: 'start' }} variant='h5' ><SellIcon />Tags</Typography>
            <Box display={'flex'} sx={{ flexWrap: 'wrap' }} padding={'10px'}>
              {
                tagList?.map((tag: any) => (<>
                  <Box sx={tagStyle}>
                    {tag.name}
                  </Box>
                </>))
              }
              <Box onClick={() => setShowCreateModal(true)} sx={{ ...tagStyle, color: colorPalette.fsGray }}>
                Add Tag +
              </Box>
            </Box>
          </Box>
          <Box marginTop={'20px'} >
            <Typography sx={{ textAlign: 'start' }} variant='h5' >
              <ForkRightIcon />
              Customer Journey Stage
              <Tooltip title='Edit' >
                <IconButton onClick={() => setShowJourneyModal(true)}>
                  <EditIcon sx={{ color: colorPalette.fsGray, width: '20px' }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <Box padding={'20px 30px'}>
              <Box sx={journeyStyle(company?.stage?.position)} >
                {company?.stage?.name || 'N/A'}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <CompanyFieldTable companyId={company.id} />
      </Box>
      {
        showCreateModal &&
        <CreateTagModal companyId={company.id} open={showCreateModal} close={handleCreateModalClose} />
      }
      {
        showJourneyModal &&
        <EditJourneyModal
          companyId={company.id}
          open={showJourneyModal}
          journey={company?.stage?.id}
          close={() => setShowJourneyModal(false)}
        />
      }
    </Box>
  )
}

export default CompanyDetailTab