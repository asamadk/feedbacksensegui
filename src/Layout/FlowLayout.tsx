import { Box } from '@mui/material'
import React, { useState } from 'react'
import LeftBarComponent from '../Components/LeftBarComponent'
import { sideBarListType } from '../Utils/types';
import FlowDashboard from '../Components/FlowLayoutComponents/FlowDashboard';
import FlowTemplateDashboard from '../Components/FlowLayoutComponents/FlowTemplateDashboard';

const sideBarData: sideBarListType[] = [
  { label: 'Flows', value: 'flows' },
  { label: 'Templates', value: 'templates' },
]

function FlowLayout() {

  const [selectedTab, setSelectedTab] = useState<'flows' | 'templates'>('flows');

  return (
    <Box sx={{ display: 'flex' }} >
      <LeftBarComponent
        header='Automation'
        list={sideBarData}
        selected={selectedTab}
        callback={(val: 'flows' | 'templates') => setSelectedTab(val)}
      />
      <Box sx={{ width: '100%' }} >
        <FlowDashboard
          type={selectedTab}
        />
      </Box>
    </Box>
  )
}

export default FlowLayout