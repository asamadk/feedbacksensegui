import React, { useState } from 'react'
import LeftBarComponent from '../Components/LeftBarComponent'
import { sideBarListType } from '../Utils/types'
import { Box } from '@mui/material'
import PeopleComponent from '../Components/CustomersComponents/PeopleComponent'
import CompaniesComponent from '../Components/CustomersComponents/CompaniesComponent'
import { useNavigate } from 'react-router'

const sideBarData: sideBarListType[] = [
  { label: 'Companies', value: 'companies' },
  { label: 'People', value: 'people' },
]

function ContactLayout() {

  const navigate = useNavigate();

  const getInitialTab = () => {
    const path = window.location.pathname;
    if (path === '/people') return 'people';
    if (path === '/companies') return 'companies';
    return 'companies';
  };

  const [selectedTab, setSelectedTab] = useState<'companies' | 'people'>(getInitialTab());

  const handleTabChange = (val: 'companies' | 'people') => {
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
    <Box sx={{ display: 'flex' }} >
      <LeftBarComponent
        header='Customers'
        list={sideBarData}
        selected={selectedTab}
        callback={handleTabChange}
      />
      <Box sx={{ width: '100%' }} >
        {CustomerBody()}
      </Box>
    </Box>
  )
}

export default ContactLayout