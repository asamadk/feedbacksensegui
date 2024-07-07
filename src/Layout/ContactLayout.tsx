import React, { useState } from 'react'
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
        {/* {selectedTab === 'people' ? PeopleTab() : CompaniesTab()} */}
        {value === '2' ? PeopleTab() : CompaniesTab()}
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

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ width: '100%', background: colorPalette.textSecondary }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="1" label="Company" />
          <Tab value="2" label="People" />
        </Tabs>
      </Box>
      {/* <LeftBarComponent
        header='Customers'
        list={sideBarData}
        selected={selectedTab}
        callback={handleTabChange}
      /> */}
      <Box sx={{ width: '100%' }} >
        {CustomerBody()}
      </Box>
    </Box>
  )
}

export default ContactLayout