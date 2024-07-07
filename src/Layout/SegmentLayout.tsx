import { Box } from '@mui/material'
import React, { useState } from 'react'
import LeftBarComponent from '../Components/LeftBarComponent'
import { sideBarListType } from '../Utils/types';

const sideBarData: sideBarListType[] = [
  { label: 'People Segment', value: 'people' },
  { label: 'Company Segment', value: 'company' },
]

function SegmentLayout() {

  const [selectedTab, setSelectedTab] = useState('people');

  const CustomerBody = () => {
    return (
      <Box>
        {selectedTab === 'people' ? PeopleSegmentTab() : CompaniesSegmentTab()}
      </Box>
    )
  }

  const PeopleSegmentTab = () => {
    return (
      <Box>People Segment</Box>
    )
  }

  const CompaniesSegmentTab = () => {
    return (
      <Box>Companies Segment</Box>
    )
  }


  return (
    <Box sx={{ display: 'flex' }} >
      <LeftBarComponent
        header='Segments'
        list={sideBarData}
        selected={selectedTab}
        callback={(val: string) => setSelectedTab(val)}
      />
      <Box sx={{ width: '100%' }} >
        {CustomerBody()}
      </Box>
    </Box>
  )
}

export default SegmentLayout