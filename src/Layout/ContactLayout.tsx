import React, { useEffect, useState } from 'react'
import LeftBarComponent from '../Components/LeftBarComponent'
import { sideBarListType } from '../Utils/types'
import { Box, Tab, Tabs } from '@mui/material'
import PeopleComponent from '../Components/CustomersComponents/PeopleComponent'
import CompaniesComponent from '../Components/CustomersComponents/CompaniesComponent'
import { useNavigate } from 'react-router'
import { colorPalette } from '../Utils/Constants'

const sideBarData: sideBarListType[] = [
  { label: 'Companies', value: 'companies' },
  { label: 'People', value: 'people' },
]

function ContactLayout() {

  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/people'){
      setSelectedTab('people');
    }else if (path === '/companies'){
      setSelectedTab('companies');
    }
  },[window.location.pathname]);

  const [selectedTab, setSelectedTab] = useState<'companies' | 'people'>('companies');

  const handleTabChange = (e :any,val :any) => {
    setSelectedTab(val);
    navigate(`/${val}`);
  };

  const CustomerBody = () => {
    return (
      <Box>
        {selectedTab === 'people' ? PeopleTab() : CompaniesTab()}
      </Box>
    )
  }

  const PeopleTab = () => {
    return (
      <PeopleComponent type={selectedTab} />
    )
  }

  const CompaniesTab = () => {
    return (
      <CompaniesComponent />
    )
  }

  return (
    <Box>
      <Box sx={{ width: '100%', background: colorPalette.textSecondary }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="companies" label="Company" />
          <Tab value="people" label="People" />
        </Tabs>
      </Box>
      <Box sx={{ width: '100%' }} >
        {CustomerBody()}
      </Box>
    </Box>
  )
}

export default ContactLayout