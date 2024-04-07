import React, { useState } from 'react'
import LeftBarComponent from '../Components/LeftBarComponent'
import { sideBarListType } from '../Utils/types'
import { Box } from '@mui/material'
import PeopleComponent from '../Components/CustomersComponents/PeopleComponent'
import CompaniesComponent from '../Components/CustomersComponents/CompaniesComponent'

const sideBarData: sideBarListType[] = [
  { label: 'Companies', value: 'companies' },
  { label: 'People', value: 'people' },
]

function ContactLayout() {

  const [selectedTab, setSelectedTab] = useState<'companies' | 'people' >('companies');

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
      <CompaniesComponent  />
    )
  }

  return (
    <Box sx={{ display: 'flex' }} >
      <LeftBarComponent
        header='Customers'
        list={sideBarData}
        selected={selectedTab}
        callback={(val : any) => setSelectedTab(val)}
      />
      <Box sx={{ width: '100%' }} >
        {CustomerBody()}
      </Box>
    </Box>
  )
}

export default ContactLayout