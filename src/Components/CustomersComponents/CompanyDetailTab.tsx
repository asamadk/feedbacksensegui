import { Box, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
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
import { getHealthScoreName, getLineChartColor, handleUnAuth } from '../../Utils/FeedbackUtils';
import EditIcon from '@mui/icons-material/Edit';
import EditJourneyModal from '../../Modals/ContactModals/EditJourneyModal';
import CompanyFieldTable from './CompanyFieldTable';
import CompanyDetailHealthScore from './CompanyDetailHealthScore';
import { getHealthScoreStyle } from '../../Styles/TableStyle';
import axios from 'axios';
import { deleteTagURL, getCompanyHealthHistoryURL } from '../../Utils/Endpoints';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EditCompanyAttributeModal from './EditCompanyAttributeModal';
import RouteIcon from '@mui/icons-material/Route';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { companyFieldType } from '../../Utils/types';
import FactoryIcon from '@mui/icons-material/Factory';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AddIcon from '@mui/icons-material/Add';
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';

const iconStyle = { fontWeight: 500, marginRight: '10px', color: colorPalette.fsGray };

const tagStyle = {
  marginLeft: '20px',
  marginTop: '10px',
  border: `1px ${colorPalette.background} solid`,
  borderRadius: '5px',
  padding: '5px',
  color: colorPalette.primary,
  background: colorPalette.secondary,
  cursor: 'pointer'
}

function CompanyDetailTab({ company }: any) {

  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [details, setDetails] = useState<any[]>([]);
  const [tagList, setTagList] = useState<any[]>(company.tags);
  const [healthScoreData, setHealthScoreData] = useState<any[]>([]);
  const [healthScoreLoading, setHealthScoreLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedFieldData, setSelectedFieldData] = useState<any>('')
  const [fieldType, setFieldType] = useState<companyFieldType>('owner');

  let init = false;
  useEffect(() => {
    if (init === false) {
      getHealthScoreTimeline();
      init = true;
    }
  }, [])

  useEffect(() => {
    populateAttributes();
  }, [company]);

  function populateAttributes() {
    const tmp = [];
    tmp.push({
      icon: <KeyIcon sx={iconStyle} />,
      label: 'Owner',
      value: company?.owner?.name,
      edit: true,
      type: 'owner'
    });
    tmp.push({
      icon: <InfoIcon sx={iconStyle} />,
      label: 'Contract Status',
      value: company.contractStatus,
      edit: true,
      type: 'contractStatus'
    });
    tmp.push({
      icon: <HourglassBottomIcon sx={iconStyle} />,
      label: 'Start Date',
      value: company.created_at ? new Date(company.created_at).toDateString() : 'None',
      edit: false
    });
    tmp.push({
      icon: <CalendarMonthIcon sx={iconStyle} />,
      label: 'Next Renewal Date',
      value: company.nextRenewalDate ? new Date(company.nextRenewalDate).toDateString() : 'None',
      edit: true,
      type: 'nextRenewalDate'
    });
    tmp.push({
      icon: <LocalAtmIcon sx={iconStyle} />,
      label: 'Total Contract Amount',
      value: company.totalContractAmount != null ? numeral(company.totalContractAmount).format('0a').toUpperCase() : '$0',
      edit: false
    });
    tmp.push({
      icon: <RouteIcon sx={iconStyle} />,
      label: 'Journey Stage',
      value: company?.stage?.name || 'None',
      edit: true
    });
    tmp.push({
      icon: <FlagCircleIcon sx={iconStyle} />,
      label: 'Onboarding',
      value: company?.onboardingStage?.name || 'None',
      edit: true
    });
    tmp.push({
      icon: <WarningIcon sx={iconStyle} />,
      label: 'Risk',
      value: company?.riskStage?.name || 'None',
      edit: true
    });
    tmp.push({
      icon: <TrendingUpIcon sx={iconStyle} />,
      label: 'Usage Frequency',
      value: company.usageFrequency || 'None',
      edit: false
    });
    tmp.push({
      icon: <TabIcon sx={iconStyle} />,
      label: 'Website',
      value: company.website,
      edit: true,
      type: 'website'
    });
    tmp.push({
      icon: <EmojiEmotionsIcon sx={iconStyle} />,
      label: 'NPS Score',
      value: company.npsScore || '0',
      edit: false
    });
    tmp.push({
      icon: <ThumbsUpDownIcon sx={iconStyle} />,
      label: 'CSAT Score',
      value: company.csatScore || '0',
      edit: false
    });
    tmp.push({
      icon: <NearMeIcon sx={iconStyle} />,
      label: 'Billing Address',
      value: company.address || 'None',
      edit: true,
      type: 'address'
    });
    tmp.push({
      icon: <FactoryIcon sx={iconStyle} />,
      label: 'Industry',
      value: company.industry || 'None',
      edit: true,
      type: 'industry'
    });
    tmp.push({
      icon: <PermContactCalendarIcon sx={iconStyle} />,
      label: 'Last Contact Date',
      value: new Date(company.lastContactDate).toDateString() || 'None',
      edit: true,
      type: 'lastContactDate'
    });
    setDetails(tmp);
  }

  async function getHealthScoreTimeline() {
    try {
      setHealthScoreLoading(true);
      const { data } = await axios.get(getCompanyHealthHistoryURL(company.id), { withCredentials: true });
      if (data.data) {
        setHealthScoreData(data.data);
      }
      setHealthScoreLoading(false);
    } catch (error) {
      setHealthScoreLoading(false);
    }
  }


  function handleCreateModalClose() {
    setShowCreateModal(false);
  }

  const blockStyle = {
    marginTop: '10px',
    border: `1px ${colorPalette.textSecondary} solid`,
    borderRadius: '5px',
  }

  function handleEditAttribute(edit: boolean, label: string, val: any, type: companyFieldType) {
    if (edit === false) { return; }
    if (label === 'Journey Stage' || label === 'Onboarding' || label === 'Risk') {
      if (label === 'Journey Stage') {
        setSelectedFieldData(company?.stage?.id)
      } else if (label === 'Onboarding') {
        setSelectedFieldData(company?.onboardingStage?.id)
      } else {
        setSelectedFieldData(company?.riskStage?.id)
      }
      setShowJourneyModal(true);
      setSelectedField(label);
    } else {
      setShowEdit(true);
      setFieldType(type);
      if (type === 'owner') {
        setSelectedFieldData(company?.owner?.id);
      } else {
        setSelectedFieldData(val);
      }
    }
  }

  function handleCompanyJourneyUpdate(type: string, name: string) {
    setShowJourneyModal(false);
    switch (type) {
      case 'Risk':
        if (company.riskStage == null) {
          company.riskStage = {};
        }
        company.riskStage.name = name;
        break;
      case 'Journey Stage':
        if (company.stage == null) {
          company.stage = {};
        }
        company.stage.name = name;
        break;
      case 'Onboarding':
        if (company.onboardingStage == null) {
          company.onboardingStage = {};
        }
        company.onboardingStage.name = name;
        break;
    }
    populateAttributes();
  }

  function handleCompanyUpdate(data: any) {
    setShowEdit(false);
    if (data == null) { return; }
    if (fieldType === 'owner') {
      company.owner = {};
      company.owner.name = data;
    } else {
      for (const key in data) {
        company[key] = data[key];
      }
    }
    populateAttributes();
  }

  function updateTagList(tag: any) {
    handleCreateModalClose();
    for (let i = 0; i < tagList.length; i++) {
      const obj = tagList[i];
      if (obj.name === tag?.name) {
        return;
      }
    }
    setTagList([...tagList, tag]);
  }

  async function handleTagDelete(tagId: number) {
    try {
      setLoading(true);
      const { data } = await axios.delete(deleteTagURL(company.id, tagId), { withCredentials: true });
      setTagList(tagList.filter(tag => tag.id !== tagId));
      snackbarRef?.current?.show(data.message, 'success');
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong', 'error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  return (
    <Box sx={{ height: 'calc(100vh - 121px)', overflowY: 'scroll' }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', }} >
        <Box sx={{ width: '50%', padding: '20px', height: 'fit-content' }} >
          <Box>
            {
              details?.map(d => (
                <Grid container sx={{ textAlign: 'start', margin: '5px' }} spacing={1.5}>
                  <Grid sx={{ display: 'flex' }} item xs>
                    {d.icon}
                    <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{d.label}</Typography>
                  </Grid>
                  <Grid sx={{ display: 'flex' }} item xs>
                    <Typography
                      fontWeight={d.edit === true ? 600 : 500}
                      sx={{ cursor: d.edit === true ? 'pointer' : 'default' }}
                      onClick={() => handleEditAttribute(d.edit, d.label, d.value, d.type)}
                    >{d.value}</Typography>
                  </Grid>
                </Grid>
              ))
            }
          </Box>
        </Box>
        <Box width={'50%'} padding={'20px'}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'start' }} >
              <Typography sx={{ textAlign: 'start' }} variant='h5' ><EmojiEventsIcon />Health</Typography>
              <Box sx={{ ...getHealthScoreStyle(company.healthScore >= 0 ? company.healthScore : 'None'), margin: '5px' }} >
                {getHealthScoreName(company.healthScore)}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'start' }} >
              {company?.healthScore === 0 && <Typography><b>Reason :</b> {company.attributeHealthScore}</Typography>}
            </Box>
            <Box sx={blockStyle} >
              <Box padding={'20px'} >
                <CompanyDetailHealthScore loading={healthScoreLoading} data={healthScoreData} />
              </Box>
            </Box>
          </Box>
          <Box marginTop={'50px'} >
            <Typography sx={{ textAlign: 'start' }} variant='h5' ><SellIcon />Tags</Typography>
            <Box sx={{ flexWrap: 'wrap' }} display={'flex'} padding={'10px'}>
              {
                tagList?.map((tag: any) => (<>
                  <Chip
                    sx={{ marginRight: '4px', marginTop: '5px' }}
                    variant='outlined'
                    label={tag.name}
                    onDelete={() => handleTagDelete(tag.id)}
                  />
                </>))
              }
              <Chip
                clickable
                onClick={() => setShowCreateModal(true)}
                sx={{ marginRight: '4px', marginTop: '5px' }}
                variant='filled'
                label="Add Tags +"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      {
        showCreateModal &&
        <CreateTagModal
          companyId={company.id}
          open={showCreateModal}
          close={handleCreateModalClose}
          update={updateTagList}
        />
      }
      {
        showJourneyModal &&
        <EditJourneyModal
          companyId={company.id}
          open={showJourneyModal}
          field={selectedField}
          value={selectedFieldData}
          close={() => setShowJourneyModal(false)}
          update={handleCompanyJourneyUpdate}
        />
      }
      {
        showEdit &&
        <EditCompanyAttributeModal
          open={showEdit}
          close={() => setShowEdit(false)}
          companyId={company.id}
          type={fieldType}
          value={selectedFieldData}
          update={handleCompanyUpdate}
        />
      }
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default CompanyDetailTab